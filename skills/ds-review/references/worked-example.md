# Worked Example — Review: Button / Web

This example shows the shape and depth of a good review. All names are **sample names**. In a real run, use the names from the live file and the Profile.

```text
Skill: /ds-review · Package 2.2.0 · Mode: Component coverage (read-only)
Target: Button / Web · Contract: — (suggested CC-BUTTON-WEB-001) · Profile: FPR-ACME-001 v1
Capability: C1–C4 OK, C5 yes · Gates checked: 14/14 · Checkpoint: n/a (read-only) · Sandbox: not used
```

## Review Summary

- Target: Button · Platform: Web · Mode: Component coverage
- Pages inspected: Foundations, Components / Web · State: workspace (ds-state/abc123/)
- Readiness: `Ready with gaps` · `/ds-plan may proceed: Yes with tracked gaps`
- Highest-risk issue: no semantic focus ring color for Light and Dark
- Findings: Critical 0 · Major 2 · Moderate 1 · Minor 0 · Info 1
- FP proposals: 1 (`FP-SYS-001`)
- Dependencies (catalog): `Icon / Web` Built · `Spinner / Web` Built (optional loading)

## Missing Points & Solutions

| # | Area | What we need | In file now? | Status | What's missing / wrong | Suggested solution | Severity | Blocks Plan? | Link |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Variable | Focus ring color | No | Missing | No semantic focus color in `Semantic` | Propose `FP-SYS-001`: `color/border/focus` (Light + Dark) | Major | No (tracked) | F-BUTTON-WEB-002, FP-SYS-001 |
| 2 | Variable | Primary pressed (Dark) | Partial | Partial | `color/bg/brand-pressed` empty in Dark | Fill the Dark value via `/ds-foundation-extend` | Major | No (tracked) | F-BUTTON-WEB-001 |
| 3 | Variable | Web min target height | No | Partial | No `size/target/min` token (Profile target: 24 min / 40 recommended) | Track as `OQ` in Plan, or propose a size token | Moderate | No | F-BUTTON-WEB-003 |
| 4 | Component | Draft Button bindings | Partial | Partial | Draft has 2 raw fills on secondary | Rebuild from semantic variables in `/ds-build` | Info | No | F-BUTTON-WEB-004 |

All other checked needs: OK (see Coverage Matrix).

## Evidence Log

| Area | Exact names found | Result | Confidence |
|---|---|---|---|
| Color variables | `Semantic` collection; modes Light, Dark | Found | High |
| Button colors | `color/bg/brand`, `color/bg/brand-hover`, `color/text/on-brand`, `color/border/default` | Found | High |
| Focus color | No `color/border/focus` or close name | Missing | High |
| Space / shape | `spacing/*`, `radius/*` in `Semantic` | Found | High |
| Text Styles EN | `Text/EN/Label/Medium` (font per Profile) | Found | High |
| Text Styles AR | `Text/AR/Label/Medium` (font per Profile; letter spacing 0; LH 1.5) | Found | High |
| Paint Styles | None used by Button | N/A — paints use Variables | High |
| Effect Styles | `Elevation/1`, `Elevation/2`; Button is flat | N/A for Button | High |
| Layout Guide Styles | `Layout/Large`, `Layout/Medium`, `Layout/Small` | N/A for Button | High |
| Existing Button | `Button / Web` draft | Partial, 2 raw fills | Medium |
| Siblings | `Button / Tablet`, `Button / Mobile` not found | Not built | High |

## Source-of-Truth Contract

| Area | Exact source | Modes | Approved usage | Do not use |
|---|---|---|---|---|
| Color | `Semantic` color variables | Light, Dark | Bind production paints | Raw hex, primitives, legacy paint styles |
| Space / shape | `spacing/*`, `radius/*` | single | Padding, gap, radius | Hard-coded numbers |
| Type EN | `Text/EN/…` Text Styles | Viewport via variable modes (Profile pattern) | Assign the style to text nodes | Raw font settings, node-level type variables |
| Type AR | `Text/AR/…` Text Styles | Same | Arabic content | Separate EN/AR component sets |
| Effects | `Elevation/*` when needed | — | Effect Style | One-off shadows |

## Need Model (abridged)

