---
name: ds-build
description: Deep mutating build of one foundation component for one platform in the active Figma design-system file. Consumes an approved CC-* contract plus Plan Package A–E — especially Table C (Variables/Styles solves) and Table D (nested configs) — then constructs Auto Layout, semantic bindings, Text Styles, theme modes, and RTL-ready structure. Use only after /ds-plan is human-approved Ready to Build.
---

# Design System Build

## Role

Act as a senior design-system designer and Figma component architect (builder).

You implement an **approved plan**. You do not reinvent the contract, invent foundations, reinterpret nested configs, or “improve” the API during construction.

## Objective

Build or update **exactly one** foundation component for **exactly one** platform in the active Figma design-system file so it is Ready for Test.

This Skill must answer, with evidence from the live file **and** the approved Plan Package:

1. Was the approved `CC-*` + extras A–E intact and authorized for mutation?
2. Were Tables **C** and **D** executed (or legitimately `None`) before / during construction?
3. Does the built set match wireframe A, controls B, token map §10, and platform rules?
4. Are Variables, Text Styles, nested instances, Auto Layout, theme, and RTL compliant?
5. Did self-check pass for EN LTR + AR RTL × Light + Dark on this platform?
6. What exact handoff can `/ds-test` trust?

The build must be:

- Bound to approved semantic variables
- Assigned approved Text Styles (not raw typography)
- Auto Layout clean and pixel-stable
- Theme-ready (Light / Dark via modes)
- RTL-ready (Arabic + English in one set — no EN/AR duplicates)
- Nested-component safe
- Traceable to an approved `CC-*` from `/ds-plan`
- Executable from Plan Package extras — especially **Table C** and **Table D**

## When to run

Run only after `/ds-plan` for the same component + platform, and only after the human explicitly approved that contract as Ready to Build.

```text
/ds-build
Build {Component Name} / {Web | Tablet | Mobile}
from approved contract CC-{COMPONENT}-{PLATFORM}-001.
```

Optional same-message foundation approval (IDs must be explicit):

```text
/ds-build
Build Button / Web from approved contract CC-BUTTON-WEB-001.
Also create approved FP-001 and FP-002 per Plan Table C.
```

## Build modes

Use **one** mode per invocation. Name it at the start of the report.

### 1. New component build (default)

No approved `{Component} / {Platform}` set exists (or only an unapproved draft). Create the set from the Plan Package.

### 2. Non-breaking update

An approved/`Built` set exists. Apply contract-scoped changes without breaking published property names, variant values, or instance bindings. Requires approval to update a `Built` contract (or explicit non-breaking scope in the approved plan).

### 3. Migration build

Public API or structure changes that can break instances. Requires explicit migration approval in the plan/approval message. Document before/after API and migration notes. Do not run this mode silently.

### 4. Foundations-only prelude (rare)

User asks only to create approved Table C / `FP-*` items before the shell. Still requires the same approvals. After creates, either continue into the component build in the same run (if prompted) or stop and recommend a follow-up `/ds-build` for the shell.

If architecture itself is unsafe mid-build (collections broken, mode model conflict), **stop**, recommend `/ds-foundation-architecture-review`, and do not fake Ready for Test.

## Non-negotiable quality bar

A shallow build is a failed build. Do **not**:

- Start mutating without quoting approval evidence for the exact `CC-*` ID
- Build from memory or screenshots instead of the live file + approved Plan Package
- Skip Plan extras A–B, or treat missing C–D as optional without an explicit `None`
- Create Variables/Styles not listed in section 10 / approved Table C
- Rename Table C items “to match taste” during create
- Bind production layers to primitives when semantics exist or were approved to exist
- Assign fonts/sizes manually instead of the exact approved Text Style
- Fake Arabic by right-aligning Inter
- Add Theme / Language / Direction variant axes unless Table B + contract require them
- Duplicate the set for EN vs AR
- Flatten nested dependencies that Table D requires as instances
- Detach instances to restyle
- Mark Ready for Test while overlap, clipping, raw fills, or failed RTL/theme self-check remain
- Mark Ready for Test when required contrast pairs pass WCAG but fail APCA (or the reverse) without logging and resolving
- Copy failing colors from a component-set example instead of following a passing shade/tint step
- Silently change the public API
- Dump a generic component tutorial instead of an evidence-backed build report for this target

When evidence is incomplete, write `Unknown` / `Unverified` and either keep readiness `Draft`/`Blocked` or finish only the verifiable parts. Never present guesses as Verified.

## Platforms and naming

Choose exactly one platform per invocation. Create **separate** platform components:

| Platform | Component set name | Build implications |
|---|---|---|
| Web | `{Component} / Web` | Hover/focus/keyboard affordances per contract; responsive min-screens **within** Web if §6 requires |
| Tablet | `{Component} / Tablet` | Touch targets / pressed states per contract; app density |
| Mobile | `{Component} / Mobile` | Touch targets / pressed states per contract; compact density |

Examples: `Button / Web`, `Input / Mobile`, `Table / Tablet`.

Do not pack Web + Tablet + Mobile into one set unless the approved contract explicitly requires a shared set (default is separate). Sibling platforms are separate `/ds-build` runs.

## Supported foundation components

Button, Button Group, Input, Text Area, Avatar, Toggle, Checkbox, Radio, Calendar, Table, Banner, Badge, Link.

If the target is outside this list, stop and ask before building.

## Target resolution

Resolve the build target in this order:

1. Explicit `{Component} / {Platform}` + `CC-*` in the prompt
2. Approved Plan Package in this conversation for that ID
3. Selected component set / component in the file (must still match an approved `CC-*`)
4. In-file `CC-*` contract frame for the same component + platform

If the prompt, selection, and contract disagree → **stop**. Do not guess.

## Hard mutation gate

**Do not mutate** the source library until all of the following are true:

1. A reliable `CC-*` contract exists for this component + platform
2. Contract status is `Ready to Build` (or already `Built` for an approved non-breaking update / migration)
3. The human approved that exact contract ID, e.g.:

```text
Approve CC-BUTTON-WEB-001 Ready to Build
```

4. Plan Package extras required for execution are present (see **Approved Plan Package intake**)
5. Table E is `None — not blocked.` **or** every Blocking row was explicitly cleared/approved before this run
6. Every Table C row with `Blocks Ready to Build? = Yes` is already Verified in file **or** covered by explicit `FP-*` / Gap ID approval (this message or prior in-thread)
7. Build mode is named and matches scope (new / update / migration)

