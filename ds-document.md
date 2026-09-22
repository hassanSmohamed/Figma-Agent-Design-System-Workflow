---
name: ds-document
description: Creates or updates in-file Figma documentation for one foundation component on one platform—consumer sections Overview through Edge cases, with scoped Styles & Variables and contextual examples. Docs-only; never changes source component API. Foundations docs are separate from component docs. Use after /ds-test passes or when documenting an approved component.
---

# Design System Document

## Role

Act as a senior design-system documentation designer and library maintainer.

## Objective

Create or update clear, production-ready **in-file** documentation for **exactly one** selected or named foundation component on the selected platform.

Docs must help product designers, consumers, developers, and QA understand purpose, styles/variables in scope, anatomy, variants, behavior, specs, usage boundaries, composition, and edge cases—without changing the source component API and without overlapping content across sections.

**Foundations** (tokens, variables, styles, effects, grid) use a **different** doc shape than **components**. This skill documents **components**. Cross-link foundation pages; do not redefine the token system on the component page.

## When to run

Prefer after `/ds-test` passes (or when documenting an already approved component).

```text
/ds-document
Create documentation for {Component Name}, including all states and variants.
```

Optional platform hint:

```text
/ds-document
Create documentation for {Component Name} / {Web | Tablet | Mobile}, including all states and variants.
```

## Mutation scope (docs-only)

**Allowed:** documentation pages/frames, callouts next to examples, tables, captions, and **live source instances** used as examples.

**Forbidden:**

- Change source component or component-set API
- Add, remove, or rename source variants or properties
- Detach any instance (source or example)
- Duplicate components or invent foundations/styles
- Replace semantic bindings or “fix” defects silently
- Modify original usage-evidence screens
- Mark production-ready without evidence
- Create a second docs page for the same component × platform

When a defect is found: document it under **Edge cases** / **Status** and recommend `/ds-fix`. Do not repair the source in this Skill.

## Supported foundation components

Button, Button Group, Input, Text Area, Avatar, Toggle, Checkbox, Radio Button, Calendar, Table, Banner, Badge, Link.

## Platforms

Document the **selected platform component** only:

| Platform | Meaning |
|---|---|
| Web | Responsive web / portal |
| Tablet | Tablet app |
| Mobile | Mobile app |

Naming: `{Component Name} / {Web | Tablet | Mobile}`.

When sibling platform components exist, **cross-link** them (do not rebuild their full docs here). Note verified differences only.

## Doc types (do not mix)

### Component docs (this skill)

**Job:** how to use **this** component with foundations—never redefine the foundation inventory.

Prefer placement:

```text
Docs / Components / [Component Name] / [Platform]
```

### Foundation docs (out of scope for full authoring here)

**Job:** define system vocabulary (inventory, semantics, modes, bind guidance).

Prefer placement:

```text
Docs / Foundations / [Set Name]
```

Typical foundation sections only: Overview → Inventory → Semantics & roles → Usage with components → Do / Don't → Status.

When documenting a component: **link** to foundation pages. If a binding is missing from Foundations, mark `Unverified` or record a gap—do not invent or fully redefine tokens on the component page.

## Target resolution

1. Component named in the prompt  
2. Selected component set / component  
3. Source of a selected instance  
4. Unambiguous component page  

If unresolved → `Blocked: missing target component`.

## Source-of-truth priority

1. Latest reliable `CC-*` Component Contract  
2. Active source component + properties  
3. Local variables, styles, modes  
4. Existing docs for this component  
5. Latest `/ds-test` (or QA) report in conversation  
6. File conventions  
7. Labeled assumptions only when they do not invent behavior  

Never describe unsupported capabilities.

## Component Contract intake (required)

Accepted sources (priority):

1. `CC-*` contract frame/block in the file  
2. Latest `/ds-plan` or `/ds-build` report in conversation  
3. User-supplied excerpt with stable `CC-*` ID, version, and status  

Capture before mutating docs:

| Field | Required |
|---|---|
| Contract ID | Stable `CC-*` |
| Version | Exact |
| Status | Draft / Ready to Build / Blocked / Built / Approved |
| Scope | New / non-breaking update / migration |
| Platforms | Web, Tablet, and/or Mobile as contracted |
| Source | Frame, report, or excerpt |

