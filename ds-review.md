---
name: ds-review
description: Deep read-only foundations and component-readiness review in the active Figma design-system file before every Plan or Build. Use to verify live Variables and Styles (Text, Paint/Color, Effect, Grid/Layout) coverage with evidence, inventory gaps as FP-* proposals, score plan readiness, and produce a Plan handoff package without modifying the file.
---

# Design System Review

## Role

Act as a design-system architect and Figma library auditor with a defect-first mindset.

You are reviewing **coverage and readiness**, not redesigning the system and not building the component.

## Objective

Before planning or building a component, prove from the **live Figma file** whether existing **Variables** and **Styles** (Text, Paint/Color, Effect, Grid/Layout), plus nested components, cover every case needed for that component and platform.

This Skill must answer, with evidence:

1. What Variables and Styles exist and are approved for use?
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

- Review Variables only and skip Styles (Text, Paint/Color, Effect, Grid/Layout)
- Claim coverage without citing exact collection / variable / style names from the live file
- Invent tokens, styles, or components that are not present
- Treat screenshots or memory as equal to the live file
- Collapse Light/Dark into component variants in recommendations
- Recommend primitive bindings on production layers when semantic tokens exist or should exist
- Recommend direct typography-variable binding on text nodes when an approved Text Style path exists
- Skip Arabic Text Styles, RTL readiness signals, or nested dependency tokens
- Mark Effect Styles as Covered without checking real geometry in the file
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

Expect, then **verify in the active file** (do not assume presence).

Review must cover **both** Variables and Styles. Skipping Styles is a failed review.

### Variables (verify)

| Foundation | Expected structure |
|---|---|
| Primitive variables | Raw tokens; never bind production layers directly |
| Semantic color variables | Theme-ready roles (bg, text, icon, border, focus, feedback) |
| Themes | Light and Dark semantic color modes |
| Radius variables | `radius-none` through `radius-full` |
| Spacing variables | `spacing-none` through `spacing-11xl` |
| Width variables | `width-xxs` through `width-6xl` |
| Typography variables | Used inside Text Styles (not bound raw on production text nodes) |
| Other number/string/boolean vars | Only if this component needs them |

### Styles (verify)

| Style type | Expected structure | What to check |
|---|---|---|
| Text Styles (EN) | Inter; roles for this component; Desktop / Tablet / Mobile where used | Exact style names; assigned to text nodes; vars inside the style |
| Text Styles (AR) | IBM Plex Sans Arabic; matching roles; Desktop / Tablet / Mobile where used | Same roles as EN where needed; no EN/AR duplicate components |
| Paint / Color Styles | Only if the file uses them for shared fills/strokes | Name, publish state, whether semantic variables should replace them |
| Effect Styles | Shadows / blurs used by this component | Full geometry in file (X, Y, blur, spread, color); do not invent values |
| Grid / Layout Styles | Desktop / Tablet / Mobile layout guides where relevant | Columns, margins, gutters, modes; N/A only with a reason |

### How Variables and Styles work together

```text
Paint on a layer     → prefer semantic color Variables (not raw hex)
Text on a layer      → approved Text Style → typography Variables inside that style
Elevation on a layer → Effect Style (geometry) + shadow color Variable when used
Page structure       → Grid / Layout Style when the component depends on layout rules
```

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
8. **Typography Styles** — EN Text Styles + AR Text Styles by role (required style audit)
9. **Space & shape** — spacing, radius, width/sizing **Variables**
10. **Effect Styles** — shadows/blurs if the component uses elevation (style + color variable)
11. **Grid / Layout Styles** — layout guides/modes if this component depends on them
12. **Paint / Color Styles** — only if the file still uses shared paint styles for fills/strokes
13. **Nested dependencies** — icon, spinner, badge, avatar, etc.
14. **RTL signals** — logical start/end patterns, AR Text Styles, mirroring expectations
15. **A11y design evidence needs** — focus visible, target size, contrast pairs (plan for **WCAG 2.2 AA + APCA additional confirmation**), non-color state; note any component-set examples whose shade/tint steps already pass or fail

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