| Need ID | Group | Required? | Why |
|---|---|---|---|
| N-01 | Surfaces | Yes | Primary / secondary / tertiary / destructive fills |
| N-02 | Content | Yes | Label + optional leading/trailing icon (`Icon / Web`) |
| N-03 | Chrome | Yes | Border on secondary; focus ring on all |
| N-05 | Interaction | Yes | Default, Hover, Focus, Pressed, Disabled (+ Loading per catalog) |
| N-07 | Theme | Yes | Light and Dark |
| N-08 | Text Styles | Yes | EN + AR Label |
| N-09 | Space / shape / size | Yes | Padding, gap, radius, target size |
| N-10..12 | Effect / Layout / Paint | No | Flat control, no page grid, paints via Variables |
| N-13 | Nested | Yes | `Icon / Web`, optional `Spinner / Web` |
| N-14 | Language | Yes | AR Label style + AR stress strings from the locale pack |
| N-15 | Direction | Yes | Catalog: Level 2 helper `.Button/Content` (icon order flips) |
| N-16 | A11y | Yes | 2.4.7 focus (2.4.13 ring policy), 1.4.3 + APCA label contrast, 2.5.8 target |

## Coverage Matrix (abridged)

| Need ID | Need | Exact variable / style / component | Layer | Modes | Status | Severity | FP / F ID |
|---|---|---|---|---|---|---|---|
| N-01 | Primary bg | `color/bg/brand` | semantic | Light, Dark | Covered | — | — |
| N-01 | Primary pressed | `color/bg/brand-pressed` | semantic | Light only | Partial | Major | F-BUTTON-WEB-001 |
| N-03 | Focus ring | — | — | — | Missing | Major | FP-SYS-001 |
| N-08 | EN / AR label | `Text/EN/Label/Medium`, `Text/AR/Label/Medium` | text style | — | Covered | — | — |
| N-09 | Target size | — | — | — | Partial | Moderate | F-BUTTON-WEB-003 |
| N-13 | Icon | `Icon / Web` | component (Built) | — | Covered | — | — |
| N-15 | Direction helper | None yet; `.Link/Content` pattern exists | convention | — | Covered (pattern) | — | — |

## Findings

| ID | Area | Severity | Blocks next step? | Evidence | Impact | Resolution |
|---|---|---|---|---|---|---|
| F-BUTTON-WEB-001 | Mode value | Major | No — tracked | `color/bg/brand-pressed` Dark empty | Plan cannot lock pressed Dark | Fill Dark (extend) |
| F-BUTTON-WEB-002 | Focus ring | Major | No — tracked | No semantic focus color | Build would guess | `Approve FP-SYS-001` |
| F-BUTTON-WEB-003 | Target size | Moderate | No | No min-target token | Plan must state min height | Plan `OQ` |
| F-BUTTON-WEB-004 | Draft bindings | Info | No | 2 raw fills on draft | Don't copy into final | Rebuild |

## Foundation Proposals

| FP ID | Type | Name | Collection | Modes | Values / aliases | Blocks Plan? | Risk | Status |
|---|---|---|---|---|---|---|---|---|
| FP-SYS-001 | Semantic color | `color/border/focus` | `Semantic` | Light, Dark | Light → `color/brand/600`, Dark → `color/brand/300` (confirm ≥ 3:1 vs fill and background) | No | Medium | Proposed |

Detail: scopes `STROKE_COLOR`; code syntax `--color-border-focus`; reason: every focusable control needs a visible focus ring (2.4.7; ring policy from 2.4.13); affected: Button, Input, Checkbox, Radio, Toggle, Link, Icon Button, Menu; alternative rejected: reusing `color/border/default` (different role).

## Plan Handoff Package

| Item | Content |
|---|---|
| Safe to plan? | Yes with tracked gaps |
| Profile | `FPR-ACME-001 v1` |
| Locked foundations | `color/bg/brand`, `color/bg/brand-hover`, `color/text/on-brand`, `color/border/default`, `color/bg/disabled`, `color/text/disabled`, `spacing/*`, `radius/*`, `Text/EN/Label/Medium`, `Text/AR/Label/Medium`, `Icon / Web` |
| Pending approvals | `FP-SYS-001`; Dark value for `color/bg/brand-pressed` |
| Open policy questions | Web min target height (F-BUTTON-WEB-003); AR numerals (Profile: open-question) |
| Nested dependencies | `Icon / Web` (Built), `Spinner / Web` (Built, optional) |
| Platform deltas | Tablet/Mobile not built; plan Web only |
| Language constraints | Locale packs en + ar; AR Label style; Arabic rules hold |
| Direction constraints | Level 2 helper for content order; trailing chevron mirrors, other icons don't |
| A11y constraints | Focus ring ≥ 2px and ≥ 3:1 vs fill + background; label contrast WCAG 4.5 + APCA 60; target 24 min / 40 recommended |
| Out of scope | Tablet, Mobile, elevation |
| Suggested contract ID | `CC-BUTTON-WEB-001` |

## Next step

`Approve FP-SYS-001, then /ds-plan`
