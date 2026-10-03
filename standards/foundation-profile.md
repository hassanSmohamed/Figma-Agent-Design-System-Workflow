# Foundation Profile (FPR)

The Foundation Profile is the **manifest** of this file's foundations. Every skill reads it instead of guessing or using hardcoded names (Inter, `spacing-11xl`, …).

- `/ds-foundation-generate` **writes** it after creating foundations.
- `/ds-foundation-architecture-review` **drafts** it for files made outside this package (human confirms).
- Review, Plan, Build, Test, Fix and Document **read** it. If it is missing, they stop and recommend creating it (or continue with `Unknown` rows if the user says so).

Stored as the **Profile** record in the state store (see [workflow-state.md](workflow-state.md)): `ds-state/{file-key}/profile.md` by default, or the `_DS Profile` frame when state is kept in the Figma file.

## Fields

```yaml
id: FPR-ACME-001
version: 1
package_version: 2.2.0
structure: Primer            # Material 3 | Primer | Carbon | Atlassian | Paste | Lightning | Ant | Cloudscape | Custom
token_layers: semantic-only  # semantic-only | semantic+component  (component tokens only for listed components)
component_token_components: []   # e.g. [Button, Input] when semantic+component

collections:
  primitives: { name: "Primitives", modes: ["Value"], hidden_from_publishing: true }
  semantic:   { name: "Semantic",   modes: ["Light", "Dark"], default: "Light" }
  viewport:   { name: "Viewport",   modes: ["Large", "Medium", "Small"], aliases: {} }   # optional
  density:    { name: "Density",    modes: ["Comfortable", "Compact"] }               # optional

naming:
  grammar: "slash-lower-kebab"     # see naming.md
  color: "color/{role}/{variant}/{state}"      # e.g. color/bg/brand/default
  spacing: "spacing/{step}"                    # e.g. spacing/md
  radius: "radius/{step}"
  size: "size/{role}/{step}"                   # e.g. size/target/min
  text_style: "Text/{LANG}/{Role}/{Size}"      # e.g. Text/EN/Label/Medium
  effect_style: "Elevation/{level}"

scales:
  spacing: [none, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl]   # actual steps in the file
  radius:  [none, sm, md, lg, full]

typography:
  text_style_platform_pattern: "one-style-plus-viewport-modes"   # or "style-per-viewport"
  fonts:
    EN: "Inter"
    AR: "IBM Plex Sans Arabic"
  arabic_rules: { letter_spacing: 0, case_transform: none, line_height_min: 1.5, size_adjust: "+0" }

required_roles_present: [focus-ring, disabled, overlay, selected, link, link-visited, divider, inverse, on-brand, feedback-x4]

locales:
  packs: [EN, AR]      # see language-direction.md
  numerals_AR: open-question   # western | arabic-indic | open-question

targets:  { web_min: 24, web_primary: 40, tablet: 48, mobile: 44 }
contrast: { gate: "WCAG 2.2 AA", confirm: "APCA", apca_version: "0.0.98G-4g" }
plan_limits: { modes_per_collection: unknown }   # filled by capability check
```

## Rules

1. Report names exactly as the Profile records them. If the live file disagrees with the Profile, the **live file wins**, the skill records `Profile drift`, and recommends updating the Profile.
2. Inter and IBM Plex Sans Arabic are only **example defaults**. Never require them unless the Profile says so.
3. `text_style_platform_pattern` tells every skill how platform/viewport typography works:
   - `one-style-plus-viewport-modes`: one Text Style per role and language. Its size and line height are bound to variables in the viewport collection. The frame's mode selects the value. **Text Styles themselves have no modes.**
   - `style-per-viewport`: separate styles such as `Text/EN/Label/Medium/Large`. Allowed but heavier.
4. Changing the Profile is a foundation change: version bump + note in the ledger.
