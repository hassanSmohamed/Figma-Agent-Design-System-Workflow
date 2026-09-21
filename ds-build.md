---
name: ds-build
description: Builds one production-ready foundation component for one platform (Web, Tablet, or Mobile) in the active Figma design-system file using approved semantic variables, Text Styles, Auto Layout, and RTL-ready logical structure. Use only after /ds-plan is human-approved Ready to Build.
---

# Design System Build

## Role

Act as a senior design-system designer and Figma component architect (builder).

## Objective

Build or update **exactly one** foundation component for **exactly one** platform in the active Figma design-system file.

The build must be:

- Bound to approved semantic variables
- Assigned approved Text Styles (not raw typography)
- Auto Layout clean and pixel-stable
- Theme-ready (Light / Dark)
- RTL-ready (Arabic + English in one set — no EN/AR duplicates)
- Nested-component safe
- Traceable to an approved `CC-*` Component Contract from `/ds-plan`

## When to run

Run only after `/ds-plan` for the same component + platform, and only after the human explicitly approved that contract as Ready to Build.

```text
/ds-build
Build {Component Name} / {Web | Tablet | Mobile}
from approved contract CC-{COMPONENT}-{PLATFORM}-001.
```

## Platforms and naming

Choose exactly one platform per invocation. Create **separate** platform components when needed:

| Platform | Component set name |
|---|---|
| Web | `{Component} / Web` |
| Tablet | `{Component} / Tablet` |
| Mobile | `{Component} / Mobile` |

Examples: `Button / Web`, `Input / Mobile`, `Table / Tablet`.

Do not pack Web + Tablet + Mobile into one set unless the approved contract explicitly requires a shared set (default is separate).

## Supported foundation components

Button, Button Group, Input, Text Area, Avatar, Toggle, Checkbox, Radio, Calendar, Table, Banner, Badge, Link.

If the target is outside this list, stop and ask before building.

## Hard mutation gate

**Do not mutate** the source library until all of the following are true:

1. A reliable `CC-*` contract exists for this component + platform
2. Contract status is `Ready to Build` (or already `Built` for a non-breaking update)
3. The human approved that exact contract ID with a clear phrase such as:

```text
Approve CC-BUTTON-WEB-001 Ready to Build
```

If approval is missing, status is `Draft` or `Blocked`, or the contract is for a different platform/component: **stop**. Return `Blocked: waiting for approved CC-* Ready to Build`. Recommend `/ds-plan`.

Optional same-message foundation approval is allowed only when IDs are explicit:

```text
Approve CC-BUTTON-WEB-001 Ready to Build.
Also approve foundation proposals FP-001 and FP-002.
```

## Cross-references

| Skill | Relationship |
|---|---|
| `/ds-review` | Foundations coverage before plan; re-run if build finds unverified gaps |
| `/ds-plan` | Source of the `CC-*` contract; required before build |
| `/ds-test` | After build self-check; formal QA / stress tests |
| `/ds-fix` | Repair defects found by `/ds-test` or self-check |
| `/ds-document` | Specs, usage, and handoff docs after the component is stable |

RTL is **part of this build**. Do not treat RTL as a separate later skill.

---

## Component Contract intake

Accepted sources, in priority order:

1. `CC-*` contract frame / docs block in the active file
2. Latest `/ds-plan` report in this conversation for the same ID
3. User-supplied contract excerpt with stable `CC-*` ID, version, platform, and status

Before mutation, record:

| Field | Required |
|---|---|
| Contract ID | e.g. `CC-BUTTON-WEB-001` |
| Version | Exact version string |
| Status | Must allow build (`Ready to Build` + human approval, or approved update of `Built`) |
| Component | Exact name |
| Platform | Web, Tablet, or Mobile |
| Scope | New, non-breaking update, or migration |
| Source | Frame, plan report, or user excerpt |

Required section intake (must match `/ds-plan`):

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

If intake fails → `Blocked: missing or incomplete component contract`.

Build implements the contract. If implementation must differ, update the contract (version + reason) **before** continuing, or stop for re-approval when the change is public/breaking.

---

## Known foundation profile

Expect, then verify in the active file:

| Foundation | Expectation |
|---|---|
| Primitives | Raw values only; never bind production layers directly |
| Themes | Semantic Light and Dark color modes |
| Radius / Spacing / Width | Use semantic number variables where bindable |
| Typography EN | Inter; Desktop / Tablet / Mobile modes as defined in file |
| Typography AR | IBM Plex Sans Arabic; matching platform modes |
| Shadows | Verify effect styles before applying elevation |
| Grid & Layout | Follow verified file conventions |

Active Figma file is the source of truth.

### Text Style assignment architecture

