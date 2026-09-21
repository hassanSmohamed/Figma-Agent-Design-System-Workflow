---
name: ds-document
description: Creates or updates in-file Figma documentation for one foundation component including all states and variants, contextual variable usage examples, and user-facing annotations. Docs-only; never changes source component API. Use after /ds-test passes or when documenting an approved component.
---

# Design System Document

## Role

Act as a senior design-system documentation designer and library maintainer.

## Objective

Create or update clear, production-ready **in-file** documentation for **exactly one** selected or named foundation component on the selected platform.

Docs must help product designers, consumers, developers, and QA understand purpose, configuration, states, tokens-in-context, EN LTR vs AR RTL, accessibility, and status—without changing the source component API.

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

**Allowed:** documentation pages/frames, annotations, tables, captions, and **live source instances** used as examples.

**Forbidden:**

- Change source component or component-set API
- Add, remove, or rename source variants or properties
- Detach any instance (source or example)
- Duplicate components or invent foundations/styles
- Replace semantic bindings or “fix” defects silently
- Modify original usage-evidence screens
- Mark production-ready without evidence

When a defect is found: document it and recommend `/ds-fix`. Do not repair the source in this Skill.

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

Intake must cover contract areas for: purpose, anatomy, public API, **full variant/state model**, content, sizing, platform, theme/RTL, a11y, foundations, acceptance criteria, open questions.

If no reliable contract → `Blocked: missing component contract`.  
If status is `Blocked` → do not publish final “approved” docs → `Blocked: component contract is Blocked`.

**Incomplete variants/states vs `CC-*` = documentation not done.**

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

Continue, but mark contextual sections `Usage evidence pending`.

### Screens already available

Confirm briefly; ask only for missing facts that change the docs.

Prefer at least one primary use and one important edge/state when available; do not fabricate platforms or states.

Per screen record: source, platform, flow, screen, location, role, variant/state, theme/direction, evidence quality (`Live frame` / `Snapshot` / `Screenshot` / `Inferred`), notes.

## Known foundation profile

Expect, then verify in file:

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
2. Update existing docs; do not duplicate pages  
3. Exact Figma property names and supported values  
4. Semantic tokens—not primitives—as guidance  
5. Visual examples before dense tables  
6. Separate supported behavior from recommendations  
7. Separate shared rules from platform differences  
8. EN LTR + AR RTL; Light + Dark when supported  
9. A11y: design evidence vs `Implementation requirement` for runtime  
10. Place annotations next to related examples  
11. Incomplete matrix or missing contextual tokens / consumer annotations = not complete  

## Required documentation sections

Create or update these sections in order (names may match file convention; content must match):

1. **Overview** — purpose, when to use / not, status, platforms, themes, directions, contract ID/version, hero instance  
2. **Context** — usage gallery / map from evidence (or `Usage evidence pending`)  
3. **Anatomy** — numbered callouts on a live instance + part table  
4. **Variants and States** — **complete matrix** per `CC-*` (all contracted axes/values; no invented combos)  
5. **Properties** — exact API how-to table  
6. **Variable usage examples (contextual)** — product-like scenes showing how tokens/variables are used **with** the component (not a token list alone)  
7. **Annotations** — consumer-facing callouts for every required topic (see below)  
8. **Themes / Localization RTL** — Light/Dark + EN LTR / AR RTL matrix; long/mixed text when relevant  
9. **Accessibility** — focus, targets, contrast, labels, non-color status, errors; runtime marked separately  
10. **Do / Don't** — paired contextual examples with reasons  
11. **Status** — docs status, known gaps, defects → `/ds-fix`, links to siblings and prior skills  

Optional compact playground is allowed if it uses live instances and does not duplicate the source set.

## Annotations (every consumer-facing point)

Place annotations **beside related examples**, not only in a distant appendix. Cover all of:

| Topic | Must explain |
|---|---|
| Purpose | What problem it solves |
| When to use / not | Boundaries and alternatives |
| Anatomy | Parts and optional slots |
| Properties how-to | Exact names, defaults, safe combinations |
| State meaning | What each state communicates |
| Sizing / platform | Hug/Fill, targets, Web vs Tablet vs Mobile notes |
| EN LTR vs AR RTL | Layout, icons, typography roles |
| Token guidance | Semantic roles in context (bg, text, border, focus, spacing, radius, type) |
| Accessibility | Design-time rules + implementation requirements |
| Do / Don't | Concrete misuse prevention |

Number callouts consistently; keep labels outside the instance.

## Variants and States (complete coverage)

Build the matrix from the **`CC-*` variant and state model** plus verified source support.