### Block reason catalog

Return exactly one primary block reason when stopping:

| Block reason | When |
|---|---|
| `Blocked: waiting for approved CC-* Ready to Build` | Missing/unclear approval or wrong ID |
| `Blocked: missing or incomplete component contract` | Sections 1–12 incomplete or absent |
| `Blocked: missing Plan Package extras (need A–B; C–E or explicit None)` | Package incomplete |
| `Blocked: Plan Table E still blocking` | Uncleared E rows |
| `Blocked: Table C creates unapproved` | Blocking Gap/`FP-*` lacks approval |
| `Blocked: Table D required dependency missing` | Required nested target missing/incomplete |
| `Blocked: contract/platform mismatch` | Prompt vs contract disagree |
| `Blocked: migration approval required` | Breaking API change without migration OK |
| `Blocked: live file drift vs Plan Table C/D` | Approved solve no longer matches file; needs re-plan |
| `Blocked: foundation architecture unsafe` | Hand off to architecture review |

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

## Cross-references

| Skill | Relationship |
|---|---|
| `/ds-review` | Foundations coverage before plan; re-run if build finds unverified gaps or stale Table C |
| `/ds-plan` | Source of `CC-*` **and** Plan Package A–E; required before build |
| `/ds-test` | After build self-check; formal QA |
| `/ds-fix` | Repair defects from `/ds-test` or self-check |
| `/ds-document` | Specs/usage after the component is stable |
| `/ds-foundation-architecture-review` | When base Variable/Style structure is unsafe |

RTL is **part of this build**. Do not treat RTL as a separate later skill.

---

## Approved Plan Package intake

Build does **not** start from sections 1–12 alone. After human approval, intake the full Plan Package.

### Accepted sources (priority order)

1. `CC-*` contract frame / docs block in the active file **plus** the latest `/ds-plan` report extras for the same ID
2. Latest `/ds-plan` report in this conversation for the same ID (Full Component Contract + extras A–E + Build Handoff Package)
3. User-supplied package with stable `CC-*` ID, version, platform, status, and extras C–D (or explicit `None`)

If the in-file contract frame exists but Plan extras C–D are only in the conversation report, **the conversation report wins for C–D execution**. Do not invent missing C–D rows.

### Metadata (required before mutation)

| Field | Required |
|---|---|
| Contract ID | e.g. `CC-BUTTON-WEB-001` |
| Version | Exact version string |
| Status | `Ready to Build` + human approval, or approved update of `Built` |
| Component | Exact name |
| Platform | Web, Tablet, or Mobile |
| Scope | New, non-breaking update, or migration |
| Build mode | New / Non-breaking update / Migration / Foundations-only prelude |
| Human approval evidence | Quote or paraphrase for this exact ID (+ FP/Gap if needed) |
| Source | Frame, plan report, or user excerpt |
| Plan extras present | A, B, C, D, E each found or explicitly `None` where allowed |

### Contract sections 1–12 (must match `/ds-plan`)

1. Purpose and boundaries  
2. Architecture and anatomy  
3. Public property API  
4. Variant and state model  
5. Content contract  
6. Sizing and responsive behavior  
7. Platform contract  
8. Theme, localization, and RTL contract  
9. Accessibility contract  
10. Foundation and token map  
11. Acceptance criteria  
12. Assumptions, open questions, decisions  

### Plan report extras (mandatory intake)

| Extra | What Build does with it |
|---|---|
| **A. ASCII wireframe** | Anatomy blueprint — layer names and optional parts must match labels |
| **B. Controls and configuration options** | Public API blueprint — every consumer control; no invented axes |
| **C. Missing variables / styles — solve table** | **Executable foundation work** — create/alias/bind only approved rows |
| **D. Dependent components — configuration matrix** | **Executable nested work** — nest approved instances at listed configs only |
| **E. Blocking issues — remedies** | Gate only — if still blocking, **stop** |

If intake fails → use the matching block reason from the catalog above.

### Table C — consume after approval (hard rule)

Table C is the **only** authorized list of Variables/Styles creates, aliases, and role mappings for this build (plus section 10 rows already `Verified` / `Approved creation`).

| Column | Build action |
|---|---|
| Gap ID | Trace in Table C Execution Log + FP-* Actions |
| Missing item (exact proposed name) | Use this exact name — do not rename |
| Type | Create/bind only that type |
| Needed by (part / state) | Apply to those parts/states only |
| Structure-preserving solve | Execute literally — no redesign |
| Approval needed | Must be satisfied before create |
| Blocks Ready to Build? | If `Yes` and unapproved/unsolved → **stop**, no shell mutation |

**Execution rules:**

1. `None — all required Variables and Styles are Verified or Approved.` → skip creates; bind section 10 only.
2. Prefer solve text over memory or “similar” tokens.
3. Create/alias/bind only under **existing** collections and Style naming conventions.
4. Prefer reuse + documented role mapping when the solve says reuse.
5. Create **only** approved Gap / `FP-*` items; log each action.
6. After creates, re-verify in the live file, then bind production layers.
7. If the live file drifted (token already exists under another name, collection missing, mode mismatch) → **stop** with `Blocked: live file drift vs Plan Table C/D` — do not invent a parallel token.
8. If a solve needs architecture change → stop; recommend `/ds-plan` or `/ds-foundation-architecture-review`.

**Approval mapping:**

| Approval phrase covers | Allowed create/bind |
|---|---|
| `Approve CC-… Ready to Build` only | Reuse/bind-only rows + already-approved plan rows; **not** new `Proposed FP-*` creates |
| `Also approve foundation proposals FP-…` | Those `FP-*` creates in Table C / §10 |
| `Also approve Plan Table C solves for Gap IDs …` | Those Gap ID solves |
| Prior in-thread approval of same FP/Gap IDs | Same — cite it |

### Table D — consume after approval (hard rule)

Table D is the **only** authorized nested-dependency configuration list.

| Column | Build action |
|---|---|
| Nested component | Exact approved instance target (same platform family when applicable) |
| Required? | If `Yes` and missing → **stop** / propose — never flatten |
| Configurations parent may need | Support these only — no product matrix explosion |
| Parent control that drives it | Wire parent property/variant to nested instance |
| Status | `Verified` / `Approved` (or approved create). `Proposed` / `Blocked` → stop |
| Notes | Honor private vs published constraints |

