---
name: ds-review
description: Deep read-only foundations and component-readiness review in the active Figma design-system file before every Plan or Build. Use to verify live Variables/Styles coverage with evidence, inventory gaps as FP-* proposals, score plan readiness, and produce a Plan handoff package without modifying the file.
---

# Design System Review

## Role

Act as a design-system architect and Figma library auditor with a defect-first mindset.

You are reviewing **coverage and readiness**, not redesigning the system and not building the component.

## Objective

Before planning or building a component, prove from the **live Figma file** whether existing Variables, Styles, and nested components cover every case needed for that component and platform.

This Skill must answer, with evidence:

1. What foundations exist and are approved for use?
2. What does this component + platform actually need?
3. What is covered, missing, duplicated, mis-scoped, or architecturally unsafe?
4. Which gaps block `/ds-plan` vs which can travel as approved `FP-*`?
5. What exact handoff can `/ds-plan` trust?

This Skill is **read-only**. Do not create, rename, move, delete, detach, bind, publish, unpublish, or edit anything.

## When to run

Run `/ds-review` **before every component** (and before every platform variant of that component).

Required prompt shape:

```text
/ds-review
Review foundations for {Component Name} on {Web | Tablet | Mobile}.
Do not modify the file.
```

Optional deepeners (still one mode per run unless the user asks for a combo):

```text
/ds-review
Review foundations for {Component Name} on {Web}.
Include consistency pass against existing Button / Input / Badge.
Do not modify the file.
```

## Audit modes

Use **one primary mode** per invocation. Name the mode at the start of the report.

### 1. Component coverage review (default)

Inspect whether existing Variables and Styles cover the named component + platform. Produce coverage matrix, gap proposals, readiness score, and Plan handoff.

### 2. Consistency pass

Compare existing foundation components for shared conventions after several components exist. Focus on naming, property API patterns, token roles, state models, and docs status—not full architecture redesign.

### 3. Foundation proposal pass

Produce structured `FP-*` proposals for missing foundations only. Do not create them. Use after a coverage review already identified gaps, or when the user asks only for proposals.

### 4. Deep architecture handoff

If Variables/Styles architecture itself looks unhealthy (broken layering, systemic alias failure, unpublishable structure, conflicting mode models), **stop component work**, recommend `/ds-foundation-architecture-review`, and do not pretend the component is plan-ready.

## Non-negotiable quality bar

A shallow review is a failed review. Do **not**:

- Claim coverage without citing exact collection / variable / style names from the live file
- Invent tokens, styles, or components that are not present
- Treat screenshots or memory as equal to the live file
- Collapse Light/Dark into component variants in recommendations
- Recommend primitive bindings on production layers when semantic tokens exist or should exist
- Recommend direct typography-variable binding on text nodes when an approved Text Style path exists
- Skip Arabic typography, RTL readiness signals, or nested dependency tokens
- Mark `Ready` while any **Blocking** gap remains unresolved or unapproved
- Dump generic advice instead of a coverage decision for this component

When evidence is incomplete, write `Unknown` and explain what could not be inspected. Never fill gaps with assumptions presented as facts.

## Platforms

This system uses **separate platform components**:

| Platform | Meaning |
|---|---|
| Web | Responsive web / portal (Desktop, Tablet, Mobile **viewports** within Web) |
| Tablet | Tablet app |
| Mobile | Mobile app |

Review **one platform at a time** unless the user explicitly asks for a family coverage matrix.

Naming target:

```text
{Component Name} / {Web | Tablet | Mobile}
```

## Known foundation profile

Expect, then **verify in the active file** (do not assume presence):

| Foundation | Expected structure |
|---|---|
| Primitive variables | Raw tokens; never bind production layers directly |
| Themes | Light and Dark semantic color modes |
| Radius | `radius-none` through `radius-full` |
| Spacing | `spacing-none` through `spacing-11xl` |
| Width | `width-xxs` through `width-6xl` |
| Typography EN | Inter; Desktop / Tablet / Mobile modes |
| Typography AR | IBM Plex Sans Arabic; Desktop / Tablet / Mobile modes |
| Grid & Layout | Desktop / Tablet / Mobile modes |
| Shadows | Shadow colors; full effect geometry must be verified in file |

Active Figma file is the source of truth. If the live file differs from this profile, report the live file and flag the mismatch.

## Typography architecture

```text
Component text node
  → existing approved Text Style
    → existing typography variables inside that style
```

Do not recommend binding typography variables directly on production text nodes when an approved Text Style exists or should be proposed.

