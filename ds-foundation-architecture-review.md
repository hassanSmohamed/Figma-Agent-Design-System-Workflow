---
name: ds-foundation-architecture-review
description: Performs a read-only expert review of the variables and styles architecture in the active Figma design-system file. Use to evaluate collection boundaries, token layers, aliases, modes, scopes, naming, publication, Text Style-to-variable dependencies, paint/effect/grid styles, governance, scalability, and optional design-token interoperability without modifying the file.
---

# Design System Foundation Architecture Review

## Role

Act as a principal design-system architect, design-token specialist, and Figma library governance reviewer.

## Objective

Determine whether the active Figma file's Variables and Styles were built with a clear, scalable, maintainable, and publishable architecture.

This Skill answers:

> Is the foundation structure healthy, and will it continue to work as the design system grows across themes, platforms, languages, products, and code?

This Skill is read-only.

Do not create, rename, move, delete, publish, unpublish, hide, bind, detach, or edit any variable, collection, mode, style, layer, or component.

## Relationship to Other Skills

Use `/ds-review` before every component to check whether existing variables and styles cover that component. Use this architecture review for deeper Variables/Styles health.

Use `/ds-foundation-architecture-review` for a deeper review of the architecture and governance of Variables and Styles themselves.

| Skill | Primary question |
|---|---|
| `/ds-review` | What foundations and components exist, and what blocks component work? |
| `/ds-foundation-architecture-review` | Are Variables and Styles structured correctly for long-term system health? |

Do not turn this Skill into a component QA pass. Inspect component usage only as evidence of whether the foundation architecture is being consumed correctly.

## Review Modes

Use one mode per invocation.

### Full architecture review

Review all local and relevant enabled-library Variables and Styles.

### Variables-only review

Review collections, groups, aliases, modes, scopes, publication boundaries, and usage architecture.

### Styles-only review

Review Text, Paint, Effect, and Layout Guide Styles, including their variable dependencies and assignment patterns.

### Change review

Review a newly added or modified collection, mode, variable group, or style group and assess whether it fits the existing architecture.

### Interoperability review

Review readiness for token export, code synchronization, or Design Tokens Community Group format mapping.

Do not assume interoperability is required unless the user requests it or the file contains clear code-export conventions.

## Standards and Evidence Hierarchy

Evaluate in this order:

1. The active Figma source file and its verified behavior
2. Existing approved organizational conventions and governance rules
3. Figma-native Variables, Styles, modes, scopes, aliases, libraries, and publishing capabilities
4. The design system's stated product, platform, theme, brand, and localization needs
5. Design Tokens Community Group 2025.10 concepts when interoperability is in scope
6. General industry practices, labeled as recommendations rather than universal standards

Do not present one popular token architecture as the only valid standard.

A two-layer or three-layer token model may both be valid depending on scale. Evaluate whether each layer has a clear responsibility and produces maintainable usage.

Classify every conclusion as:

| Evidence status | Meaning |
|---|---|
| Verified | Directly confirmed in the active file |
| Inferred | Strongly suggested by repeated evidence but not explicitly documented |
| Unknown | Cannot be confirmed from the available file access |
| Recommendation | Expert improvement, not a confirmed defect or universal requirement |

## Reference Architecture Principles

Use these as evaluation principles, not automatic pass/fail rules.

### Variables

A healthy variable architecture usually separates responsibilities such as:

```text
Primitive values
    ↓ aliases
Semantic roles
    ↓ optional aliases
Component-specific decisions only when justified
```

Examples:

```text
color.blue.600
    ↓
color.background.brand.default
    ↓ optional
button.primary.background.default
```

Do not require component-specific variables when shared semantic roles are sufficient.

Do not accept component layers bound directly to primitives merely because the visual result is correct.

### Styles

Styles are reusable property bundles, not obsolete duplicates of Variables.

Use the appropriate source for the job:

```text
Component text node
    → exact approved Text Style
        → typography variables already assigned inside the style
```

```text
Text color
    → semantic color variable
```

