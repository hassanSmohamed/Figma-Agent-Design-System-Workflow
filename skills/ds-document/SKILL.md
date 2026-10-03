---
name: ds-document
description: Creates or updates usage-focused documentation for one tested Figma component ({Component} / Web, Tablet, or Mobile) — or, in Foundations mode, for a foundation set — using live instances only, a remembered docs template, usage evidence, scoped Styles & Variables, complete variants, property capabilities with examples, separate Theme / Language / Direction columns, version history, and developer notes. Docs-only writes; hands off to Release QA. Do not use before Build QA passes (use /ds-test), to fix defects found while documenting (use /ds-fix), or for code-side developer handoff (use /ds-handoff).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Document

You are the design-system documentation lead. Produce one docs page per component × platform (or per foundation set) that a designer, tester, or front-end developer can use without asking questions. Explain what exists clearly and completely, without inventing behavior.

Docs writes only (+ state writes for the docs style record and ledger). Never edit the source component, foundations, or usage screens.

## When to use

- "Document {Component} / {Platform}." after Build QA passed (contract `Tested`).
- "Mode: Foundations. Document the {Color | Typography | Spacing | Elevation} foundations."
- Updating a docs page after a new contract version.

## When not to use

- Contract not yet `Tested` → `/ds-test` (Build QA) first.
- Defects found while documenting → record them and recommend `/ds-fix`.
- Token export and code prop mapping for developers → `/ds-handoff`.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-document"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check (C1, C3, C4, C6, C7, C8); record it. Save a checkpoint before the first docs write ([figma-tooling](../../standards/figma-tooling.md) §3).
3. Open the state store ([workflow-state](../../standards/workflow-state.md)).

## References

[lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [workflow-state](../../standards/workflow-state.md) · [figma-tooling](../../standards/figma-tooling.md) · [language-direction](../../standards/language-direction.md) · [accessibility](../../standards/accessibility.md) · [platforms](../../standards/platforms.md) · [foundation-profile](../../standards/foundation-profile.md) · [reporting](../../standards/reporting.md) · [component catalog](../../catalog/components.md)

## Instructions

### Modes

| Mode | Gate | Placement |
|---|---|---|
| **Component** (default) | Contract state `Tested` or later (Build QA passed). Earlier → `Blocked: run /ds-test (Build QA) first` | `Docs / Components / {Component} / {Platform}` (or the file's convention) |
| **Foundations** | Profile present | `Docs / Foundations / {Set}` |

### 1. Intake

1. Read Profile, contract record, ledger, latest test report (same version). State store wins over chat.
2. **Docs template** — read the docs style record (`docs-style.md`, or `_DS Docs Style` in-file). If a template is recorded, reuse it and say so. If not, **stop and ask**:

   ```text
   Which documentation style should I use as the template?
   - The name of an existing docs page or frame in this file
   - Or a short description (layout, detail level, how examples look)
   I will save your choice and reuse it next time.
   ```

   Save the answer to the docs style record (state write).
3. **Usage evidence** (Component mode) — ask for 2–6 screens (platform, flow, screen, instance, common/edge/error/empty/success), or accept `Skip usage screens` (Composition then says `Usage evidence pending`). Never edit those screens.

### 2. Follow the rules

1. Live source instances only; never detach; never redraw a fake.
2. Update in place; one page per component × platform.
3. Exact property names and values from Table B; exact semantic names; no primitives as guidance.
4. **Theme, Language, Direction are separate columns** in every example table and matrix (never one "EN LTR / AR RTL" cell).
5. Fonts and Text Style names come from the Profile, not memory.
6. Design evidence vs `Implementation requirement` (runtime) kept apart.
7. Callouts sit beside the example in the section that owns the fact.
8. Each fact lives in one section; others link to it.
9. A defect found while documenting → record it under Edge cases and Status, recommend `/ds-fix`; do not repair.

### 3. Write the component sections (in order)

| # | Section | Owns |
|---|---|---|
| 1 | **Overview** | Purpose, platform, support flags (`Theme: Light, Dark` · `Language: EN, AR` · `Direction: LTR, RTL`), contract ID + version, hero instance, sibling links |
| 2 | **Styles & Variables** | Per part: role, exact variable / Text Style / Effect Style, mode notes; 1–3 contextual mini-layouts with callouts. Links to Foundations, never redefines them |
| 3 | **Anatomy** | Numbered parts on a live instance; required/optional; private helpers named |
| 4 | **Variants** | Every contracted value at least once; invalid combinations labeled restricted |
| 5 | **Behavior & interaction** | State meaning, pointer/touch/keyboard, focus, loading/disabled, motion; **Language** notes; **Direction** notes (every helper the consumer sets per instance, what mirrors; Table and Calendar add an RTL starter instance — [language-direction](../../standards/language-direction.md) §3); design a11y (contrast pairs with WCAG + APCA results, targets) |
| 6 | **Detail specs** | Property capabilities (below), sizing, targets, nested dependencies |
| 7 | **Usage** | Use for / Don't use for + alternatives |
| 8 | **Composition** | Product-like layouts with neighbors and spacing, or `Usage evidence pending` |
| 9 | **Edge cases** | Long EN, long AR, diacritics, mixed-direction values, empty/error/overflow, known defects |
| 10 | **Developer notes** | Code prop mapping (contract §13 if present), token code syntax names, APG runtime pattern, keyboard and ARIA as `Implementation requirement`; focusable components add "Sticky headers, toasts and overlays must not hide the focused component (WCAG 2.4.11)" |
| 11 | **Version & changes** | Contract version history from the contract record; what changed per version; migration notes for majors |
| 12 | **Status** | Docs status, open gaps, one next step |

#### Property capabilities (in Detail specs)

For every public property in Table B:

| Property | Kind | What it can do | Every value (default marked) | When it applies | What it cannot do | Example |
|---|---|---|---|---|---|---|

Examples: variant axis → caption pointing at the live example in Variants; boolean → off + on; text → default + long EN + long AR; instance swap → default + allowed swaps (or default + 2 and the swap rule). A property without an example = incomplete.

#### Example matrix columns

`| Example | Theme | Language | Direction | Platform / viewport | Notes |`

### Foundations sections (Foundations mode)

Overview → Inventory (exact names, modes) → Semantics & roles → Usage with components (links to component pages) → Do / Don't → Contrast pairs (for color) or Arabic rules (for typography) → Version & changes → Status.

### 4. Set the docs status label (page only — the contract state is separate)

| Label | Meaning |
|---|---|
| `Draft` | Sections or evidence incomplete |
| `Ready for Release QA` | All sections complete; awaiting `/ds-test` Release QA |
| `Needs fixes` | A Critical/Major defect is recorded |
| `Deprecated` | Replacement exists (set by `/ds-release`) |

The contract becomes `Documented` only when Release QA passes.

## Examples

Input:

```text
/ds-document
Document Button / Web.
```

with a recorded docs style and `Skip usage screens`.

Expected output (summary): page `Docs / Components / Button / Web` with 12 sections; every Table B property (Hierarchy, Size, State, Label, Leading / Trailing icon, Direction) has a capability line and an example; example matrix with separate Theme, Language, Direction columns; Composition says `Usage evidence pending`; docs label `Ready for Release QA`; next step `/ds-test` (Release QA).

## Common edge cases

- **Contract earlier than `Tested`** → `Blocked: run /ds-test (Build QA) first`.
- **No docs style recorded** → stop and ask the template question; save the answer.
- **User skips usage screens** → Composition says `Usage evidence pending`.
- **Table B and the live set disagree** → report under Contract drift; document the contract, recommend `/ds-fix` or `/ds-plan`.
- **Defect found** → record under Edge cases and Status (`Needs fixes`); never repair.

## Output

Standard level ([reporting](../../standards/reporting.md)):

1. **Report header** (template used, usage evidence: provided / skipped)
2. **Documentation Result** — page path, docs status label, sections created/updated
3. **Coverage checklist** — `| Item | Done? | Notes |` (12 sections, every Table B property has an example, every contracted value shown, Theme/Language/Direction columns, Developer notes, Version & changes)
4. **Contract drift** — `None` or differences found
5. **Known gaps** — with owner skill
6. **Next step** — `/ds-test` (Release QA) · `/ds-fix` · answer template/usage question

## Completion gate

- Contract `Tested`+ (Component mode); template recorded and followed; usage evidence handled
- All 12 sections present (or explicit `pending`); every property has a capability line and example
- Theme, Language, Direction shown as separate columns; fonts from the Profile
- Live instances only; source, foundations, and screens unchanged
- Docs style record and ledger updated; one next step
