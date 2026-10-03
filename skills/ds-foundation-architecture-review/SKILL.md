---
name: ds-foundation-architecture-review
description: Read-only expert review of the Variables and Styles architecture in the active Figma design-system file — collections, token layers, aliases, modes, scopes, naming, publication, Text Style-to-variable bindings, paint/effect/layout styles, governance, and optional DTCG interoperability. Includes a fast Post-generate check and a Profile draft mode for files made outside the package. Use before component work or when foundations look unhealthy. Do not use to review a single component (use /ds-review) or to change foundations (use /ds-foundation-extend or /ds-foundation-generate).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Foundation Architecture Review

You are a principal design-system architect, design-token specialist, and Figma library governance reviewer.

> Is the foundation structure healthy, and will it keep working as the system grows across themes, platforms, languages, products, and code?

Read-only: no source, foundation, or docs writes. State writes (ledger, Profile draft) are allowed and reported.

## When to use

- Right after `/ds-foundation-generate` (mode **Post-generate check**).
- "Review our Variables and Styles" before component work, or when foundations look unhealthy.
- A file made outside this package needs a Foundation Profile (mode **Profile draft**).
- A proposed new collection, mode, group, or style (mode **Change review**).

## When not to use

- Reviewing one component's readiness → `/ds-review`.
- Creating or changing foundations → `/ds-foundation-generate` or `/ds-foundation-extend`.
- Exporting tokens for developers → `/ds-handoff`.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-foundation-architecture-review"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check (C1, C3, C4, C5); record it.
3. Open the state store ([workflow-state](../../standards/workflow-state.md)) and read the Profile if present.

## References

[findings](../../standards/findings.md) · [foundation-profile](../../standards/foundation-profile.md) · [naming](../../standards/naming.md) · [figma-tooling](../../standards/figma-tooling.md) · [workflow-state](../../standards/workflow-state.md) · [language-direction](../../standards/language-direction.md) · [accessibility](../../standards/accessibility.md) · [reporting](../../standards/reporting.md)

Skill files: [worked example](references/worked-example.md) · scripts: [contrast-pairs](../../scripts/figma/contrast-pairs.js), [text-style-audit](../../scripts/figma/text-style-audit.js)

## Instructions

### Modes (one per run)

| Mode | Scope | Typical length |
|---|---|---|
| **Post-generate check** | Right after `/ds-foundation-generate`: alias direction, mode completeness, scopes, hidden primitives, required roles, Text Style bindings, Arabic rules, Profile matches file | Short |
| **Full architecture review** | Everything below | Long |
| **Variables-only** | Steps 3–10 | Medium |
| **Styles-only** | Steps 11–15 | Medium |
| **Change review** | A new/changed collection, mode, group, or style | Short |
| **Interoperability review** | Step 19 (DTCG 2025.10 / Style Dictionary readiness) — only when requested | Medium |
| **Profile draft** | Infer a Foundation Profile from an existing file; human confirms before it is written as `v1` | Medium |

### Evidence hierarchy

1. The live file and its verified behavior
2. The Foundation Profile and approved organizational conventions
3. Figma-native capabilities (Variables, Styles, modes, scopes, aliases, publishing)
4. Product needs (platforms, themes, brands, locales)
5. DTCG 2025.10 concepts — only when interoperability is in scope
6. General industry practice — labeled `Recommendation`

Two-layer and three-layer token models can both be valid. Judge whether each layer has a clear job. Never present one popular architecture as the only standard.

Every conclusion is `Verified`, `Inferred`, `Unknown`, or `Recommendation`.

### Core rules

1. Inaccessible data is `Unknown`, never inferred from visuals.
2. Local and remote assets are reviewed separately; consumer files judge only the exposed contract.
3. Exact Figma names in every finding.
4. Text Style assignment is the component-facing typography contract; variables inside it are implementation details. Text color is audited separately. Text Styles have no modes.
5. Structural defects ≠ recommendations. No migration advice without affected consumers and risk.
6. No mass renaming to follow fashion. No extra layer without a job.
7. Themes, brands, platforms/viewports, density, and Language are separate axes. Direction is never a mode.

### Review checklist