- Include every contracted Type / Size / State (and other axes) that consumers can select  
- Use live instances in strips/grids; prefer readable strips over full cross-product explosion when the contract separates axes—but **every contracted value must appear at least once**  
- Label invalid combinations as restricted, not as missing examples  
- Do not invent missing states; record gaps and route defects to `/ds-fix`  
- Distinguish interaction / system / selection / content states when applicable  

**Gate:** if any contracted variant value or state is undocumented → incomplete.

## Variable usage examples (contextual)

Do **not** ship a bare token dump as the only token section.

For each major semantic role the component uses, show a **product-like mini layout** (form row, toolbar, card header, list item, etc.) where:

- The component instance is live  
- Callouts name the **exact semantic variable / text style / effect** on the relevant part  
- Mode behavior (Light/Dark) is shown or noted  
- Spacing/radius/type appear as used in composition, not as orphan swatches only  

A compact reference table may follow the visuals. Mark unverified bindings `Unverified`.

**Gate:** contextual variable examples required for completion.

## Live instances rule

All matrix, anatomy, playground, theme/RTL, and Do/Don't component examples must remain **instances of the source**. Never detach. Never edit source while documenting.

## Idempotency and placement

Inspect existing docs first. Prefer:

```text
Docs / [Component Name] / [Platform]
```

or the file’s established docs convention. Update in place. Cross-link sibling platforms when they exist.

## Workflow

### 1. Resolve target + platform + contract

Confirm `CC-*`, platform component name, and sibling links.

### 2. Usage evidence

Request screens or accept skip; produce a short Usage Evidence Summary before building Context.

### 3. Inspect source (read-only)

Record API, variants, states, bindings, nested dependencies, Auto Layout, themes, RTL behavior, known defects. Do not edit source. Record contract drift explicitly.

### 4. Set documentation status

| Status | Meaning |
|---|---|
| Draft | Incomplete docs or evidence |
| Ready for QA | Docs built; independent test not confirmed |
| Ready | Latest `/ds-test` (or equivalent) passed; no blocking gaps |
| Needs fixes | Critical/Major gaps or defects remain |
| Deprecated | Explicitly marked for replacement |
| Unknown | Insufficient evidence |

Do not invent `Ready`. Do not mark `Ready` if contract is Draft/Blocked or matrix/tokens/annotations are incomplete.

### 5. Build required sections

Create/update Overview → Status in the order above. Keep English clear and concise.

### 6. Cross-references

In Status (and gaps), link the workflow:

| Command | Use |
|---|---|
| `/ds-review` | Foundation coverage before plan/build |
| `/ds-plan` | Component Contract (`CC-*`) |
| `/ds-build` | Source construction |
| `/ds-test` | QA / acceptance before or after docs |
| `/ds-fix` | Repair source defects found while documenting |

### 7. Quality checks

- Source API unchanged; no detaches  
- Full `CC-*` variants/states covered  
- Contextual variable examples present  
- Consumer annotations present for every required topic  
- Exact property/token names; no primitive recommendations  
- Platform docs for selected platform + sibling cross-links  
- Light/Dark and EN/AR when supported  
- Usage evidence handled or explicitly skipped  
- Original screens untouched  

## Component-specific reminders (short)

Document only what the contract and source support. Typical focuses:

- **Button / Link:** type hierarchy, loading, icon-only, focus/disabled, visited (Link)  
- **Button Group:** orientation, primary order, RTL order, wrapping  
- **Input / Text Area:** label, helper/error, leading/trailing, read-only vs disabled, multiline  
- **Avatar:** image/initials/fallback, sizes, status  
- **Toggle / Checkbox / Radio:** meaning of states, groups, labels, RTL without reversing meaning  
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
| Full variants/states vs `CC-*` | | |
| Contextual variable examples | | |
| Consumer annotations (all topics) | | |

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
- `Documentation complete`  

## Completion gate

Documentation is **complete only when all** are true:

1. Target + reliable `CC-*` identified; drift recorded if any  
2. Usage screens supplied **or** explicit source-only skip recorded  
3. Source API unchanged; examples remain live instances (no detach)  
4. **Full variants and states** from the contract are documented  
5. **Contextual variable usage examples** exist (not token list only)  
6. **Consumer annotations** cover purpose, use/not, anatomy, properties, states, sizing/platform, EN/AR RTL, tokens, a11y, do/don't—placed next to related examples  
7. Required sections Overview through Status are present  
8. Selected platform documented; siblings cross-linked when they exist  
9. Status and gaps are honest; defects point to `/ds-fix`  

If any of items **4–6** fail → result must be `Partially documented` (not complete).
