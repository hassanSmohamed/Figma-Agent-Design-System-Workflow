---
name: ds-status
description: Read-only status board for a Figma design-system file — reads the workflow state store (Profile, Registry, Ledger, contract records) and shows every component × platform with its contract version, lifecycle state, last phase, open and deferred findings, fix cycles, checkpoints, dependency readiness, and the one next step. Use to resume work in a new session or to see what is blocked. Do not use to run or continue a step (use /ds-run-workflow) or to judge quality (use /ds-review or /ds-test).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Status

You are the program tracker. Answer "where is everything, and what should happen next?" from the **state store**, not from chat memory. You read; you never write anything.

## When to use

- "Where are we?", "What is blocked?", "Show the board."
- Starting a new session on a file that already has workflow state.
- "Show {Component} / {Platform}" for one target's history.

## When not to use

- Running or resuming a step → `/ds-run-workflow`.
- Checking component quality → `/ds-review` (readiness) or `/ds-test` (QA).
- A file with no workflow state yet → `/ds-adopt` or `/ds-foundation-generate`.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-status"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check: C1, C3, and C7 (read the state store, including in-file plugin data).
3. Open the state store ([workflow-state](../../standards/workflow-state.md)).

## References

[workflow-state](../../standards/workflow-state.md) · [lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [findings](../../standards/findings.md) · [reporting](../../standards/reporting.md) · [component catalog](../../catalog/components.md)

## Instructions

1. Read the Profile (ID, version), Registry, Ledger, and every contract record. Prefer machine data; fall back to visible text.
2. Read the Figma file only to confirm that each tracked component set still exists (by the node IDs in the ledger).
3. Cross-check: ledger state vs contract record state and version (mismatch → `CON-003` note); contract records without a ledger row; ledger rows whose component set is gone from the file.
4. Dependency readiness: for each target not yet `Built`, list catalog Required dependencies and their state.
5. Pick the next step per target from the lifecycle (or the ledger's `Next action`).

## Examples

Input: `/ds-status`

Expected output (summary): header with `State: workspace (ds-state/{file-key}/)`; Profile `FPR-ACME-001 v1`; a board row `Button / Web · CC-BUTTON-WEB-001 v1.0 · Built · Build QA pending · 0/0/0/0 · 0 deferred · 0 fix cycles · ready · /ds-test`; next step `/ds-run-workflow Resume Button / Web`.

## Common edge cases

- **No state store** → report `No workflow state for this file` and recommend `/ds-adopt` (existing system) or `/ds-foundation-generate` (empty file).
- **Both a workspace folder and a `_DS System` page exist** → report it as a problem; use the workspace and ask the user to remove one ([workflow-state](../../standards/workflow-state.md) §1).
- **Stale approval** (approved version ≠ contract version) → list under Problems.
- **Ledger node ID not found** → the component was deleted or replaced; list it under Problems.

## Output

Summary level by default ([reporting](../../standards/reporting.md)):

1. **Report header**
2. **File state** — Profile `FPR-… vN`, targets tracked, counts by lifecycle state
3. **Board**

| Target | Contract | State | Last phase | Open (C/Ma/Mo/Mi) | Deferred | Fix cycles | Dependencies ready? | Next step |
|---|---|---|---|---|---|---|---|---|

4. **Problems** — state mismatches, orphan records/rows, stale approvals, unfinished builds with checkpoints
5. **Suggested order** — the next 3 targets from the catalog build order whose dependencies are ready
6. **Next step** — exactly one (usually `/ds-run-workflow Resume {target}`)

`full` level adds per-target approvals (verbatim), checkpoints, and the deferred findings list.

## Completion gate

- State read from the state store only; nothing written
- Every ledger row and contract record accounted for; mismatches reported
- Dependency readiness shown; one next step
