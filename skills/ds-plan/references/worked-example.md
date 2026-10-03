# Worked Example — Plan: Button / Web (abridged)

Sample names. A real plan uses live names and fills every section.

```text
Skill: /ds-plan · Package 2.2.0 · Mode: New contract
Target: Button / Web · Contract: CC-BUTTON-WEB-001 v0.3 · Profile: FPR-ACME-001 v1
Capability: C1, C3, C4, C7 OK · Gates checked: 12/12 · Contract record: written
```

## Plan Summary

- Status: `Ready to Build` (pending approval)
- Highest risk: focus ring role does not exist yet (`FP-SYS-001`)
- Controls: 6 · Variants estimate: 4 × 3 × 6 = 72 (minus 6 invalid = 66) · FP: 1 · OQ: 1 (non-blocking) · Blocks: 0
- Dependencies: `Icon / Web` Built · `Spinner / Web` Built

## Build Snapshot (derived)

| # | What to build | Control (Table B) | Kind | Values / default | Depends on (D) | Foundation status (§10) | Missing? (C) | Solve (C) | Blocks Ready? |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `Button / Web` | Hierarchy | variant axis | primary, secondary, tertiary, destructive / primary | — | Verified | No | — | No |
| 2 | `Button / Web` | Size | variant axis | small, medium, large / medium | — | Verified | No | — | No |
| 3 | `Button / Web` | State | variant axis | default, hover, focus, pressed, disabled, loading / default | Spinner (loading) | Proposed FP-SYS-001 (focus) | Yes | Create `color/border/focus` in `Semantic` | Yes until approved |
| 4 | `.Button/Content` | Direction | exposed nested | LTR, RTL / LTR | Icon | Verified | No | — | No |
| 5 | Theme | — | mode | Light, Dark | — | Verified | No | — | No |
| 6 | Language | — | content / style | EN, AR | — | Verified | No | — | No |

## §2 Anatomy (wireframe)

```text
+------------------------------------------------+
| [(leading icon)]  Label  [(trailing icon)]     |   ← .Button/Content (Level 2 helper)
+------------------------------------------------+
  Root (Auto Layout, Hug) · focus ring outside the container
```

## Table B — Public API

| Control | Kind | Values / default | Lives on | Consumer effect | Code prop | Notes |
|---|---|---|---|---|---|---|
| Hierarchy | variant axis | primary, secondary, tertiary, destructive / primary | Root | Emphasis | `variant` | |
| Size | variant axis | small, medium, large / medium | Root | Height + padding | `size` | medium = 40px |
| State | variant axis | default, hover, focus, pressed, disabled, loading / default | Root | Interaction preview | — | not a code prop |
| Label | text prop | "Button" | `.Button/Content` | Visible text | `children` | |
| Leading icon / Trailing icon | boolean + instance swap | off / `Icon / Web` | `.Button/Content` | Optional icons | `startIcon`, `endIcon` | |
| Direction | exposed nested | LTR, RTL / LTR | `.Button/Content` | Order + alignment | `dir` (inherited) | Level 2 |

## §4 Invalid combinations

`State=loading` with `Hierarchy=tertiary` (not supported) — 6 variants not built.

## §5 Content

| Role | EN example | AR example | Source | Long EN | Long AR |
|---|---|---|---|---|---|
| Label | Save | حفظ | pack (stress copy) | Save and continue to the next step | حفظ ومتابعة إلى الخطوة التالية |

## §8c Direction

| Part | Level | Helper | What flips in RTL | Directional slots | Generic slots |
|---|---|---|---|---|---|
| Content row | 2 | `.Button/Content` | Child order, text alignment | none by default | leading / trailing icon (consumer picks glyph) |
| Root | 1 | — | Nothing | — | — |

## §9 Accessibility (abridged)

| A11Y rule | SC | Criterion | Evidence |
|---|---|---|---|
| A11Y-007 | 2.4.7 / 2.4.13 policy | Focus ring 2px `color/border/focus`, ≥ 3:1 vs fill and background, outside container | Contrast rows + render bounds |
| A11Y-009 | 2.5.8 | Target ≥ 24px (medium height 40px) | Measured height |
| A11Y-002 | 1.4.3 | Label vs fill: role `label-text` | WCAG + APCA rows, Light + Dark |

Runtime (APG Button): `<button>`, Enter/Space, `aria-busy` while loading, `aria-disabled` when focusable-disabled.

## Table C

| FP ID | Exact name | Type | Needed by | Solve | Approval | Blocks Ready to Build? |
|---|---|---|---|---|---|---|
| FP-SYS-001 | `color/border/focus` | Semantic color | State=focus, all hierarchies | Create in `Semantic`; Light → `color/brand/600`, Dark → `color/brand/300`; scope `STROKE_COLOR` | `Approve FP-SYS-001` | Yes |

## Table D

| Nested component | Required? | Configs | Driving control | Lifecycle state | Notes |
|---|---|---|---|---|---|
| `Icon / Web` | Yes | size 16 / 20 / 24 by Size; color role by Hierarchy | Size, Hierarchy | Built | via `.Button/Content` |
| `Spinner / Web` | Optional | size 16 / 20 | State=loading | Built | replaces label visually; label kept for a11y |

## Table E

None — not blocked.

## Approval request

```text
Plan complete for Button / Web.
Contract: CC-BUTTON-WEB-001 v0.3 — Ready to Build.
Table C: 1 FP · Table D: 2 deps · Table E: clear
Contract record: written

Reply with one of:
- Approve CC-BUTTON-WEB-001 v1.0 Ready to Build. Also approve FP-SYS-001
- Revise plan: {what to change}
```

On approval the contract becomes `v1.0 Approved`.
