---
name: ds-run-workflow
description: Orchestrates the design-system workflow for one target component on one platform. Use to run Jira board package (/ds-jira) → Review → Plan (CC-* + Plan Package A–E) → human approval → Build (consumes Tables C–D) → Test → Fix → Test → Document and return one final results report.
---

# Design System Workflow Orchestrator

## Role

Act as the design-system workflow coordinator for this skill package.

## Objective

Run the correct sequence for one foundation component on one platform, stop for approvals when required, and return one combined results report.

Primary install target: **Figma Custom Skills**. Cursor + Figma MCP may also use this skill when available.

## Scope

Handle one of these at a time:

- One full component workflow (one platform)
- Review-only
- Plan-only (always ends waiting for approval)
- Test / Fix cycle
- Documentation-only
- Jira board package-only (parent + full-workflow subtasks draft)
- Foundation architecture review

Do not run unrelated components in one invocation.

## Required inputs

Before starting, verify:

1. Live Figma design-system file (not screenshots alone)
2. Target component is identifiable
3. Platform is identifiable: `Web`, `Tablet`, or `Mobile`
4. Requested workflow mode is clear

If any are missing, stop and ask for the smallest missing input.

## Plan → Build handoff (mandatory)

`/ds-plan` produces a **Plan Package**. After human approval, `/ds-build` must intake it — not the 12 contract sections alone.

| Extra | Producer | Consumer after approval |
|---|---|---|
| **A. ASCII wireframe** | `/ds-plan` | `/ds-build` — anatomy blueprint |
| **B. Controls table** | `/ds-plan` | `/ds-build` — public API blueprint |
| **C. Missing Variables/Styles — solve table** | `/ds-plan` | `/ds-build` — **executable** creates / aliases / binds |
| **D. Dependent components — configuration matrix** | `/ds-plan` | `/ds-build` — **executable** nested instance configs |
| **E. Blocking remedies** | `/ds-plan` | `/ds-build` — **gate only**; must be clear before mutation |

Rules:

1. Do not start `/ds-build` until `Approve CC-… Ready to Build` is present for that exact contract ID.
2. If Table C has rows with `Blocks Ready to Build? = Yes`, also require explicit `FP-*` and/or Gap ID approval before Build creates them.
3. If Table E is not clear, do not start Build — return to Plan / Review.
4. Build must log Table C and Table D execution (or explicit `None`). Orchestrator treats missing C–D intake as a failed Build handoff.
5. Do not reinterpret or “improve” Tables C–D between Plan and Build. If they are wrong, revise Plan first.

## Workflow modes

### 1. Full component workflow (default)

Sequence:

1. `/ds-jira` — plain-text parent task + subtasks for the full workflow (board kickoff; skip if user declines)
2. `/ds-review` — foundations coverage for this component + platform (Plan Handoff Package required)
3. `/ds-plan` — `CC-*` contract + Plan Package extras **A–E** (C–D must be build-executable or explicit `None`)
4. **Hard stop for human approval**
   - `Approve CC-… Ready to Build`
   - plus `FP-*` / Table C Gap IDs when creates block Ready to Build
5. `/ds-build` — consumes approved package; **executes Tables C–D**; applies **Language** (EN + automatic AR stress copy + Text Styles) and **Direction** (LTR/RTL logical layout) as **separate** concerns in the same build
6. `/ds-test`
7. `/ds-fix` when Critical or Major findings exist
8. `/ds-test` recheck after fixes
9. `/ds-document` when requested or when the component is approved

There is **no separate Language phase** and **no separate RTL/Direction phase**. Both are part of Build, but they must never be treated as one axis.

## Package-wide: Language ≠ Direction

Across every skill in this package, **Language** and **Direction** are independent:

| Axis | What it is | Mechanism | Not allowed |
|---|---|---|---|
| **Language** | Content locale preview: English / Arabic | Content strings + approved `Text/EN/…` and `Text/AR/…` Text Styles | Language as a variant axis; EN/AR duplicate component sets; faking Arabic by right-aligning Inter |
| **Direction** | Reading/layout direction: LTR / RTL | Direction-neutral Auto Layout; Leading/Trailing/Start/End; optional nested `Direction=LTR\|RTL` only if anatomy requires it | Direction as a Theme/Language mashup; assuming Language ≡ Direction in the public API |

Rules every phase must respect:

1. Do **not** conflate “Arabic” with “RTL” or “English” with “LTR” in property names, variant axes, intake labels, or acceptance wording.
2. Primary product stress remains **EN + LTR** and **AR + RTL**, but Plan/Build/Test/Document must name **Language** and **Direction** as separate contract fields and evidence columns.
3. Theme (Light/Dark), Language (EN/AR), and Direction (LTR/RTL) are three independent non-axes — never explode `Theme × Language × Direction` variants.
4. Intake and reports use separate labels: `Theme`, `Language`, `Direction` — not `theme/RTL` or `language/direction` as a single blob.
5. Review Plan Handoff, Plan §8, Build Phase 6, Test §9, Fix, and Document must all split Language vs Direction.

## Package-wide: Automatic Arabic copy

Every full-workflow run **must** supply Arabic stress/default strings for every contracted text role. This is **content simulation for layout and Text Style stress**, not product localization policy.

| Rule | Detail |
|---|---|
| Who produces it | `/ds-plan` §5 lists EN + AR example strings per text role; `/ds-build` applies them automatically in Phase 6 |
| Source of strings | Prefer Plan §5 AR examples; if Plan omitted a role, Build fills from the shared stress glossary (Build Appendix A) — do not leave AR empty |
| What is allowed | Automatic AR stress/default strings for Label, Helper, Error, Placeholder, Title, Body, and any other contracted text role |
| What is forbidden | Inventing numeral policy, date format, legal/product microcopy, or claiming AR strings are finalized product translation |
| Text Styles | Every AR stress string uses the exact approved `Text/AR/…` style for that role + platform |
| Test / Document | Fail or gap if a contracted text role has EN but no AR stress; docs show AR examples as stress, not as locked product copy |

Underlying skills implement these rules; the orchestrator must not weaken them.

### 2. Review-first workflow

1. `/ds-review` (component coverage; evidence + Plan Handoff Package required)
2. Foundation proposal pass when needed
3. Return readiness (`Ready` / `Ready with gaps` / `Blocked`) and recommend `/ds-plan` only when not Blocked

### 3. Plan-only workflow

1. Confirm `/ds-review` exists or run it
2. `/ds-plan` (must emit A–E / Build Handoff Package)
3. Stop for approval (do not auto-start Build)

### 4. Test-and-fix workflow

1. `/ds-test`
2. `/ds-fix` when needed
3. `/ds-test` recheck
4. `/ds-document` only if requested

### 5. Documentation workflow

1. Confirm contract and test status
2. Confirm usage screens or source-only exception
3. `/ds-document`
4. Return documentation report

### 6. Jira board package workflow

1. Confirm component + platform
2. `/ds-jira` — plain-text parent `Create …` plus Review→Handoff subtasks
3. Return Jira Draft Result (`Ready to paste` or `Needs more inputs`)

### 7. Foundation architecture workflow

1. `/ds-foundation-architecture-review`
2. `/ds-review` only if component impact must be mapped
3. Return architecture findings

## Skill routing rules

Underlying skills are the source of truth:

- `/ds-review`
- `/ds-plan`
- `/ds-build`
- `/ds-test`
- `/ds-fix`
- `/ds-document`
- `/ds-jira`
- `/ds-foundation-architecture-review`

Do not bypass a stricter underlying rule.

Hard stop when:

- Required production layers remain unbound
- Nested reuse gate fails (including unmet **Table D** Required rows)
- Variables/Styles compliance gate fails (including unexecuted blocking **Table C** rows)
- Unintended overlap, clipping, or unstable Auto Layout remains
- Plan is not human-approved before Build
- Required `FP-*` / Table C Gap IDs are unapproved
- Plan Package extras C–D are missing (and not explicitly `None`)
- Table E still has uncleared Blocking rows
- Build tries to invent foundations or nested substitutes not listed in Tables C–D

## Step control rules

1. Run one phase at a time and name the phase.
2. State read-only vs mutating at the start of each phase.
3. Stop immediately for blocking questions, missing contract decisions, missing foundation / Table C approval, Table E blockers, or migration approval.
4. Do not continue past a blocked phase.
5. After Plan, verify Build Handoff Package fields exist before offering Build.
6. After each mutating phase, summarize what changed — for Build, include Table C / Table D execution results.
7. If Test finds no Critical/Major issues, skip Fix and say why.
8. Do not Document as production-ready while Test fails, unless the user asks for draft docs.
9. At full-workflow kickoff, offer `/ds-jira` (parent + subtasks) unless the user skips board setup.
10. `/ds-jira` is draft-only — never create Jira issues via API from the orchestrator. Output must be easy plain text with Action + component titles.

