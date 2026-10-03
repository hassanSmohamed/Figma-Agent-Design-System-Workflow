# Worked Example — Build: Button / Web (abridged)

Sample names and sample numbers. A real build reports live names and measured values.

```text
Skill: /ds-build · Package 2.2.0 · Mode: New
Target: Button / Web · Contract: CC-BUTTON-WEB-001 v1.1 (Approved) · Profile: FPR-ACME-001 v1
State: workspace (ds-state/abc123/), ledger rev 9 · Tooling: figma-use loaded · skillNames "figma-use,ds-build"
Capability: C1–C8 OK, C5 yes · Gates checked: 9/9
Checkpoint: "ds-build CC-BUTTON-WEB-001 v1.1 start 2026-10-02 15:20" · Sandbox cleaned: Yes
```

## Build Summary

- Approval: `"Approve CC-BUTTON-WEB-001 v1.1 Ready to Build. Also approve FP-SYS-001, FP-BUTTON-WEB-002"` (typed this turn by @lina, 2026-10-02)
- Result: state → `Built`
- Variants: 66 (72 minus 6 invalid) · Properties: 6 · FP created: 2
- Highest remaining risk: none blocking; 1 Minor (layer name polish)

## Table C execution log

| FP ID | Action | Result | Rollback |
|---|---|---|---|
| FP-SYS-001 | Created `color/border/focus` in `Semantic`; Light → `color/brand/600`, Dark → `color/brand/300`; scope `STROKE_COLOR`; code syntax `--color-border-focus` | Verified on re-read | Delete variable `color/border/focus` |
| FP-BUTTON-WEB-002 | Created `color/button/bg/primary` in `Semantic`; Light → `color/brand/600`, Dark → `color/brand/200`; scope `FRAME_FILL`; code syntax `--color-button-bg-primary` | Verified on re-read | Delete variable `color/button/bg/primary` |

## Table D execution log

| Nested component | Configs wired | Driving control | Result |
|---|---|---|---|
| `Icon / Web` | 16 / 20 / 24; color role per Hierarchy | Size, Hierarchy | Instance, not detached |
| `Spinner / Web` | 16 / 20 | State=loading | Instance |

## Variant set layout

Hierarchy → groups (4) · Size → columns (3) · State → rows (6). Gap 40, group gap 64, padding 24. `checkSetOverlap`: 0 findings.

## Direction implementation

| Part | Level | Helper | RTL behavior | Verified |
|---|---|---|---|---|
| Content row | 2 | `.Button/Content` | Icon/label order reversed; text right-aligned | Sandbox: Pass |
| Root | 1 | — | No change needed | Sandbox: Pass |

## Directional icon decisions

| Slot | Directional? | Mirrors in RTL? | Reason |
|---|---|---|---|
| Leading icon | Generic | No | Consumer chooses the glyph |
| Trailing icon | Generic | No | Same; docs show picking `chevron-left` for RTL "next" |

## Language implementation

| Role | EN | AR | AR source | Text Styles |
|---|---|---|---|---|
| Label (short) | Save | حفظ | AR pack, `Stress copy` | `Text/EN/Label/Medium`, `Text/AR/Label/Medium` |
| Label (long) | Save and continue to the next step | حفظ ومتابعة إلى الخطوة التالية | AR pack, `Stress copy` | same |

## Contrast (excerpt)

| Pair | Role key | Mode | FG hex | BG hex | WCAG ratio | Pass | APCA Lc (signed) | Pass | Disposition |
|---|---|---|---|---|---|---|---|---|---|
| Label on primary | label-text | Light | `#FFFFFF` | `#0B5CD5` | 5.99:1 | Yes | -84.3 | Yes | Pass both |
| Label on primary (v1.0, `color/bg/brand`) | label-text | Dark | `#0A0F1A` | `#6FA8FF` (`brand/300`) | 7.96:1 | Yes | 56.2 | **No** (< 60) | WCAG only — APCA fail |
| Label on primary (v1.1, `color/button/bg/primary`) | label-text | Dark | `#0A0F1A` | `#84B4FF` (`brand/200`) | 9.08:1 | Yes | 62.2 | Yes | Pass both |
| Focus ring vs fill | non-text-ui | Light | `#0B5CD5` | `#FFFFFF` | 5.99:1 | Yes | 79.1 | Yes | Pass both |
| Focus ring vs page | non-text-ui | Dark | `#6FA8FF` | `#0A0F1A` | 7.96:1 | Yes | -54.4 | Yes | Pass both |

Negative Lc means light text on a dark background. The pass check uses the absolute value.

On the first run (v1.0) the Dark label pair passed WCAG but failed APCA. Build did not lower the bar or use a raw hex, and it did not repoint `color/bg/brand`: that token is shared by Badge, Toggle and four other components, so changing it would be a token value change (`FPV-*`, with a contrast table for every consumer). Build stopped before Phase 5. `/ds-plan` revised the contract to v1.1 (non-breaking): Button binds a new component token `color/button/bg/primary` (`FP-BUTTON-WEB-002`) that aliases `brand/200` in Dark. The build ran again on v1.1 after the new approval, typed in this turn.

## Self-check (excerpt)

| Rule | Check | Result | Evidence |
|---|---|---|---|
| CON-001 | API = Table B | Pass | 6 properties, names and defaults match |
| TOK-001..003 | Bindings | Pass | 0 raw, 0 primitive, 0 unbound |
| TXT-001..003 | Text Styles | Pass | 132 text nodes, all styled |
| DIR-001 | RTL order / LTR regression | Pass | Sandbox, both directions |
| A11Y-009 | Target | Pass | medium = 40px height |

## Change log (excerpt)

| # | Object | Node ID | Change | Reason (contract §) | Rollback |
|---|---|---|---|---|---|
| 1 | `color/border/focus` | `VariableID:12:40` | Created | Table C FP-SYS-001 | Delete variable |
| 2 | `color/button/bg/primary` | `VariableID:12:41` | Created | Table C FP-BUTTON-WEB-002 | Delete variable |
| 3 | `.Button/Content` | `214:880` | Created helper set (LTR/RTL) | §8c Level 2 | Delete set |
| 4 | `Button / Web` | `214:901` | Created 66 variants | §3–4 | Delete set |
| 5 | Ledger | — | State `Built`, last phase 9, node IDs recorded (rev 9 → 10) | — | Edit ledger row |

## Next step

`/ds-test` (Build QA) for `Button / Web`.
