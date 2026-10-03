/*
 * Text Style audit for one component set or a sandbox frame (or the Arabic style rules for all local styles). Read-only.
 * Requires (paste first): scripts/figma/helpers.js
 *
 * Usage:
 *   return await auditTextStyles({ setName: 'Button / Web', prefixes: { EN: 'Text/EN/', AR: 'Text/AR/' } });
 *   return await auditTextStyles({ rootId: sandboxFrameId, prefixes: { … } });   // stress copy in sandbox instances
 *   return await auditArabicStyles({ prefix: 'Text/AR/', minLineHeight: 1.5 });
 *
 * Set mode skips text inside nested instances (each nested component is audited in its own set).
 * Sandbox mode (rootId) audits all text, including overridden text inside instances.
 * Style values bound to variables are resolved in the node's own mode (viewport modes on the frame).
 */

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const TYPO_FIELDS = ['fontSize', 'lineHeight', 'letterSpacing', 'fontFamily', 'fontStyle'];

function typoValue(source, field) {
  if (field === 'fontFamily') return source.fontName.family;
  if (field === 'fontStyle') return source.fontName.style;
  return source[field];
}

/** What the style gives this node for one field: the plain value, or its bound variable resolved for the node. */
async function expectedTypo(style, field, node) {
  const alias = style.boundVariables && style.boundVariables[field];
  if (!alias) return { value: typoValue(style, field) };
  const variable = await figma.variables.getVariableByIdAsync(alias.id);
  if (!variable || typeof variable.resolveForConsumer !== 'function') return { unverified: true };
  return { value: variable.resolveForConsumer(node).value };
}