Variables alone are not enough. Continue to Styles before you score readiness.

### D. Audit all style types

Inspect **every** style type below. If a type is not used by this component, mark `N/A` with a short reason. If you could not open/list it, mark `Unknown`.

#### D1. Text Styles (always required for text-bearing components)

| Check | What to record |
|---|---|
| EN family | Exact style names for needed roles (label, body, helper, error, etc.) |
| AR family | Matching roles for Arabic; missing AR role = gap |
| Platform modes | Desktop / Tablet / Mobile (or file’s real modes) on those styles |
| Style → variable link | Typography variables inside the style are healthy (not broken) |
| Apply path | Production text nodes should use the Text Style, not raw font settings |
| Gaps | Missing role, missing AR twin, broken variable link, wrong platform mode |

#### D2. Paint / Color Styles

| Check | What to record |
|---|---|
| Existence | Which paint/color styles exist that this component might use |
| Relationship to variables | Prefer semantic color Variables when both exist; note conflicts |
| Local vs library | Where the style lives; publish/enabled status if relevant |
| Gaps / conflicts | Style and variable both claim the same role with different values |

If the file does not use Paint Styles for this component, write `N/A — paints use Variables only` (only after you checked).

#### D3. Effect Styles

| Check | What to record |
|---|---|
| Names | Exact Effect Style names used or needed |
| Geometry | X, Y, blur, spread, type (drop shadow, inner shadow, layer blur) from the file |
| Color link | Shadow color Variable vs hard-coded color |
| Modes / themes | Whether Light/Dark stay correct when theme changes |
| Gaps | Missing style, invented geometry, raw effects on layers |

Do not invent blur, offset, or spread. If geometry is unclear, `Unknown`.

#### D4. Grid / Layout Styles

| Check | What to record |
|---|---|
| Names | Exact grid/layout style names |
| Modes | Desktop / Tablet / Mobile (or file modes) |
| Structure | Columns, margin, gutter, row settings as visible in file |
| Relevance | Required for this component vs page-only foundation |
| Gaps | Missing mode, broken guide, component depends on layout but no style exists |

For most single controls (Button, Checkbox), this is often `N/A` with reason. For Table, Calendar, or layout-heavy patterns, inspect for real.

#### Styles audit rule

A review that lists Variables coverage but leaves Text / Paint / Effect / Grid Styles unchecked is incomplete. Do not move to readiness scoring until Styles are covered or explicitly `N/A` / `Unknown`.

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
- Text Style naming (EN/AR roles and platform modes)
- Effect Style and Grid/Layout Style naming when used
- When to use a Variable vs a Style for the same visual job
- Size / density patterns
- Documentation placement patterns

Mark each as `Verified convention`, `Unresolved policy`, `Mixed evidence`, `Not applicable`, or `Blocked`.

### I. Score readiness and emit Plan handoff

Apply the readiness rubric and produce the Plan handoff package (required output sections below).

Do not score `Ready` if Text Styles (when text is required) were not audited, or if Effect / Grid / Paint styles were skipped without an `N/A` or `Unknown` reason.

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
- Cover **Variables and Styles** every time; one without the other is incomplete.
- Prefer semantic variable bindings over primitives for production paints and numbers.
- Prefer approved Text Styles over raw typography on production text nodes.
- Prefer Effect Styles (with verified geometry) over one-off raw effects when elevation is shared.
- Light/Dark = modes, not component variants.
- English/Arabic = typography Styles + content + logical layout, not duplicate language component sets.
- Separate platform components are required; do not push “shared-first”.
- Report gaps; do not silently repair them.
- Prefer reuse of an existing close variable/style over proposing a near-duplicate `FP-*`.
- If a Variable and a Style both claim the same role with different results, record `Conflict`.
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

Return **all** sections below. Do not drop any section. Do not replace the full report with a prose-only summary.

