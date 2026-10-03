---
name: ds-foundation-generate
description: Generates Figma Variables and Styles foundations by adapting an open-source design-system structure (Material 3, Primer, Carbon, Atlassian, Paste, Lightning, Ant, Cloudscape, Custom) to the user's brand colors and typefaces, with deterministic ramps, required semantic roles, scopes, code syntax, Arabic Text Style rules, a WCAG + APCA smoke check, and a written Foundation Profile. Use when bootstrapping or extending a design-system file before component work. Do not use for one or two approved additions (use /ds-foundation-extend), for reviewing existing foundations (use /ds-foundation-architecture-review), or for building components.
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill. Works in a source library file only.
disable-model-invocation: true
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Foundation Generate

You are a principal design-system architect and Figma Variables/Styles builder. Create (or extend) the file's **Variables** and **Styles** from one chosen open-system structure plus the user's brand seeds, then write the **Foundation Profile** that every other skill reads.

> Which structure fits, how do brand seeds map into it, and exactly which Variables/Styles should exist?

Mutating (foundation write), only after `Approve FG-… vN Ready to Generate`.

## When to use

- "Generate foundations for {Brand} using {Primer | Material 3 | …}."
- A new or empty design-system file before any component work.
- Extending an existing file with a whole structure layer (additive only).

## When not to use

- A few approved `FP-*` additions → `/ds-foundation-extend`.
- Judging existing foundations → `/ds-foundation-architecture-review`.
- Building components → `/ds-review` → `/ds-plan` → `/ds-build`.
- Consumer (non-library) files → stop; generate only in the source library.

New file order: `/ds-foundation-generate` → `/ds-foundation-architecture-review` (Post-generate check) → `/ds-review` per component.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-foundation-generate"` ([figma-tooling](../../standards/figma-tooling.md) §5). This package's blueprint and gates decide **what** to create; `figma-generate-library` may only guide **how**.
2. Capability check passes C1, C2, C6, C7, C8, C9. Otherwise `Blocked: write tools unavailable`.
3. Choose the state store mode ([workflow-state](../../standards/workflow-state.md) §1).

## References

[lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [foundation-profile](../../standards/foundation-profile.md) · [naming](../../standards/naming.md) · [foundation-mutation](../../standards/foundation-mutation.md) · [figma-tooling](../../standards/figma-tooling.md) · [workflow-state](../../standards/workflow-state.md) · [language-direction](../../standards/language-direction.md) · [accessibility](../../standards/accessibility.md) · [reporting](../../standards/reporting.md)

Skill files: [structure catalog](references/structure-catalog.md) · [generation defaults](references/defaults.md) · scripts: [contrast-pairs](../../scripts/figma/contrast-pairs.js), [text-style-audit](../../scripts/figma/text-style-audit.js)

## Instructions

### Figma rules (non-negotiable)

| Use | When |
|---|---|
| **Variables** | Single values (color, number, string, boolean); aliases; modes (theme, viewport, density, brand); scopes; code syntax |
| **Text Styles** | Typography composites; properties bound to variables where possible. Text Styles have **no modes** |
| **Effect Styles** | Shadows / blurs (multi-layer needs a style; color/offset/blur can bind to variables) |
| **Paint Styles** | Gradients, image fills, multi-paint stacks only — never a simple solid that a variable covers |
| **Layout Guide Styles** | Reusable grids, only when requested or required by the structure |

Architecture: `Primitives (hidden) → Semantic roles → Component tokens only if the Profile allows them`. One axis per collection. Never `Theme × Language × Direction` in a mode name.

### Hard gates

1. No mutation before the exact approval `Approve FG-{BRAND}-{STRUCTURE}-{NNN} v{N} Ready to Generate`, typed this turn or stored with approver and date ([lifecycle-and-ids](../../standards/lifecycle-and-ids.md) §4–5). A blueprint edit bumps `v` and cancels the approval.
2. Existing local foundations → stop and offer **Extend**, **Replace** (needs `Confirm Replace Foundations` + checkpoint), or **Abort**.
3. Foundations only — never component sets.

### Required inputs (ask only for what is missing)

| Input | Required | Default / notes |
|---|---|---|
| Brand / product name | Yes | Used in IDs and descriptions |
| Structure choice | Yes | From the [catalog](references/structure-catalog.md) |
| Brand primary color | Yes | Hex |
| Secondary / accent, neutral base, feedback colors | No | Derived by [defaults](references/defaults.md) §1 |
| Typeface — Latin | Yes | Must be available in Figma |
| Typeface — Arabic (or other enabled locale) | If AR enabled | Arabic-capable family + fallback |
| Themes | Yes | Light + Dark |
| Web viewport typography (`Large / Medium / Small`) | No | Ask; creates a `Viewport` collection |
| Density modes | No | Separate collection only |
| Token layers | Yes | `semantic-only` (default) or `semantic+component` with a component list |
| Naming | No | Package grammar ([naming](../../standards/naming.md)) or the structure's native names |
| Locale packs | No | EN + AR; numerals policy for AR (`western` / `arabic-indic` / `open-question`) |

### Steps

1. **Context check.** Record file name, library vs consumer, existing collections (names, modes, counts), existing Text/Paint/Effect/Layout styles, enabled remote libraries, and the **modes-per-collection limit** (C9). If the plan limit is lower than the modes the user wants, propose fewer modes before drafting.
2. **Collect** brand seeds, locales, and token-layer policy.
3. **Present the structure catalog**; the user chooses.
4. **Draft the Foundation Blueprint** `FG-{BRAND}-{STRUCTURE}-{NNN} v{N}`. It must contain:
   - **A. Structure decision** — chosen system, why it fits (1–3 bullets), collections + modes diagram, token-layer policy.
   - **B. Method** — every default used from [defaults](references/defaults.md) (ramp method, anchor step, scales, line heights, Arabic size adjust) and every deviation.
   - **C. Brand remap** — seed → primitive targets → semantic roles.
   - **D. Variables table (executable)** — `| ID | Collection | Name | Type | Values per mode | Alias of | Scopes | Hidden | Code syntax (WEB) | Description |`. Primitives: `Hidden = Yes`, scopes `[]`. Semantic: exact scopes, alias per mode, every mode filled. Every [required role](references/defaults.md) present.
   - **E. Styles table (executable)** — `| ID | Style type | Name | Variable bindings | Raw leftovers | Language |`. EN and AR Text Styles are separate names. Arabic styles follow [language-direction](../../standards/language-direction.md) §4 (letter spacing 0, no case transform, line height ≥ 1.5).
   - **F. Risks and non-goals** — fonts not installed, expected contrast moves, what is not created (components, publishing).
   - **G. Approval line** — `Reply: Approve FG-… v1 Ready to Generate`.
5. **Stop for approval** (exact phrase with version).
6. **Checkpoint.**
7. **Create Variables, then Styles**, following [foundation-mutation](../../standards/foundation-mutation.md) exactly: collections + modes → primitives (hidden, no scopes) → semantic aliases (scopes, all modes) → descriptions + code syntax → typography variables → Text Styles bound to variables → Effect Styles → Paint/Layout styles only if needed. Work in small `use_figma` calls (one collection or style group per call), return the created IDs from each, and log every item with a rollback action.
8. **Smoke check:**

| Check | How | Pass when |
|---|---|---|
| Alias direction | Read aliases | Semantic → primitive only; no raw values in Semantic |
| Mode completeness | Read values per mode | No empty mode values |
| Contrast | [contrast-pairs](../../scripts/figma/contrast-pairs.js) on the role pairs from [defaults](references/defaults.md) §5 (text on surfaces, on-brand on brand, border/strong and focus on surfaces, feedback text on feedback bg) in Light and Dark | WCAG and APCA both pass per [accessibility](../../standards/accessibility.md) §4; failures moved along the ramp and logged |
| Arabic styles | `auditArabicStyles` in [text-style-audit](../../scripts/figma/text-style-audit.js) | No TXT-006/007/008 findings |
| Fonts | Text Styles resolve | Chosen fonts load |
| Axes | Mode names | No combined axes |

9. **Write** the Profile record (all fields of [foundation-profile](../../standards/foundation-profile.md)), update the ledger and the registry, then report.

### Extend path (when foundations exist)

Diff the blueprint against the file before approval. Extend is **additive only**; renames or deletions are migrations (`MIG-*`).

| Situation | Rule |
|---|---|
| Same name, same type, same values | Skip (reuse) |
| Same name, different value | **Conflict** — list it; never overwrite without an `FP-*` + approval |
| Same role, different name | Propose reuse; do not create a parallel token |
| Missing mode in an existing collection | Propose adding the mode (check plan limit) |
| New name in an existing collection | Additive create |

### Never, unless explicitly requested

Publishing/unpublishing; deleting foundations (Replace needs `Confirm Replace Foundations`); editing components; renaming remote assets; copying competitor values.

## Examples

Input:

```text
/ds-foundation-generate
Brand: Acme. Structure: Primer. Primary #0B5FFF. Latin: Inter. Arabic: IBM Plex Sans Arabic. Light + Dark.
```

Expected output (summary): blueprint `FG-ACME-PRIMER-001 v1` with collections `Primitives` (Value), `Semantic` (Light, Dark), `Typography`; Primer role groups `success/*`, `attention/*`, `danger/*`, `done/*`; the line `Reply: Approve FG-ACME-PRIMER-001 v1 Ready to Generate`. Nothing is created until that phrase is typed.

## Common edge cases

- **Foundations already exist** → stop and offer Extend / Replace / Abort.
- **Plan allows fewer modes than asked** → propose fewer modes in the blueprint; never create a partial mode set.
- **Font not installed** → list under Risks; ask for a fallback before approval.
- **Contrast fails at the anchor step** → move along the ramp, log the move; never weaken thresholds.
- **Code cannot run** (C5 no) → do the smoke checks by hand and mark numbers `Unverified`.
- **A `use_figma` call fails midway** → stop, read what was created, and resume from the change log ([figma-tooling](../../standards/figma-tooling.md) §5 rule 6).

## Output

Standard level ([reporting](../../standards/reporting.md)):

```markdown
# Foundation Generate Report — FG-… v…
(Report header)

## Summary
- Structure · token layers · status: Draft | Approved | Generated | Blocked
- Seeds used and what was derived

## Collections created
| Collection | Modes | Variables | Hidden from publishing |

## Styles created
| Type | Count | Prefix |

## Contrast smoke check
| Pair | Mode | FG hex | BG hex | WCAG | APCA Lc (signed) | Disposition | Step moved? |

## Change log
| Step | Object | Action | ID | Rollback |

## Created names (appendix)
Full list of every variable and style name created.

## Profile
FPR-… v1 written to the Profile record.

## Next step
`/ds-foundation-architecture-review` (mode: Post-generate check)
```

## Completion gate

- Capability check and plan limits recorded
- Exact versioned approval quoted
- Checkpoint saved
- Every required role exists in every mode
- Primitives hidden and unscoped; semantic scopes exact; descriptions and code syntax set
- Arabic Text Styles pass the Arabic rules
- Contrast smoke check done (or marked `Unverified` with reason)
- Profile, ledger, registry written
- Report lists exact created names, IDs, and rollback actions
