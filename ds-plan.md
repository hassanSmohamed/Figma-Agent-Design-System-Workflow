---
name: ds-plan
description: Creates a comprehensive Component Contract and Plan Package for one foundation component on one platform. Use after /ds-review. Read-only. Report opens with a Build Snapshot one-table plan (what to build + controls + missing Variable/Style solves), then full contract + extras A–E. Tables C and D are the executable handoff /ds-build consumes after human approval. Stops for explicit approval before any Build mutation.
---

# Design System Plan

## Role

Act as a senior design-system designer and Figma component architect (planner only).

## Objective

Produce a comprehensive Component Contract (`CC-*`) and **Plan Package** for **exactly one component on exactly one platform**.

The Plan Package is what `/ds-build` intakes after approval:

| Extra | Build role after approval |
|---|---|
| **Build Snapshot** | Human-facing one-table rollup (what + controls + solves). Not executable alone — must match A–E |
| **A. ASCII wireframe** | Anatomy blueprint |
| **B. Controls table** | Public API blueprint |
| **C. Missing Variables/Styles — solve table** | **Executable** foundation creates / aliases / binds |
| **D. Dependent components — configuration matrix** | **Executable** nested instance configs |
| **E. Blocking remedies** | Gate only — must be clear before Build mutates |

This Skill is read-only for the source component library. It may recommend creating a compact contract documentation frame, but must not mutate the source component set, variants, properties, or foundations.

**Hard gate:** Build must not start until a human explicitly approves the plan (and any Table C creates / `FP-*` that block Ready to Build).

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

**Contrast confirmation (mandatory in the contract):**

| Method | Role in Plan |
|---|---|
| **WCAG 2.2 AA** | Compliance baseline — name critical text/UI pairs that must meet 4.5:1 / 3:1 |
| **APCA (Lc)** | **Additional confirmation** — name the same pairs with expected Lc targets (Bronze Simple Mode guidance); especially call out Dark mode and thin/small type |

Do not treat APCA as a replacement for WCAG 2.2 AA in this package. Record both in acceptance criteria (§11) for pairs Build must verify.

**Component-set example → shade / tint follow-up:**

If the plan (or user) references an example from this `{Component} / {Platform}` set or a sibling set:

1. Prefer that example’s semantic color roles and shade/tint steps that already pass **WCAG + APCA**
2. If a pair fails either method → do not lock it as Verified; propose a structure-preserving solve (alias/bind a passing step on the same ramp, or Table C / `FP-*`)
3. If emphasis must change → move along the **approved** shade/tint ramp to the nearest step that still passes both methods — do not invent off-ramp hex
4. Document the chosen step + both measurements in §10 / acceptance criteria

List runtime requirements separately (ARIA, keyboard, announcements). Never claim runtime a11y from Figma alone.

### 10. Foundation and token map

| Part or property | Exact semantic variable / Text Style / effect / nested component | Mode behavior | Status |
|---|---|---|---|

Status: `Verified`, `Approved creation`, `Proposed FP-*`, `Blocked`.

Contract cannot become `Ready to Build` while a required foundation is only `Proposed FP-*` unless the user explicitly approves those `FP-*` IDs in the same message.

### 11. Acceptance criteria

Observable pass/fail criteria for structure, API, tokens, themes, responsive/platform behavior, long EN/AR, RTL, a11y design (**WCAG 2.2 AA + APCA** on critical contrast pairs; shade/tint follow-up when examples are cited), dependencies, instance safety.

### 12. Assumptions, open questions, decisions

| Type | ID | Statement | Impact | Blocks build? |
|---|---|---|---|---|

Use `AS-*`, `OQ-*`, `DEC-*`.

## Mandatory plan report extras

Every plan report must include the following **output-only** sections. They visualize and operationalize the contract; they do not replace sections 1–12.

**Order in the report:** Plan Summary → **Build Snapshot** → Full Component Contract (1–12) → A → B → C → D → E → Foundation Dependencies → Build Handoff Package → Approval Request → Recommended Next Action.

### Build Snapshot (one-table plan)

Required. Place **immediately after Plan Summary**, before the Full Component Contract.

Purpose: one scannable table that answers *what will Build create, with which controls/configurations, and what missing Variables/Styles still need a solve?*

This is a **rollup only**. Sources of truth remain:

| Snapshot column | Authoritative source |
|---|---|
| What to build / Control / Kind / Values | §§2–4 + Table B |
| Depends on | Table D |
| Foundation status | §10 |
| Missing / Solve / Blocks Ready? | Table C (+ Table E when blocked) |

**Required columns:**

| # | What to build | Control / config | Kind | Values / default | Depends on | Foundation status | Missing Variable/Style? | Structure-preserving solve | Blocks Ready? |
|---|---|---|---|---|---|---|---|---|---|

Rules:

- One row per consumer control, or per part×control that Build must implement
- Cover **all** public controls from Table B (do not omit axes)
- Include theme / RTL / language only as non-property rows when relevant (`Kind` = `mode` or `layout / style`) — never as variant axes
- If nothing is missing for a row: `Missing Variable/Style?` = `No`, Solve = `—`, Blocks Ready? = `No`
- If something is missing: cite exact Gap ID (`G-001`) and/or `FP-*`; Solve must match Table C literally
- Respect variant explosion prevention — do not explode Theme × Language × Direction
- Do **not** remove or skip Tables A–E because Snapshot exists

Illustrative row shape (replace with the real target):

| # | What to build | Control / config | Kind | Values / default | Depends on | Foundation status | Missing Variable/Style? | Structure-preserving solve | Blocks Ready? |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `{Component} / {Platform}` root | Hierarchy | variant axis | … / default | — | Verified | No | — | No |
| 2 | Focus ring | State=Focus | variant | Focus | — | Proposed FP-001 | Yes — `G-001` `color/focus/ring` | Create in existing semantic collection; alias per mode | Yes until FP-001 approved |

### A. ASCII wireframe

Show the component shape as a compact ASCII layout so a human can imagine anatomy before Build.

Rules:

- One primary wireframe for the default / most common configuration
- Optional second wireframe only when anatomy changes meaningfully (e.g. icon-only vs label+icon)
- Label every visible part with the same names used in section 2
- Mark optional parts in parentheses, e.g. `(leading icon)`
- Do not invent product copy; use role labels (`Label`, `Helper`, `Error`)

Example shape (illustrative only — replace with the real target):

```text
+------------------------------------------+
| [ (leading icon) ]  Label  [ (trailing) ]|
+------------------------------------------+
```

### B. Controls and configuration options

List **all** consumer-facing controls in one table (variants, properties, instance swaps, boolean shows). Do not omit axes that exist in sections 3–4.

| Control | Kind | Values / default | Where it lives | Consumer effect | Notes |
|---|---|---|---|---|---|

`Kind`: `variant axis` | `text prop` | `boolean prop` | `instance swap` | `other`.

If a control is internal-only / not published, put it in Notes as `private` and do not treat it as consumer API.

### C. Missing variables / styles — solve table

**Build handoff:** After approval, `/ds-build` treats Table C as the **only** authorized list of Variables/Styles creates, aliases, and role mappings for this component (together with section 10 rows already `Verified` / `Approved creation`). Build must execute approved rows literally — no reinterpretation, no silent extras.

If section 10 (or Review handoff) has any gap with status `Proposed FP-*` or `Blocked`, emit this table. If nothing is missing, write `None — all required Variables and Styles are Verified or Approved.`

| Gap ID | Missing item (exact proposed name) | Type | Needed by (part / state) | Structure-preserving solve | Approval needed | Blocks Ready to Build? |
|---|---|---|---|---|---|---|

`Type`: semantic variable, Text Style, Effect Style, Paint/Color Style, Grid/Layout Style.

**Solve rules (mandatory):**

- Prefer create/alias/bind under the **existing** Variable collections and Style naming conventions
- Prefer reuse of an existing Verified token/style with a documented role mapping when a new name is unnecessary
- Do **not** propose renaming collections, collapsing Light/Dark into variants, splitting EN/AR into duplicate component sets, or otherwise changing the base architecture
- Each row must be actionable enough that `/ds-build` (after approval) can execute it without reinterpretation
- Use stable Gap IDs (`G-001`, …) and link `FP-*` IDs in **Approval needed** when a foundation proposal already exists
- Exact proposed names in this table become the names Build must create — do not leave “TBD” names on rows that block Ready to Build

**What Build will do with each row (write solves accordingly):**

| Column | Build action after approval |
|---|---|
| Gap ID | Trace in Build’s Table C Execution Log |
| Missing item | Create/bind under this exact name |
| Type | Create/bind only that foundation type |
| Needed by | Apply only to those parts/states |
| Structure-preserving solve | Execute literally |
| Approval needed | Must be satisfied before create |
| Blocks Ready to Build? | If `Yes` and unapproved → Build stops |