**Lead with the easy table** (`Missing Points & Solutions`), then keep every detailed section after it. The table is the quick view; the later sections are the full evidence.

Match the depth and section order in **Worked example: Button / Web** at the end of this skill. Use easy, clear language. Real reports must use live Figma names, not the sample names from the example.

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

### Missing Points & Solutions (primary easy table)

This is the main quick report. Put it **right after** Review Summary.

Show one row for every important need that is `Missing`, `Partial`, `Conflict`, or `Unknown`.  
Also include clear `OK` rows only when helpful for balance — or add one final note: `All other checked needs: OK` (and point to the Coverage Matrix).

| # | Area | What we need | In file now? | Status | What’s missing / wrong | Suggested solution | Severity | Blocks Plan? | Link |
|---|---|---|---|---|---|---|---|---|---|

Column guide (easy English):

| Column | Meaning |
|---|---|
| Area | Variable, Text Style, Paint Style, Effect Style, Grid Style, Component, Convention, or A11y |
| What we need | The role this component needs (example: focus ring color) |
| In file now? | `Yes` / `No` / `Partial` / `Unknown` |
| Status | `OK` · `Missing` · `Partial` · `Conflict` · `N/A` · `Unknown` |
| What’s missing / wrong | Short plain fact from the live file |
| Suggested solution | What to do next: reuse an existing name, propose `FP-*`, fix a mode/value, or run architecture review |
| Severity | Blocking / Major / Minor / Info |
| Blocks Plan? | `Yes` / `No` |
| Link | Matching `F-*` and/or `FP-*` ID from the detailed sections |

Suggested solution patterns (use one per row):

- Reuse existing: `Use {exact name}`
- Propose new: `Propose FP-*: add {exact name} in {collection/group}`
- Fix existing: `Fill Dark mode for {exact name}` / `Repair broken alias on {exact name}`
- Policy: `Decide between {A} and {B} as OQ-* in Plan`
- Architecture: `Run /ds-foundation-architecture-review`
- No change: `N/A — not needed for this component`

Every row in this table must still appear with full detail in Findings, Coverage Matrix, and/or Foundation Proposals. **Do not remove those sections.**

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

### Variables Inventory

| Foundation | Collection | Count | Modes | Status | Notes |
|---|---|---:|---|---|---|

List primitive and semantic variable collections that matter for this component.

### Styles Inventory

| Style type | Style name or group | Count | Modes / platform | Linked variables? | Status | Notes |
|---|---|---:|---|---|---|---|

Style types to include (each row or an explicit `N/A` / `Unknown` row):

- Text Styles (EN)
- Text Styles (AR)
- Paint / Color Styles
- Effect Styles
- Grid / Layout Styles

### Component Coverage Matrix

| Need ID | Need | Exact variable / style / component | Layer (semantic variable / primitive / text style / paint style / effect style / grid style / component) | Modes covered | Status | Severity if not Covered | FP / finding ID |
|---|---|---|---|---|---|---|---|

Status values: `Covered`, `Partial`, `Missing`, `Conflict`, `Unknown`, `N/A`.

Every required text role must point to a **Text Style** name (not only a typography variable).  
Every required elevation must point to an **Effect Style** (and color variable if used), or `N/A` with reason.  
Grid/Paint styles follow the same rule.

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
| Locked foundations | Exact semantic variables **and** Text / Effect / Grid / Paint Styles Plan may treat as `Verified` |
| Pending approvals | `FP-*` IDs that must be approved before `Ready to Build` |
| Open policy questions | Convention conflicts Plan must resolve as `OQ-*` |
| Nested dependencies | Approved components that must be instances |
| Platform deltas to investigate | Known differences vs sibling platforms |
| RTL / i18n constraints | Signals Plan must encode in the contract |
| A11y design constraints | Focus, target size, contrast pairs already evidenced (**WCAG + APCA** when measured); shade/tint steps from set examples that pass both |
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
6. Lead the written report with **Missing Points & Solutions**, then keep every detailed section — never drop data to “simplify.”
7. Do not continue into `/ds-plan` automatically unless the user explicitly asked the orchestrator to continue and readiness allows it.
8. End with one next action only.