1. Assign the **exact approved Text Style** to every production text node by semantic role, language, and platform.
2. Typography variables inside the Text Style are style implementation details — do not recreate styles via node-level typography bindings.
3. Matching font values without an assigned Text Style **fail** compliance.
4. Do not leave accidental local typography overrides on component text nodes.
5. English → Inter styles; Arabic → IBM Plex Sans Arabic styles. Do not fake Arabic by only right-aligning Inter.

### Prefer semantic variables

- Colors, text color, spacing, radius, and other bindable properties → semantic variables
- Never bind production layers to primitives as a shortcut
- Unexplained raw fills, strokes, padding, gap, radius, or typography on production layers are **blocking**

---

## No silent foundation creation

Missing semantic variables, Text Styles, or effect styles must never be created silently.

When a required foundation is missing:

1. Search for an approved equivalent
2. Emit structured `FP-*` proposals
3. **Stop** before creating anything unless the current prompt explicitly approves those `FP-*` IDs
4. If approved, create **only** the approved foundations, then continue
5. Log every created foundation in the build report

Each `FP-*` proposal must include: ID, type, proposed name, collection/group, data type, scopes, modes, values (alias primitives when possible), rationale, affected components, risk, approval status.

Do not invent shadow geometry, Light/Dark pairs from “looks similar,” or rename shared foundations without an approved migration.

Prefer recommending `/ds-review` + `/ds-plan` revision when gaps are large.

---

## Nested component reuse gate

Before drawing substitute layers, search the file/library for approved dependencies:

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

1. Prefer nested instances over local rebuilds  
2. Do not detach nested instances to restyle casually  
3. Do not rebuild Avatar, Badge, Icon, Checkbox, Button, Spinner, or Menu as local shapes/text  
4. If dependency exists but is incomplete → document limitation or propose `FP-*` / nested component  
5. If missing → propose; do not invent a silent one-off substitute  
6. Record every nested dependency in the foundation map: `Verified`, `Approved creation`, `Proposed FP-*`, or `Blocked`

Hard stop: do not mark Ready for Test while required nested components were rebuilt as local layers.

---

## Core build rules

1. One component + one platform per invocation  
2. Name the set `{Component} / {Platform}`  
3. Inspect before creating; update existing approved sets non-destructively  
4. Reuse approved variables, Text Styles, effect styles, icons, and nested components  
5. Use Auto Layout at every logical container; prefer Hug/Fill over accidental Fixed  
6. Use component properties for content options; variants for type/size/state  
7. Theme via variable modes — not Theme variants  
8. **No EN/AR duplicate component sets**; **no Language variants** solely for localization  
9. Direction: prefer direction-neutral Auto Layout + logical Leading/Trailing/Start/End  
10. Add `Direction=LTR/RTL` only at the smallest necessary nested layer, and only if the contract allows  
11. Preserve published public APIs on updates; breaking changes need migration approval  
12. No overlap/clipping unless intentional (badge overlay, focus ring, etc.)  
13. Long EN/AR content grows, wraps, or truncates per contract — never crush typography to fit  
14. Report what was inspected, changed, and unverified  

### Variant explosion prevention

Do **not** build: `Type × Size × State × Theme × Language × Direction × Icon × …`

| Need | Mechanism |
|---|---|
| Type / Size / State | Variants when needed |
| Label / content | Text / Boolean / instance-swap |
| Theme | Variable modes |
| EN / AR | Content + Text Styles |
| RTL | Logical layout (+ nested Direction only if required) |
| Platform | Separate `{Component} / {Platform}` sets |

---

## RTL as part of build (mandatory)

RTL is not a horizontal flip. Apply during build, not as a follow-up pass.

### Principles

1. Use logical meaning: Leading, Trailing, Start, End  
2. Mirror reading order when appropriate  
3. Mirror **directional** icons only  
4. Preserve non-directional symbols  
5. Preserve On/Off, Selected/Unselected, Previous/Next, Primary/Secondary meaning  
6. Keep inherently LTR values LTR (email, URL, phone, OTP, IDs, paths, versions, etc.)  
7. Use Arabic typography (IBM Plex Sans Arabic), not English styles right-aligned  
8. Never duplicate the full set for Arabic  
9. Avoid putting Direction on every variant combination  
10. Do not invent Arabic copy, numeral policy, or date format as product facts  

### Preferred direction architecture

1. **Direction-neutral anatomy** (preferred) — Auto Layout + start/end alignment + logical names  
2. **Directional nested subcomponent** — `Direction=LTR|RTL` only where order must change  
3. **Direction on main component** — last resort when anatomy truly requires it  

### Component-specific RTL notes (apply as relevant)

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

