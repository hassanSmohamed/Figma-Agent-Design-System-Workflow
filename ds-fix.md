---
name: ds-fix
description: Safely repairs confirmed Test findings for one platform component while preserving public API and instances. Use after /ds-test.
---

# Design System Fix

## Role

Act as a careful design-system maintainer.

## Objective

Repair confirmed `/ds-test` findings for **exactly one foundation component on exactly one platform** without breaking the public API, instances, or shared foundations.

This Skill is mutating. Change only what is needed to fix in-scope findings.

## When to run

Run after `/ds-test` for the same component + platform.

```text
/ds-fix
Fix Critical and Major findings for {Component Name} / {Web | Tablet | Mobile}.
```

## Platforms

One platform per run: `Web`, `Tablet`, or `Mobile`.

Naming target:

```text
{Component Name} / {Web | Tablet | Mobile}
```

## Accepted inputs

Use one of:

- A `/ds-test` report in the current conversation
- Explicit `QA-*` / `A11Y-*` finding IDs
- A clear issue list from the user
- A selected component plus instruction to fix confirmed Critical and Major issues
- A `CC-*` Component Contract plus confirmed findings

If no findings are supplied, run a focused read-only inspection, build an internal issue list, then mutate only confirmed Critical/Major items.

If the target is unclear, do not mutate. Return `Blocked: missing target component or platform`.

## Component Contract intake (`CC-*`)

Use the latest reliable contract as the repair boundary.

Accepted sources, in priority:

1. `CC-*` frame or docs block in the active file
2. Latest `/ds-plan` or `/ds-build` report
3. User-supplied contract excerpt with ID, version, and status

Capture before mutation: Contract ID, version, status, scope, platform (must match), source.

Required intake: public API, variant/state model, content, sizing/responsive, platform rules, theme/LTR-RTL, accessibility, foundation map, acceptance criteria, open questions.

Gates:

- No reliable contract → do not mutate unless the prompt explicitly authorizes contract recovery or emergency repair → else `Blocked: missing component contract`
- Status `Blocked` → do not mutate → `Blocked: component contract is Blocked`

## Fix scope

Default:

- Fix **Critical** and **Major** only
- Fix Moderate/Minor only when the user asks, or when inseparable from a higher-severity repair
- Do not redesign unrelated areas
- Do not add new visual styles or product features

## Safety rules

1. Verify each finding still exists before fixing it.
2. Preserve component and component-set IDs where possible.
3. Preserve approved variant property names and values.
4. Preserve component property names and defaults.
5. Preserve nested dependencies as instances; do not detach.
6. Do not delete variants with unknown usage.
7. Do not replace semantic bindings with primitives.
8. Do not create duplicate variables or styles.
9. Assign the exact existing approved Text Style for typography repairs.
10. Do not rebuild Text Styles via direct node-level typography variables.
11. Remove accidental local typography overrides after style assignment.
12. Do not invent missing tokens/styles silently — use the `FP-*` gate.
13. Do not invent shadow geometry.
14. Do not expand the variant matrix when a property or nested instance solves it.
15. Do not rebuild the whole component for a local issue.
16. Do not change the public API silently.
17. Do not modify unrelated components.
18. Do not mark a finding fixed until revalidated.
19. Keep a change log.
20. Do not claim runtime a11y compliance from Figma-only repairs.
21. Do not add fake hidden text/ARIA layers to simulate code semantics.
22. Separate design fixes, documentation fixes, and runtime handoff.
23. Do not solve contrast by binding to primitives.
24. Contrast repairs must re-confirm with **WCAG 2.2 AA and APCA**; prefer the next shade/tint on the approved ramp that passes **both**.
25. If the finding cites a component-set example, follow that example’s passing semantic step — or move along the ramp — do not invent off-ramp hex.
26. Do not shrink approved typography or target size to fit dense layout.
27. Match the `CC-*` contract unless an approved contract update is in scope.
28. Replace rebuilt nested dependencies with approved instances when they exist.
29. Bind unexplained raw production values to approved Variables/Styles.
30. Repair overlap, clipping, and inconsistent Auto Layout before marking layout fixed.
31. Do not use absolute positioning to hide Auto Layout defects.

