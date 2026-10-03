/*
 * Binding audit for one component set. Read-only.
 * Requires (paste first): scripts/figma/helpers.js
 *
 * Flags: raw fills/strokes (no variable, no style), primitive bindings, unbound padding/gap/radius/fixed size/
 * min-max/stroke weight, raw overrides inside nested instances, rebuilt nested parts (frames named like a catalog
 * component that hold no instance of it), absolute positioning. Mixed values are reported as Unverified.
 *
 * Usage:
 *   return await auditBindings({
 *     setName: 'Button / Web',
 *     primitiveCollections: ['Primitives'],          // from the Foundation Profile
 *     nestedNames: ['Icon', 'Spinner', 'Badge'],      // catalog components that must be instances
 *   });
 */

const SPACING_FIELDS = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing'];
const RADIUS_FIELDS = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
const LIMIT_FIELDS = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
const SIDE_STROKES = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
const SIZED_TYPES = new Set(['FRAME', 'COMPONENT', 'INSTANCE', 'RECTANGLE', 'ELLIPSE']);
const isMixed = (value) => typeof value === 'symbol';

/** Number fields that must be bound on this node. */
function boundNumberFields(node) {
  const fields = [];
  if (node.layoutMode && node.layoutMode !== 'NONE') {
    fields.push(...SPACING_FIELDS.filter((f) => f !== 'counterAxisSpacing' || node.layoutWrap === 'WRAP'));
  }
  fields.push(...RADIUS_FIELDS.filter((f) => f in node));
  if (SIZED_TYPES.has(node.type)) {
    if (node.layoutSizingHorizontal === 'FIXED') fields.push('width');
    if (node.layoutSizingVertical === 'FIXED') fields.push('height');
  }
  fields.push(...LIMIT_FIELDS.filter((f) => f in node && node[f] !== null));
  const stroked = Array.isArray(node.strokes) && node.strokes.some((p) => p.visible !== false);
  if (stroked) fields.push(...(isMixed(node.strokeWeight) ? SIDE_STROKES : ['strokeWeight']));
  return fields;
}

/** Inside an instance only overridden fields are audited; the rest belongs to the nested component's own set. */
function isOverridden(field, overrides) {
  if (!overrides) return true;
  if (overrides.has(field)) return true;
  if (RADIUS_FIELDS.includes(field)) return overrides.has('cornerRadius');
  if (SIDE_STROKES.includes(field)) return overrides.has('strokeWeight');
  return false;
}

async function mainComponentName(instance) {
  const main = await instance.getMainComponentAsync();
  if (!main) return '';
  return main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent.name : main.name;
}

async function auditBindings({ setName, primitiveCollections = ['Primitives'], nestedNames = [] }) {
  const set = await findComponentSet(setName);
  if (!set) return { error: `Component set not found: ${setName}` };

  const rows = [];
  const counts = { correct: 0, raw: 0, primitive: 0, unboundNumber: 0, rebuiltNested: 0, overrides: 0, unverified: 0 };
  const infoCache = new Map();
  const info = async (id) => {
    if (!infoCache.has(id)) infoCache.set(id, await variableInfo(id));
    return infoCache.get(id);
  };
  const unverified = (rule, where, field, issue) => {
    counts.unverified++;
    rows.push({ rule, ...where, field, issue, status: 'Unverified' });
  };

  async function auditPaints(node, where, overrides) {
    for (const field of ['fills', 'strokes']) {
      if (!(field in node) || !isOverridden(field, overrides)) continue;
      if (isMixed(node[field])) {
        unverified('TOK-001', where, field, 'Mixed paints across text ranges; check each range by hand');
        continue;
      }
      if (!Array.isArray(node[field])) continue;
      const styleId = field === 'fills' ? node.fillStyleId : node.strokeStyleId;
      for (const paint of node[field]) {
        if (paint.visible === false || paint.type !== 'SOLID') continue;
        const alias = paint.boundVariables && paint.boundVariables.color;
        if (alias) {
          const v = await info(alias.id);
          if (v && primitiveCollections.includes(v.collection)) {
            counts.primitive++;
            rows.push({ rule: 'TOK-002', ...where, field, issue: `Bound to primitive ${v.name}` });
          } else counts.correct++;
        } else if (styleId && !isMixed(styleId) && styleId !== '') {
          counts.correct++;
        } else {
          counts.raw++;
          rows.push({ rule: 'TOK-001', ...where, field, issue: 'Raw color (no variable, no style)' });
        }
      }
    }
  }

  function auditNumbers(node, where, overrides) {
    const bound = node.boundVariables || {};
    for (const field of boundNumberFields(node).filter((f) => isOverridden(f, overrides))) {
      const value = node[field];
      if (isMixed(value)) {
        unverified('TOK-003', where, field, 'Mixed value; check each side by hand');
        continue;
      }
      if (typeof value !== 'number' || value === 0) continue;
      if (bound[field]) counts.correct++;
      else {
        counts.unboundNumber++;
        rows.push({ rule: 'TOK-003', ...where, field, issue: `Unbound value ${value}` });
      }
    }
  }

  async function auditRebuilt(node, where) {
    if (node.type !== 'FRAME' && node.type !== 'GROUP') return;
    const hit = nestedNames.find((n) => node.name.toLowerCase().startsWith(n.toLowerCase()));
    if (!hit) return;
    for (const inst of node.findAll((n) => n.type === 'INSTANCE')) {
      if ((await mainComponentName(inst)).toLowerCase().startsWith(hit.toLowerCase())) return;
    }
    counts.rebuiltNested++;
    rows.push({ rule: 'DEP-001', ...where, field: 'node', issue: `"${node.name}" looks like a rebuilt ${hit} (no ${hit} instance inside)` });
  }

  async function auditInstanceOverrides(instance, where) {
    for (const { id, overriddenFields } of instance.overrides || []) {
      const target = await figma.getNodeByIdAsync(id);
      if (!target) continue;
      counts.overrides++;
      const at = { ...where, layer: target === instance ? where.layer : `${where.layer}/${target.name}` };
      const fields = new Set(overriddenFields);
      await auditPaints(target, at, fields);
      auditNumbers(target, at, fields);
    }
  }

  const nodes = [];
  walk(set, (node, path) => {
    if (!closest(node.parent, 'INSTANCE', set)) nodes.push({ node, path });
  });

  for (const { node, path } of nodes) {
    const where = { variant: variantLabel(node), layer: path.slice(2).join('/') || node.name };
    if (node.type === 'INSTANCE') await auditInstanceOverrides(node, where);
    else {
      await auditPaints(node, where, null);
      auditNumbers(node, where, null);
      await auditRebuilt(node, where);
    }
    if ('layoutPositioning' in node && node.layoutPositioning === 'ABSOLUTE') {
      rows.push({ rule: 'STR-006', ...where, field: 'layout', issue: 'Absolute position inside Auto Layout (check it is intentional)' });
    }
  }
  return { set: setName, counts, findings: rows };
}
