---
name: ds-run-workflow
description: Orchestrates the design-system workflow for one target component on one platform. Use to run Review → Plan → human approval → Build → Test → Fix → Test → Document and return one final results report.
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
- Foundation architecture review

Do not run unrelated components in one invocation.

## Required inputs

Before starting, verify:

1. Live Figma design-system file (not screenshots alone)
2. Target component is identifiable
3. Platform is identifiable: `Web`, `Tablet`, or `Mobile`
4. Requested workflow mode is clear

If any are missing, stop and ask for the smallest missing input.

## Workflow modes

### 1. Full component workflow (default)

Sequence:

1. `/ds-review` — foundations coverage for this component + platform
2. `/ds-plan` — comprehensive `CC-*` contract
3. **Hard stop for human approval** (`Approve CC-… Ready to Build`)
4. `/ds-build` — includes EN LTR + AR RTL in the same build
5. `/ds-test`
6. `/ds-fix` when Critical or Major findings exist
7. `/ds-test` recheck after fixes
8. `/ds-document` when requested or when the component is approved

There is **no separate RTL phase**. RTL is part of Build.

### 2. Review-first workflow

1. `/ds-review` (component coverage; evidence + Plan Handoff Package required)
2. Foundation proposal pass when needed
3. Return readiness (`Ready` / `Ready with gaps` / `Blocked`) and recommend `/ds-plan` only when not Blocked

### 3. Plan-only workflow

1. Confirm `/ds-review` exists or run it
2. `/ds-plan`
3. Stop for approval

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

### 6. Foundation architecture workflow

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
- `/ds-foundation-architecture-review`

Do not bypass a stricter underlying rule.

Hard stop when:

- Required production layers remain unbound
- Nested reuse gate fails
- Variables/Styles compliance gate fails
- Unintended overlap, clipping, or unstable Auto Layout remains
- Plan is not human-approved before Build
- Required `FP-*` foundations are unapproved

## Step control rules

1. Run one phase at a time and name the phase.
2. State read-only vs mutating at the start of each phase.
3. Stop immediately for blocking questions, missing contract decisions, missing foundation approval, or migration approval.
4. Do not continue past a blocked phase.
5. After each mutating phase, summarize what changed.
6. If Test finds no Critical/Major issues, skip Fix and say why.
7. Do not Document as production-ready while Test fails, unless the user asks for draft docs.

## Planning and approval rules

- `/ds-plan` always ends with an approval request
- Build starts only after explicit `Approve CC-… Ready to Build`
- Respect `FP-*` approval gates
- Respect migration-approval gates
- One component + one platform per full workflow

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
- Recommended next action

### Phase Results

| Phase | Ran | Result | Key output |
|---|---|---|---|

Possible phases: Review, Plan, Approval, Build, Test, Fix, Test recheck, Document, Foundation architecture review.

### Contracts and Approvals

| Item type | ID | Status | Notes |
|---|---|---|---|

Include `CC-*`, `FP-*`, and migration approvals.

### Main Findings or Changes

| Area | Summary | Severity or impact | Action taken |
|---|---|---|---|

### Final Recommendation

Return exactly one best next step, such as:

- `Continue to /ds-plan`
- `Approve CC-* Ready to Build`
- `Continue to /ds-build`
- `Continue to /ds-test`
- `Continue to /ds-fix`
- `Continue to /ds-document`
- `Approve foundation proposal FP-*`
- `Approve migration proposal`
- `Resolve contract blocker`
- `Workflow complete`

## Completion gate

Complete only when:

- Correct mode was chosen
- Each phase respected read-only vs mutating boundaries
- Approval gates were respected
- No blocked phase was silently skipped
- Final report states what ran, what changed, what is blocked, and what happens next