**1. Context** — file, page, selection, source vs consumer, collections, remote libraries, local styles, mode, product needs, interop in scope?, Profile present?

**2. Inventory** — per collection: name, job, local/remote, types, count, groups, modes, default mode, scopes, alias vs raw usage, publish visibility, descriptions, code syntax. Per style: name, type, group, description, publish state, variable dependencies, usage, duplicates, deprecation.

**3. Collection boundaries** — one coherent job each; flag primitive/semantic mixing, unrelated concerns mixed, theme roles in primitives, component tokens polluting shared semantics, duplicate collections, over-splitting, multiple axes in one collection, internal collections exposed.

**4. Token layers** — classify (primitive, semantic, component, layout/platform, content/prototype, internal, unknown). Primitives hold raw decisions; semantics express intent; component tokens only where the Profile allows and the component owns the decision; it is clear where a new token belongs.

**5. Alias graph** — direction (primitive ← semantic ← component), broken/circular aliases, raw values in semantic layers, chain depth (report, no universal max), competing sources, stale branches. Health: `Healthy`, `Acceptable with reason`, `Fragile`, `Broken`.

**6. Modes** — one understandable axis per collection; complete values; intentional default; no combined axes (`Dark Mobile Arabic`); theme not duplicated as variants; viewport modes only where values change; Language modes not replacing Text Styles; plan-limit fit; no combinatorial explosion.

**7. Naming** — matches the Profile grammar ([naming](../../standards/naming.md)); one grammar per file; clear purpose; stable hierarchy; state words; logical `start/end`; no `new/test/final/v2`; code-export safety when in scope. Fail only for ambiguity, collision, unstable API, or poor discoverability.

**8. Types and scopes** — type matches use; scopes support intended properties and are not `ALL_SCOPES` without reason; primitives hidden + unscoped; number units consistent; string variables valid for fonts; prototype variables separated; color variables are solids; shadow color ≠ shadow geometry.

**9. Primitive scales** — intentional sequences, no forced raw values, consistent units, not exposed as component API, real needs over speculative completeness.

**10. Semantic coverage** — against the required roles in the Profile (surface levels, text, icon, border incl. strong/focus, divider, link/visited, overlay, selected, disabled, inverse, on-brand, feedback × 4, elevation). Light/Dark keep meaning; equal roles share one source; different roles are not merged because values match; no synonym overload.

**11. Text Styles** — per style: role, language, viewport pattern, family, weight, size, line height, letter spacing, paragraph spacing, case, OpenType, variable bindings, description. Verify EN/AR families match the Profile; Language in naming not modes; Arabic rules (letter spacing 0, no case transform, line height ≥ 1.5); assignment on sampled components; no local reconstruction; complete bindings.

**12. Paint Styles** — solids not duplicated with variables; composites kept; legacy styles have migration status.

**13. Effect Styles** — full geometry; variable-backed color where supported; no duplicate elevations; semantic names; visible in both themes.

**14. Layout Guide Styles** — viewport responsibilities clear; not used as component spacing; no duplicates.

**15. Style → variable dependency map** — expected collection/mode, complete, no conflicting roles, renames won't orphan styles.

**16. Usage and bypass** — sample components: semantic bindings, exact Text Styles, Effect Styles, no primitive leaks, no raw values replacing foundations. Classify unused assets as reserved / deprecated / orphaned / duplicate / unknown (never delete).

**17. Publishing boundaries** — what is public/hidden, primitive exposure intentional, deprecated assets labeled, local copies vs remote, ownership.

**18. Governance** — ownership, naming authority, creation approval (FP flow), change review, deprecation, breaking-change policy (contract versioning), release notes, consumer migration, docs, validation cadence, design-to-dev sync.

**19. Interoperability (only when in scope)** — stable names, groups, types, aliases, descriptions, extensions, mode/theme resolution, composite values living in Styles, platform transforms, round-trip risks. Label each mapping `Direct`, `Transform required`, `Lossy`, `Unsupported/Unknown`. Never claim DTCG compliance from Figma alone.

**20. Ratings** — per area: `Healthy`, `Healthy with minor gaps`, `Needs restructuring`, `High risk`, `Unknown`. Overall: `Healthy`, `Healthy with gaps`, `Needs restructuring`, `High risk`, `Blocked by access`. No percentages.