## Completion gate

Complete only when:

- Target component and platform are identified (or explicitly Blocked for missing input)
- Need model was built for this component + platform
- **Variables** were checked against live collections with named evidence
- **Styles** were checked for Text, Paint/Color, Effect, and Grid/Layout (each Covered, gap, `N/A`, or `Unknown`)
- Coverage was checked against live foundations with named evidence
- **Missing Points & Solutions** table is filled for every Missing / Partial / Conflict / Unknown need
- Gaps are listed as Findings and/or `FP-*` proposals, not silently ignored
- All detailed sections are still present (do not drop Evidence Log, inventories, matrix, findings, proposals, handoff)
- Severity and readiness rubric were applied
- Plan Handoff Package is filled (variables + styles in locked foundations)
- No mutations were made
- Next action is explicit and singular

## Worked example: Button / Web

Use this as the **shape and depth** of a good review report.  
Token names below are **sample names**. In a real run, replace every name with what you find in the live Figma file.

**Mode:** Component coverage review (read-only)  
**Prompt used:**

```text
/ds-review
Review foundations for Button on Web.
Do not modify the file.
```

### Review Summary

- Target component: Button
- Platform: Web
- Audit mode: Component coverage review
- File / pages inspected: Design System — Foundations, Components / Web
- Overall readiness: `Ready with gaps`
- `/ds-plan` may proceed: `Yes with tracked gaps`
- Highest-risk issue: Focus ring color is missing as a semantic token for Light and Dark
- Gap counts: Blocking 0 / Major 1 / Minor 2 / Info 1
- `FP-*` proposal count: 1

### Missing Points & Solutions (primary easy table)

| # | Area | What we need | In file now? | Status | What’s missing / wrong | Suggested solution | Severity | Blocks Plan? | Link |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Variable | Focus ring color | No | Missing | No semantic focus color in `Color/Semantic` | Propose `FP-001`: add `color/focus/ring` (Light + Dark) | Major | No | F-002, FP-001 |
| 2 | Variable | Primary pressed (Dark) | Partial | Partial | `color/bg/button/primary-pressed` empty in Dark | Fill Dark mode value for that variable | Major | No | F-001 |
| 3 | Variable | Web min target height | No | Partial | No shared min-height size token (~40px) | Keep as Plan `OQ` or accept fixed Web min 40px | Minor | No | F-003 |
| 4 | Component | Draft Button bindings | Partial | Partial | Draft has 2 raw fills on secondary | Rebuild from semantic variables in `/ds-build` | Info | No | F-004 |

All other checked needs: OK (see Component Coverage Matrix).

### Evidence Log

| Inspected area | Exact names or paths found | Result | Confidence |
|---|---|---|---|
| Color variables | `Color/Semantic` collection; modes Light, Dark | Found | High |
| Button color vars | `color/bg/button/primary`, `color/text/button/primary`, `color/border/button/primary` | Found for default + hover | High |
| Focus variable | No `color/focus/ring` (or close name) in semantic collection | Missing | High |
| Spacing / radius vars | `Spacing`, `Radius` collections | Found | High |
| Text Styles EN | `Text/EN/Label/Medium` | Found | High |
| Text Styles AR | `Text/AR/Label/Medium` | Found | High |
| Paint / Color Styles | Local paint styles list checked; Button uses variables, not paint styles | N/A for Button paints | High |
| Effect Styles | `Shadow/sm`, `Shadow/md` exist; Button does not need shadow | N/A for Button | High |
| Grid / Layout Styles | `Layout/Desktop`, `Layout/Tablet`, `Layout/Mobile` exist; Button does not own page grid | N/A for Button | High |
| Existing Button | `Button / Web` draft on Components / Web | Partial draft, some raw fills | Medium |
| Sibling platforms | `Button / Tablet` not found; `Button / Mobile` not found | Not built yet | High |

