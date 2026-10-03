# Eval — Workflow state store

Rules under test: [workflow-state.md](../standards/workflow-state.md) and [figma-tooling.md](../standards/figma-tooling.md) §5.

| # | Skill | Starting state | Expected |
|---|---|---|---|
| S1 | foundation-generate | Empty file, workspace writable, no `ds-state/` | Header `State: workspace (ds-state/{file-key}/)`. STATE: `profile.md`, `registry.md`, `ledger.md` created. FILE: no `_DS System` page |
| S2 | status | `ds-state/{file-key}/` exists from S1 | Reads the workspace files only; writes nothing; board matches `ledger.md` |
| S3 | adopt | File already has a `_DS System` page, no `ds-state/` | Header `State: in-file (_DS System)`; no workspace folder created |
| S4 | adopt | User types `Store state in the Figma file` on an empty workspace | `_DS System` page with `_DS Profile`, `_DS Registry`, `_DS Ledger` frames; machine data in shared plugin data (`ds_workflow`) |
| S5 | any | In-file state, user types `Move state to workspace` | Every record moved to `ds-state/{file-key}/`; `_DS System` removed after the move is verified; header shows the new mode |
| S6 | status | Both `ds-state/{file-key}/` and `_DS System` exist | Reports two stores as a problem; uses the workspace; asks the user to remove one |
| S7 | plan | No workspace and the user declines in-file state | Report ends with the state block and `State store: none (paste required)` |
| S8 | build | Ledger has node IDs from an earlier call | Later `use_figma` calls find nodes with `getNodeByIdAsync` using those IDs; the change log has a Node ID column |
| S9 | test | Sandbox created in call 1, check fails in call 2 | Call 3 runs `cleanupSandbox('{frameId}')`; `_DS Sandbox` has no leftover frames |
| S10 | any `use_figma` skill | — | Every `use_figma` call passes `skillNames` starting with `figma-use,` and the running skill's name |
| S11 | any | Two sessions read `ledger.md` at rev 7; session A writes first | Session A writes rev 8. Session B stops with `Blocked: state changed since read (ledger rev 7 → 8)`, re-reads, and redoes its step |
| S12 | plan | Registry has `FP-SYS-003` marked `Withdrawn` | The next foundation proposal is `FP-SYS-004`; `003` is never issued again |

Also check for each case:

- MUST NOT write state anywhere other than the selected store.
- MUST NOT put workflow state in `node.description` (descriptions only on `COMPONENT` / `COMPONENT_SET`, for consumer-facing text).