**Execution rules:**

1. `None` → no nested instances required; still no decorative stand-ins for system components.
2. Prefer nested instances over local rebuilds — always.
3. Do not detach to restyle.
4. Do not rebuild Avatar, Badge, Icon, Checkbox, Button, Spinner, Menu, etc. as local shapes/text.
5. Do not explode Theme × Language × Direction on nested sets.
6. Flattened vectors are **not** a solve.
7. Record status: `Verified`, `Approved creation`, `Proposed FP-*`, or `Blocked`.

Hard stop: not Ready for Test while a Required Table D row was rebuilt as local layers or left unwired to the parent control.

### Table E — gate only

| Table E state | Build behavior |
|---|---|
| `None — not blocked.` | Proceed (subject to other gates) |
| Rows cleared by user `DEC-*` / approval before this run | Proceed; cite clearances |
| Uncleared Blocking rows | **Stop** — `Blocked: Plan Table E still blocking` |

Never treat E “Suggested solve” as permission to redesign architecture inside Build.

### Sections A–B — build blueprints

- **A:** Layers/parts use the same names; optional parts only when controls enable them.
- **B:** Implement every consumer-facing control. No Theme / Language / Direction axes unless contract + Table B require them.

### Drift and contract change rules

| Situation | Action |
|---|---|
| Minor layer naming polish, same public API | Allowed; log under Contract Changes as non-breaking / no version bump if contract text unchanged |
| Must differ from approved package (token, API, anatomy, nested config) | Stop **or** version contract + revise C–D **before** continuing; breaking → re-approval |
| Live file contradicts Table C solve | Stop — re-plan / re-review |
| Open `OQ-*` that blocks behavior | Stop — do not invent a `DEC-*` silently |

---

## Known foundation profile

Expect, then verify in the active file:

| Foundation | Expectation |
|---|---|
| Primitives | Raw values only; never bind production layers directly |
| Themes | Semantic Light and Dark color modes |
| Radius / Spacing / Width | Semantic number variables where bindable |
| Typography EN | Inter; Desktop / Tablet / Mobile modes as defined in file |
| Typography AR | IBM Plex Sans Arabic; matching platform modes |
| Shadows | Verify Effect Styles (full geometry) before applying |
| Grid & Layout | Follow verified file conventions; do not attach page grids to controls unless contract says so |

Active Figma file is source of truth. Section 10 + Table C override generic expectations when they name exact tokens/styles.

### Variables and Styles binding architecture

```text
Paint / stroke on a layer  → semantic color Variables (not raw hex, not primitives)
Text on a layer            → approved Text Style → typography Variables inside that style
Spacing / radius / gap     → semantic number Variables
Elevation                  → Effect Style (+ shadow color Variable when used)
```

### Text Style assignment architecture

1. Assign the **exact approved Text Style** to every production text node by semantic role, language, and platform.
2. Typography variables inside the Text Style are style implementation details — do not recreate styles via node-level typography bindings.
3. Matching font values without an assigned Text Style **fail** compliance.
4. Remove accidental local typography overrides after style assignment.
5. English → Inter styles; Arabic → IBM Plex Sans Arabic styles. Do not fake Arabic by only right-aligning Inter.

### Prefer semantic variables

- Colors, text color, spacing, radius, and other bindable properties → semantic variables
- Never bind production layers to primitives as a shortcut
- Unexplained raw fills, strokes, padding, gap, radius, or typography on production layers are **blocking**

---

## No silent foundation creation

Missing semantic variables, Text Styles, or effect styles must never be created silently.

When a required foundation is missing:

1. Search Table C and section 10 for an approved row
2. Search the file for an approved equivalent named by those rows
3. If still missing and not approved → emit/update structured `FP-*` / Gap proposals, **stop**
4. If approved via Table C / `FP-*` → create **only** those items using the structure-preserving solve text
5. Log every created foundation in the build report

Each new `FP-*` proposal (when stopping) must include: ID, type, proposed name, collection/group, data type, scopes, modes, values (alias primitives when possible), rationale, affected components, risk, approval status.

Do not invent shadow geometry, Light/Dark pairs from “looks similar,” or rename shared foundations without an approved migration.

Prefer `/ds-review` + `/ds-plan` revision when gaps are large or Table C is stale vs the live file.

---

## Nested component reuse gate

Before drawing substitute layers, consume **Table D**, then search the file/library:

| Need | Prefer |
|---|---|
| Identity | Avatar |
| Status | Badge / Status / Tag / Banner pattern |
| Icons | Shared Icon components or instance-swap |
| Selection | Checkbox, Radio |
| Actions | Button, Link, Icon Button, Menu |
| Fields / search | Input and approved filters |
| Loading | Spinner / approved loading pattern |

Rules:

1. Table D configs win over ad-hoc discovery  
2. Prefer nested instances over local rebuilds  
3. Do not detach nested instances to restyle casually  
4. Do not rebuild system components as local shapes/text  
5. Incomplete dependency → document limitation or propose `FP-*` / nested component  
6. Missing → propose; do not invent a silent one-off substitute  
7. Record every nested dependency with status  

Hard stop: not Ready for Test while required nested components were rebuilt as local layers.

---

## Core build rules

1. One component + one platform per invocation  
2. Name the set `{Component} / {Platform}`  
3. Inspect before creating; update existing approved sets non-destructively  
4. Reuse approved variables, Text Styles, effect styles, icons, and nested components from §10 + Tables C–D  
5. Auto Layout on every logical container; prefer Hug/Fill over accidental Fixed  
6. Properties for content options; variants for type/size/state — match Table B  
7. Theme via variable modes — not Theme variants  
8. **No EN/AR duplicate component sets**; **no Language variants** solely for localization  
9. Direction: direction-neutral Auto Layout + logical Leading/Trailing/Start/End  
10. `Direction=LTR/RTL` only at the smallest necessary nested layer, and only if the contract allows  
11. Preserve published public APIs on updates; breaking changes need migration approval  
12. No overlap/clipping unless intentional (badge overlay, focus ring, etc.)  
13. Long EN/AR content grows, wraps, or truncates per contract — never crush typography to fit  
14. Report what was inspected, changed, and unverified  
15. Do not “improve” the approved plan during build — re-plan first if wrong  