### Source-of-Truth Contract

| Area | Exact source | Modes | Approved usage | Do not use |
|---|---|---|---|---|
| Color | `Color/Semantic` variables | Light, Dark | Bind production paints to semantic color variables | Raw hex; primitive color on production; old paint styles for the same role |
| Spacing | `Spacing` variables | single mode | Use for padding and gap | Hard-coded spacing numbers |
| Radius | `Radius` variables | single mode | Use for corner radius | Hard-coded radius |
| Type EN | Text Styles `Text/EN/...` | Desktop / Tablet / Mobile | Assign Text Styles to text nodes | Type vars bound straight on text nodes; raw font settings |
| Type AR | Text Styles `Text/AR/...` | Desktop / Tablet / Mobile | Same as EN for Arabic content | Separate EN/AR Button component sets |
| Effects | Effect Styles `Shadow/...` when elevation is needed | — | Apply Effect Style; keep shadow color on variables when used | One-off raw shadows on Button (Button is flat here) |
| Layout | Grid Styles `Layout/...` | Desktop / Tablet / Mobile | Page/layout frames only | Do not attach page grid styles to Button itself |

### Need Model

| Need ID | Need group | Required for this component? | Why |
|---|---|---|---|
| N-01 | Surfaces | Yes | Primary / secondary / tertiary / destructive fills |
| N-02 | Content | Yes | Label text + optional icon |
| N-03 | Chrome | Yes | Border on secondary; focus ring on all |
| N-04 | Feedback | Partial | Destructive is required; success/warning not required for Button |
| N-05 | Interaction | Yes | Default, Hover, Focus, Pressed; Disabled |
| N-06 | Disabled / loading | Yes | Disabled required; loading optional if system uses spinner in buttons |
| N-07 | Theme | Yes | Light and Dark |
| N-08 | Typography Styles | Yes | EN + AR label Text Styles |
| N-09 | Space & shape | Yes | Padding, gap, radius variables |
| N-10 | Effect Styles | No | This Button is flat (no shadow) |
| N-11 | Grid / Layout Styles | No | Button does not own page grid |
| N-12 | Paint / Color Styles | No | Paints use semantic color variables |
| N-13 | Nested dependencies | Yes | Icon component instance for icon slots |
| N-14 | RTL signals | Yes | Start/End padding and icon order for Arabic |
| N-15 | A11y design | Yes | Visible focus, contrast, min target size on Web |

### Variables Inventory

| Foundation | Collection | Count | Modes | Status | Notes |
|---|---|---:|---|---|---|
| Semantic color | `Color/Semantic` | ~120 | Light, Dark | Healthy | Good button bg/text set; focus gap |
| Primitives | `Color/Primitive` | ~80 | single | Healthy | Do not bind on Button layers |
| Spacing | `Spacing` | 16 | single | Healthy | `spacing-sm` to `spacing-xl` usable |
| Radius | `Radius` | 8 | single | Healthy | `radius-md` fits Button |

### Styles Inventory

| Style type | Style name or group | Count | Modes / platform | Linked variables? | Status | Notes |
|---|---|---:|---|---|---|---|
| Text Styles (EN) | `Text/EN/Label/Medium` (+ related Label sizes) | several | Desktop/Tablet/Mobile | Yes — type vars inside style | Healthy | Use on Button label |
| Text Styles (AR) | `Text/AR/Label/Medium` (+ related Label sizes) | several | Desktop/Tablet/Mobile | Yes — type vars inside style | Healthy | Matching AR role exists |
| Paint / Color Styles | (none required for Button) | — | — | — | N/A | Button fills use color variables |
| Effect Styles | `Shadow/sm`, `Shadow/md` | 2 | — | Shadow color vars present | N/A for Button | Exist in file; Button does not use them |
| Grid / Layout Styles | `Layout/Desktop`, `Layout/Tablet`, `Layout/Mobile` | 3 | Desktop/Tablet/Mobile | — | N/A for Button | Page layout only |

