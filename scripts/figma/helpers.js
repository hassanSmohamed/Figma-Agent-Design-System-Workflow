/*
 * Shared Figma Plugin API helpers for the ds-* skills.
 * Paste this file before any script in scripts/figma/ (see scripts/README.md).
 * All functions are async-safe and never mutate source components.
 * Run through use_figma after loading the figma-use skill (standards/figma-tooling.md §5).
 * Write helpers return node IDs: nothing persists between use_figma calls, so pass IDs as strings.
 */

const DS_NAMESPACE = 'ds_workflow';
const SYSTEM_PAGE = '_DS System';
const SANDBOX_PAGE = '_DS Sandbox';

/* ---------- Variables ---------- */

async function getCollectionsByName() {
  const list = await figma.variables.getLocalVariableCollectionsAsync();
  return Object.fromEntries(list.map((c) => [c.name, c]));
}

/**
 * Find one variable. `ref` is a name, a variable ID ('VariableID:…'), or { name, collection } / { id }.
 * Library variables are not in the local list: pass their ID (from a node binding or the Profile).
 * A name that exists in more than one collection throws; pass the collection to choose.
 */
async function findVariable(ref, collectionName) {
  const { id, name, collection = collectionName } = typeof ref === 'string'
    ? (ref.startsWith('VariableID:') ? { id: ref } : { name: ref })
    : ref;
  if (id) return figma.variables.getVariableByIdAsync(id);
  const cols = await getCollectionsByName();
  if (collection && !cols[collection]) throw new Error(`Collection not found: ${collection}`);
  const colId = collection ? cols[collection].id : null;
  const hits = (await figma.variables.getLocalVariablesAsync())
    .filter((v) => v.name === name && (!colId || v.variableCollectionId === colId));
  if (hits.length > 1) {
    const names = Object.values(cols).filter((c) => hits.some((v) => v.variableCollectionId === c.id)).map((c) => c.name);
    throw new Error(`Ambiguous variable "${name}" in collections ${names.join(', ')}; pass the collection`);
  }
  return hits[0] || null;
}

/**
 * Resolve a variable to its final value for a mode map, following aliases across collections.
 * modeMap: { [collectionName]: modeName }. Collections not in the map use their default mode.
 * Returns { value, chain: [variable names], modes: [mode names] }.
 */
async function resolveVariable(variable, modeMap = {}, depth = 0) {
  if (depth > 20) throw new Error(`Alias chain too deep at ${variable.name} (circular?)`);
  const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  const wanted = modeMap[col.name];
  const mode = (wanted && col.modes.find((m) => m.name === wanted)) || col.modes.find((m) => m.modeId === col.defaultModeId);
  const raw = variable.valuesByMode[mode.modeId];
  if (raw === undefined) {
    return { value: null, chain: [variable.name], modes: [`${col.name}:${mode.name}`], missing: true };
  }
  if (raw && raw.type === 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(raw.id);
    if (!target) return { value: null, chain: [variable.name, '(broken alias)'], modes: [mode.name], broken: true };
    const next = await resolveVariable(target, modeMap, depth + 1);
    return { ...next, chain: [variable.name, ...next.chain], modes: [`${col.name}:${mode.name}`, ...next.modes] };
  }
  return { value: raw, chain: [variable.name], modes: [`${col.name}:${mode.name}`] };
}

async function variableInfo(id) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v) return null;
  const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  return { id, name: v.name, collection: col.name, type: v.resolvedType, scopes: v.scopes, hidden: v.hiddenFromPublishing };
}

/* ---------- Nodes ---------- */

