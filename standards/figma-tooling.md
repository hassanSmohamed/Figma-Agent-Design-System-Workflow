# Figma Tooling, Write Safety, and Facts

## 1. Phase 0 · Capability check (every skill)

Before any inspection, list what the current tools can do. Put the result in the report header.

| Capability | Needed by | If missing |
|---|---|---|
| C1 Read collections, modes, values per mode | all | Rows become `Unknown`; mutating skills stop |
| C2 Read alias targets, scopes, publish visibility, code syntax | review, architecture review, generate | `Unknown` |
| C3 Read styles incl. effect geometry and Text Style variable bindings | review, build, test | `Unknown`; never invent values |
| C4 Read node bindings (`boundVariables`, `textStyleId`, `effectStyleId`) | build, test, fix | `Unknown` |
| C5 Execute Figma Plugin API JavaScript | scripts in `scripts/` | Do the check by hand and mark numbers `Unverified` |
| C6 Write variables, styles, nodes | generate, extend, build, fix, document, release; test (sandbox only) | **Stop**: `Blocked: write tools unavailable` |
| C7 Write the state store (workspace files, or shared plugin data in-file) | every skill that records state | See [workflow-state.md](workflow-state.md) §1 (paste fallback) |
| C8 Save a version-history checkpoint | mutating skills | Ask the human to save a named version, wait for "Saved" |
| C9 Plan limits (modes per collection) | generate, extend | Ask the user or mark `unknown`; propose fewer modes |

Each skill lists one capability set in its Prerequisites. A skill that makes source, foundation or docs writes lists C6 and C8 (it saves a checkpoint, §3); a skill that records state lists C7.

Figma MCP rules (§5) apply whenever the runtime uses the Figma MCP server.

## 2. Write categories

| Category | Examples | Allowed in |
|---|---|---|
| **Source write** | Component sets, variants, properties, bindings | `/ds-build`, `/ds-fix` (after approval gates) |
| **Foundation write** | Variables, collections, modes, styles | Only through [foundation-mutation.md](foundation-mutation.md) |
| **Docs write** | Docs pages and frames with live instances | `/ds-document` |
| **State write** | Records in the state store ([workflow-state.md](workflow-state.md)) | Any skill, including "read-only" ones |
| **Sandbox write** | Temporary instances on `_DS Sandbox` | Any skill; must be cleaned up |

"Read-only" in a skill means: **no source, foundation, or docs writes.** State and sandbox writes are allowed and must be reported.

## 3. Checkpoint, rollback, resume

Before the first source/foundation/docs write in a run:

1. Save a version-history checkpoint named `ds-{skill} {target or FG ID} v{version} start {timestamp}` (Plugin API: `figma.saveVersionHistoryAsync(title, description)` where available; otherwise ask the human).
2. Write the checkpoint name into the ledger.
3. Every change-log row has a **Rollback** column: the inverse action (`Delete variable color/focus/ring`, `Restore fill to color/bg/brand/default`).
4. After each construction phase, write `Last phase: {skill} Phase N` to the ledger.

**Resume rule:** at Phase 0, if the ledger shows an unfinished run for the same target and version, or the file contains a half-built set (set exists, contract state is still `Approved`), report `Resume detected at Phase N`, verify the earlier phases quickly, and continue from Phase N. Never start over on top of a half-built set.

## 4. Figma facts the skills rely on

State these correctly; do not invent features.

1. **Text Styles have no modes.** A Text Style can bind font family, weight, size, line height, letter spacing, and paragraph spacing to variables. Those variables live in a collection that may have modes; the **frame's mode** decides the value.
2. **Auto Layout has no RTL switch.** Child order is physical. Text alignment (left/center/right) is physical. RTL needs the mechanism in [language-direction.md](language-direction.md).
3. **Modes are per collection**, and the number of modes depends on the Figma plan. Check before proposing many modes.
4. **Publishing a library is a human action** in the Figma UI. Skills prepare release notes and checklists; they do not publish.
5. Variables can be hidden from publishing (`hiddenFromPublishing`) and can have empty scopes (hidden from all pickers). Use both for primitives.
6. Variables can carry code syntax per platform (`WEB`, `ANDROID`, `iOS`) and a description.
7. Effect styles can bind some effect properties (such as color, offsets, blur, spread) to variables; multi-layer shadows still need an Effect Style.
8. Component properties of nested instances can be **exposed** on the parent instance ("expose nested instances"). This lets a private helper's `Direction` property appear to consumers without adding an axis to the parent set.
9. `absoluteRenderBounds` includes strokes and effects; use it for overlap checks (fallback: `absoluteBoundingBox` plus effect extents).

<!-- core -->
## 5. Figma MCP rules

These follow Figma's [skill guide](https://developers.figma.com/docs/figma-mcp-server/create-skills/) and its [`figma-use`](https://github.com/figma/mcp-server-guide/blob/main/skills/figma-use/SKILL.md) skill.

1. **Invoke the `figma-use` skill before every `use_figma` call.** It holds the Plugin API rules that prevent hard-to-debug failures. If it is not installed, stop: `Blocked: figma-use skill not available`.
2. **Always pass `skillNames`** to `use_figma`, listing `figma-use` and the running skill, for example `skillNames: "figma-use,ds-build"`. If a skill was loaded as an MCP resource, prefix its name with `resource:`. This parameter is used for logging only.
3. **Script shape:** plain JavaScript with top-level `await` and `return`. No async IIFE, no `figma.closePlugin()`, no `figma.notify()`, and no `console.log` for results. The package scripts already follow this. Paste them in the order given in `scripts/README.md`.
4. **Return every created or changed node ID** from a write script (`createdNodeIds`, `mutatedNodeIds`). Nothing carries over between `use_figma` calls, so later calls pass these IDs as string literals. Record the important ones (set, helpers, sandbox frame) in the ledger.
5. **Switch pages at most once per call** with `await figma.setCurrentPageAsync(page)`. Split multi-page work into parallel calls.
6. **On a `use_figma` error, stop.** If `safeToRetryWithoutCanvasRead` is false, read the canvas first to see what changed. Then fix the cause and retry. Never retry blindly on top of a half-written state.
7. **Other Figma skills:** `figma-use` may suggest loading `figma-generate-library` (component and foundation creation) or `figma-generate-design` (screens). When a `ds-*` skill is running, its gates, contract, and standards decide **what** to build. Use those Figma skills only for **how** to call the Plugin API.
8. Set `node.description` only on a `COMPONENT` or `COMPONENT_SET`, never on frames or instances.
9. Test on a duplicate or example file, never on an important working file.
<!-- /core -->