```text
Layer with a reusable composite shadow
    → Effect Style
        → variable-backed color where supported and approved
```

```text
Reusable gradient, image paint, or multi-paint treatment
    → Paint Style when a single color variable is insufficient
```

```text
Reusable layout guide configuration
    → Layout Guide Style
```

Simple solid colors should not be duplicated across both Paint Styles and Variables without a documented compatibility or migration reason.

## Core Rules

1. Inspect before evaluating.
2. Review local assets and identify relevant remote dependencies separately.
3. Preserve exact Figma names in the report.
4. Never infer an alias, scope, mode value, or style binding from visual similarity.
5. Treat exact Text Style assignment as the component-facing typography contract.
6. Treat typography variables inside Text Styles as implementation dependencies.
7. Audit text color separately because it is not part of a Figma Text Style.
8. Distinguish structural defects from optional recommendations.
9. Do not recommend a migration without identifying affected consumers and risk.
10. Do not propose mass renaming merely to match a fashionable naming pattern.
11. Do not require primitive, semantic, and component layers when the extra layer has no clear responsibility.
12. Do not accept mixed responsibilities inside one collection merely because the names are tidy.
13. Treat modes as contextual value changes, not as a substitute for unrelated collections.
14. Treat themes, brands, platforms, density, and breakpoints as separate axes unless the architecture intentionally combines them and remains maintainable.
15. Use `Unknown` when Figma access cannot prove usage, publication, or internal bindings.
16. Return a read-only migration plan; do not apply it.

## Review Workflow

### 1. Establish review context

Record:

- File name
- Current page
- Selected objects
- Whether this is the source library or a consumer file
- Local variable collections
- Enabled remote libraries relevant to the review
- Local Text, Paint, Effect, and Layout Guide Styles
- Requested review mode
- Known product, platform, brand, theme, and localization requirements
- Whether code synchronization or token export is in scope

When the file is a consumer file, do not judge remote library internals that cannot be inspected. Report only the exposed contract and local usage evidence.

### 2. Inventory all foundation assets

For every variable collection, capture:

- Exact collection name
- Intended responsibility
- Local or remote
- Variable types
- Variable count
- Groups and nesting depth
- Modes
- Default mode
- Scopes
- Alias usage
- Raw-value usage
- Publication visibility where available
- Description coverage
- Code syntax or export metadata where available

For every local style, capture:

- Exact style name
- Style type
- Style group
- Description
- Local or published status where available
- Variable dependencies
- Usage evidence
- Duplicate or near-duplicate candidates
- Deprecation or replacement evidence

### 3. Review collection boundaries

For each collection, determine whether it has one coherent responsibility.

Check for:

- Primitive and semantic values mixed without a documented reason
- Color, spacing, radius, typography, layout, and behavior concerns mixed arbitrarily
- Theme roles stored inside a primitive collection
- Component-specific decisions polluting a shared semantic collection
- Duplicate collections serving the same responsibility
- Collections split so narrowly that consumers cannot understand which source to use
- One collection carrying unrelated mode axes
- Brand or product collections that duplicate an extendable or alias-based source without a governance reason
- Internal implementation collections accidentally exposed as public API

A collection is not healthy merely because all variables are grouped neatly.

### 4. Review token-layer architecture

Classify each variable or group as:

- Primitive
- Semantic
- Component-specific
- Layout or platform foundation
- Content or prototype variable
- Internal implementation
- Unknown

Verify:

- Primitive variables contain reusable raw decisions rather than product meaning
- Semantic variables express usage intent rather than raw appearance
- Component-specific variables exist only where the component owns a distinct decision
- Components can consume semantic or justified component variables without bypassing the architecture
- The same semantic role does not point to inconsistent layers across modes
- Token layers do not form avoidable circular ownership
- The architecture can explain where a new token belongs

Flag ambiguous variables whose name and location do not reveal their responsibility.

### 5. Review alias architecture

Inspect the alias graph.

Check:

- Semantic variables alias approved primitives where appropriate
- Component-specific variables alias semantic roles where appropriate
- Semantic collections do not contain unexplained raw values
- Aliases do not point in the wrong architectural direction
- No circular or broken aliases exist
- Alias chains are understandable and not unnecessarily deep
- Theme or brand changes can be made at the intended layer
- Identical raw values are not mistaken for equivalent meaning
- Duplicate aliases do not create several competing sources of truth
- Renamed or deprecated variables do not leave stale alias branches

Report alias depth and risk, but do not impose a universal maximum depth.

Use:

| Alias health | Meaning |
|---|---|
| Healthy | Direction and ownership are clear |
| Acceptable with reason | Extra layer has documented value |
| Fragile | Chain is difficult to understand or migrate |
| Broken | Missing, circular, or semantically invalid dependency |

### 6. Review modes and context axes

For every collection, identify what each mode represents.

Examples:

- Light and Dark
- Desktop, Tablet, and Mobile
- Brand A and Brand B
- Comfortable and Compact
- Locale or language preview

Check:

- Mode names represent one understandable axis
- Mode values are complete
- The default mode is intentional
- Modes do not combine unrelated axes such as `Dark Mobile Arabic`
- Theme values are not duplicated as component variants
- Platform modes are used only where values genuinely change by platform
- Language modes are not used as a replacement for applying approved Text Styles unless the system explicitly requires content simulation
- Language and Direction must remain independent axes — never combine into modes like `Dark Mobile Arabic` or treat Arabic as a Direction mode
- Mode inheritance and overrides are predictable
- Nested frames or components do not create accidental mode conflicts
- The mode model can scale without combinatorial explosion
- Plan limits or library constraints do not make the architecture unusable

When multiple independent axes are required, recommend separate collections or documented orchestration rather than silently combining them.

### 7. Review naming and grouping

Evaluate names for:

- Clear purpose
- Consistent casing and separators
- Stable hierarchy
- Searchability in Figma pickers
- Distinction between primitive and semantic meaning
- Logical groups created through slash-separated paths where appropriate
- Avoidance of redundant words inherited from the collection name
- Avoidance of temporary names such as `new`, `test`, `final`, or numeric duplicates
- Consistent state grammar such as `default`, `hover`, `pressed`, `focused`, and `disabled`
- Logical `start`, `end`, `leading`, and `trailing` terminology where direction matters
- Code-export safety when interoperability is in scope

Do not fail a naming system only because it differs from a preferred syntax. Fail it when it creates ambiguity, collision, unstable API, or poor discoverability.

### 8. Review variable types and scopes

For every variable, verify:

- The variable type matches the value and intended use
- Scope supports the intended Figma properties
- Scope is not so broad that misuse becomes likely without a reason
- Number variables do not mix incompatible units or meanings
- String variables used for font family or weight are valid for their Text Styles
- Boolean and string variables intended only for prototypes are separated from visual design tokens when appropriate
- Color variables represent solid colors; composite paints remain Styles where necessary
- Typography variables map correctly into the approved Text Styles
- Shadow color variables do not pretend to define complete shadow geometry

Flag variables that exist but cannot be safely applied to their intended property.

### 9. Review primitive foundations

Review:

- Color scales
- Opacity
- Spacing
- Radius
- Width and sizing
- Typography values
- Grid and layout values
- Shadow colors
- Motion or duration values when present
- Z-index or elevation values when present

Check:

- Sequences are intentional and documented
- Duplicate values with different semantic purposes are understood
- Missing steps do not force local raw values
- Units and naming remain consistent
- Primitive scales are not exposed as the preferred component API
- Numeric scales are not treated as mathematically correct merely because they increase regularly
- Values support real product needs rather than speculative completeness

Do not require every possible token category.

### 10. Review semantic coverage

Assess whether the semantic layer covers the system's real usage needs.

Review families such as:

- Background and surface
- Text
- Icon
- Border and divider
- Focus
- Link
- Overlay
- Interactive actions
- Disabled
- Selected and current
- Error, warning, success, and information
- Elevation
- Layout and container roles where appropriate

Check:

- Names describe intent
- Light and Dark mappings preserve meaning
- Equivalent roles share one source
- Different roles are not merged solely because they currently share a value
- Contrast-sensitive foreground/background relationships are documented where required
- Semantic coverage does not force component teams to use primitives
- Excessive semantic synonyms do not create choice paralysis

### 11. Review Text Style architecture

Treat existing approved Text Styles as the typography API assigned to component text nodes.

For every Text Style, inspect:

- Exact name and group
- Intended semantic role
- Language
- Platform or responsive mode
- Font family
- Font weight and style
- Font size
- Line height
- Letter spacing
- Paragraph spacing and indentation
- Decoration and case
- OpenType features where relevant
- Internal variable bindings
- Description and usage guidance
- Assignment coverage in sampled components
- Local override risk

Verify:

- English and Arabic styles use the correct approved font families
- Language is encoded in Text Style naming/assignment, not as a Direction or Theme mode
- Direction (LTR/RTL layout) is not solved by inventing Language modes
- Desktop, Tablet, and Mobile responsibilities are clear
- The Text Style is assigned directly to component text nodes
- Font family, weight, size, line height, and letter spacing are not reconstructed locally when an approved style exists
- Variables assigned inside the Text Style point to the intended typography collection and mode
- Text Styles do not contain broken or partial variable bindings
- Style names reflect semantic usage or an intentionally documented type scale
- Equivalent text roles reuse the same style
- Intentional mixed emphasis inside a text layer is documented
- Text color remains a separate semantic color binding
- Alignment and resizing behavior are not falsely assumed to be owned by the Text Style

A text layer that visually matches a style but does not have the exact style assigned is non-compliant.

### 12. Review Paint Style architecture

Inspect Paint Styles for:

- Solid colors
- Gradients
- Images
- Patterns
- Multiple paints
- Blend behavior where visible
- Variable dependencies

Check:

- Simple semantic solid colors are not duplicated unnecessarily as both Paint Styles and color Variables
- Paint Styles are retained when they represent composite paints that a single Variable cannot express
- Gradients use approved color sources where supported
- Legacy color styles have a documented migration status
- Published and internal Paint Styles are clearly separated
- Names describe usage rather than incidental appearance when they are semantic

Do not recommend deleting Paint Styles that provide capabilities Variables do not replace.

### 13. Review Effect Style architecture

For every Effect Style, inspect:

- Effect type
- X and Y offsets
- Blur
- Spread
- Color and opacity
- Multiple-effect stacks
- Light and Dark behavior
- Variable-backed color where supported
- Naming and semantic elevation role

Check:

- Shadow geometry is complete and intentional
- Shadow color variables are not mistaken for complete effects
- Similar elevations do not have unexplained duplicate styles
- Effect names communicate semantic elevation or usage
- Blur and shadow effects are not mixed without clear intent
- Consumers apply the Effect Style rather than rebuilding it locally
- Theme behavior does not reduce visibility or create unintended contrast

### 14. Review Layout Guide Style architecture

Inspect reusable grid, row, column, and layout-guide styles.

Check:

- Desktop, Tablet, and Mobile responsibilities are clear
- Column count, gutter, margin, and alignment are coherent
- Product layout guides are not misused as component spacing tokens
- Duplicate guides do not compete for the same viewport
- Names and descriptions explain intended containers
- Platform-specific guides are separated only when necessary

### 15. Review style-to-variable dependency integrity

Create a dependency map for every variable-backed style.

Check:

- The style points to the expected collection and mode
- Dependencies are complete
- Styles do not mix unrelated typography or color systems accidentally
- The same semantic style does not point to conflicting variable roles
- Renaming or replacing a variable will not silently orphan a style
- Style changes do not override an intentional variable architecture
- Consumers use the Style and do not duplicate its internal property bindings

### 16. Review usage and bypass patterns

Sample approved components and representative screens.

Check:

- Components bind to semantic or justified component variables
- Component text nodes use exact approved Text Styles
- Effects use approved Effect Styles
- Layout guides use approved guide styles where intended
- Raw local values are not replacing an available foundation
- Primitive bindings are not leaking into production components
- Local typography overrides are intentional and documented
- Unused Variables and Styles are identified as candidates, not deleted automatically
- Frequently used local values reveal possible missing foundations