### D. Dependent components — configuration matrix

**Build handoff:** After approval, `/ds-build` treats Table D as the **only** authorized nested-dependency configuration list. Required rows must be nested instances (never flattened vectors). Parent controls listed here are what Build must wire.

If the target nests or requires other components, list each dependency with **every configuration the parent may need**. If none, write `None`.

| Nested component | Required? | Configurations parent may need | Parent control that drives it | Status | Notes |
|---|---|---|---|---|---|

Rules:

- Use approved instance targets only (same platform family when applicable)
- Enumerate real config combinations the parent must support (e.g. Icon size/color roles, Avatar size, Link state) — not an open-ended product matrix
- Respect variant explosion prevention: list needed configs; do not explode Theme × Language × Direction on nested sets
- Flattened vectors instead of instances are not allowed as a “solve”
- Status must be honest: `Verified`, `Approved`, `Proposed`, or `Blocked` — Build will not mutate while Required rows are `Proposed` / `Blocked` without approval
- Name the exact parent control from section 3 / Table B that drives each nested config

**What Build will do with each row (write configs accordingly):**

| Column | Build action after approval |
|---|---|
| Nested component | Use this exact instance target |
| Required? | If `Yes` and missing → Build stops or proposes — never flattens |
| Configurations parent may need | Support these configs only |
| Parent control that drives it | Wire that property/variant to the nested instance |
| Status | Must be buildable (`Verified` / `Approved`) before Ready for Test |
| Notes | Honor private vs published constraints |

### E. Blocking issues — structure-preserving remedies

**Build handoff:** Table E is a **gate only**. `/ds-build` must not mutate while uncleared Blocking rows remain. Remedies here are for the human / Plan revision — not a license for Build to redesign architecture.

If status is `Blocked`, or any finding/OQ/`FP-*` blocks Ready to Build, emit this table. If none, write `None — not blocked.`

| Block ID | Problem | Impact | Suggested solve (no base-structure change) | Owner action | Unblocks when |
|---|---|---|---|---|---|

**Hard rule:** Every Blocking row **must** include a concrete suggested solve that keeps the existing base structure intact. Allowed solves include:

- Approve an existing `FP-*` and create the missing token/style in the current collections (then Build executes via Table C)
- Alias a missing semantic to an existing primitive already in the file (record as a Table C solve)
- Bind to an existing Verified semantic/style with an explicit role mapping (record as a Table C solve)
- Narrow scope / defer a non-essential state to a later non-breaking update
- Answer an `OQ-*` with a `DEC-*` that fits current naming, mode, and platform conventions
- Re-run `/ds-review` for missing evidence (when the block is Unknown coverage, not architecture failure)

**Disallowed as Plan “solves”:**

- Redesigning Variable/Style architecture
- Merging or splitting platform components against package rules
- Theme / Language / Direction as new variant axes
- Duplicate EN/AR component sets
- Detaching or flattening nested components to bypass missing deps

If the only real fix requires architecture change, say so explicitly, keep status `Blocked`, and recommend `/ds-foundation-architecture-review` — do not silently rewrite the base structure in the plan.

## Status rules

### `Draft`

Plan is being written. Incomplete sections or open questions remain.

### `Ready to Build`

Only when:

- All 12 sections are complete and specific
- Build Snapshot is present and consistent with Tables B–E / §10
- Report extras A–B are present; C–E are present or explicitly `None`
- Table C rows are build-executable (exact names + structure-preserving solves) or the table is `None`
- Table D rows name real instance targets + parent controls, or the table is `None`
- Table E is `None — not blocked.` (or every Blocking row is already cleared by `DEC-*` / approval)
- Required foundations are `Verified` or explicitly approved `FP-*`
- No blocking `OQ-*` remains
- Platform is exactly one of Web / Tablet / Mobile
- Human has not yet approved — status may be proposed as Ready, but mutation still waits for approval phrase

### `Blocked`

Missing decisions that change public API, unapproved required foundations, ownership conflicts, or unsafe migration.

When `Blocked`, section E is mandatory and must propose structure-preserving remedies (or an explicit architecture-review handoff when that is the only honest path). Do not claim that `/ds-build` can proceed.

## Human approval gate (mandatory)

After delivering the plan, **stop**.

Ask for approval with this exact pattern:

```text
Plan complete for {Component Name} / {Platform}.
Contract: {CC-ID} version {version} — status {Draft | Ready to Build | Blocked}.
Plan Package: Snapshot delivered; A–B delivered; C={n gaps or None}; D={n deps or None}; E={clear or blocked}.

Reply with one of:
- Approve CC-{ID} Ready to Build
- Approve CC-{ID} Ready to Build. Also approve foundation proposals FP-… / Table C Gap IDs …
- Revise plan: {what to change}
- Blocked: {reason}
```

Do not run `/ds-build`, do not mutate components, and do not create foundations until the user replies with explicit approval of the contract ID (and any Table C creates that block Ready to Build).

Safe approval phrases:

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

**Approval → Build mapping (state this when requesting approval):**

| User approves | `/ds-build` may |
|---|---|
| `CC-* Ready to Build` only | Bind Verified / already-approved map rows; execute bind/reuse-only Table C rows; nest Table D Verified deps |
| `CC-*` + `FP-*` / Gap IDs | Also create those Table C foundations, then bind and build |
| Contract only, while Table C still has unapproved `Blocks Ready to Build? = Yes` | **Not enough** — Build must stop |

After approval, the correct next skill is `/ds-build`, which **must consume Tables C–D** (or their explicit `None`) before mutating.

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
- Foundation proposals pending (`FP-*` / Table C Gap IDs)
- Nested dependencies count (Table D)
- Missing Variables/Styles count (Table C)
- Table E clear? `Yes` / `No`

### Build Snapshot (one-table plan)

Required rollup table (see **Build Snapshot** rules above). Human-facing view of what to build + controls + missing Variable/Style solves. Must stay consistent with §10 and Tables B–E.

### Full Component Contract

All 12 sections in order.

### ASCII Wireframe

Section A (required). Build anatomy blueprint.

### Controls and Configuration Options

Section B table (required). Build public API blueprint.

### Missing Variables / Styles — Solve Table

Section C table, or `None`. **Executable Build handoff** for Variables/Styles.

### Dependent Components — Configuration Matrix

Section D table, or `None`. **Executable Build handoff** for nested instances.

### Blocking Issues — Structure-Preserving Remedies

Section E table, or `None`. Build mutation gate.

### Foundation Dependencies

| Dependency | Status | Notes |
|---|---|---|

(Keep this summary table in addition to section D; D is the full nested configuration matrix.)

### Build Handoff Package

Mandatory closing block so `/ds-build` can start without reinterpretation:

| Handoff item | Content |
|---|---|
| Contract ID / version / proposed status | e.g. `CC-BUTTON-WEB-001` / `1.0` / `Ready to Build` |
| Extras delivered | Build Snapshot / A / B / C / D / E (each present or explicit `None`) |
| Snapshot vs detail | Snapshot row count; confirm Snapshot Gap IDs ⊆ Table C |
| Table C for Build | Gap IDs + `FP-*` to execute after approval, or `None` |
| Table D for Build | Nested targets + required configs, or `None` |
| Table E gate | `Clear` or list Block IDs still open |
| Approvals still needed before Build | `CC-*` and any `FP-*` / Gap IDs |
| After approval run | `/ds-build` for `{Component} / {Platform}` from this package |

### Approval Request

Exact approval prompt (see above). Include Table C Gap / `FP-*` lines when creates are required.

### Recommended Next Action

- `Wait for human approval`
- `Revise plan after answers to OQ-*`
- `Approve FP-* / Table C Gap IDs, then /ds-build` (when contract is otherwise Ready)
- `Approve FP-* / apply structure-preserving solves, then re-plan or continue`
- `Run /ds-review again for missing coverage`
- `Run /ds-foundation-architecture-review` (only when base structure itself is unsafe)
- `After approval → /ds-build` (Build must consume Tables C–D)

## Completion gate

Complete only when:

- One component + one platform were planned
- Contract is comprehensive (all required sections)
- Build Snapshot delivered and consistent with Tables B–E / §10
- Report extras A–B delivered; C–E delivered or explicitly `None`
- Table C is build-executable (or `None`); Table D names real nested configs (or `None`)
- Build Handoff Package is filled
- Every Blocking item includes a structure-preserving suggested solve (or an explicit architecture-review handoff)
- Status is honest (`Draft`, `Ready to Build`, or `Blocked`)
- Explicit approval request was issued (including Table C / `FP-*` when needed)
- No source component mutation occurred