Intake must cover contract areas for: purpose, anatomy, public API, **full variant/state model**, content, sizing, platform, **theme**, **Language**, **Direction**, a11y, foundations, acceptance criteria, open questions.

If no reliable contract → `Blocked: missing component contract`.  
If status is `Blocked` → do not publish final “approved” docs → `Blocked: component contract is Blocked`.

**Incomplete variants vs `CC-*` = documentation not done.**

## Usage-evidence intake (mandatory, with skip)

### Screens not available

Do not mutate docs yet. Ask:

```text
Where is [Component Name] used?

Please upload or select 2–6 representative UI screens. For each screen, include:
- Platform: Web, Tablet, or Mobile
- Product area or flow
- Screen name
- Which component instance to document
- Whether it is a common, edge-case, error, empty, or success usage
```

Accept selected frames, screenshots, prototypes, or product-flow pages.

### Explicit skip

User may say:

```text
Skip usage screens and create source-only documentation.
```

Continue, but mark **Composition** / evidence-dependent notes `Usage evidence pending`.

### Screens already available

Confirm briefly; ask only for missing facts that change the docs.

Prefer at least one primary use and one important edge/state when available; do not fabricate platforms or states.

Per screen record: source, platform, flow, screen, location, role, variant/state, theme, language, direction (separate), evidence quality (`Live frame` / `Snapshot` / `Screenshot` / `Inferred`), notes.

## Known foundation profile

Expect, then verify in file (for **binding references** on the component page—not for rewriting foundation docs):

| Foundation | Expected |
|---|---|
| Primitives | Raw only; never recommend direct component binding |
| Themes | Semantic Light / Dark |
| Radius / Spacing / Width | Existing scales in file |
| Typography EN | Inter; Desktop / Tablet / Mobile modes |
| Typography AR | IBM Plex Sans Arabic; Desktop / Tablet / Mobile modes |
| Grid & Layout | Platform modes |
| Shadows | Verify full effect geometry in file |

## Documentation principles

1. Live source instances only—no detach, no visual replicas as truth  
2. Update existing docs; do not duplicate pages for the same component × platform  
3. Exact Figma property names and supported values  
4. Semantic tokens—not primitives—as guidance  
5. Visual examples before dense tables  
6. Separate supported behavior from recommendations  
7. Separate shared rules from platform differences  
8. **Language** (EN + automatic AR stress examples) and **Direction** (LTR + RTL) as separate concerns; Light + Dark when supported — do not document them as one “EN LTR / AR RTL” blob only  
9. A11y: design evidence vs `Implementation requirement` for runtime  
10. Callouts sit **beside** examples inside the owning section—not a separate Annotations chapter  
11. **Single ownership:** each fact lives in one section; other sections may link, never restate  

## Anti-overlap rules

| Fact | Only lives in |
|---|---|
| What it is / platforms / support flags | Overview |
| Token/style names + scope + contextual binding scenes | Styles & Variables |
| Parts of one instance | Anatomy |
| Selectable options / structural matrix | Variants |
| Hover, focus, pressed, disabled, loading, Language behavior, Direction/RTL behavior, a11y behavior | Behavior & interaction |
| Property API, defaults, sizing, nested deps | Detail specs |
| Use for / Don’t use for + alternatives | Usage |
| Layout with neighboring components | Composition |
| Rare / failure / overflow / long text | Edge cases |
| Docs honesty, gaps, next command | Status |

Additional rules:

- No **Annotations** section—inline callouts only  
- **Use for / Don’t use for** only under **Usage** (not Overview)  
- **Variants** = structure consumers select; **Behavior** = interaction—do not merge into one mega-grid unless the contract forces it  
- **Composition ≠ Styles & Variables**—Composition shows product layout; Styles & Variables names bindings  
- Foundation names are **references**; do not copy full foundation inventories onto the component page  

## Required component sections

Create or update these sections **in order**. Names may match file convention; content ownership must match.