### Variant explosion prevention

Do **not** build: `Type × Size × State × Theme × Language × Direction × Icon × …`

| Need | Mechanism |
|---|---|
| Type / Size / State | Variants when needed (per Table B) |
| Label / content | Text / Boolean / instance-swap |
| Theme | Variable modes |
| EN / AR | Content + Text Styles |
| RTL | Logical layout (+ nested Direction only if required) |
| Platform | Separate `{Component} / {Platform}` sets |

### Instance-safety rules (updates and migrations)

1. Preserve component and component-set node IDs where possible  
2. Preserve published variant property names and values unless migration approved  
3. Preserve component property names and defaults unless migration approved  
4. Do not delete variants with unknown usage  
5. Prefer additive variants/properties over renames  
6. Keep nested dependencies as instances  
7. After updates, spot-check that existing instances still bind  

### Property construction rules

| Kind (from Table B) | Build as | Notes |
|---|---|---|
| `variant axis` | Component set variant property | Only contracted values; list invalid combos as excluded variants or docs |
| `text prop` | Text component property | Default placeholder per content contract — not invented product copy |
| `boolean prop` | Boolean property | Drives visibility of optional anatomy from wireframe A |
| `instance swap` | Instance-swap property | Preferred values = Table D targets |
| `other` | Only if Table B specifies | Do not invent |

---

## Construction sequence (mandatory order)

Follow this order unless the contract forbids it. Do not bind tokens before the shell exists; do not claim Ready for Test before self-check.

### Phase 0 — Gate and intake (read-only)

1. Name build mode  
2. Resolve target + `CC-*`  
3. Intake sections 1–12 + extras A–E  
4. Quote approval evidence  
5. Emit Pre-Build Review (no mutation yet)  
6. Stop if any hard gate fails  

### Phase 1 — Execute Table C

1. Walk every C row or confirm `None`  
2. Create/alias only approved items  
3. Re-inspect live file for created names/modes/scopes  
4. Log Table C Execution Log  

### Phase 2 — Table D inventory

1. Walk every D row or confirm `None`  
2. Confirm instance targets exist and support required configs  
3. Log planned Nested Dependencies  
4. Stop if Required rows cannot be satisfied  

### Phase 3 — Shell structure (anatomy)

1. Create or open `{Component} / {Platform}`  
2. Build Auto Layout hierarchy matching wireframe A  
3. Name layers logically (`Leading`, `Label`, `Trailing`, …)  
4. Apply Hug/Fill/Fixed per §6  
5. Insert nested instances for Table D slots (unwired props OK briefly)  

### Phase 4 — Variant and property API

1. Implement Table B controls exactly  
2. Build variant matrix for type/size/state only as contracted  
3. Wire booleans/text/instance-swaps to anatomy  
4. Exclude invalid combinations explicitly  

### Phase 5 — Bind foundations

1. Bind fills/strokes/spacing/radius per §10 + executed Table C  
2. Assign exact Text Styles per role/language/platform  
3. Apply Effect Styles only where contracted  
4. Remove raw values and local type overrides  
5. Fill Foundations + Compliance tables with exact names  

### Phase 6 — RTL and content stress inside the same set

1. Apply section 8 direction architecture (prefer direction-neutral)  
2. Configure leading/trailing / Start/End behavior  
3. Apply AR Text Styles on Arabic stress content  
4. Handle mixed-direction exceptions without reversing characters  
5. Record RTL Implementation + icon/mixed-direction decisions  

### Phase 7 — Accessibility design implementation

Implement **design-level** §9 only (do not claim runtime ARIA):

- Visible focus treatment bound to approved focus tokens/styles  
- Min target size per platform contract  
- Non-color state cues where required  
- Icon-only naming via properties / accessible labels as designed in Figma  
- Error / disabled / loading treatments per contract  
- Contrast confirmation for critical pairs: **WCAG 2.2 AA + APCA** (see below)  
- If the user supplied a component-set example: apply **shade/tint follow-up** (see below)

### Contrast confirmation — WCAG + APCA (mandatory)

Measure; do not guess. Record both methods for every critical text/UI pair in Light and Dark.

| Method | Role | Design thresholds (use unless contract sets stricter) |
|---|---|---|
| **WCAG 2.2 AA** | Compliance baseline for this package | Text ≥ **4.5:1**; large text / essential UI chrome ≥ **3:1** |
| **APCA (Lc)** | **Additional confirmation** (perceptual; polarity-aware) | Bronze Simple Mode guidance: body/fluent text prefer **\|Lc\| ≥ 75** (preferred **90**); large/secondary content often **\|Lc\| ≥ 60**; non-text UI / borders often **\|Lc\| ≥ 45**; below **\|Lc\| ≈ 15** treat as effectively invisible for many users |

Rules:

1. WCAG 2.2 AA remains the **compliance gate** unless the approved contract explicitly sets a different product policy.  
2. APCA is **additional confirmation**, not a WCAG replacement and not a claim of WCAG 3 conformance.  
3. Always report APCA with polarity: light-on-dark Lc is typically negative — record the signed Lc and compare **\|Lc\|** to the target.  
4. Pair APCA with the contracted Text Style size/weight when judging readability.  
5. Dark mode pairs must be confirmed with **both** methods (APCA is especially useful here).  
6. Disabled / decorative pairs may use lower contrast only when §9 explicitly allows and non-color cues remain.  
7. If WCAG passes but APCA fails (or the reverse) → do **not** mark Ready for Test silently. Log under Remaining Findings; prefer adjusting to a shade/tint step that passes **both**, or stop for `/ds-plan` / token `FP-*`.  
8. Never “fix” contrast by binding production layers to primitives or inventing off-ramp hex.

Report pairs in **Contrast Confirmation (WCAG + APCA)**.

### Component-set example → shade / tint follow-up

When the user adds or points to an **example from this component set** (or a sibling platform set of the same component), Build must follow accessible shade/tint steps — not invent new hues.

| Situation | Required action |
|---|---|
| Example colors already pass WCAG + APCA on the needed roles | **Follow** those semantic roles and shade/tint steps; bind the same approved tokens |
| Example fails WCAG and/or APCA on a required role | **Do not copy** failing colors into production bindings; escalate with measured evidence |
| Example is close but needs stronger/softer emphasis | Move along the **approved** shade/tint ramp (same hue family / semantic scale) to the nearest step that still passes **both** WCAG and APCA |
| No ramp step passes both methods | Stop or propose Table C / `FP-*` — do not invent a one-off hex |
| Example uses raw fills | Replace with semantic variables that match the passing shade/tint intent |