## Foundation Proposal Contract (`FP-*`)

Never create a missing semantic variable, Text Style, or effect style silently.

When a required foundation is missing:

1. Verify no approved equivalent exists.
2. Create a structured proposal (`FP-001`, …).
3. **Stop** before creating it unless the prompt explicitly approves that proposal ID.
4. When approved, create only what was approved, then continue.
5. Record every created foundation in the change log.

Each proposal must include: Proposal ID, foundation type, exact Figma name, collection/group, data type, scopes, modes, values (alias primitives when possible), rationale, affected components, risk, approval status.

Approval example: `Approve foundation proposal FP-001`.

### Foundation-change gate

Creating a variable or style changes the shared library. Even with API safety, require explicit `FP-*` approval. Reverify the gap, create exactly as approved, validate, and record consumers changed.

## Breaking-change gate

Potentially breaking:

- Rename/remove variant property or value
- Remove a component property or change its type
- Replace the source component set
- Delete a nested dependency
- Change boolean-state meaning or documented action order

Also contract-impacting: new public property, new variant axis/value, documented RTL/platform behavior change, dependency change, accessibility acceptance change.

When breaking is required:

1. Do not apply silently.
2. Apply safe non-breaking repairs first.
3. Return a migration proposal (existing API, proposed API, reason, affected instances, steps).
4. Mark the finding `Needs migration approval`.

Update the contract first for approved non-breaking contract-impacting changes. For breaking changes, wait for migration approval.

## Fix order

1. Broken instances or API risk  
2. Rebuilt nested dependencies → shared instances  
3. Overlap, clipping, inconsistent Auto Layout  
4. Accessibility-critical design issues  
5. Incorrect semantic bindings and missing Text Styles  
6. Broken typography / text layout  
7. Missing required states  
8. Broken theme behavior  
9. Broken responsive / platform behavior  
10. Broken Arabic or RTL behavior  
11. Variant/property architecture  
12. Naming  
13. Documentation and polish (only if in scope)

## Fix patterns (summary)

### Accessibility (`A11Y-*`)

Classify each repair as Design, Documentation, Runtime, Foundation (`FP-*`), or Product decision.

- Contrast: semantic tokens; remeasure; do not guess or use primitives  
- Focus: visible Focused state; not clipped; Light/Dark; distinct from other states  
- Target size: ≥ 24×24 CSS px (plus product touch standard); preserve visual icon size  
- Labels: visible labels; icon-only naming guidance; no fake hidden name layers  
- Non-color states; helper/error association; loading not motion-only  
- Reflow: fix Auto Layout — do not shrink type  
- Runtime keyboard/ARIA/announcements stay in handoff unless code is also in scope

### Bindings and nested reuse

Bind to semantic Variables. Replace local Avatar/Badge/Icon/Checkbox/Button/Input/Spinner/Menu/Link rebuilds with nested instances. Remove orphaned local layers.

### Typography

```text
Component text node
  → exact existing approved Text Style
    → typography variables inside that Text Style
```

Assign style → remove accidental overrides → verify internal variables → bind semantic text color separately when needed. Missing style → `FP-*`. Do not edit shared styles unless explicitly approved.

### Layout / responsive / platform

Fix Auto Layout direction, gap, padding, Hug/Fill/min/max. Stress long EN/AR. Respect Web viewport vs Tablet/Mobile touch rules from the contract.

### Theme / RTL

Fix semantic bindings; test Light/Dark; no theme variants. Use Leading/Trailing and Start/End; mirror only directional icons; keep inherently LTR values readable.

### Missing shadow

Use an existing verified effect style. If geometry is missing, stop with a foundation gap — do not invent offsets/blur/spread.

## Workflow

### 1. Resolve target and findings

| Finding ID | Severity | Still reproducible | Planned repair | Breaking risk |
|---|---|---|---|---|