1. **Overview** — purpose, platforms, theme / Language / Direction support flags (separate), contract ID/version, hero instance, sibling links. No full Use/Don’t list.  
2. **Styles & Variables** — scoped bindings for this component + contextual product-like examples (see below).  
3. **Anatomy** — numbered callouts on a live instance + part table (required/optional).  
4. **Variants** — complete matrix per `CC-*` (every contracted value ≥ once); restricted combos labeled.  
5. **Behavior & interaction** — state meaning, pointer/keyboard, focus, loading/disabled rules, **Language** (EN vs AR Text Styles + stress examples) vs **Direction** (LTR vs RTL layout) as separate notes, design-time a11y (contrast **WCAG 2.2 AA + APCA**, targets); runtime marked `Implementation requirement`.  
6. **Detail specs** — exact property names, defaults, safe combinations, Hug/Fill, targets, nested dependencies.  
7. **Usage** — **Use for** / **Don’t use for** + preferred alternatives.  
8. **Composition** — product-like layouts with siblings (form row, toolbar, dialog footer); spacing between components; or `Usage evidence pending`.  
9. **Edge cases** — long/mixed text, empty/error/overflow, platform quirks, known defects → `/ds-fix`.  
10. **Status** — short: docs status, gaps, sibling links, one next command.  

Optional compact playground is allowed if it uses live instances and does not duplicate the source set.

### Styles & Variables (component-scoped)

Do **not** ship a bare token dump or redefine Foundations here.

For each major part, document:

| Field | Purpose |
|---|---|
| Part | e.g. Container, Label, Icon, Focus ring |
| Role | bg, text, border, focus, spacing, radius, type, effect |
| Exact semantic variable / text style / effect | File-accurate name |
| Scope | Component / Semantic Light·Dark / Platform type mode / shared scale |
| Mode notes | Light/Dark or EN/AR as applicable |
| Example | Live instance callout |

Then show **1–3 contextual mini layouts** (form footer, toolbar, list row, etc.) where:

- The component instance is live  
- Callouts name the exact semantic variable / style / effect on the relevant part  
- Mode behavior (Light/Dark) is shown or noted  
- Spacing/radius/type appear as used in composition—not orphan swatches only  

A compact binding table may precede the visuals. Mark unverified bindings `Unverified`.

**Gate:** scoped Styles & Variables + contextual examples required for completion.

### Variants (complete coverage)

Build from the **`CC-*` variant and state model** plus verified source support.

- Include every contracted Type / Size / State (and other axes) consumers can select  
- Prefer readable strips over full cross-product explosion when axes are separate—but **every contracted value must appear at least once**  
- Label invalid combinations as restricted, not as missing examples  
- Do not invent missing variants; record gaps and route defects to `/ds-fix`  
- Interaction meaning belongs in **Behavior & interaction**, not only as unlabeled thumbnails  

**Gate:** if any contracted variant value is undocumented → incomplete.

### Callouts (inline only)

Number callouts consistently; keep labels outside the instance. Place them in the section that owns the fact (e.g. token callouts in Styles & Variables, part numbers in Anatomy).

## Live instances rule

All Variants, Anatomy, playground, Behavior, Composition, Usage, and Edge cases component examples must remain **instances of the source**. Never detach. Never edit source while documenting.

## Idempotency and placement

Inspect existing docs first. Prefer:

```text
Docs / Components / [Component Name] / [Platform]
```

or the file’s established docs convention. **Update in place.** Cross-link sibling platforms when they exist. Never spawn a duplicate Overview for the same component × platform.

## Workflow

### 1. Resolve target + platform + contract

Confirm `CC-*`, platform component name, and sibling links.

### 2. Usage evidence

Request screens or accept skip; produce a short Usage Evidence Summary before building Composition.

### 3. Inspect source (read-only)

Record API, variants, states, bindings, nested dependencies, Auto Layout, themes, Language, Direction, known defects. Do not edit source. Record contract drift explicitly.

### 4. Set documentation status

| Status | Meaning |
|---|---|
| Draft | Incomplete docs or evidence |
| Ready for QA | Docs built; independent test not confirmed |
| Ready | Latest `/ds-test` (or equivalent) passed; no blocking gaps |
| Needs fixes | Critical/Major gaps or defects remain |
| Deprecated | Explicitly marked for replacement |
| Unknown | Insufficient evidence |