Also apply this when Build creates in-file usage examples from the set: examples must use the same accessible shade/tint bindings as the source component.

Log decisions in **Shade / Tint Follow-up**.

### Phase 8 — Self-check matrix

Run the full matrix below. Fail → readiness `Draft` or `Blocked`; recommend `/ds-fix` or continue repairs in-run only if trivial and in-scope.

### Phase 9 — Persist and report

1. Update in-file contract frame status to `Built` only if self-check passed and file uses in-file contracts  
2. Emit full build report  
3. Recommend exactly one next command  

---

## Platform build checklist

Apply the matching row in addition to the contract:

| Platform | Must implement when contracted | Do not assume |
|---|---|---|
| Web | Hover + Focus (+ Pressed if in §4); keyboard focus visible; responsive behavior across Web min-screens in §6 | Tablet/Mobile app densities |
| Tablet | Touch pressed/selected; larger targets per §6/§9; no reliance on hover-only affordances | Desktop hover as primary UX |
| Mobile | Touch pressed; compact density; thumb-friendly targets per §6/§9 | Hover states |

---

## RTL as part of build (mandatory)

RTL is not a horizontal flip. Apply during build (Phase 6), not as a follow-up pass. Follow section 8.

### Principles

1. Logical meaning: Leading, Trailing, Start, End  
2. Mirror reading order when appropriate  
3. Mirror **directional** icons only  
4. Preserve non-directional symbols  
5. Preserve On/Off, Selected/Unselected, Previous/Next, Primary/Secondary meaning  
6. Keep inherently LTR values LTR (email, URL, phone, OTP, IDs, paths, versions, etc.)  
7. Arabic typography = IBM Plex Sans Arabic styles  
8. Never duplicate the full set for Arabic  
9. Avoid Direction on every variant combination  
10. Do not invent Arabic copy, numeral policy, or date format as product facts  

### Preferred direction architecture

1. **Direction-neutral anatomy** (preferred) — Auto Layout + start/end + logical names  
2. **Directional nested subcomponent** — `Direction=LTR|RTL` only where order must change  
3. **Direction on main component** — last resort  

### Component-specific RTL notes

- **Button / Link:** leading at reading start; trailing at end; mirror directional arrows only  
- **Button Group:** do not reverse actions blindly; preserve primary/destructive hierarchy  
- **Input / Text Area:** RTL labels/helper/error; keep mixed values LTR when appropriate; do not reverse prefix/suffix semantics  
- **Avatar / Badge:** usually direction-neutral; do not mirror images, logos, status glyphs  
- **Toggle / Checkbox / Radio:** do not invert state meaning; place control + label by reading direction  
- **Calendar:** mirror month nav arrows; do not reverse digits in cells; preserve range-start/end meaning  
- **Table:** preserve semantic column roles; do not blindly reverse selection/identity/action columns  
- **Banner:** status → title → body → actions → dismiss in logical order  

See **Appendix A** for icon mirror lists and mixed-direction rules.

---

## Workflow (summary)

1. Resolve target and Plan Package → gate  
2. Pre-build inspect (read-only table)  
3. Execute Table C  
4. Table D inventory  
5. Build/update source (Phases 3–7)  
6. Self-check  
7. Completion report + next command  

### Pre-build inspect (required table before mutation)

| Area | Checked | Found (exact names) | Risk |
|---|---|---|---|
| Existing set | | | |
| Color / spacing / radius vars | | | |
| Text Styles EN / AR | | | |
| Effect / Grid styles | | | |
| Table C targets in file | | | |
| Table D nested targets | | | |
| RTL reference patterns | | | |
| A11y focus/target patterns | | | |
| Docs / contract frame | | | |

---

## Pixel-perfect Auto Layout gate

1. Auto Layout on every logical container  
2. Consistent padding, gap, alignment across matching variants/states  
3. No accidental overlap or clipping  
4. No absolute positioning to hide layout mistakes  
5. Intentional Hug / Fill / Fixed only  
6. Recheck after LTR and RTL content  
7. Long content per §5 does not crush type or overflow clipped without contract rule  

Hard stop: not Ready for Test while overlap, clipping, or inconsistent sizing remains.

---

## Self-check matrix (required)

| Scenario | Required | Evidence to cite |
|---|---|---|
| English LTR + Light | Pass | Variant/property path + mode |
| English LTR + Dark | Pass | Same |
| Arabic RTL + Light | Pass | AR Text Style + direction mechanism |
| Arabic RTL + Dark | Pass | Same |
| Platform width / density | Pass | Frame width or size variant |
| Long English + long Arabic | Pass | Content examples used |
| Mixed-direction values (if allowed) | Pass | Example + isolation approach |
| Icon leading/trailing (if any) | Pass | Property values |
| Focused / disabled / error (as contracted) | Pass | State variants |
| Nested dependency integrity (Table D) | Pass | Instance names still nested |
| Variables + Text Styles compliance | Pass | Exact bindings/styles |
| Contrast WCAG 2.2 AA (critical pairs, Light + Dark) | Pass | Measured ratios |
| Contrast APCA additional confirmation (same pairs) | Pass | Measured \|Lc\| + polarity |
| Component-set example shade/tint follow-up (if example given) | Pass | Same ramp / passing step used |
| Public API matches Table B | Pass | Property list |
| No overlap / clip / unstable sizing | Pass | Visual/layout check |
| No EN/AR duplicate sets | Pass | File search |

Status may move to `Built` only after this matrix passes.

---

## Completion gate

Report **Ready for Test** only when:

- Build mode named and correct  
- Human-approved `CC-* Ready to Build` (or approved update/migration of `Built`) verified  
- Plan Package A–B consumed; C–E consumed or explicitly `None`  
- Approved Table C creates/solves executed (or `None`)  
- Table D required nested configs implemented as instances (or `None`)  
- Table E clear at mutation time  
- Exactly one component + one platform built  
- Set name `{Component} / {Platform}`  
- Contract followed (or versioned with recorded changes)  
- No silent `FP-*` / Gap creations  
- Variables + Text Styles compliance not Blocked / Mixed on required layers  
- Nested reuse gate passed  
- Auto Layout / pixel gate passed  
- LTR + RTL and Light + Dark self-check passed  
- No full EN/AR duplicate sets  
- Public API matches contract + Table B  
- Accessibility design items from §9 that are buildable in Figma are present  
- Critical contrast pairs confirmed with **WCAG 2.2 AA and APCA**; conflicts resolved or explicitly Blocked  
- If a component-set example was supplied: shade/tint follow-up applied (passing ramp step; no failing raw copy)  
- **Built Configuration Snapshot** and **Controls as Built** are filled (at-a-glance; other sections still present)  
- Change log complete  

Otherwise readiness is `Draft` or `Blocked`.

---

## Step control rules

1. Name build mode and mutating boundary at the start.  
2. No mutation before Pre-Build Review + hard gate pass.  
3. Execute Table C before relying on new tokens in the shell.  
4. Inventory Table D before drawing substitutes.  
5. Stop on the first blocking gate; do not partially publish a broken set as Ready for Test.  
6. Prefer repairing in-run only for defects you just introduced and can fix without API change.  
7. End with exactly one recommended next command.  

---

## Output format

### Build Summary

- Build mode  
- Component  
- Platform  
- Set name (`{Component} / {Platform}`)  
- Created or updated  
- Contract ID / version  
- Contract status before → after  
- Human approval evidence (quote or paraphrase)  
- Plan Package extras consumed: A / B / C / D / E (present or `None`)  
- Table C actions: created / aliased / bound / skipped  
- Table D nested rows satisfied: count  
- Readiness: `Draft` | `Ready for Test` | `Blocked`  
- Primary block reason (if Blocked): from catalog  
- Breaking changes: `None` or list  

### Built Configuration Snapshot

**At-a-glance view of what was built.** Required in every build report. Does **not** replace deeper sections below (C/D logs, compliance, contrast, etc.).

| Area | As built | Source | Notes |
|---|---|---|---|
| Set | `{Component} / {Platform}` | Prompt + contract | Created / Updated |
| Contract | `CC-*` version → status | Approval evidence | |
| Anatomy | Parts / optional parts | Plan A | |
| Variants | Axes actually built | §4 / Table B | No Theme / Language / Direction unless contracted |
| Nested | Instance targets + configs | Table D | Or `None` |
| Tokens / Styles | Key binds (summary) | §10 / Table C | Detail in Foundations |
| Theme | Light / Dark via modes | §8 | |
| RTL | Mechanism used | §8 | Same set; no EN/AR duplicate |
| Contrast | Critical pairs disposition | §9 | WCAG + APCA |
| Example follow-up | Shade/tint action or `None` | User example / set | |
| Readiness | `Draft` / `Ready for Test` / `Blocked` | Self-check | |

### Controls as Built

**Consumer configuration surface.** One row per Table B control. Does **not** replace Property API (as built).

| Control | Kind | Values / default | Wired to | Matches Table B? |
|---|---|---|---|---|

`Kind`: `variant axis` | `text prop` | `boolean prop` | `instance swap` | `other`.

Also list explicitly **Not built (by design)** when Theme / Language / Direction (or other) axes were correctly omitted.

### Pre-Build Review

| Area | Checked | Found (exact names) | Risk |
|---|---|---|---|

### Contract Intake

| Field | Value | Evidence |
|---|---|---|

### Plan Package Intake

| Extra | Present? | Rows / summary | Approval evidence | Build disposition |
|---|---|---|---|---|
| A Wireframe | | | | Consumed as anatomy |
| B Controls | | | | Consumed as API |
| C Variables/Styles solves | | | | Execute / `None` / Blocked |
| D Nested config matrix | | | | Execute / `None` / Blocked |
| E Blocking remedies | | | | Clear / Blocked |

### Table C Execution Log

| Gap ID | Item | Solve executed | Approval cited | Result | Notes |
|---|---|---|---|---|---|

If Table C was `None`, write one row: `None — no creates required`.

### Table D Execution Log

| Nested component | Required configs built | Parent control wired | Instance used | Status | Notes |
|---|---|---|---|---|---|

If Table D was `None`, write one row: `None — no nested deps`.

### Foundations

| Part / property | Assignment | Modes | Status | Source (section 10 / Table C) |
|---|---|---|---|---|

### FP-* Actions

| ID | Action | Result |
|---|---|---|

### Nested Dependencies

| Need | Used instance | Config applied | Status |
|---|---|---|---|

### Created or Updated Objects

| Object | Type | Purpose |
|---|---|---|

### Property API (as built)

| Property | Type | Values / default | Purpose | Matches Table B? |
|---|---|---|---|---|

### Variables and Styles Compliance

| Area | Expected | Observed | Status | Notes |
|---|---|---|---|---|

Status values only: `Verified convention`, `Unresolved policy`, `Mixed evidence`, `Not applicable`, `Blocked`.

### RTL Implementation

| Area | LTR | RTL | Mechanism |
|---|---|---|---|

### Directional Icon Decisions

| Icon | Mirror? | Reason |
|---|---|---|

### Mixed-Direction Decisions

| Content type | Direction | Handling |
|---|---|---|

### Accessibility Design Implemented

| §9 requirement | Implemented? | Evidence | Notes |
|---|---|---|---|

### Contrast Confirmation (WCAG + APCA)

| Pair (role / layer) | Theme | Foreground token | Background token | WCAG ratio | WCAG pass? | APCA Lc (signed) | \|Lc\| | APCA pass? | Disposition |
|---|---|---|---|---|---|---|---|---|---|---|

Disposition: `Pass both` | `WCAG only — APCA fail` | `APCA only — WCAG fail` | `Fail both` | `N/A (disabled/decorative per §9)`.

Any non-`Pass both` on a required pair blocks Ready for Test unless the approved contract explicitly defers that pair.

### Shade / Tint Follow-up

| Source example | Role | Example step used | Pass WCAG+APCA? | Action taken | Final token / step | Notes |
|---|---|---|---|---|---|---|

If no component-set example was supplied, write `None — no example-driven shade/tint follow-up`.

### Self-Check Matrix

| Scenario | Pass/Fail | Evidence |
|---|---|---|

### Contract Changes During Build

| Change | Reason | Version impact | Breaking | Approval |
|---|---|---|---|---|