## Planning and approval rules

- `/ds-plan` always ends with an approval request and a **Build Handoff Package**
- Build starts only after explicit `Approve CC-… Ready to Build`
- Respect `FP-*` and Table C Gap ID approval gates
- Respect migration-approval gates
- One component + one platform per full workflow
- After approval, pass the same Plan Package (especially **C–D**) into `/ds-build` without rewriting solves

Safe approval patterns the orchestrator should accept:

```text
Approve CC-BUTTON-WEB-001 Ready to Build
```

```text
Approve CC-BUTTON-WEB-001 Ready to Build.
Also approve foundation proposals FP-001 and FP-002.
```

```text
Approve CC-BUTTON-WEB-001 Ready to Build.
Also approve Plan Table C solves for Gap IDs G-001, G-002.
```

## Platform rules

Separate platform components:

```text
{Component} / Web
{Component} / Tablet
{Component} / Mobile
```

Web responsive min-screens are **within** the Web component. Tablet app and Mobile app are separate builds.

## Result reporting

Return one final combined report.

### Workflow Summary

- Target component
- Platform
- Workflow mode
- Final status: `Completed`, `Completed with gaps`, `Blocked`, or `Stopped for approval`
- Last completed phase
- Plan Package C–D status: present / `None` / missing
- Recommended next action

### Phase Results

| Phase | Ran | Result | Key output |
|---|---|---|---|

Possible phases: Jira board package, Review, Plan, Approval, Build, Test, Fix, Test recheck, Document, Foundation architecture review.

For **Plan**, Key output must mention `CC-*` plus extras A–E (C/D row counts or `None`).  
For **Build**, Key output must mention Table C / Table D execution (or `None`).  
For **Jira board package**, Key output must mention draft status (`Ready to paste` / `Needs more inputs`) and that parent + nine subtasks were returned.

### Contracts and Approvals

| Item type | ID | Status | Notes |
|---|---|---|---|

Include `CC-*`, `FP-*`, Table C Gap IDs (`G-*`), Table E Block IDs when relevant, and migration approvals.

### Plan → Build Package Trace

| Extra | Plan delivered? | Approved? | Build consumed / executed? | Notes |
|---|---|---|---|---|
| A Wireframe | | | | |
| B Controls | | | | |
| C Variables/Styles solves | | | | |
| D Nested config matrix | | | | |
| E Blocking remedies | | | | Gate clear? |

### Main Findings or Changes

| Area | Summary | Severity or impact | Action taken |
|---|---|---|---|

When Build/Test/Document ran, include Language and Direction as **separate** rows when relevant (do not merge into one “RTL/i18n” blob).

### Language / Direction / Theme coverage (full workflow)

| Axis | Verified? | Evidence summary |
|---|---|---|
| Theme (Light / Dark) | | |
| Language (EN + automatic AR stress copy + Text Styles) | | |
| Direction (LTR + RTL logical layout) | | |

### Final Recommendation

Return exactly one best next step, such as:

- `Continue to /ds-plan`
- `Approve CC-* Ready to Build`
- `Approve CC-* Ready to Build + FP-* / Table C Gap IDs`
- `Continue to /ds-build` (will consume Tables C–D)
- `Continue to /ds-test`
- `Continue to /ds-fix`
- `Continue to /ds-document`
- `Continue to /ds-jira`
- `Paste Jira board package into board`
- `Approve foundation proposal FP-*`
- `Approve migration proposal`
- `Resolve contract / Table E blocker`
- `Revise Plan Tables C–D, then re-approve`
- `Workflow complete`

## Completion gate

Complete only when:

- Correct mode was chosen
- Each phase respected read-only vs mutating boundaries
- Approval gates were respected (`CC-*`, `FP-*`, Table C Gap IDs as needed)
- Plan → Build handoff included Tables C–D (or explicit `None`) when Build ran
- No blocked phase was silently skipped
- When full workflow ran, `/ds-jira` ran at kickoff or was explicitly skipped
- When Build/Test ran: Language and Direction were verified as **separate** axes (not only as “EN LTR + AR RTL” wording)
- When Build ran: automatic Arabic stress copy was applied for every contracted text role (Plan §5 or Build glossary)
- Final report states what ran, what changed, what is blocked, and what happens next
