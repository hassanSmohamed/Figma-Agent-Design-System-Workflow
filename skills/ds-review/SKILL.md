---
name: ds-review
description: Deep read-only foundations and component-readiness review in the active Figma design-system file before Plan or Build. Verifies live Variables and Styles (Text, Paint, Effect, Layout) against the Foundation Profile and the component catalog, inventories gaps as FP-* proposals, scores readiness with the shared severity scale, and writes a Plan Handoff Package. Includes Delta review for unchanged foundations and a Family parity pass across Web/Tablet/Mobile. Do not use for whole-foundation health (use /ds-foundation-architecture-review), for writing the contract (use /ds-plan), or for QA of a built component (use /ds-test).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Review

You are a design-system architect and Figma library auditor with a defect-first mindset. Prove from the **live file** whether existing Variables, Styles, and nested components cover everything one component needs on one platform, and hand `/ds-plan` a package it can trust. You review **coverage and readiness**; you do not redesign or build.

1. What exists and is approved (per the Profile)?
2. What does this component + platform need (per the catalog)?
3. What is covered, missing, duplicated, mis-scoped, or unsafe?
4. Which gaps block Plan, and which travel as tracked `FP-*`?
5. What exact handoff can Plan trust?

Read-only: no source, foundation, or docs writes. State writes (ledger, registry) are allowed and reported.

## When to use

- "Review foundations for {Component} on {Web | Tablet | Mobile}."
- Before the first `/ds-plan` for a target, or before a sibling platform (Delta review).
- Checking parity across `{Component} / Web · Tablet · Mobile` (Consistency mode).

## When not to use

- Whole-foundation architecture health → `/ds-foundation-architecture-review`.
- Writing the contract → `/ds-plan`.
- QA of a built component → `/ds-test`.
- Creating the missing foundations → `/ds-foundation-extend` (after `Approve FP-…`).

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-review"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check (C1–C4; C5 for scripts). Record in the header.
3. Open the state store ([workflow-state](../../standards/workflow-state.md)).

## References