async function findComponentSet(name) {
  await figma.loadAllPagesAsync();
  for (const page of figma.root.children) {
    const hit = page.findOne((n) => (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === name);
    if (hit) return hit;
  }
  return null;
}

function walk(node, visit, path = []) {
  const here = [...path, node.name];
  visit(node, here);
  if ('children' in node) node.children.forEach((c) => walk(c, visit, here));
}

/** First node of `type` from `node` upward (inclusive), stopping before `stop`. */
function closest(node, type, stop = null) {
  for (let n = node; n && n !== stop; n = n.parent) if (n.type === type) return n;
  return null;
}

function variantLabel(node) {
  const owner = closest(node, 'COMPONENT') || closest(node, 'INSTANCE');
  if (!owner) return '(not in a component)';
  return owner.variantProperties
    ? Object.entries(owner.variantProperties).map(([k, v]) => `${k}=${v}`).join(', ')
    : owner.name;
}

function renderBox(node) {
  const r = node.absoluteRenderBounds || node.absoluteBoundingBox;
  return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
}

/** Accept a node or a node ID string (IDs are how later use_figma calls refer to nodes). */
async function nodeRef(nodeOrId) {
  return typeof nodeOrId === 'string' ? figma.getNodeByIdAsync(nodeOrId) : nodeOrId;
}

/* ---------- In-file state store (opt-in, standards/workflow-state.md) ---------- */

async function getPage(name, create) {
  await figma.loadAllPagesAsync();
  let page = figma.root.children.find((p) => p.name === name);
  if (!page && create) {
    page = figma.createPage();
    page.name = name;
  }
  return page || null;
}

async function getStateFrame(kind, frameName, create) {
  const page = await getPage(SYSTEM_PAGE, create);
  if (!page) return null;
  let frame = page.children.find((n) => n.type === 'FRAME' && n.name === frameName);
  if (!frame && create) {
    frame = figma.createFrame();
    frame.name = frameName;
    page.appendChild(frame);
  }
  if (frame && !frame.getSharedPluginData(DS_NAMESPACE, 'kind')) frame.setSharedPluginData(DS_NAMESPACE, 'kind', kind);
  return frame;
}

async function readState(kind, frameName) {
  const frame = await getStateFrame(kind, frameName, false);
  if (!frame) return null;
  const raw = frame.getSharedPluginData(DS_NAMESPACE, kind);
  return raw ? JSON.parse(raw) : null;
}

/**
 * State write, in-file mode only. Workspace mode writes ds-state/ files instead.
 * `expectedRev` is the rev you read (0 for a new record); a different stored rev means someone else wrote first.
 */
async function writeState(kind, frameName, data, expectedRev) {
  if (typeof expectedRev !== 'number') throw new Error('writeState needs expectedRev (the rev you read; 0 for a new record)');
  const current = await readState(kind, frameName);
  const currentRev = (current && current.rev) || 0;
  if (currentRev !== expectedRev) return { written: false, conflict: true, currentRev, mutatedNodeIds: [] };
  const frame = await getStateFrame(kind, frameName, true);
  const rev = currentRev + 1;
  frame.setSharedPluginData(DS_NAMESPACE, kind, JSON.stringify({ ...data, rev, updated: new Date().toISOString() }));
  return { written: true, rev, mutatedNodeIds: [frame.id] };
}

/* ---------- Checkpoint ---------- */

async function saveCheckpoint(title, description = '') {
  if (typeof figma.saveVersionHistoryAsync !== 'function') {
    return { saved: false, reason: 'saveVersionHistoryAsync not available — ask the human to save a named version' };
  }
  const result = await figma.saveVersionHistoryAsync(title, description);
  return { saved: true, id: result && result.id, title };
}

/* ---------- Sandbox (_DS Sandbox page) ---------- */

async function createSandbox(label) {
  const page = await getPage(SANDBOX_PAGE, true);
  const frame = figma.createFrame();
  frame.name = `Sandbox · ${label} · ${new Date().toISOString()}`;
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = 40;
  frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 24;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.clipsContent = false;
  page.appendChild(frame);
  return { frame, frameId: frame.id, createdNodeIds: [frame.id] };
}

/** Set a variable mode on a sandbox frame (node or ID) by names. */
async function setSandboxMode(frameOrId, collectionName, modeName) {
  const frame = await nodeRef(frameOrId);
  if (!frame) throw new Error(`Sandbox frame not found: ${frameOrId}`);
  const col = (await getCollectionsByName())[collectionName];
  if (!col) throw new Error(`Collection not found: ${collectionName}`);
  const mode = col.modes.find((m) => m.name === modeName);
  if (!mode) throw new Error(`Mode not found: ${collectionName}/${modeName}`);
  frame.setExplicitVariableModeForCollection(col, mode.modeId);
  return { mutatedNodeIds: [frame.id] };
}

/** Delete the sandbox frame (node or ID). Call it even after a failure. */
async function cleanupSandbox(frameOrId) {
  const frame = await nodeRef(frameOrId);
  const removedId = frame && !frame.removed ? frame.id : null;
  if (removedId) frame.remove();
  const page = await getPage(SANDBOX_PAGE, false);
  return { cleaned: true, removedNodeIds: removedId ? [removedId] : [], remaining: page ? page.children.length : 0 };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCollectionsByName, findVariable, resolveVariable, variableInfo, findComponentSet, walk, closest, variantLabel,
    renderBox, readState, writeState, nodeRef, saveCheckpoint, createSandbox, setSandboxMode, cleanupSandbox,
  };
}