Distinguish:

- Unused but intentionally reserved
- Deprecated
- Orphaned
- Duplicate
- Unknown usage

### 17. Review publication and library boundaries

Check where visible:

- Which Variables and Styles are public
- Which internal assets are hidden from publishing
- Whether primitive exposure is intentional
- Whether consumer-facing semantics are published
- Whether deprecated assets remain discoverable without guidance
- Whether descriptions explain usage and restrictions
- Whether library update descriptions and change governance are supported
- Whether the source file name and library purpose are clear
- Whether local copies compete with remote library assets
- Whether product, platform, or brand libraries have clear ownership boundaries

Do not recommend publishing every local asset.

### 18. Review governance and lifecycle

Evaluate:

- Ownership
- Naming authority
- Creation approval
- Change review
- Deprecation
- Replacement mapping
- Breaking-change policy
- Version or release notes
- Consumer migration
- Documentation coverage
- Test or validation cadence
- Designer-to-developer synchronization

A structurally clean Variables modal can still be a weak system when governance is undefined.

### 19. Review interoperability when requested

When code synchronization or token export is in scope, compare the architecture with Design Tokens Community Group 2025.10 concepts.

Review:

- Stable token names
- Groups
- Types
- Values
- Aliases and references
- Descriptions
- Extensions or tool-specific metadata
- Mode or theme resolution strategy
- Composite values that live in Figma Styles rather than Variables
- Naming transformations required by target platforms
- Round-trip risks
- Lossy mappings

Important:

- Figma Variables and the DTCG format are not identical models.
- Figma Text, Effect, Paint, and Layout Guide Styles may require separate transformation or metadata.
- Do not claim DTCG compliance from Figma inspection alone.
- Label each mapping as `Direct`, `Transform required`, `Lossy`, or `Unsupported/Unknown`.

### 20. Evaluate architecture health

Rate each area:

| Rating | Meaning |
|---|---|
| Healthy | Clear ownership, low ambiguity, and scalable use |
| Healthy with minor gaps | Sound architecture with limited cleanup needed |
| Needs restructuring | Repeated ambiguity or bypass patterns create maintenance risk |
| High risk | Broken dependencies, unclear ownership, or unsafe publishing/migration risk |
| Unknown | Insufficient evidence |

Do not calculate a misleading overall percentage.

The final overall status must be one of:

- `Healthy`
- `Healthy with gaps`
- `Needs restructuring`
- `High risk`
- `Blocked by access`

## Finding IDs and Severity

Use stable prefixes:

```text
VAR-001    Variable architecture
STYLE-001  Style architecture
MODE-001   Mode architecture
ALIAS-001  Alias integrity
PUB-001    Publishing and library boundary
GOV-001    Governance
INT-001    Interoperability
```

Use the shared severity scale:

| Severity | Meaning |
|---|---|
| Critical | Broken dependency, unsafe library contract, or structural issue likely to cause widespread incorrect output |
| Major | Architecture bypass, ambiguous source of truth, missing required mode values, or duplicate public API with significant maintenance risk |
| Moderate | Inconsistency, weak discoverability, local override pattern, or incomplete governance that creates recurring friction |
| Minor | Documentation, description, naming polish, or low-risk cleanup |

For every finding include:

- ID
- Severity
- Evidence status
- Exact asset names
- Current structure
- Expected principle
- System impact
- Consumer impact
- Recommended target structure
- Migration risk
- Whether it blocks component work

## Migration Recommendation Rules

When restructuring is recommended:

1. Preserve existing consumers until a migration is approved.
2. Identify source and replacement assets.
3. Separate additive cleanup from breaking changes.
4. Map aliases before renaming or deleting.
5. Identify affected Styles and components.
6. Identify library publishing consequences.
7. Define validation and rollback checks.
8. Recommend deprecation before deletion when consumers may exist.
9. Do not mutate the file.

Use migration phases:

```text
Phase 0 — Evidence and backup
Phase 1 — Add or repair target foundations
Phase 2 — Migrate Styles
Phase 3 — Migrate components and product usage
Phase 4 — Deprecate old assets
Phase 5 — Remove only after usage verification
```

## Output Format

Return the report in this exact order.

### Review Summary

- Review mode
- Overall status
- Highest-risk architecture issue
- Strongest part of the current structure
- Number of confirmed findings by severity
- Whether component work can continue safely
- Whether migration is recommended

### Scope and Evidence

| Area | Inspected | Evidence status | Limitation |
|---|---|---|---|

### Current Architecture Map

Show the observed structure, for example:

```text
Primitive Collections
    ↓
Semantic Collections and Modes
    ↓
Approved Styles and optional component variables
    ↓
Components
```

Do not show a proposed architecture as if it already exists.

### Variable Collection Architecture

| Collection | Responsibility | Types | Modes | Token layer | Public/internal | Rating | Notes |
|---|---|---|---|---|---|---|---|

### Alias Integrity

| Source | Target | Direction | Depth | Health | Finding ID |
|---|---|---|---:|---|---|

### Mode Architecture

| Collection | Mode axis | Modes | Completeness | Combination risk | Rating | Finding ID |
|---|---|---|---|---|---|---|

### Naming, Types, and Scopes

| Asset | Name quality | Type | Scope | Grouping | Status | Finding ID |
|---|---|---|---|---|---|---|

### Semantic Coverage

| Semantic family | Coverage | Duplicate roles | Missing roles | Theme integrity | Rating |
|---|---|---|---|---|---|

### Text Style Architecture

| Text Style | Role | Language | Platform/mode | Variable dependencies | Assignment coverage | Override risk | Rating |
|---|---|---|---|---|---|---|---|

### Paint, Effect, and Layout Guide Styles

| Style | Type | Intended role | Variable dependencies | Duplicate risk | Usage | Rating | Finding ID |
|---|---|---|---|---|---|---|---|

### Style-to-Variable Dependency Map

| Style | Property | Variable | Collection/mode | Dependency health |
|---|---|---|---|---|

### Usage and Bypass Findings

| Consumer | Expected source | Actual source | Bypass type | Impact | Finding ID |
|---|---|---|---|---|---|

### Publishing and Governance

| Check | Current state | Risk | Recommendation | Finding ID |
|---|---|---|---|---|

### Interoperability Readiness

Include only when requested or clearly relevant.

| Foundation | DTCG mapping | Transformation | Risk | Recommendation |
|---|---|---|---|---|

### Findings

| ID | Severity | Evidence | Area | Exact assets | Impact | Recommended resolution | Blocks work |
|---|---|---|---|---|---|---|---|

Use `None` when no confirmed defect exists.

### Recommended Target Architecture

Show only changes supported by findings.

Distinguish:

- Keep
- Repair
- Consolidate
- Add
- Deprecate
- Investigate

### Migration Plan

| Phase | Action | Affected assets | Risk | Validation | Approval required |
|---|---|---|---|---|---|

Use `Not required` when the current structure is healthy.

### Open Questions

Include only questions whose answers materially change the architecture assessment or migration plan.

Do not ask preference questions that can be resolved from existing conventions.

## Completion Gate

The review is complete only when:

- All accessible local variable collections were inventoried
- Collection responsibilities and token layers were classified
- Alias direction and integrity were reviewed
- Modes and independent context axes were reviewed
- Naming, grouping, types, and scopes were reviewed
- Publication boundaries were reviewed where visible
- Existing Text Styles and their internal typography-variable bindings were reviewed
- Exact Text Style assignment was sampled in components
- Text color was audited separately from Text Style properties
- Paint, Effect, and Layout Guide Styles were reviewed
- Style-to-variable dependencies were mapped
- Usage bypass patterns were sampled
- Governance and lifecycle risks were assessed
- Interoperability was assessed only when in scope
- Findings separate defects from recommendations
- Any restructuring recommendation includes migration risk and consumer impact
- No Figma object was modified
