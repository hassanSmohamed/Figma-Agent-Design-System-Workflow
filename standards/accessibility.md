# Accessibility Standard

Baseline: **WCAG 2.2 Level AA** design evidence. **APCA** is an additional confirmation, not a replacement, and never a claim of WCAG 3 conformance.

## 1. Evidence classes

| Class | Meaning |
|---|---|
| Design verified | Confirmed in Figma (measured or inspected) |
| Documentation verified | Clearly specified for implementation |
| Runtime verification required | Needs code, browser, or assistive technology |
| Not applicable | Does not apply (reason required) |

Never claim from Figma alone: semantic HTML, ARIA, accessibility-tree names, keyboard handling, screen-reader announcements, focus management, DOM order, live regions, reduced-motion media queries.

## 2. WCAG 2.2 mapping (design-level checks)

| SC | Name | What the skills check in Figma | Rule IDs |
|---|---|---|---|
| 1.4.1 | Use of Color | State/status has a non-color cue (icon, text, shape, weight) | A11Y-001 |
| 1.4.3 | Contrast (Minimum) | Text ≥ 4.5:1; large text (≥ 24px regular or ≥ 18.66px bold) ≥ 3:1 | A11Y-002 |
| 1.4.11 | Non-text Contrast | Meaningful UI parts (input borders, checkbox/radio outlines, toggle track, focus ring, icons that carry meaning) ≥ 3:1 against adjacent colors | A11Y-003 |
| 1.4.10 | Reflow | Content reflows at narrow width without loss; long EN/AR wraps | A11Y-004 |
| 1.4.12 | Text Spacing | Layout survives increased line/paragraph/word spacing (Latin). Arabic letter spacing stays 0 (script exception) | A11Y-005 |
| 1.4.4 | Resize Text | Hug/Fill lets text grow (spot-check +200% where practical) | A11Y-006 |
| 2.4.7 | Focus Visible | Focus state exists for every focusable variant, Light and Dark, and the ring is not clipped by the component or a clipping parent | A11Y-007, A11Y-008 |
| 2.4.11 | Focus Not Obscured (Minimum) | Page-level: other content (sticky headers, toasts) must not hide the focused component. Figma can't verify it; the docs page carries the warning | Docs note (Release QA) |
| 2.5.8 | Target Size (Minimum) | Hit area ≥ 24 × 24 CSS px (and platform target from [platforms.md](platforms.md)) | A11Y-009 |
| 3.3.1 / 3.3.2 | Error Identification / Labels | Error text (not color alone); visible label or documented name for icon-only | A11Y-010 |
| 2.2.2 | Pause, Stop, Hide | Loading/animation has a non-motion cue and can stop | A11Y-011 |
| 4.1.2 | Name, Role, Value | Runtime handoff only (APG pattern from the catalog) | A11Y-012 |

**Package policies above AA** (cited so nobody mistakes them for AA requirements):

| SC (AAA) | Name | Package policy | Rule IDs |
|---|---|---|---|
| 2.4.13 | Focus Appearance | Focus ring ≥ 2 px and ≥ 3:1 against fill and background (§5) | A11Y-003, A11Y-007 |
| 2.3.3 | Animation from Interactions | Reduced-motion guidance documented | A11Y-011 |

## 3. Contrast procedure (deterministic)

Never estimate. Use `scripts/figma/contrast-pairs.js` (with `scripts/lib/color.js`) when code can run (capability C5); otherwise do the same steps by hand and mark results `Unverified` unless each number was computed.

1. **Resolve** each variable through its alias chain **per mode** (Light and Dark) to a final color.
2. **Composite** transparency: if the foreground (or background) has alpha, blend it over the actual color beneath (in sRGB) before measuring.
3. **WCAG**: relative luminance per WCAG 2.x (sRGB piecewise transfer), ratio = (L1 + 0.05) / (L2 + 0.05).
4. **APCA**: APCA-W3 version **0.0.98G-4g** (pinned). Record the **signed** Lc. Light text on a dark background gives a **negative** Lc. Polarity follows the colors, not the theme.
5. Record **both hex values**, the mode, both results, and pass/fail per method in the table, so anyone can repeat it.

<!-- core -->
## 4. Thresholds

### WCAG (gate)

| Content | Minimum |
|---|---|
| Body / normal text | 4.5:1 |
| Large text | 3:1 |
| Meaningful non-text UI | 3:1 against adjacent colors |
| Placeholder text | 4.5:1 (placeholder is **not** exempt) |
| Disabled (inactive) controls | Exempt (WCAG 1.4.3 / 1.4.11), but see APCA row |

### APCA (confirmation) — package policy based on Bronze Simple Mode

| Content | Minimum \|Lc\| | Preferred |
|---|---|---|
| Body text (fluent reading) | 75 | 90 |
| Labels, short content text | 60 | 75 |
| Large / bold headings | 45 | 60 |
| Meaningful icons, focus ring, input borders | 45 | 60 |
| Placeholder text | 45 | 60 |
| Disabled text | 30 | 45 |
| Decorative dividers | 15 | — |

A contract may set stricter values in §9. A pair that passes one method and fails the other is a **finding** (never hidden).

Script roles (`scripts/lib/color.js` `THRESHOLDS`): `body-text`, `label-text`, `large-text`, `non-text-ui`, `placeholder`, `disabled`, `decorative`. Use `disabled` only for inactive controls; placeholder text always uses `placeholder`.
<!-- /core -->

## 5. Focus ring (package policy, based on 2.4.13 Focus Appearance — AAA)

- Visible on every focusable variant, Light and Dark.
- ≥ 2 px thick (or equivalent area).
- ≥ 3:1 against **both** the component fill and the surrounding background.
- Not clipped: no "clip content" on a parent that cuts the ring; outer ring needs set-view gap (see build variant grid).
- Visually distinct from Hover, Pressed, and Error.
- Bound to a semantic focus token (never raw hex).

## 6. Shade / tint follow-up

When a component-set example (or a user-cited example) is the reference:

1. Example passes both methods → follow its semantic roles and ramp steps.
2. Example fails → do not copy; move along the **approved ramp** to the nearest step that passes both. Reach that step through an existing semantic token or a new component-scoped token (`FP-*`). Repointing a shared token is a token value change (`FPV-*`, [foundation-mutation.md](foundation-mutation.md)), never a component fix.
3. No ramp step passes → stop and propose an `FP-*`. Never invent off-ramp hex or bind primitives.

## 7. Optional checks (when asked or when the contract lists them)

- Forced colors / high-contrast mode notes for developers.
- 200% text spot-check on the docs page.
- Reading order notes for complex components (Table, Calendar).