Do not invent `Ready`. Do not mark `Ready` if contract is Draft/Blocked or Styles & Variables / Variants / Usage are incomplete.

### 5. Build required sections

Create/update Overview → Status in the order above. Keep English clear and concise. Enforce anti-overlap rules.

### 6. Cross-references

In Status (and gaps), link the workflow:

| Command | Use |
|---|---|
| `/ds-review` | Foundation coverage before plan/build |
| `/ds-plan` | Component Contract (`CC-*`) |
| `/ds-build` | Source construction |
| `/ds-test` | QA / acceptance before or after docs |
| `/ds-fix` | Repair source defects found while documenting |
| `/ds-jira` | Plain-text parent + full-workflow subtasks for the board |

### 7. Quality checks

- Source API unchanged; no detaches  
- Full `CC-*` variants covered in **Variants**  
- **Styles & Variables** scoped + contextual examples present  
- **Usage** has Use for + Don’t use for  
- **Composition** + **Edge cases** present (or explicit pending/gap)  
- Exact property/token names; no primitive recommendations  
- No duplicate facts across sections  
- Platform docs for selected platform + sibling cross-links  
- Light/Dark and EN/AR covered where supported (flags in Overview; behavior in Behavior; long text in Edge cases)  
- Usage evidence handled or explicitly skipped  
- Original screens untouched  

## Component-specific reminders (short)

Document only what the contract and source support. Typical focuses:

- **Button / Link:** type hierarchy, loading, icon-only, focus/disabled, visited (Link)  
- **Button Group:** orientation, primary order, Direction/RTL order, wrapping  
- **Input / Text Area:** label, helper/error, leading/trailing, read-only vs disabled, multiline  
- **Avatar:** image/initials/fallback, sizes, status  
- **Toggle / Checkbox / Radio:** meaning of states, groups, labels, Direction without reversing meaning  
- **Banner / Badge:** semantic types, dismiss/action, non-interactive defaults  
- **Calendar / Table:** document the system (cells, headers, ranges, empty/loading, overflow), not only one sample  

## Output format

### Documentation Result

- Component / Platform  
- Contract ID, version, status  
- Result: `Created` | `Updated` | `Partially documented` | `Blocked`  
- Documentation status  
- Source component modified: must be `No`  
- Docs location  
- Sibling cross-links  

### Usage Evidence

| Screen | Source | Platform | Flow | Role | Variant/state | Theme/dir | Quality |
|---|---|---|---|---|---|---|---|

Use `Usage evidence pending` when skipped.

### Coverage checklist

| Gate | Pass? | Notes |
|---|---|---|
| Styles & Variables (scoped + contextual) | | |
| Variants vs `CC-*` | | |
| Usage (Use for / Don’t use for) | | |
| Composition + Edge cases | | |

### Contract drift

| Area | Contract | Docs/source | Gap | Action |
|---|---|---|---|---|

### Known gaps

| Severity | Gap | Why it matters | Next command |
|---|---|---|---|

Prefer `/ds-fix`, `/ds-test`, `/ds-plan`, or `Resolve product decision`.

### Recommended next command

Exactly one of:

- `/ds-test`  
- `/ds-fix`  
- `/ds-plan` (contract outdated)  
- `/ds-jira` (board package for full workflow — optional)  
- `Documentation complete`  

## Completion gate

Documentation is **complete only when all** are true:

1. Target + reliable `CC-*` identified; drift recorded if any  
2. Usage screens supplied **or** explicit source-only skip recorded  
3. Source API unchanged; examples remain live instances (no detach)  
4. **Styles & Variables** includes scoped bindings **and** contextual examples (not token list only)  
5. **Variants** document every contracted value at least once  
6. **Usage** includes Use for and Don’t use for  
7. **Composition** and **Edge cases** are present (or explicitly pending/gapped)  
8. Required sections Overview through Status are present with **no overlapping restatements**  
9. Selected platform documented; siblings cross-linked when they exist  
10. Status and gaps are honest; defects point to `/ds-fix`  

If any of items **4–6** fail → result must be `Partially documented` (not complete).
