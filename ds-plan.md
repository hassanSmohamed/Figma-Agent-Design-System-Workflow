---
name: ds-plan
description: Creates a comprehensive Component Contract and build plan for one foundation component on one platform in the active Figma design-system file. Use after /ds-review. Read-only. Stops for explicit human approval before any Build mutation.
---

# Design System Plan

## Role

Act as a senior design-system designer and Figma component architect (planner only).

## Objective

Produce a comprehensive Component Contract (`CC-*`) and build plan for **exactly one component on exactly one platform**.

This Skill is read-only for the source component library. It may recommend creating a compact contract documentation frame, but must not mutate the source component set, variants, properties, or foundations.

**Hard gate:** Build must not start until a human explicitly approves the plan.

## When to run

Run after a successful `/ds-review` for the same target.

```text
/ds-plan
Plan {Component Name} for {Web | Tablet | Mobile}.
```

## Platforms

Choose exactly one:

- `Web` — responsive web/portal component
- `Tablet` — tablet app component
- `Mobile` — mobile app component

Naming target for later Build:

```text
{Component Name} / {Web | Tablet | Mobile}
```

Example: `Button / Web`, `Button / Tablet`, `Button / Mobile`.

## Supported foundation components

Button, Button Group, Input, Text Area, Avatar, Toggle, Checkbox, Radio Button, Calendar, Table, Banner, Badge, Link.

## Prerequisites

1. Latest `/ds-review` for this component + platform in the conversation or file notes
2. Review **Plan Handoff Package** consumed: locked foundations, pending `FP-*`, open policy questions, nested dependencies, RTL/i18n and a11y constraints
3. Clear target component or draft source
4. No blocking unanswered foundation architecture failure (or user accepts risk)
5. Review readiness is `Ready` or `Ready with gaps` — if `Blocked`, do not draft a `Ready to Build` contract

If `/ds-review` was skipped, run a mini coverage check first. Prefer asking the user to run `/ds-review` when foundations are uncertain.

When a Review handoff exists, seed contract section 10 (Foundation and token map) from **Locked foundations** and track **Pending approvals** as `Proposed FP-*` until the user approves them.

## Component Contract identity

```text
CC-[COMPONENT]-[PLATFORM]-001
```

Examples: `CC-BUTTON-WEB-001`, `CC-INPUT-MOBILE-001`.

| Metadata | Required value |
|---|---|
| Contract ID | Stable `CC-*` ID |
| Component | Exact name |
| Platform | Web, Tablet, or Mobile |
| Version | Start at `0.1 Draft` |
| Status | `Draft`, `Ready to Build`, `Blocked` |
| Scope | New component, non-breaking update, or migration |
| Source | Prompt, selected draft, screens, or specification |
| Owner | File convention or `Unassigned` |
| Last updated | Current session |

## Required contract sections (comprehensive)

Every plan must include all sections below with concrete decisions. Vague placeholders are not allowed for public API, states, or foundations.

### 1. Purpose and boundaries

- User need
- When to use / when not to use
- Foundation vs composite vs product
- Explicit out of scope

### 2. Architecture and anatomy

- Root component set name for this platform
- Internal parts, optional parts, repeated parts
- Nested dependencies (must be instances of approved components)
- Private vs public parts
- Family hierarchy when applicable (e.g. Table)

### 3. Public property API

| Property name | Type | Values / default | Purpose | Applies to | Required | API risk |
|---|---|---|---|---|---|---|

Rules:

- Properties for consumer decisions only
- No language, direction, or theme properties unless anatomy truly requires them
- No one-property-per-content-example explosion

### 4. Variant and state model

| Axis | Values | Mechanism | Combination restrictions |
|---|---|---|---|

Include interaction states appropriate to the platform (e.g. Hover for Web; touch pressed for Mobile/Tablet).

List invalid combinations explicitly.

### 5. Content contract

Required/optional text and slots; wrapping/truncation; long EN; long AR; mixed-direction values; empty content. Do not invent product copy.

### 6. Sizing and responsive behavior

Hug/Fill/Fixed; min/max; size scale; padding/gaps; overflow.