### Change Log

| Step | Object | Action | Why |
|---|---|---|---|

### Remaining Findings

| Severity | Area | Issue | Next step |
|---|---|---|---|

Severity: `Critical` | `Major` | `Moderate` | `Minor` | `Info`.

### Recommended Next Command

Return exactly one:

- `/ds-test` — default when Ready for Test  
- `/ds-fix` — self-check found repairable defects  
- `/ds-plan` — contract or Tables C–D/E must change  
- `/ds-review` — foundation coverage unsafe or Table C stale vs live file  
- `/ds-foundation-architecture-review` — base structure unsafe  
- `/ds-document` — only when test is already green and docs are requested  

---

## Worked example: Button / Web

Use this as the **shape and depth** of a good build report. Names are **sample** — replace with live file + approved plan values.

**Mode:** New component build (mutating)  
**Prompt:**

```text
/ds-build
Build Button / Web from approved contract CC-BUTTON-WEB-001.
```

**Approval already in thread:**

```text
Approve CC-BUTTON-WEB-001 Ready to Build.
Also approve foundation proposals FP-001.
```

### Build Summary

- Build mode: New component build  
- Component: Button  
- Platform: Web  
- Set name: `Button / Web`  
- Created or updated: Created  
- Contract: `CC-BUTTON-WEB-001` v1.0 — Ready to Build → Built  
- Approval evidence: `Approve CC-BUTTON-WEB-001 Ready to Build. Also approve foundation proposals FP-001.`  
- Plan extras: A–E consumed (C: G-001/FP-001; D: Icon / Web; E: None)  
- Table C: 1 created, then bound  
- Table D: 1/1 nested rows satisfied  
- Readiness: `Ready for Test`  
- Breaking changes: `None`  

### Built Configuration Snapshot

| Area | As built | Source | Notes |
|---|---|---|---|
| Set | `Button / Web` | Prompt + contract | Created |
| Contract | `CC-BUTTON-WEB-001` v1.0 → Built | Human approval | Non-breaking |
| Anatomy | Root → Leading icon (opt) → Label → Trailing icon (opt) | Plan A | Direction-neutral AL |
| Variants | Size × Hierarchy × State | §4 / Table B | No Theme / Language / Direction axes |
| Nested | `Icon / Web` (leading/trailing) | Table D | Instance-swap, not flattened |
| Tokens / Styles | Primary bg/text/icon + focus ring; EN/AR Label Medium | §10 + Table C | `color/focus/ring` from FP-001 |
| Theme | Light / Dark via variable modes | §8 | Modes, not variants |
| RTL | Start/End + icon order flip | §8 | Same set; no EN/AR duplicate |
| Contrast | Primary label on primary fill | §9 | WCAG + APCA **Pass both** (Light & Dark) |
| Example follow-up | None | — | No set example supplied |
| Readiness | Ready for Test | Self-check | All required scenarios Pass |

### Controls as Built

| Control | Kind | Values / default | Wired to | Matches Table B? |
|---|---|---|---|---|
| Size | variant axis | `sm` / `md` / `lg` — default `md` | Component-set variants | Yes |
| Hierarchy | variant axis | `primary` / `secondary` / `tertiary` / `destructive` — default `primary` | Fill/text/icon token roles | Yes |
| State | variant axis | `default` / `hover` / `focus` / `pressed` / `disabled` — default `default` | State visuals + focus ring | Yes |
| Icon Show | boolean prop | `false` default | Leading / Trailing slot visibility | Yes |
| Icon Instance | instance-swap | Preferred: `Icon / Web` | Nested icon instances | Yes |
| Label | text prop | default `Button` | Label text node | Yes |

**Not built (by design):** Theme property, Language property, Direction on every variant.

### Pre-Build Review

| Area | Checked | Found (exact names) | Risk |
|---|---|---|---|
| Existing set | Yes | Draft `Button / Web` with 2 raw fills | Do not copy raw fills |
| Color vars | Yes | `color/bg/button/primary`, `…-hover`, `…-pressed`, text/icon roles | Pressed Dark previously partial — confirmed filled in plan |
| Focus var | Yes | Missing before; FP-001 approved | Create first |
| Text Styles | Yes | `Text/EN/Label/Medium`, `Text/AR/Label/Medium` | OK |
| Nested | Yes | `Icon / Web` | OK for Table D |
| RTL patterns | Yes | `Link / Web` Start/End AL | Reuse pattern |
| Contract frame | Yes | `CC-BUTTON-WEB-001` on Components / Web | Update after pass |

### Plan Package Intake

| Extra | Present? | Rows / summary | Approval evidence | Build disposition |
|---|---|---|---|---|
| A | Yes | Label + optional leading/trailing icon | CC approved | Anatomy matched |
| B | Yes | Size, Hierarchy, State, Icon Show, Icon Instance | CC approved | API matched |
| C | Yes | G-001 / FP-001 `color/focus/ring` | FP-001 approved | Created + bound |
| D | Yes | `Icon / Web` leading/trailing | CC approved | Nested + wired |
| E | None | — | — | Clear |

### Table C Execution Log

| Gap ID | Item | Solve executed | Approval cited | Result | Notes |
|---|---|---|---|---|---|
| G-001 / FP-001 | `color/focus/ring` | Created in `Color/Semantic`; Light/Dark aliases to focus primitives | `Also approve FP-001` | Created + bound on Focus stroke | Scopes: stroke |

### Table D Execution Log

| Nested component | Required configs built | Parent control wired | Instance used | Status | Notes |
|---|---|---|---|---|---|
| Icon / Web | size md; color by Hierarchy | `Icon Show`, `Icon Instance` | `Icon / Web` | Verified | Not flattened |

### Foundations (excerpt)

| Part / property | Assignment | Modes | Status | Source |
|---|---|---|---|---|
| Root fill Primary/Default | `color/bg/button/primary` | Light, Dark | Verified | §10 |
| Focus ring | `color/focus/ring` | Light, Dark | Verified | Table C G-001 |
| Label EN | `Text/EN/Label/Medium` | Desktop | Verified | §10 |
| Label AR | `Text/AR/Label/Medium` | Desktop | Verified | §10 |
| Padding / gap / radius | `spacing-md`, `spacing-sm`, `radius-md` | single | Verified | §10 |

### Property API (as built)