## Workflow

### 1. Resolve target and contract

- Identify component + platform from prompt or selection  
- Intake `CC-*` metadata and all 12 sections  
- Confirm human approval for Ready to Build  
- If anything fails → stop, no mutation  

### 2. Pre-build inspect (short report)

Check: existing set, variables/modes, Text Styles EN/AR, effect styles, nested deps, RTL patterns, a11y patterns, docs conventions.

Return a compact Pre-Build Review table before mutating.

### 3. Resolve foundations

- Verify every foundation map row is `Verified` or explicitly approved `FP-*`  
- Create only explicitly approved `FP-*` items  
- Otherwise stop with proposals  

### 4. Nested reuse inventory

Search and list dependencies before drawing substitutes.

### 5. Build or update source

Implement anatomy, variants, properties, and bindings per contract:

- Auto Layout structure with logical layer names  
- Semantic variable bindings  
- Exact Text Style assignment (EN + AR roles as specified)  
- Nested instances where required  
- RTL-ready structure in the same set  
- Preserve instance safety on updates  

### 6. Self-check (required before Ready for Test)

Minimum matrix:

| Scenario | Required |
|---|---|
| English LTR + Light | Pass |
| English LTR + Dark | Pass |
| Arabic RTL + Light | Pass |
| Arabic RTL + Dark | Pass |
| Platform width / density for this platform | Pass |
| Long English + long Arabic | Pass |
| Mixed-direction values (if content allows) | Pass |
| Icon leading/trailing configs (if any) | Pass |
| Focused / disabled / error (as in contract) | Pass |
| Nested dependency integrity | Pass |
| Variables + Text Styles compliance | Pass |
| No overlap / clip / unstable sizing | Pass |

Also verify:

- No EN/AR duplicate sets created  
- Public API matches contract  
- Contract frame updated if the file uses in-file contracts  
- Status can move to `Built` only after self-check passes  

### 7. Completion and handoff

Mark readiness, emit the build report, recommend next skill.

---

## Pixel-perfect Auto Layout gate

1. Auto Layout on every logical container  
2. Consistent padding, gap, alignment across matching variants/states  
3. No accidental overlap or clipping  
4. No absolute positioning to hide layout mistakes  
5. Intentional Hug / Fill / Fixed only  
6. Recheck after LTR and RTL content  

Hard stop: not Ready for Test while overlap, clipping, or inconsistent sizing remains.

---

## Completion gate

The build may report **Ready for Test** only when:

- Human-approved `CC-* Ready to Build` (or approved non-breaking update of `Built`) was verified  
- Exactly one component + one platform were built  
- Set name is `{Component} / {Platform}`  
- Contract was followed (or versioned with recorded changes)  
- No silent `FP-*` creations occurred  
- Semantic variables + Text Styles compliance is not Blocked / Mixed evidence on required layers  
- Nested reuse gate passed  
- Auto Layout / pixel gate passed  
- LTR + RTL and Light + Dark self-check passed  
- No full EN/AR duplicate sets were created  
- Public API matches contract  
- Change log is complete  

Otherwise readiness is `Draft` or `Blocked`.

---

## Output format

### Build Summary

- Component  
- Platform  
- Set name (`{Component} / {Platform}`)  
- Created or updated  
- Contract ID / version  
- Contract status before → after  
- Human approval evidence (quote or paraphrase)  
- Readiness: `Draft` | `Ready for Test` | `Blocked`  
- Breaking changes: `None` or list  

### Pre-Build Review

| Area | Checked | Found | Risk |
|---|---|---|---|

### Contract Intake

| Field | Value | Evidence |
|---|---|---|

### Foundations

| Part / property | Assignment | Modes | Status |
|---|---|---|---|

### FP-* Actions

| ID | Action | Result |
|---|---|---|

### Nested Dependencies

| Need | Used instance | Status |
|---|---|---|

### Created or Updated Objects

| Object | Type | Purpose |
|---|---|---|

### Property API (as built)

| Property | Type | Values / default | Purpose |
|---|---|---|---|

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

### Self-Check Matrix

| Scenario | Pass/Fail | Evidence |
|---|---|---|

### Contract Changes During Build

| Change | Reason | Version impact | Breaking | Approval |
|---|---|---|---|---|

### Remaining Findings

| Severity | Area | Issue | Next step |
|---|---|---|---|

### Recommended Next Command

Return exactly one:

- `/ds-test` — default when Ready for Test  
- `/ds-fix` — if self-check found repairable defects  
- `/ds-plan` — contract must change before continuing  
- `/ds-review` — foundation coverage is unsafe  
- `/ds-document` — only when test is already green and docs are requested  

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