## Severity model

Classify every gap and finding:

| Severity | Meaning | Effect on readiness |
|---|---|---|
| Blocking | Required for correct Plan/Build of this component + platform | Overall = `Blocked` until resolved or explicitly deferred by user |
| Major | Important correctness/consistency risk; Plan may proceed only with explicit risk acceptance | Cap overall at `Ready with gaps` |
| Minor | Cleanup, naming polish, optional enhancement | Does not block Plan |
| Info | Observation, convention note, future scalability signal | No block |

Architecture-level systemic failure → switch mode to **Deep architecture handoff** and recommend `/ds-foundation-architecture-review`.

## Foundation proposal contract (`FP-*`)

Never create missing foundations in this Skill.

When a required semantic variable, Text Style, effect style, grid style, or primitive is missing:

1. Search for an approved equivalent (alias, synonym, sibling naming, library remote).
2. If none exists, create a structured proposal with a stable ID such as `FP-001`.
3. Stop mutating intent. Wait for explicit approval in a later mutating skill or explicit user approval phrase.

### Required `FP-*` fields

| Field | Required content |
|---|---|
| Proposal ID | `FP-001` style ID (stable within this review) |
| Foundation type | Semantic variable, text style, effect style, grid/layout style, or primitive |
| Proposed name | Exact Figma name |
| Collection or style group | Exact destination |
| Data type | Color, number, string, boolean, text style, effect style, etc. |
| Scope | Exact Figma scopes (or `Unknown — confirm on create`) |
| Modes | Light/Dark, Desktop/Tablet/Mobile, or other existing modes |
| Values | Prefer aliases to existing primitives; list per mode |
| Rationale | Which component need requires it (link to coverage row) |
| Affected components | Current + likely future consumers |
| Alternative considered | Existing token/style that was rejected and why |
| Risk | Low, Medium, or High |
| Blocks Plan? | Yes / No |
| Approval status | `Proposed` |

Approval example: `Approve foundation proposal FP-001`.

Batch approval is allowed: `Approve foundation proposals FP-001, FP-002`.

## Inspection protocol (mandatory)

Work in this order. State what you inspected.

### A. Establish target and evidence base

Record:

- File name
- Page(s) inspected
- Current selection (if any)
- Local vs enabled remote library assets used as evidence
- Target component exact name
- Platform (`Web` / `Tablet` / `Mobile`)
- Audit mode

If target component or platform is unclear → return `Blocked: missing target component or platform` and stop.

### B. Map need model for this component

Before auditing collections, derive the **need model**: what this component type typically requires on this platform.

Always cover these need groups:

1. **Surfaces** — background, elevated surface, subtle/strong fills
2. **Content** — text roles, icons, media slots
3. **Chrome** — border, divider, focus ring, caret (if input-like)
4. **Feedback** — error, success, warning, information
5. **Interaction** — default, hover, focus, pressed/active, selected (as platform applies)
6. **Disabled / loading / empty** — if applicable to the component family
7. **Theme** — Light and Dark semantic coverage
8. **Typography** — EN Text Styles + AR Text Styles by role
9. **Space & shape** — spacing, radius, width/sizing tokens
10. **Effects** — shadows/blurs if the component uses elevation
11. **Layout foundations** — grid/layout modes relevant to platform
12. **Nested dependencies** — icon, spinner, badge, avatar, etc.
13. **RTL signals** — logical start/end patterns, AR styles, mirroring expectations
14. **A11y design evidence needs** — focus visible, target size, contrast pairs, non-color state

Extend with component-family extras (see below). Do not skip a group by saying “N/A” without a one-line reason.

### C. Audit variable collections

For every relevant local collection (and enabled library collections used by this file), capture:

| Check | What to record |
|---|---|
| Identity | Collection name, purpose guess vs stated use |
| Modes | Exact mode names; missing expected Light/Dark or platform modes |
| Layering | Primitive vs semantic boundaries |
| Counts | Approximate variable counts by group if useful |
| Naming | Pattern consistency; collisions; ambiguous names |
| Scopes | Over/under-scoped variables |
| Aliases | Broken aliases; raw values inside semantic collections |
| Duplicates | Same role, multiple tokens |
| Gaps | Roles needed by the component that have no token |

Prefer listing **exact variable paths/names** in findings.

### D. Audit styles

Inspect Text, and where relevant Paint / Effect / Grid styles:

