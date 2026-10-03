import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

/** Load scripts the same way an agent pastes them into a Plugin API runtime. */
function loadInRuntime(files, figma) {
  const context = vm.createContext({ figma, console, JSON, Math, Object, Array, Map, Error, String, Date });
  vm.runInContext(files.map(read).join('\n;\n'), context);
  return context;
}

function mockVariables() {
  const collections = [
    { id: 'c-prim', name: 'Primitives', modes: [{ modeId: 'p', name: 'Value' }], defaultModeId: 'p' },
    { id: 'c-sem', name: 'Semantic', modes: [{ modeId: 'l', name: 'Light' }, { modeId: 'd', name: 'Dark' }], defaultModeId: 'l' },
  ];
  const rgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: 1,
  });
  const alias = (id) => ({ type: 'VARIABLE_ALIAS', id });
  const variables = [
    { id: 'v-white', name: 'color/white', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#FFFFFF') } },
    { id: 'v-black', name: 'color/neutral/950', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#0A0A0A') } },
    { id: 'v-blue', name: 'color/blue/600', variableCollectionId: 'c-prim', valuesByMode: { p: rgb('#0B5FFF') } },
    { id: 'v-text', name: 'color/text/primary', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-black'), d: alias('v-white') } },
    { id: 'v-bg', name: 'color/bg/surface/default', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-white'), d: alias('v-black') } },
    { id: 'v-onbrand', name: 'color/text/on-brand', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-white'), d: alias('v-white') } },
    { id: 'v-brand', name: 'color/bg/brand/default', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-blue'), d: alias('v-blue') } },
    { id: 'v-empty', name: 'color/border/focus', variableCollectionId: 'c-sem', valuesByMode: { l: alias('v-blue') } },
  ];
  return {
    variables: {
      getLocalVariableCollectionsAsync: async () => collections,
      getLocalVariablesAsync: async () => variables,
      getVariableByIdAsync: async (id) => variables.find((v) => v.id === id) || null,
      getVariableCollectionByIdAsync: async (id) => collections.find((c) => c.id === id) || null,
    },
  };
}

test('all Figma scripts parse together with their dependencies', () => {
  for (const file of ['contrast-pairs', 'binding-audit', 'text-style-audit', 'set-layout']) {
    assert.doesNotThrow(() =>
      loadInRuntime(['lib/color.js', 'lib/grid.js', 'figma/helpers.js', `figma/${file}.js`], {}),
    );
  }
});

test('contrast-pairs resolves aliases per mode and keeps polarity', async () => {
  const ctx = loadInRuntime(['lib/color.js', 'figma/helpers.js', 'figma/contrast-pairs.js'], mockVariables());
  const result = await ctx.checkContrastPairs({
    modes: [{ Semantic: 'Light' }, { Semantic: 'Dark' }],
    pairs: [
      { name: 'Body text', fg: 'color/text/primary', bg: 'color/bg/surface/default', role: 'body-text' },
      { name: 'Label on brand', fg: 'color/text/on-brand', bg: 'color/bg/brand/default', role: 'label-text' },
      { name: 'Focus (missing Dark)', fg: 'color/border/focus', bg: 'color/bg/surface/default', role: 'non-text-ui' },
    ],
  });
  const row = (pair, mode) => result.rows.find((r) => r.pair === pair && r.mode === `Semantic:${mode}`);

  assert.equal(row('Body text', 'Light').fgChain, 'color/text/primary → color/neutral/950');
  assert.ok(row('Body text', 'Light').apcaLc > 0, 'dark text on light bg is positive');
  assert.ok(row('Body text', 'Dark').apcaLc < 0, 'light text on dark bg is negative');
  assert.ok(row('Label on brand', 'Light').apcaLc < 0, 'white on brand is negative in Light mode too');
  assert.equal(row('Focus (missing Dark)', 'Dark').disposition, 'Unverified');
  assert.match(row('Focus (missing Dark)', 'Dark').error, /Unresolved/);
});

function mockPages() {
  const nodes = new Map();
  let next = 1;
  const makeNode = (type) => {
    const plugin = new Map();
    const node = {
      id: `${next++}:1`, type, name: '', children: [], removed: false,
      getSharedPluginData(ns, key) { return plugin.get(`${ns}/${key}`) || ''; },
      setSharedPluginData(ns, key, value) { plugin.set(`${ns}/${key}`, value); },
      appendChild(child) { child.parent = this; this.children.push(child); },
      remove() {
        this.removed = true;
        nodes.delete(this.id);
        if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this);
      },
    };
    nodes.set(node.id, node);
    return node;
  };
  const root = { children: [] };
  return {
    root,
    loadAllPagesAsync: async () => {},
    createPage: () => { const p = makeNode('PAGE'); root.children.push(p); return p; },
    createFrame: () => makeNode('FRAME'),
    getNodeByIdAsync: async (id) => nodes.get(id) || null,
  };
}

test('findVariable: ambiguous names throw, collection or ID picks one', async () => {
  const figma = mockVariables();
  const vars = await figma.variables.getLocalVariablesAsync();
  vars.push({ id: 'v-dup', name: 'color/text/primary', variableCollectionId: 'c-prim', valuesByMode: {} });
  const ctx = loadInRuntime(['figma/helpers.js'], figma);
  await assert.rejects(ctx.findVariable('color/text/primary'), /Ambiguous.*Primitives, Semantic|Ambiguous.*Semantic, Primitives/);
  assert.equal((await ctx.findVariable({ name: 'color/text/primary', collection: 'Semantic' })).id, 'v-text');
  assert.equal((await ctx.findVariable('color/text/primary', 'Primitives')).id, 'v-dup');
  assert.equal((await ctx.findVariable('VariableID:x')), null);
});

/** Minimal scene graph: parent links, findOne/findAll, plus whatever props each node needs. */
function scene() {
  const byId = new Map();
  let next = 1;
  const node = (type, props = {}, children = []) => {
    const n = {
      id: `${next++}:9`, type, name: type, parent: null, children: [], ...props,
      findAll(pred) { return this.children.flatMap((c) => [...(pred(c) ? [c] : []), ...c.findAll(pred)]); },
      findOne(pred) { return this.findAll(pred)[0] || null; },
    };
    children.forEach((c) => { c.parent = n; n.children.push(c); });
    byId.set(n.id, n);
    return n;
  };
  return { node, byId };
}

function typographyFigma(pages, styles, extraVariables = []) {
  const collections = [{ id: 'c-vp', name: 'Viewport', modes: [{ modeId: 'lg', name: 'Large' }, { modeId: 'sm', name: 'Small' }], defaultModeId: 'lg' }];
  const modeOf = (n) => { for (let p = n; p; p = p.parent) if (p.viewportMode) return p.viewportMode; return 'lg'; };
  const variables = [
    { id: 'v-fs', name: 'type/body/size', variableCollectionId: 'c-vp', valuesByMode: { lg: 16, sm: 14 } },
    ...extraVariables,
  ].map((v) => ({ ...v, resolveForConsumer: (n) => ({ value: v.valuesByMode[modeOf(n)] }) }));
  return {
    root: { children: pages },
    loadAllPagesAsync: async () => {},
    getStyleByIdAsync: async (id) => styles.find((s) => s.id === id) || null,
    getLocalTextStylesAsync: async () => styles,
    getNodeByIdAsync: async () => null,
    variables: {
      getVariableByIdAsync: async (id) => variables.find((v) => v.id === id) || null,
      getVariableCollectionByIdAsync: async (id) => collections.find((c) => c.id === id) || null,
      getLocalVariableCollectionsAsync: async () => collections,
      getLocalVariablesAsync: async () => variables,
    },
  };
}

const segment = (chars, styleId, fontSize) => ({
  characters: chars, textStyleId: styleId, fontSize, fontName: { family: 'Inter', style: 'Medium' },
  letterSpacing: { unit: 'PIXELS', value: 0 }, lineHeight: { unit: 'PIXELS', value: 20 },
});

test('text-style audit: bound style values resolve in the node mode; nested instance text is skipped in set mode', async () => {
  const { node } = scene();
  const style = {
    id: 's-en', name: 'Text/EN/Label/MD', fontSize: 16, fontName: { family: 'Inter', style: 'Medium' },
    letterSpacing: { unit: 'PIXELS', value: 0 }, lineHeight: { unit: 'PIXELS', value: 20 }, boundVariables: { fontSize: { id: 'v-fs' } },
  };
  const label = node('TEXT', { name: 'Label', characters: 'Save', getStyledTextSegments: () => [segment('Save', 's-en', 14)] });
  const deep = node('TEXT', { characters: 'x', getStyledTextSegments: () => [segment('x', '', 12)] });
  const variant = node('COMPONENT', { name: 'Size=md', variantProperties: { Size: 'md' }, viewportMode: 'sm' }, [
    label, node('INSTANCE', {}, [node('FRAME', {}, [deep])]),
  ]);
  const set = node('COMPONENT_SET', { name: 'Button / Web' }, [variant]);
  const ctx = loadInRuntime(['figma/helpers.js', 'figma/text-style-audit.js'], typographyFigma([node('PAGE', {}, [set])], [style]));
  const result = await ctx.auditTextStyles({ setName: 'Button / Web' });
  assert.equal(result.counts.nodes, 1, 'deep instance text is not audited');
  assert.equal(result.findings.length, 0, `14px in Small matches the bound style: ${JSON.stringify(result.findings)}`);
});

test('text-style audit: sandbox mode checks Arabic stress copy inside instances', async () => {
  const { node, byId } = scene();
  const style = {
    id: 's-en', name: 'Text/EN/Label/MD', fontSize: 14, fontName: { family: 'Inter', style: 'Medium' },
    letterSpacing: { unit: 'PIXELS', value: 0 }, lineHeight: { unit: 'PIXELS', value: 20 }, boundVariables: {},
  };
  const ar = node('TEXT', { name: 'Label', characters: 'حفظ التغييرات', getStyledTextSegments: () => [segment('حفظ', 's-en', 14)] });
  const frame = node('FRAME', { name: 'Sandbox' }, [node('INSTANCE', { variantProperties: { Size: 'md' } }, [ar])]);
  const figma = typographyFigma([], [style]);
  figma.getNodeByIdAsync = async (id) => byId.get(id) || null;
  const ctx = loadInRuntime(['figma/helpers.js', 'figma/text-style-audit.js'], figma);
  const result = await ctx.auditTextStyles({ rootId: frame.id });
  assert.deepEqual([...result.findings.map((f) => f.rule)], ['TXT-003']);
  assert.equal(result.findings[0].variant, 'Size=md');
});

test('Arabic audit: bound line height is checked in every viewport mode', async () => {
  const style = {
    id: 's-ar', name: 'Text/AR/Body/MD', fontSize: 16, textCase: 'ORIGINAL',
    letterSpacing: { unit: 'PIXELS', value: 0 }, lineHeight: { unit: 'PIXELS', value: 24 }, boundVariables: { lineHeight: { id: 'v-lh' } },
  };
  const lh = { id: 'v-lh', name: 'type/body/line', variableCollectionId: 'c-vp', valuesByMode: { lg: 24, sm: 18 } };
  const ctx = loadInRuntime(['figma/helpers.js', 'figma/text-style-audit.js'], typographyFigma([], [style], [lh]));
  const result = await ctx.auditArabicStyles({ minLineHeight: 1.5 });
  assert.deepEqual([...result.findings.map((f) => `${f.rule} ${f.mode}`)], ['TXT-008 Viewport:Small']);
});

test('binding audit: radius on any node, instance overrides, slot wrappers, mixed fills', async () => {
  const { node, byId } = scene();
  const solid = { type: 'SOLID', visible: true };
  const iconMain = node('COMPONENT', { name: 'Icon / Web' });
  const iconInstance = node('INSTANCE', { name: 'icon', getMainComponentAsync: async () => iconMain });
  const overridden = node('VECTOR', { name: 'glyph', fills: [solid] });
  const nested = node('INSTANCE', { name: 'badge', getMainComponentAsync: async () => null }, [overridden]);
  nested.overrides = [{ id: overridden.id, overriddenFields: ['fills'] }];
  const variant = node('COMPONENT', { name: 'Size=md', variantProperties: { Size: 'md' }, layoutMode: 'HORIZONTAL', boundVariables: {} }, [
    node('RECTANGLE', { name: 'thumb', topLeftRadius: 8, topRightRadius: 0, bottomLeftRadius: 0, bottomRightRadius: 0, boundVariables: {} }),
    node('FRAME', { name: 'Icon wrapper', layoutMode: 'NONE' }, [iconInstance]),
    node('FRAME', { name: 'Icon', layoutMode: 'NONE' }, [node('VECTOR', {})]),
    node('TEXT', { name: 'Label', fills: Symbol('mixed') }),
    nested,
  ]);
  const set = node('COMPONENT_SET', { name: 'Toggle / Web' }, [variant]);
  const figma = {
    root: { children: [node('PAGE', {}, [set])] },
    loadAllPagesAsync: async () => {},
    getNodeByIdAsync: async (id) => byId.get(id) || null,
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
  };
  const ctx = loadInRuntime(['figma/helpers.js', 'figma/binding-audit.js'], figma);
  const result = await ctx.auditBindings({ setName: 'Toggle / Web', nestedNames: ['Icon'] });
  const got = result.findings.map((f) => `${f.rule} ${f.layer} ${f.field}${f.status ? ' ' + f.status : ''}`);
  assert.deepEqual([...got].sort(), [
    'DEP-001 Icon node',
    'TOK-001 Label fills Unverified',
    'TOK-001 badge/glyph fills',
    'TOK-003 thumb topLeftRadius',
  ]);
});

test('writeState rejects a stale rev instead of overwriting', async () => {
  const ctx = loadInRuntime(['figma/helpers.js'], mockPages());
  await assert.rejects(ctx.writeState('ledger', '_DS Ledger', { rows: [] }), /expectedRev/);
  const first = await ctx.writeState('ledger', '_DS Ledger', { rows: ['a'] }, 0);
  assert.equal(first.rev, 1);
  const second = await ctx.writeState('ledger', '_DS Ledger', { rows: ['a', 'b'] }, 1);
  assert.equal(second.rev, 2);
  const stale = await ctx.writeState('ledger', '_DS Ledger', { rows: ['a', 'c'] }, 1);
  assert.equal(stale.conflict, true);
  assert.equal(stale.currentRev, 2);
  assert.deepEqual([...(await ctx.readState('ledger', '_DS Ledger')).rows], ['a', 'b']);
});

test('sandbox returns its node ID and a later call can delete it by ID', async () => {
  const figma = mockPages();
  const ctx = loadInRuntime(['figma/helpers.js'], figma);
  const created = await ctx.createSandbox('Button / Web');
  assert.deepEqual([...created.createdNodeIds], [created.frameId]);

  const result = await ctx.cleanupSandbox(created.frameId);
  assert.deepEqual([...result.removedNodeIds], [created.frameId]);
  assert.equal(result.remaining, 0);
  assert.equal(await figma.getNodeByIdAsync(created.frameId), null);

  const again = await ctx.cleanupSandbox(created.frameId);
  assert.equal(again.removedNodeIds.length, 0, 'cleanup is safe to repeat');
});