- **Web:** responsive behavior across Desktop / Tablet / Mobile **viewports** using min-screens
- **Tablet / Mobile:** app layout conventions and touch target sizes for that platform

### 7. Platform contract

Always `Separate platform component` for this package.

Document verified differences vs sibling platforms (anatomy, interaction, target size, hover/keyboard, placement). Do not plan a shared component “for now”.

### 8. Theme, localization, and RTL contract

- Light / Dark via modes
- Exact English Text Style names by role
- Exact Arabic Text Style names by role
- Direction-neutral Auto Layout; Start/End rules
- Icon mirroring rules
- Mixed-direction exceptions
- No English/Arabic duplicate component sets

RTL is part of Build later; the plan must fully define RTL expectations here.

### 9. Accessibility contract

Design-level criteria: focus, target size, contrast, labels, icon-only names, non-color state, errors, loading, reflow, reading order.

List runtime requirements separately (ARIA, keyboard, announcements). Never claim runtime a11y from Figma alone.

### 10. Foundation and token map

| Part or property | Exact semantic variable / Text Style / effect / nested component | Mode behavior | Status |
|---|---|---|---|

Status: `Verified`, `Approved creation`, `Proposed FP-*`, `Blocked`.

Contract cannot become `Ready to Build` while a required foundation is only `Proposed FP-*` unless the user explicitly approves those `FP-*` IDs in the same message.

### 11. Acceptance criteria

Observable pass/fail criteria for structure, API, tokens, themes, responsive/platform behavior, long EN/AR, RTL, a11y design, dependencies, instance safety.

### 12. Assumptions, open questions, decisions

| Type | ID | Statement | Impact | Blocks build? |
|---|---|---|---|---|

Use `AS-*`, `OQ-*`, `DEC-*`.

## Status rules

### `Draft`

Plan is being written. Incomplete sections or open questions remain.

### `Ready to Build`

Only when:

- All 12 sections are complete and specific
- Required foundations are `Verified` or explicitly approved `FP-*`
- No blocking `OQ-*` remains
- Platform is exactly one of Web / Tablet / Mobile
- Human has not yet approved — status may be proposed as Ready, but mutation still waits for approval phrase

### `Blocked`

Missing decisions that change public API, unapproved required foundations, ownership conflicts, or unsafe migration.

## Human approval gate (mandatory)

After delivering the plan, **stop**.

Ask for approval with this exact pattern:

```text
Plan complete for {Component Name} / {Platform}.
Contract: {CC-ID} version {version} — status {Draft | Ready to Build | Blocked}.

Reply with one of:
- Approve CC-{ID} Ready to Build
- Revise plan: {what to change}
- Blocked: {reason}
```

Do not run `/ds-build`, do not mutate components, and do not create foundations until the user replies with explicit approval of the contract ID.

Safe approval phrases:

```text
Approve CC-BUTTON-WEB-001 Ready to Build
```

```text
Approve CC-BUTTON-WEB-001 Ready to Build.
Also approve foundation proposals FP-001 and FP-002.
```

## Variant explosion prevention

Do not plan:

```text
Type × Size × State × Theme × Language × Direction × Icon × …
```

Prefer: variants for type/size/state; text/boolean/instance-swap for content; modes for theme; logical layout for RTL.

## Contract persistence

Recommend a compact `Component contract` frame near the source or docs area with the same `CC-*` ID. If the file uses an external-spec convention, return the full contract in the report only.

## Output format

### Plan Summary

- Component
- Platform
- Contract ID / version / status
- Highest risk
- Blocking open questions count
- Foundation proposals pending

### Full Component Contract

All 12 sections in order.

### Foundation Dependencies

| Dependency | Status | Notes |
|---|---|---|

### Approval Request

Exact approval prompt (see above).

### Recommended Next Action

- `Wait for human approval`
- `Revise plan after answers to OQ-*`
- `Run /ds-review again for missing coverage`
- `After approval → /ds-build`

## Completion gate

Complete only when:

- One component + one platform were planned
- Contract is comprehensive (all required sections)
- Status is honest (`Draft`, `Ready to Build`, or `Blocked`)
- Explicit approval request was issued
- No source component mutation occurred