- EN vs AR text style families and platform modes
- Role coverage (label, body, title, caption, button label, helper, error, etc. as needed)
- Text Style → typography variable integrity
- Effect styles: confirm geometry in file; do not invent blur/spread/offset
- Whether production should consume styles vs raw values

### E. Build the component coverage matrix

For each need in the need model, mark status:

| Status | Meaning |
|---|---|
| Covered | Exact approved semantic token/style/component exists and is appropriate |
| Partial | Exists but incomplete modes, weak naming, or wrong layer |
| Missing | No approved equivalent; needs `FP-*` or architecture work |
| Conflict | Multiple competing sources or unsafe primitive shortcut |
| Unknown | Could not verify from available evidence |
| N/A | Not required for this component + platform (reason required) |

Every `Missing` / `Conflict` that is required must become either:

- an `FP-*` proposal, or
- a Blocking finding that points to `/ds-foundation-architecture-review` / manual resolution

### F. Inventory related components

Record siblings and dependencies:

- Existing `{Component} / Web|Tablet|Mobile`
- Drafts, duplicates, deprecated copies
- Nested components this build would consume
- Documentation frames tied to the component
- Binding health if an existing draft is selected (bound vs raw)

### G. RTL readiness signal (read-only)

Report whether:

- Arabic Text Styles exist for needed roles
- Logical naming / direction-neutral patterns are visible in existing components
- Icon mirroring conventions exist
- Any anti-pattern suggests EN/AR duplicate component sets

Do not mutate. RTL construction happens later inside `/ds-build`. Plan still needs these signals.

### H. Consistency and convention extraction

Extract conventions Plan must follow:

- Property naming patterns
- State axis patterns (e.g. `State=Default/Hover/...`)
- Token role naming (bg/text/icon/border/focus)
- Size / density patterns
- Documentation placement patterns

Mark each as `Verified convention`, `Unresolved policy`, `Mixed evidence`, `Not applicable`, or `Blocked`.

### I. Score readiness and emit Plan handoff

Apply the readiness rubric and produce the Plan handoff package (required output sections below).

## Component-family need extras

Use these as **additive** checks on top of the universal need model.

### Button / Button Group / Link

- Primary / secondary / tertiary / destructive (or file’s real hierarchy)
- Icon-only vs label vs label+icon
- Danger and quiet variants if present in system language
- Focus ring token; pressed overlay; disabled text/icon/bg
- Touch target expectations for Tablet/Mobile; hover for Web
- Button Group spacing and selected/segment roles if applicable

### Input / Text Area

- Label, placeholder, value, helper, error text roles (EN + AR)
- Field bg, border default/hover/focus/error/disabled
- Caret/selection if represented
- Leading/trailing icon or slot tokens
- Multiline min-height / resize affordance for Text Area
- Mandatory vs optional indicator patterns

### Checkbox / Radio / Toggle

- Unchecked / checked / indeterminate (if any)
- Selected control fill vs label text tokens
- Focus and disabled packing
- Touch target and hit area for Tablet/Mobile

### Avatar / Badge

- Size scale tokens
- Image / initials / icon fallback
- Status/presence accents if in system
- Contrast on all theme surfaces used

### Banner / Badge messaging

- Info / success / warning / error semantic sets
- Icon + text + optional action roles
- Dismiss control dependency

### Calendar / Table

- Dense cell tokens; selected/today/disabled/out-of-range
- Header vs body typography roles
- Divider/row hover (Web) / pressed (app)
- Nested controls (Icon Button, Checkbox) must be instances

If the target is outside this list, still build a full need model from anatomy; do not skip the universal groups.

## Decision rules

- Prefer the live Figma file over exports, PDFs, or prior chat memory.
- Prefer semantic bindings over primitives for production recommendations.
- Light/Dark = modes, not component variants.
- English/Arabic = typography + content + logical layout, not duplicate language component sets.
- Separate platform components are required; do not push “shared-first”.
- Report gaps; do not silently repair them.
- Prefer reuse of an existing close token/style over proposing a near-duplicate `FP-*`.
- If two sources conflict, record `Conflict` and block Plan on that row until policy is clear.
- Use `Unknown` when evidence is incomplete.

## Readiness rubric

Compute overall readiness from findings:

| Overall | Criteria |
|---|---|
| Ready | No Blocking gaps; no unresolved required `FP-*`; conventions clear enough for Plan; architecture healthy for this scope |
| Ready with gaps | No Blocking gaps, but Major gaps and/or unapproved non-blocking `FP-*` remain; Plan may proceed if it tracks them |
| Blocked | Any Blocking gap, required unapproved `FP-*` that Plan would need to lock, missing target/platform, or architecture handoff required |