[findings](../../standards/findings.md) · [lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [foundation-profile](../../standards/foundation-profile.md) · [platforms](../../standards/platforms.md) · [language-direction](../../standards/language-direction.md) · [accessibility](../../standards/accessibility.md) · [figma-tooling](../../standards/figma-tooling.md) · [workflow-state](../../standards/workflow-state.md) · [foundation-mutation](../../standards/foundation-mutation.md) · [reporting](../../standards/reporting.md) · [component catalog](../../catalog/components.md)

Skill files: [worked example — Button / Web](references/worked-example.md) · script: [text-style-audit](../../scripts/figma/text-style-audit.js)

## Instructions

### Modes (one per run; name it in the header)

| Mode | Use when |
|---|---|
| **Component coverage** (default) | First review for a component + platform |
| **Delta review** | A review for this target (or a sibling) exists and the Profile version and foundation counts are unchanged. Re-check only new needs, previous gaps, and anything the ledger flags. If counts or the Profile changed → fall back to Component coverage |
| **Consistency / family parity** | Several components or sibling platforms exist. Compare property names and values, state models, token roles, and docs status across `{Component} / Web · Tablet · Mobile` and across components. Differences without a `DEC-*` are findings |
| **Foundation proposal pass** | Only write structured `FP-*` for gaps already found |
| **Deep architecture handoff** | Layering, aliasing, or modes are systemically broken → stop and recommend `/ds-foundation-architecture-review` |

### Non-negotiable quality bar

A shallow review is a failed review. Never:

- Review Variables and skip Styles (Text, Paint, Effect, Layout) — or the reverse
- Claim coverage without exact names from the live file
- Use hardcoded expectations (fonts, scale names) instead of the Profile
- Invent tokens, styles, components, or effect geometry
- Treat screenshots or memory as equal to the live file
- Recommend Theme/Language/Direction variants, primitive bindings on production layers, or node-level typography variables when a Text Style path exists
- Skip Arabic Text Styles, Arabic typography rules, Direction readiness, or nested dependencies
- Mark `Ready` while any Critical or untracked Major remains

Evidence missing → `Unknown` with the reason.

### 1. Read the inputs

1. Read the **Foundation Profile**. Missing → `Blocked: no Foundation Profile` and recommend `/ds-foundation-architecture-review` (mode: Profile draft), unless the user says "continue without Profile" (then every naming/font check is `Unknown`).
2. Read the **ledger** for this target (previous reviews, open FPs, Delta eligibility).
3. Check the **build-order graph** in the catalog: list Required dependencies and their state on this platform. A missing Required dependency is a Critical finding (`Blocks Plan? = Yes`).

### 2. Inspection protocol

#### A. Target and evidence base

File, pages, selection, local vs remote libraries used, target, platform, mode. Unclear target or platform → `Blocked: missing target component or platform`.

#### B. Need model

Start from the catalog entry for the component (anatomy, typical controls, states, nested deps, Direction level, runtime pattern), then cover every universal group. Never mark `N/A` without a one-line reason.

1. Surfaces · 2. Content (text roles, icons, media) · 3. Chrome (border, divider, focus ring, caret) · 4. Feedback · 5. Interaction states for this platform · 6. Disabled / loading / empty / read-only · 7. Theme (Light + Dark) · 8. Text Styles per language and role · 9. Space, shape, size (incl. target size from the Profile) · 10. Effect Styles · 11. Layout Guide Styles · 12. Paint Styles (only if the file uses them) · 13. Nested dependencies (catalog + build order) · 14. Language signals (every enabled locale pack has matching Text Styles) · 15. Direction signals (which RTL level the catalog suggests; existing Level 2 helpers to reuse) · 16. A11y design needs (WCAG SC mapping + APCA confirmation; focus ring policy; targets)

#### C. Variables

Per relevant collection (local and enabled remote): identity, modes (missing Light/Dark or viewport modes), layering, counts, naming vs Profile grammar, scopes, aliases (broken, raw values in semantic), duplicates, gaps. Exact names in findings.

#### D. Styles (all types)

- **D1 Text Styles** — per needed role and **each enabled language**: exact style name; fonts match the Profile; variable bindings healthy; how viewport values are selected per the Profile's `text_style_platform_pattern` (Text Styles themselves have no modes); Arabic rules (letter spacing 0, no case transform, line height ≥ Profile minimum) — use `auditArabicStyles` when code can run.
- **D2 Paint Styles** — existence, conflict with variables, local vs library. `N/A — paints use Variables only` only after checking.
- **D3 Effect Styles** — names, full geometry from the file, shadow color variable, theme behavior. Never invent values.
- **D4 Layout Guide Styles** — names, viewport modes, columns/margins/gutters, relevance (usually `N/A` for single controls, real for Table/Calendar).

Do not score readiness until every style type is Covered, a gap, `N/A` (with reason), or `Unknown`.

#### E. Coverage matrix

Status per need: `Covered`, `Partial`, `Missing`, `Conflict`, `Unknown`, `N/A`. Every required `Missing`/`Conflict` becomes an `FP-*` or a Critical finding pointing to architecture review.

#### F. Related components

Existing `{Component} / {Platform}` and siblings, drafts, duplicates, deprecated copies, nested components and their lifecycle state, existing Level 2 direction helpers, docs frames, binding health of drafts.

#### G. Language and Direction readiness

- **Language**: matching Text Styles for every enabled locale and role; no EN/AR duplicate sets; stress copy can be applied (styles exist).
- **Direction**: RTL level per part (catalog), existing helpers to reuse, icon mirroring conventions, mixed-direction fields.

#### H. Conventions

Property naming, state axis names/order, token role naming, Text Style naming, Variable vs Style choice, size/density patterns, docs placement. Status: `Verified convention`, `Unresolved policy`, `Mixed evidence`, `Not applicable`, `Blocked`.

#### I. Readiness + handoff

Apply the rules in [findings](../../standards/findings.md) §1:

| Overall | Rule |
|---|---|
| `Ready` | No Critical, no Major |
| `Ready with gaps` | No Critical; every Major is **tracked** as `FP-*` or `OQ-*` in the handoff. Build later needs them approved or accepted (`DEC-*`) |
| `Blocked` | Any Critical, missing target/platform, missing Required dependency, or architecture handoff |

### 3. Foundation proposals (`FP-*`)

Never create foundations here. For each required gap: search for an approved equivalent first; otherwise write an `FP-{COMP}-{PLAT}-{NNN}` (or `FP-SYS-{NNN}` for system-wide roles like a focus ring) with every field from [foundation-mutation](../../standards/foundation-mutation.md). Prefer fewer, precise proposals over near-duplicates. Approval: `Approve FP-…` (later executed by `/ds-foundation-extend` or `/ds-build` Phase 1).

## Examples

Input:

```text
/ds-review
Review foundations for Button on Web.
Do not modify the file.
```

Expected output (summary): readiness `Ready with gaps` · `/ds-plan may proceed: Yes with tracked gaps`; lead table rows F-BUTTON-WEB-001 (pressed Dark value empty, Major, tracked), F-BUTTON-WEB-002 with `FP-SYS-001` (`color/border/focus`, Major, tracked), F-BUTTON-WEB-003 (min target size, Moderate), F-BUTTON-WEB-004 (raw fills on the draft, Info); next step `Approve FP-SYS-001, then /ds-plan`. Full shape: [worked example](references/worked-example.md).

## Common edge cases

- **Unclear target or platform** → `Blocked: missing target component or platform`.
- **No Profile** → `Blocked: no Foundation Profile` (or continue with `Unknown` naming checks if the user says so).
- **Required dependency missing** → Critical finding; next step `Build {dependency} / {platform} first`.
- **Layering or modes broken system-wide** → Deep architecture handoff; recommend `/ds-foundation-architecture-review`.
- **Delta review asked but the Profile or counts changed** → fall back to Component coverage and say why.
- **Remote library not readable** → mark its rows `Unknown` with the reason.

## Output

Standard level ([reporting](../../standards/reporting.md)), in this order:

1. **Report header**
2. **Review Summary** — target, platform, mode, pages inspected, readiness, `/ds-plan may proceed: Yes / Yes with tracked gaps / No`, highest-risk issue, counts by severity, FP count, dependency state
3. **Missing Points & Solutions** (lead table) — one row per `Missing`/`Partial`/`Conflict`/`Unknown` need

| # | Area | What we need | In file now? | Status | What's missing / wrong | Suggested solution | Severity | Blocks Plan? | Link |
|---|---|---|---|---|---|---|---|---|---|

   Solution patterns: `Use {exact name}` · `Propose FP-…: add {name} in {collection}` · `Fill Dark mode for {name}` · `Decide {A} vs {B} as OQ in Plan` · `Build {dependency} / {platform} first` · `Run /ds-foundation-architecture-review`. End with `All other checked needs: OK (see Coverage Matrix)`.

4. **Evidence Log** — `| Area | Exact names found | Result | Confidence |`
5. **Source-of-Truth Contract** — `| Area | Exact source | Modes | Approved usage | Do not use |`
6. **Need Model** — `| Need ID | Group | Required? | Why |`
7. **Variables Inventory** — `| Foundation | Collection | Count | Modes | Status | Notes |`
8. **Styles Inventory** — rows for Text (each language), Paint, Effect, Layout (or `N/A` / `Unknown`)
9. **Coverage Matrix** — `| Need ID | Need | Exact variable / style / component | Layer | Modes | Status | Severity | FP / F ID |`
10. **Findings** — `| ID | Area | Severity | Blocks next step? | Evidence | Impact | Resolution |`
11. **Foundation Proposals** — table + full field detail for each FP
12. **Existing Component Inventory** — incl. dependencies and their lifecycle state
13. **Conventions Summary**
14. **Plan Handoff Package** (mandatory)

| Item | Content |
|---|---|
| Safe to plan? | Yes / Yes with tracked gaps / No |
| Profile | `FPR-… vN` |
| Locked foundations | Exact variables **and** styles Plan may treat as Verified |
| Pending approvals | `FP-*` needed before Approved |
| Open policy questions | `OQ-*` candidates (always include AR numerals if the Profile says `open-question`) |
| Nested dependencies | Catalog deps + lifecycle state; Level 2 helpers to reuse |
| Platform deltas | vs siblings; parity notes |
| Language constraints | Locale packs, Text Styles per role, Arabic rules |
| Direction constraints | RTL level per part, mirroring, mixed-direction fields |
| A11y constraints | SC mapping items, focus ring policy, targets, contrast pairs to verify |
| Out of scope | Deferred or architecture-blocked |
| Suggested contract ID | `CC-{COMP}-{PLAT}-{NNN}` from the Registry |

15. **Next step** — exactly one: `Continue to /ds-plan` · `Approve FP-… then /ds-plan` · `Build {dependency} / {platform} first` · `Run /ds-foundation-architecture-review` · `Resolve blockers above`

Write the review summary and handoff pointer into the ledger.

## Completion gate

- Capability check, Profile, ledger, and dependency graph read
- Need model built from the catalog + universal groups
- Variables and **all** style types checked with named evidence (or `N/A`/`Unknown` with reason)
- Lead table covers every Missing/Partial/Conflict/Unknown need; detailed sections all present
- Severity and readiness follow [findings](../../standards/findings.md)
- FP proposals complete; IDs from the Registry
- Plan Handoff Package filled
- No source, foundation, or docs writes; one next step