### Component Coverage Matrix

| Need ID | Need | Exact variable / style / component | Layer | Modes covered | Status | Severity if not Covered | FP / finding ID |
|---|---|---|---|---|---|---|---|
| N-01 | Primary bg default | `color/bg/button/primary` | semantic variable | Light, Dark | Covered | — | — |
| N-01 | Primary bg hover | `color/bg/button/primary-hover` | semantic variable | Light, Dark | Covered | — | — |
| N-01 | Primary bg pressed | `color/bg/button/primary-pressed` | semantic variable | Light only | Partial | Major | F-001 |
| N-02 | Label text primary | `color/text/button/primary` | semantic variable | Light, Dark | Covered | — | — |
| N-02 | Icon on primary | `color/icon/button/primary` | semantic variable | Light, Dark | Covered | — | — |
| N-03 | Focus ring | — | — | — | Missing | Major | FP-001, F-002 |
| N-05 | Disabled bg/text | `color/bg/button/disabled`, `color/text/button/disabled` | semantic variable | Light, Dark | Covered | — | — |
| N-08 | EN label style | `Text/EN/Label/Medium` | text style | Desktop/Tablet/Mobile | Covered | — | — |
| N-08 | AR label style | `Text/AR/Label/Medium` | text style | Desktop/Tablet/Mobile | Covered | — | — |
| N-09 | Padding / gap / radius | `spacing-md`, `spacing-sm`, `radius-md` | semantic variable | single | Covered | — | — |
| N-10 | Shadow effect | Effect Styles not needed | effect style | — | N/A | — | — |
| N-11 | Page grid | Grid Styles not needed on Button | grid style | — | N/A | — | — |
| N-12 | Paint style fill | Paint Styles not used | paint style | — | N/A | — | — |
| N-13 | Icon nested | `Icon / Web` | component | — | Covered | — | — |
| N-14 | RTL patterns | Seen on `Link / Web` (Auto Layout Start/End) | convention | — | Covered | — | — |
| N-15 | Min target size | No shared size token for 40px Web min | — | — | Partial | Minor | F-003 |

### Findings

| ID | Area | Severity | Evidence | Impact on Plan/Build | Recommended resolution |
|---|---|---|---|---|---|
| F-001 | Primary pressed Dark | Major | `color/bg/button/primary-pressed` empty in Dark mode | Plan cannot lock pressed Dark as Verified | Fill Dark value later, or add `FP` if new token is needed |
| F-002 | Focus ring | Major | No semantic focus color in `Color/Semantic` | Build would guess or use raw hex | Approve `FP-001` then use it in Plan token map |
| F-003 | Target size | Minor | No `size/button/min-height` (or same role) | Plan must write a fixed min height rule | Keep as Plan `OQ` or accept hard min 40px for Web |
| F-004 | Draft bindings | Info | Draft `Button / Web` still has 2 raw fills on secondary | Do not copy raw fills into final Build | Rebuild from semantic tokens |

### Foundation Proposals

| Proposal ID | Type | Name | Collection | Modes | Values / aliases | Blocks Plan? | Risk | Status |
|---|---|---|---|---|---|---|---|---|
| FP-001 | Semantic variable | `color/focus/ring` | `Color/Semantic` | Light, Dark | Alias to focus primitive per mode (confirm in file) | No (Plan may proceed; Build needs approval before Ready to Build) | Medium | Proposed |

**FP-001 detail**

- Foundation type: Semantic variable (color)
- Proposed name: `color/focus/ring`
- Collection: `Color/Semantic`
- Scopes: Stroke color, and frame stroke if needed
- Modes: Light, Dark
- Values: alias to existing focus primitives if present; if not, stop and ask before inventing primitives
- Rationale: Every Button state needs a visible focus ring for Web keyboard users (Need N-03 / N-14)
- Affected components: Button, Input, Checkbox, Radio, Link, and other focusable controls
- Alternative considered: reuse `color/border/button/primary` — rejected because border role is not focus role
- Risk: Medium
- Blocks Plan?: No
- Approval status: Proposed

