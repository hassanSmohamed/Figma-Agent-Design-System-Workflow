---
name: ds-foundation-extend
description: Executes approved FP-* foundation proposals (new variables, modes, Text/Effect/Paint/Layout styles) and approved FPV-* token value changes (with a consumer contrast table) in the active Figma design-system file through the package's single foundation-mutation path — re-verify, checkpoint, create in existing collections, alias per mode, set scopes/code syntax/descriptions, validate, log rollback, flag consumers for re-test, and update the Foundation Profile. Use after Review, Plan, Build, Fix, Test, or the architecture review proposes FP-* or FPV-* items and a human approves them. Do not use to design new foundations from scratch (use /ds-foundation-generate) or to judge foundations (use /ds-foundation-architecture-review).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
disable-model-invocation: true
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Foundation Extend

You are a careful foundation maintainer. Create or fill the approved `FP-*` items, and nothing else, using [foundation-mutation](../../standards/foundation-mutation.md). You execute approved proposals exactly; you do not design new foundations. `/ds-build` Phase 1 and `/ds-fix` use the same procedure; this skill runs it on its own.

Mutating (foundation write).

## When to use

- "Execute approved FP-SYS-001, FP-BUTTON-WEB-002."
- A review, plan, or test raised `FP-*` items and the human typed `Approve FP-…`.
- A build or fix stopped with `Blocked: shared token change needs FPV-…`, and the human typed `Approve FPV-…` after reading the consumer contrast table.

## When not to use

- Creating a whole foundation set → `/ds-foundation-generate`.
- Deciding whether a foundation change is needed → `/ds-foundation-architecture-review` or `/ds-review`.
- Any FP without a verbatim approval → stop; ask for it.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-foundation-extend"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check: C1, C2, C6, C7, C8 (C9 when adding modes).
3. Open the state store ([workflow-state](../../standards/workflow-state.md)) and read the Profile (or the user accepts `Unknown` naming checks).
4. Each `FP-*` / `FPV-*` exists with all required fields (Registry, Review/Plan report, or contract Table C) and a verbatim approval naming it (`Approve FP-…` / `Approve FPV-…`), typed this turn or stored with approver and date ([lifecycle-and-ids](../../standards/lifecycle-and-ids.md) §4).
5. Checkpoint saved.

## References

[foundation-mutation](../../standards/foundation-mutation.md) · [lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [foundation-profile](../../standards/foundation-profile.md) · [naming](../../standards/naming.md) · [figma-tooling](../../standards/figma-tooling.md) · [workflow-state](../../standards/workflow-state.md) · [accessibility](../../standards/accessibility.md) · [reporting](../../standards/reporting.md)

Scripts: [contrast-pairs](../../scripts/figma/contrast-pairs.js), [text-style-audit](../../scripts/figma/text-style-audit.js)

## Instructions

1. **Intake** — list each FP: ID, type, name, collection/group, modes/values, scopes, code syntax, approval quote.
2. **Re-verify** — gap still exists; no equivalent under another name; destination collection/group exists; mode count fits the plan limit.
3. **Checkpoint** — `ds-foundation-extend {FP IDs} start {timestamp}`.
4. **Create** — exactly per [foundation-mutation](../../standards/foundation-mutation.md) execution steps 2–7. Return the IDs of every created variable and style.
5. **Validate** — re-read created items; contrast pairs for new color roles (Light + Dark, WCAG + APCA); Arabic rules for new AR Text Styles.
6. **Record** — ledger (FP status `Created`, with IDs), registry, Profile version bump if the role set or grammar changed.

**`FPV-*` (token value change)** — follow the `FPV-*` rules in [foundation-mutation](../../standards/foundation-mutation.md):

1. Re-scan consumers. A consumer missing from the approved list → `Blocked: live file drift` (the approval covered a different set).
2. Re-run the before/after contrast table with `checkContrastPairs`. Any pair that passed before and fails after → `Blocked: FPV-… breaks {consumer} contrast`.
3. Change the alias per mode; rollback = the previous alias per mode.
4. Write `Re-test needed: FPV-…` on every consumer at `Tested` or later; next step for each is `/ds-test` (Build QA).

## Examples

Input:

```text
/ds-foundation-extend
Execute approved FP-SYS-001.
```

with `FP-SYS-001` = `color/border/focus`, Light → `color/brand/600`, Dark → `color/brand/300`, scope `STROKE_COLOR`.

Expected output (summary): one row `FP-SYS-001 · color/border/focus · Created (2 modes, aliases) · contrast vs surface Light 4.8:1 / Dark 6.1:1 · Pass · Rollback: delete variable {id}`; `No Profile change`; next step back to the skill that raised it.

## Common edge cases

One block reason per stop:

- `Blocked: FP-… not approved` — no verbatim `Approve FP-…`.
- `Blocked: FP-… incomplete (missing fields)` — for example no Dark value or no scope.
- `Blocked: write tools unavailable` — C2 or C6 is no.
- `Blocked: live file drift` — the gap no longer exists or an equivalent appeared; report it and create nothing.
- Mode limit reached on the plan → stop and report; never delete modes to make room.

## Output

Standard level ([reporting](../../standards/reporting.md)): header, then

| FP ID | Item | Action | Validation | Result | Rollback |
|---|---|---|---|---|---|

plus contrast rows for new color roles, the Profile change (or `No Profile change`), and one next step (usually back to the skill that raised the FP: `/ds-plan`, `/ds-build`, or `/ds-fix`).

## Completion gate

- Only approved FP items created and approved FPV changes applied; each re-verified first
- FPV: consumer list and contrast table re-checked; consumers flagged `Re-test needed`
- Existing collections/groups used; no renames or deletions
- Every mode filled; scopes, descriptions, code syntax set; primitives hidden
- Validation done (or `Unverified` with reason)
- Change log with rollback and created IDs; ledger, registry, Profile updated
