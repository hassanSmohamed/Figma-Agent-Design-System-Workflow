# Worked Example — Post-generate check (Primer-based file)

Sample names. In a real run, use the live file's names.

```text
Skill: /ds-foundation-architecture-review · Package 2.2.0 · Mode: Post-generate check (read-only)
Target: Acme DS (source library) · Profile: FPR-ACME-001 v1
Capability: C1–C4 OK, C5 yes (scripts), C6 not needed · Gates checked: 10/10
```

## Review Summary

- Overall status: `Healthy with gaps`
- Highest-risk issue: `color/border/focus` has no Dark value
- Strongest part: clean primitive → semantic alias direction, primitives hidden and unscoped
- Findings: Critical 0 · Major 1 · Moderate 1 · Minor 1
- Component work can continue: Yes, after `FP-SYS-001`
- Migration recommended: No

## Missing Points & Solutions

| # | Area | What's wrong | Exact assets | Severity | Blocks work? | Suggested solution | ID |
|---|---|---|---|---|---|---|---|
| 1 | Mode | Dark value empty | `color/border/focus` (Semantic) | Major | Yes | `FP-SYS-001`: alias Dark → `color/brand/300`; re-run contrast | MODE-001 |
| 2 | Text Style | Arabic Caption line height 1.3× | `Text/AR/Caption/Small` | Moderate | No | Raise to 1.5× via the line-height variable | STYLE-001 |
| 3 | Scope | Semantic spacing uses `ALL_SCOPES` | `spacing/*` | Minor | No | Limit to `GAP`, `WIDTH_HEIGHT` | VAR-001 |

## Findings

| ID | Severity | Evidence | Area | Exact assets | Impact | Recommended resolution | Blocks work |
|---|---|---|---|---|---|---|---|
| MODE-001 | Major | Verified | Modes | `color/border/focus` | Focus ring invisible risk in Dark | `FP-SYS-001` then `/ds-foundation-extend` | Yes |
| STYLE-001 | Moderate | Verified | Text Styles | `Text/AR/Caption/Small` | Diacritics clipping in small text | Raise line height | No |
| VAR-001 | Minor | Verified | Scopes | `spacing/*` | Spacing tokens appear in unrelated pickers | Narrow scopes | No |

## Profile

`Profile matches file` (apart from MODE-001, which is a value gap, not drift).

## Next step

`Approve FP-SYS-001` → `/ds-foundation-extend`