Skip findings no longer reproducible and say why.

Also record Contract ID, version/status before fix, and repair mode: Match contract / approved contract update / migration proposal.

### 2. Capture current API

Before mutation: component-set name, variant properties, component properties/defaults, nested dependencies, bindings, Text Style map, modes, a11y findings, contract baseline, existing drift.

### 3. Apply minimal repairs

Fix one related group at a time. After each group: reinspect affected variants; Light/Dark if colors changed; EN/AR if layout/type changed; Text Style integrity; nested instances; affected `A11Y-*`; keep runtime items in handoff.

On live-vs-contract drift: match the contract when safe; if live behavior is the approved target, stop until the user approves a contract update.

### 4. Revalidate changed areas

Focused checks for: original finding, adjacent states, public API, responsive/platform behavior, Text Styles, contrast/focus/target where affected, theme, RTL where affected, documentation accuracy, runtime handoff completeness.

### 5. Stop conditions

Stop and report when:

- Required token/style missing and no approved `FP-*`
- Shadow geometry missing
- Destructive migration required
- Missing dependency or unavailable font/style
- Product decision / approved copy needed
- Runtime-only a11y cannot be fixed in Figma
- Repair would change the contract without approval

## Output format

Default report is **simple tables only**. Easy language. Do not emit empty matrices. Keep contract intake, full change logs, Text Style maps, and regression matrices internal unless the user asks for a full audit.

### Fix Result — {Component} / {Platform}

| Field | Value |
|---|---|
| Status | `Fixed`, `Partially fixed`, or `Blocked` |
| Contract | `CC-*` (version before → after, or unchanged) |
| Platform | Web, Tablet, or Mobile |

### Fixed

| ID | What changed | Checked |
|---|---|---|

One row per fixed finding. Use plain language. Include the exact Variable/Text Style when relevant. Leave the table as `None` if nothing was fixed.

### Still open

| ID | Problem | Why not fixed | Options (pick one) | Try again |
|---|---|---|---|---|

One row per unresolved Critical/Major finding (including migration and `FP-*` stops).  
**Why not fixed** must be concrete (missing approval, breaking API, runtime-only, product decision, etc.).  
**Options** must be actionable (approve `FP-*`, approve migration, `/ds-plan`, document exception).  
**Try again** must tell the user the exact reply that unblocks the next `/ds-fix` (or the command to run).  
Leave as `None` if everything in scope is fixed.

### Skipped

| ID | Reason |
|---|---|

Include: no longer reproducible, Moderate/Minor out of scope, already fixed. Leave as `None` if nothing was skipped.

### Next

List only the actions that apply to this run:

| Action | When |
|---|---|
| `/ds-fix` | After the user picks an option under Still open |
| `/ds-test` | Recheck Fixed items (default when anything was mutated) |
| `/ds-plan` | Contract update or replanning required |
| `/ds-document` | Behavior fixed; docs still incomplete |
| `Approve FP-*` then `/ds-fix` | Waiting on foundation approval |
| `Approve migration` then `/ds-fix` | Breaking change blocked |

Optional — only when the public API actually changed:

### API change

| What | Before | After | Breaking? |
|---|---|---|---|

## Completion gate

A fix is complete only when:

- Every changed finding was reproduced first
- A reliable `CC-*` was captured
- Smallest safe repair was applied
- Public API preserved or migration proposal returned
- Contract drift fixed or explicitly escalated
- Changed areas revalidated
- No primitive-color shortcuts introduced
- Required layers bound to approved Variables/Styles
- Nested rebuilds replaced with instances when approved dependencies exist
- Layout defects repaired when affected
- Any new foundation explicitly approved, created exactly, and validated
- Typography/Text Style integrity revalidated when affected
- Changed `A11Y-*` design findings revalidated; runtime work not falsely marked done
- No fake semantic layers; no unrelated components modified
- Next table lists `/ds-test` when mutations occurred, and `/ds-fix` retry paths when Still open items need approval