/** true / false, or null when the units can't be compared (bound numbers are pixels). */
function sameTypo(actual, expected) {
  const close = (a, b) => Math.abs(a - b) < 0.01;
  if (typeof expected === 'number') {
    if (typeof actual === 'number') return close(actual, expected);
    return actual && actual.unit === 'PIXELS' ? close(actual.value, expected) : null;
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

async function auditTextStyles({ setName, rootId, prefixes = { EN: 'Text/EN/', AR: 'Text/AR/' } }) {
  const root = rootId ? await nodeRef(rootId) : await findComponentSet(setName);
  if (!root) return { error: rootId ? `Node not found: ${rootId}` : `Component set not found: ${setName}` };
  const rows = [];
  const counts = { nodes: 0, styled: 0, missingStyle: 0, wrongLanguage: 0, overrides: 0, unverified: 0 };
  const styleCache = new Map();
  const getStyle = async (id) => {
    if (!styleCache.has(id)) styleCache.set(id, await figma.getStyleByIdAsync(id));
    return styleCache.get(id);
  };

  const texts = [];
  walk(root, (node, path) => {
    if (node.type !== 'TEXT') return;
    if (!rootId && closest(node.parent, 'INSTANCE', root)) return;
    texts.push({ node, path });
  });

  for (const { node, path } of texts) {
    counts.nodes++;
    const where = { variant: variantLabel(node), layer: path.slice(2).join('/') || node.name };
    const lang = ARABIC_RE.test(node.characters) ? 'AR' : 'EN';
    const segments = node.getStyledTextSegments(['textStyleId', 'fontSize', 'fontName', 'letterSpacing', 'lineHeight']);
    for (const seg of segments) {
      if (!seg.textStyleId) {
        counts.missingStyle++;
        rows.push({ rule: 'TXT-001', ...where, issue: `No Text Style on "${seg.characters.slice(0, 24)}"` });
        continue;
      }
      const style = await getStyle(seg.textStyleId);
      if (!style) {
        rows.push({ rule: 'TXT-001', ...where, issue: 'Text Style id not found (remote or deleted)' });
        continue;
      }
      counts.styled++;
      if (!style.name.startsWith(prefixes[lang])) {
        counts.wrongLanguage++;
        rows.push({ rule: 'TXT-003', ...where, issue: `${lang} content uses "${style.name}"` });
      }
      const differing = [];
      for (const field of TYPO_FIELDS) {
        const expected = await expectedTypo(style, field, node);
        const same = expected.unverified ? null : sameTypo(typoValue(seg, field), expected.value);
        if (same === null) {
          counts.unverified++;
          rows.push({ rule: 'TXT-002', ...where, issue: `${field} on "${style.name}" could not be compared`, status: 'Unverified' });
        } else if (!same) differing.push(field);
      }
      if (differing.length) {
        counts.overrides++;
        rows.push({ rule: 'TXT-002', ...where, issue: `Local override (${differing.join(', ')}) on top of "${style.name}"` });
      }
    }
  }
  return { root: rootId || setName, counts, findings: rows };
}

/** Value of a style field in one mode of a collection: bound variable resolved, or the plain value. */
async function styleValueInMode(style, field, modeMap) {
  const alias = style.boundVariables && style.boundVariables[field];
  if (!alias) return style[field];
  const variable = await figma.variables.getVariableByIdAsync(alias.id);
  if (!variable) return null;
  const r = await resolveVariable(variable, modeMap);
  return r.missing || r.broken ? null : r.value;
}

/** Mode maps to check for a style: every mode of each collection its typography variables live in. */
async function styleModeMaps(style) {
  const maps = [{}];
  for (const field of ['fontSize', 'lineHeight', 'letterSpacing']) {
    const alias = style.boundVariables && style.boundVariables[field];
    const variable = alias && (await figma.variables.getVariableByIdAsync(alias.id));
    if (!variable) continue;
    const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
    if (maps.some((m) => col.name in m)) continue;
    const base = maps.splice(0);
    for (const m of base) for (const mode of col.modes) maps.push({ ...m, [col.name]: mode.name });
  }
  return maps;
}

async function auditArabicStyles({ prefix = 'Text/AR/', minLineHeight = 1.5 } = {}) {
  const styles = (await figma.getLocalTextStylesAsync()).filter((s) => s.name.startsWith(prefix));
  const rows = [];
  for (const s of styles) {
    if (s.textCase && s.textCase !== 'ORIGINAL') rows.push({ rule: 'TXT-007', style: s.name, issue: `Case transform ${s.textCase}` });
    for (const modeMap of await styleModeMaps(s)) {
      const mode = Object.entries(modeMap).map(([c, m]) => `${c}:${m}`).join(', ') || 'default';
      const fontSize = await styleValueInMode(s, 'fontSize', modeMap);
      const ls = await styleValueInMode(s, 'letterSpacing', modeMap);
      const lh = await styleValueInMode(s, 'lineHeight', modeMap);
      if (fontSize === null || ls === null || lh === null) {
        rows.push({ rule: 'TXT-008', style: s.name, mode, issue: 'Bound variable has no value in this mode', status: 'Unverified' });
        continue;
      }
      const lsValue = typeof ls === 'number' ? ls : ls.value;
      if (lsValue !== 0) rows.push({ rule: 'TXT-006', style: s.name, mode, issue: `Letter spacing ${lsValue}${ls.unit === 'PERCENT' ? '%' : 'px'} (must be 0)` });
      let ratio = null;
      if (typeof lh === 'number' || lh.unit === 'PIXELS') ratio = (typeof lh === 'number' ? lh : lh.value) / fontSize;
      else if (lh.unit === 'PERCENT') ratio = lh.value / 100;
      if (ratio === null) rows.push({ rule: 'TXT-008', style: s.name, mode, issue: `Line height AUTO — set an explicit value ≥ ${minLineHeight}` });
      else if (ratio < minLineHeight) rows.push({ rule: 'TXT-008', style: s.name, mode, issue: `Line height ${ratio.toFixed(2)}× < ${minLineHeight}×` });
    }
  }
  return { checked: styles.length, findings: rows };
}