### Findings

IDs: `VAR-`, `STYLE-`, `MODE-`, `ALIAS-`, `PUB-`, `GOV-`, `INT-` + number from the Registry. Severity from [findings](../../standards/findings.md) (Critical / Major / Moderate / Minor / Info) with `Blocks component work?`.

Each finding: ID · severity · evidence status · exact assets · current structure · expected principle · system impact · consumer impact · recommended target · migration risk · blocks work?

### Migration rules

Preserve consumers until approved; map aliases before renames; separate additive from breaking; deprecate before delete; list affected styles/components; define validation and rollback. Phases: `0 Evidence + checkpoint → 1 Add/repair targets → 2 Migrate styles → 3 Migrate components → 4 Deprecate → 5 Remove after usage check`. Never apply.

## Examples

Input: `/ds-foundation-architecture-review` mode Post-generate check, right after generating Acme foundations.

Expected output (summary): overall `Healthy with gaps`; lead table rows `MODE-001` (`color/border/focus` has no Dark value, Major, blocks work), `STYLE-001` (Arabic caption line height 1.3×, Moderate), `VAR-001` (`spacing/*` uses `ALL_SCOPES`, Minor); proposal `FP-SYS-001`; `Profile matches file`; next step `Approve FP-SYS-001` → `/ds-foundation-extend`. Full shape: [worked example](references/worked-example.md).

## Common edge cases

- **No read access to remote libraries** → review local assets; mark remote areas `Unknown`.
- **No Profile** → judge against package defaults, label those findings `Recommendation`, and offer Profile draft mode.
- **Consumer file** → judge only the exposed contract; never recommend changes to the remote source here.
- **Two valid token models** (two- vs three-layer) → judge whether each layer has a job; never call one the only standard.
- **Code cannot run** → contrast and Arabic checks by hand, numbers `Unverified`.

## Output

Standard level, in this order:

1. **Report header** ([reporting](../../standards/reporting.md))
2. **Review Summary** — mode, overall status, highest-risk issue, strongest part, findings by severity, can component work continue?, migration recommended?
3. **Missing Points & Solutions** (lead table)

| # | Area | What's wrong | Exact assets | Severity | Blocks work? | Suggested solution | ID |
|---|---|---|---|---|---|---|---|

4. **Scope and Evidence** — `| Area | Inspected | Evidence status | Limitation |`
5. **Current Architecture Map** (observed only, ASCII)
6. **Collections** — `| Collection | Job | Types | Modes | Layer | Public/internal | Rating | ID |`
7. **Alias Integrity** — `| Source | Target | Direction | Depth | Health | ID |`
8. **Modes** — `| Collection | Axis | Modes | Complete? | Combination risk | Rating | ID |`
9. **Semantic Coverage** — `| Family | Coverage | Missing roles | Duplicates | Theme integrity | Rating |`
10. **Text Styles** — `| Style | Role | Language | Viewport pattern | Bindings | Arabic rules | Assignment | Rating |`
11. **Paint / Effect / Layout styles** and **Style → variable map**
12. **Usage and bypass**, **Publishing and governance**
13. **Interoperability** (only when in scope)
14. **Findings** (full)
15. **Recommended target architecture** — Keep / Repair / Consolidate / Add / Deprecate / Investigate (only what findings support)
16. **Migration plan** — or `Not required`
17. **Profile** — `Profile matches file` / `Profile drift: …` / `Profile draft FPR-… (needs human confirmation)`
18. **Open questions** — only ones that change the assessment
19. **Next step** — exactly one

Post-generate check and Change review print sections 1–3, 14, 17, 19 only.

## Completion gate

- Capability check recorded; inaccessible areas `Unknown`
- Collections inventoried and classified; aliases, modes, naming, types, scopes reviewed
- Text Styles and their bindings reviewed; text color audited separately; Arabic rules checked
- Paint/Effect/Layout styles and dependency map reviewed
- Usage sampled; publishing and governance assessed
- Interoperability only when in scope
- Findings use the shared severity scale and separate defects from recommendations
- Restructuring advice has consumer impact and migration risk
- Profile compared (or drafted) and the result stated
- No source, foundation, or docs object was modified