### Existing Component Inventory

| Component | Platform | Page | Properties | Dependencies | Binding status | Readiness |
|---|---|---|---|---|---|---|
| Button / Web | Web | Components / Web | Size, Hierarchy, State, Icon (draft) | Icon / Web | Mixed (some raw fills) | Draft only |
| Button / Tablet | Tablet | — | — | — | — | Missing |
| Button / Mobile | Mobile | — | — | — | — | Missing |
| Icon / Web | Web | Foundations / Icon | Name, Size | — | Bound | Ready enough to nest |
| Link / Web | Web | Components / Web | — | — | Bound | Useful RTL reference |

### Variables and Styles Convention Summary

| Area | Verified convention | Evidence | Plan impact | Status |
|---|---|---|---|---|
| State axis | `State=Default, Hover, Focus, Pressed, Disabled` | Link / Web + Button draft | Reuse same State names | Verified convention |
| Theme | Light/Dark via variable modes | `Color/Semantic` | No theme property on Button | Verified convention |
| Language | One component; EN/AR via Text Styles + content | Text style libraries | No language property | Verified convention |
| Text Style path | Text node → Text Style → type variables | EN/AR Label styles | Plan must name exact Text Styles | Verified convention |
| Paint vs variable | Button paints use semantic color variables | No paint style on Button draft fills | Do not introduce paint styles for Button fills | Verified convention |
| Effect Style use | Shared shadows live as Effect Styles; Button is flat | `Shadow/sm`, `Shadow/md` exist | Leave effects out of Button contract | Verified convention |
| Size naming | Draft uses `Size=sm/md/lg` | Button / Web draft | Confirm md as default in Plan | Mixed evidence |
| Focus token naming | No shared focus token yet | Search in semantic colors | Follow `FP-001` name if approved | Unresolved policy |

### Plan Handoff Package

| Handoff item | Content |
|---|---|
| Safe to plan? | `Yes with tracked gaps` |
| Locked foundations | Variables: `color/bg/button/primary`, `color/bg/button/primary-hover`, `color/text/button/primary`, `color/icon/button/primary`, `color/bg/button/disabled`, `color/text/button/disabled`, `spacing-md`, `spacing-sm`, `radius-md`. Styles: `Text/EN/Label/Medium`, `Text/AR/Label/Medium`. Component: `Icon / Web`. Effect/Grid/Paint Styles: none required for Button |
| Pending approvals | `FP-001` (`color/focus/ring`) before contract can be `Ready to Build` |
| Open policy questions | Confirm size scale `sm/md/lg` and Web min height 40px (F-003); confirm Dark value for primary pressed (F-001) |
| Nested dependencies | `Icon / Web` must be an instance (not flattened vectors) |
| Platform deltas to investigate | Tablet/Mobile not built; Plan only for Web now; do not share one component across platforms |
| RTL / i18n constraints | Use Start/End padding; icon swaps side with direction; AR label style for Arabic text; no EN/AR duplicate Button sets |
| A11y design constraints | Visible focus required; contrast must hold on primary/destructive in Light and Dark via **WCAG 2.2 AA + APCA**; Web min target about 40px; prefer shade/tint steps from set examples that already pass both |
| Out of scope for Plan | Button / Tablet, Button / Mobile, shadow elevation |
| Suggested contract ID | `CC-BUTTON-WEB-001` |

### Recommended Next Action

`Approve foundation proposal FP-001 then continue to /ds-plan`

---

**How to use this example**

1. Keep the same section order in every real review.
2. Lead with **Missing Points & Solutions** (easy table), then keep all detailed sections — do not drop any.
3. Always fill **Variables Inventory** and **Styles Inventory** (Text, Paint, Effect, Grid — or `N/A` / `Unknown`).
4. Swap sample names for **live** names from the file.
5. If a cell has no proof, write `Unknown` — do not guess.
6. End with **one** next action only.