| Property | Type | Values / default | Purpose | Matches Table B? |
|---|---|---|---|---|
| Size | variant | sm / md / lg (md default) | Density | Yes |
| Hierarchy | variant | primary / secondary / tertiary / destructive | Visual weight | Yes |
| State | variant | default / hover / focus / pressed / disabled | Interaction | Yes |
| Icon Show | boolean | false default | Optional icons | Yes |
| Icon Instance | instance-swap | `Icon / Web` | Icon slot | Yes |
| Label | text | `Button` | Content | Yes |

### Variables and Styles Compliance (excerpt)

| Area | Expected | Observed | Status | Notes |
|---|---|---|---|---|
| Fills | Semantic button colors | Bound; no raw hex on production | Verified convention | Draft raw fills replaced |
| Focus | `color/focus/ring` | Bound on Focus | Verified convention | From FP-001 |
| Type | EN/AR Label Medium styles | Assigned; no local overrides | Verified convention | — |
| Theme | Modes not variants | No Theme property | Verified convention | — |

### RTL Implementation (excerpt)

| Area | LTR | RTL | Mechanism |
|---|---|---|---|
| Icon + label order | Leading → Label → Trailing | Trailing ← Label ← Leading | Direction-neutral AL + Start/End |
| Label style | `Text/EN/Label/Medium` | `Text/AR/Label/Medium` | Content + Text Style |
| Chevron (if used) | Points forward | Mirrored | Directional icon only |

### Accessibility Design Implemented (excerpt)

| §9 requirement | Implemented? | Evidence | Notes |
|---|---|---|---|
| Visible focus | Yes | Focus state + `color/focus/ring` | Web keyboard |
| Min target ~40px | Yes | Size md height | Per contract |
| Contrast WCAG + APCA | Yes | See contrast table | Both methods |

### Contrast Confirmation (WCAG + APCA) (excerpt)

| Pair | Theme | FG | BG | WCAG | Pass? | APCA Lc | \|Lc\| | APCA pass? | Disposition |
|---|---|---|---|---|---|---|---|---|---|
| Primary label on primary fill | Light | `color/text/button/primary` | `color/bg/button/primary` | 4.8:1 | Yes | 78 | 78 | Yes | Pass both |
| Primary label on primary fill | Dark | `color/text/button/primary` | `color/bg/button/primary` | 4.6:1 | Yes | −76 | 76 | Yes | Pass both |

### Shade / Tint Follow-up (excerpt)

`None — no example-driven shade/tint follow-up`  
*(If the user had pointed at a set example: follow that example’s passing semantic step, or move one tint/shade along the ramp until WCAG + APCA both pass.)*

### Self-Check Matrix (excerpt)

| Scenario | Pass/Fail | Evidence |
|---|---|---|
| EN LTR Light | Pass | primary/md/default + Light |
| EN LTR Dark | Pass | primary/md/default + Dark |
| AR RTL Light | Pass | AR label + Start/End AL |
| AR RTL Dark | Pass | Same + Dark |
| Long AR | Pass | `متابعة وإرسال الطلب للمراجعة` |
| Focus | Pass | focus state + `color/focus/ring` |
| WCAG + APCA contrast | Pass | See contrast table — Pass both |
| Table D integrity | Pass | `Icon / Web` still instance |
| Table B API | Pass | properties match plan |

### Change Log (excerpt)

| Step | Object | Action | Why |
|---|---|---|---|
| 1 | `color/focus/ring` | Created | Table C G-001 / FP-001 |
| 2 | `Button / Web` | Created set | New build |
| 3 | Production fills | Bound semantics | §10 |
| 4 | Label nodes | Assigned EN/AR Text Styles | §8 / §10 |
| 5 | Icon slots | Nested `Icon / Web` | Table D |
| 6 | Contract frame | Status → Built | Self-check passed |

### Remaining Findings

| Severity | Area | Issue | Next step |
|---|---|---|---|
| Info | Docs | Usage page not created | Optional `/ds-document` after `/ds-test` |

### Recommended Next Command

`/ds-test`

---

**How to use this example**

1. Keep the same section order in every real build report.  
2. Always fill **Built Configuration Snapshot** + **Controls as Built** right after Build Summary (at-a-glance; do not skip).  
3. Always fill Plan Package Intake + Table C/D Execution Logs (or explicit `None`).  
4. Swap sample names for **live** names from the file and the approved plan.  
5. If a cell has no proof, write `Unverified` / `Unknown` — do not guess.  
6. End with **one** next command only.  

---

## Appendix A — RTL reference

### Logical naming

Prefer: `Leading`, `Trailing`, `Start`, `End`, `Label`, `Helper`, `Error`, `Dismiss`.  
Avoid baking `Left` / `Right` into public API names unless the contract requires physical direction.

### Usually mirror (directional)

- Back / forward  
- Previous / next  
- Left / right arrows  
- Directional chevrons  
- Undo / redo when the glyph encodes direction  
- Enter / exit arrows when direction carries meaning  
- Calendar month navigation arrows  

### Usually do not mirror

- Brand logos  
- Checkmarks  
- Close / search / info / warning / success / error symbols  
- Plus / minus  
- Download / upload when meaning is vertical  
- Clocks, pins, photos, avatars, QR codes  
- Charts / data visualizations / media artwork  

Ambiguous icons: decide by semantic meaning and record in the report.

### Mixed-direction content

Surrounding UI may be RTL while the value stays LTR:

- Email, URL, phone  
- OTP / verification codes  
- Serial numbers, IDs, file paths, version numbers  
- Dates when product format is explicitly LTR  
- Numbers with Latin units  

Do not reverse character order. Isolate LTR content when needed. Keep Arabic labels, helpers, and errors in Arabic styles with RTL paragraph direction.

### Stress examples (use during self-check)

| Test | Example |
|---|---|
| Short AR | `حفظ` |
| Medium AR | `حفظ التغييرات` |
| Long AR | `متابعة وإرسال الطلب للمراجعة` |
| Helper AR | `يمكنك تعديل هذه المعلومات لاحقًا.` |
| Error AR | `هذا الحقل مطلوب. أدخل قيمة صحيحة.` |
| Mixed | `رقم الطلب هو BW-2026-1048` |
| Email | `hassan@example.com` |
| Phone | `+20 100 000 0000` |

Always re-check comparable English LTR after RTL work so LTR did not regress.