Also report:

- Foundation gap count (Blocking / Major / Minor)
- Highest-risk issue (one sentence)
- Whether `/ds-plan` may proceed: `Yes` / `Yes with tracked gaps` / `No`

## Output format

Return **all** sections below. Do not replace them with a prose-only summary.

### Review Summary

- Target component
- Platform
- Audit mode
- File / pages inspected
- Overall readiness: `Ready`, `Ready with gaps`, or `Blocked`
- `/ds-plan` may proceed: `Yes` / `Yes with tracked gaps` / `No`
- Highest-risk issue
- Gap counts: Blocking / Major / Minor / Info
- `FP-*` proposal count

### Evidence Log

| Inspected area | Exact names or paths found | Result | Confidence |
|---|---|---|---|

Confidence: `High` (seen in file), `Medium` (partial), `Low` (inferred/limited access).

### Source-of-Truth Contract

| Area | Exact source | Modes | Approved usage | Do not use |
|---|---|---|---|---|

### Need Model

| Need ID | Need group | Required for this component? | Why |
|---|---|---|---|

### Foundation Inventory

| Foundation | Collection or style | Count | Modes | Status | Notes |
|---|---|---:|---|---|---|

### Component Coverage Matrix

| Need ID | Need | Exact token/style/component | Layer (semantic/primitive/style) | Modes covered | Status | Severity if not Covered | FP / finding ID |
|---|---|---|---|---|---|---|---|

Status values: `Covered`, `Partial`, `Missing`, `Conflict`, `Unknown`, `N/A`.

### Findings

| ID | Area | Severity | Evidence | Impact on Plan/Build | Recommended resolution |
|---|---|---|---|---|---|

Use `F-001` style IDs.

### Foundation Proposals

| Proposal ID | Type | Name | Collection | Modes | Values / aliases | Blocks Plan? | Risk | Status |
|---|---|---|---|---|---|---|---|---|

Include full field detail for each `FP-*` in an appendix subsection if the table would truncate critical values.

### Existing Component Inventory

| Component | Platform | Page | Properties | Dependencies | Binding status | Readiness |
|---|---|---|---|---|---|---|

### Variables and Styles Convention Summary

| Area | Verified convention | Evidence | Plan impact | Status |
|---|---|---|---|---|

Status values: `Verified convention`, `Unresolved policy`, `Mixed evidence`, `Not applicable`, `Blocked`.

### Plan Handoff Package

This section is mandatory. `/ds-plan` should be able to start from it.

| Handoff item | Content |
|---|---|
| Safe to plan? | `Yes` / `Yes with tracked gaps` / `No` |
| Locked foundations | Exact semantic variables / Text Styles / effects Plan may treat as `Verified` |
| Pending approvals | `FP-*` IDs that must be approved before `Ready to Build` |
| Open policy questions | Convention conflicts Plan must resolve as `OQ-*` |
| Nested dependencies | Approved components that must be instances |
| Platform deltas to investigate | Known differences vs sibling platforms |
| RTL / i18n constraints | Signals Plan must encode in the contract |
| A11y design constraints | Focus, target size, contrast pairs already evidenced |
| Out of scope for Plan | Items deferred or architecture-blocked |
| Suggested contract ID | `CC-{COMPONENT}-{PLATFORM}-001` if clear |

### Recommended Next Action

Return exactly one:

- `Continue to /ds-plan`
- `Approve foundation proposal FP-* then continue to /ds-plan`
- `Run /ds-foundation-architecture-review`
- `Resolve blockers listed above`
- `Continue consistency remediation notes, then re-run /ds-review`

## Step control rules

1. Name the audit mode and read-only boundary at the start.
2. Inspect before concluding. Evidence Log must not be empty.
3. Stop for missing target/platform; do not guess.
4. If architecture is systemically unhealthy, hand off; do not drown the report in component trivia.
5. Prefer fewer precise `FP-*` proposals over many near-duplicate proposals.
6. Do not continue into `/ds-plan` automatically unless the user explicitly asked the orchestrator to continue and readiness allows it.
7. End with one next action only.

## Completion gate

Complete only when:

- Target component and platform are identified (or explicitly Blocked for missing input)
- Need model was built for this component + platform
- Coverage was checked against **live** foundations with named evidence
- Gaps are listed as Findings and/or `FP-*` proposals, not silently ignored
- Severity and readiness rubric were applied
- Plan Handoff Package is filled
- No mutations were made
- Next action is explicit and singular
