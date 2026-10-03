# Workflow State

Chat memory is not a source of truth. Everything a later session needs lives in a **state store**.

Figma's `figma-use` skill says to keep workflow state outside the Figma file. So the package default is a folder in the workspace. Saving state inside the Figma file is an **opt-in** exception, for runtimes that have no workspace (for example the agent inside Figma) or for teams who ask for it.

## 1. Two store modes

| Mode | Where | When |
|---|---|---|
| **Workspace** (default) | `ds-state/{figma-file-key}/` in the workspace / repo | The runtime can read and write files |
| **In-file** (opt-in) | Page `_DS System` in the Figma file | The user types `Store state in the Figma file`, or the runtime has no file system and the user agrees |

If neither is possible, the skill prints the state block at the end of its report and asks the user to paste it into the next session. It reports `State store: none (paste required)`.

### Choosing the mode (Phase 0 of every skill)

1. `ds-state/{file-key}/` exists → use **Workspace**.
2. The Figma file has a `_DS System` page → use **In-file**.
3. Neither exists: Workspace if files can be written, otherwise ask the user.

Report it in the header as `State: workspace (ds-state/abc123/)` or `State: in-file (_DS System)`. Never keep two stores for the same Figma file. To switch, the user must type `Move state to {workspace | the Figma file}`, and the skill moves every record.

## 2. Records

| Record | Workspace file | In-file frame | Written by |
|---|---|---|---|
| Profile | `profile.md` | `_DS Profile` | generate, architecture review, adopt |
| Registry | `registry.md` | `_DS Registry` | any skill that issues an ID |
| Ledger | `ledger.md` | `_DS Ledger` | every skill |
| Docs style | `docs-style.md` | `_DS Docs Style` | `/ds-document` |
| Contract | `contracts/CC-{COMP}-{PLAT}-{NNN}.md` | `CC-{COMP}-{PLAT}-{NNN}` | `/ds-plan`, `/ds-adopt`; updated by build, test, fix, document, release |

Each record holds the same data in two layers:

1. **Readable text** for people (short headings and tables).
2. **Machine data**: one fenced `json` block in the workspace file, or shared plugin data on the in-file frame (namespace `ds_workflow`, key = record kind). When plugin data can't be written, the readable text must be complete enough to parse.

The Figma file key comes from the file URL (`figma.com/design/{file-key}/…`).

<!-- core -->
### Revisions (no silent overwrites)

Two sessions or two people can work on the same file. Every record's machine data carries `rev` (integer, starts at 1), `updated` (ISO date-time) and `by` (skill and approver/user if known).

1. Remember the `rev` you read. Re-read the record **just before** writing.
2. Same `rev` → write with `rev + 1`. Different `rev` → do not write; stop with `Blocked: state changed since read ({record} rev {read} → {now})`, re-read, and redo the step on the new data.
3. In-file mode: `writeState(kind, frameName, data, expectedRev)` does this check and returns `{ written: false, conflict: true, currentRev }` on a conflict. Use `expectedRev = 0` for a new record.
4. **Registry IDs are never reused.** The registry is append-only; a dropped item is marked `Withdrawn`, and its number is never issued again.

## 3. Source priority

When a skill needs the contract, the Plan Package, the Profile, or approvals:

1. **The state store** wins for records. Stored approvals still need approver and date, and a resumed write needs `Proceed {ID} v{x}` ([lifecycle-and-ids.md](lifecycle-and-ids.md) §4–5).
2. The latest report in this conversation, **only if** it has the same ID **and** version as the store.
3. A pasted excerpt from the user that includes the ID and version.

If the store and the chat disagree → stop with `Blocked: state store and conversation disagree on {ID} version`.

The **live Figma file** still wins for facts about the design itself (variables, styles, nodes). When the live file disagrees with a record, report the drift (for example `Profile drift`).
<!-- /core -->

## 4. Contract record (minimum)

```text
CC-BUTTON-WEB-001 · v1.0 · Approved · rev 4
Component: Button / Web        Scope: New        Owner: Unassigned
Approval: "Approve CC-BUTTON-WEB-001 v1.0 Ready to Build. Also approve FP-BUTTON-WEB-001"  (approver: @lina · 2026-10-02 · rev 3)
Sections 1–13
Table B — Controls (full)
Table C — Foundation solves (full, FP IDs)
Table D — Nested configs (full)
Table E — Blocks (full or "None — not blocked.")
History: v0.1 Draft → v0.3 Ready to Build → v1.0 Approved → Built (2026-10-02)
```

## 5. Ledger row (minimum)

| Field | Example |
|---|---|
| Target | `Button / Web` |
| Contract | `CC-BUTTON-WEB-001 v1.0` |
| State | `Built` |
| Last phase | `Build Phase 9` |
| Next action | `/ds-test` |
| Approvals | verbatim phrase · approver · date (records without approver and date are not approvals) |
| Rev | `7` (see Revisions in §2) |
| Open findings | `QA-BUTTON-WEB-004 (Major)` |
| Deferred findings | `QA-BUTTON-WEB-007 (Minor) — naming polish` |
| Checkpoints | `ds-build CC-BUTTON-WEB-001 v1.0 start 2026-10-02 14:05` |
| Fix cycles | `1` |
| Node IDs | IDs returned by the last write (set, helpers), so later `use_figma` calls can find them |

## 6. Sandbox page (`_DS Sandbox`)

The sandbox is temporary canvas work, not workflow state. It is always in the Figma file. Read-only skills (`/ds-test`, and `/ds-review` when asked) use it to switch modes, swap text, or set Direction without touching the source:

1. Create a frame `Sandbox · {skill} · {target} · {timestamp}` and keep its returned node ID.
2. Place instances of the source. Never detach them. Never edit the source set.
3. Set variable modes, text overrides, and Direction values on the instances or the frame.
4. Measure.
5. **Delete the frame by its ID at the end of the run**, even after a failure. Report `Sandbox cleaned: Yes`.
