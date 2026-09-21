---
name: ds-test
description: Read-only QA/test of one foundation component for one platform. Checks structure, tokens, Text Styles, variants/states, themes, a11y WCAG 2.2 design evidence, EN LTR + AR RTL, Web/Tablet/Mobile platform rules. Use after /ds-build.
---

# Design System Test

## Role

Act as an independent design-system QA reviewer.

## Objective

Run a read-only test of **exactly one foundation component on exactly one platform**. Produce evidence-based findings.

This Skill is read-only. Do not edit, fix, rename, detach, create, move, or delete anything.

## When to run

Run after `/ds-build` for the same component + platform.

```text
/ds-test
Test {Component Name} / {Web | Tablet | Mobile}.
Do not modify the file.
```

## Platforms

Choose exactly one per run:

| Platform | Meaning |
|---|---|
| Web | Responsive web / portal |
| Tablet | Tablet app |
| Mobile | Mobile app |

Naming target:

```text
{Component Name} / {Web | Tablet | Mobile}
```

Do not mix platforms in one test. Sibling platforms need separate `/ds-test` runs.

## Target resolution

Use this order:

1. Explicitly named component + platform in the prompt
2. Selected component set or component
3. Component set containing the selected instance
4. Current component page when the target is unambiguous

If no reliable target exists, return `Blocked: missing target component or platform`.

## Component Contract intake (`CC-*`)

Use the latest reliable Component Contract as the first expectation source.

Accepted sources, in priority order:

1. A `CC-*` contract frame or documentation block in the active Figma file
2. The latest `/ds-plan` or `/ds-build` report in the current conversation
3. A user-supplied contract excerpt with stable `CC-*` ID, version, and status

Before review, capture:

| Contract field | Required intake |
|---|---|
| Contract ID | Stable `CC-*` ID |
| Version | Exact contract version |
| Status | `Draft`, `Ready to Build`, `Blocked`, or `Built` |
| Scope | New component, non-breaking update, or migration |
| Platform | Web, Tablet, or Mobile (must match this run) |
| Source | Contract frame, plan/build report, or supplied excerpt |

Required section intake:

- Purpose and boundaries
- Architecture and anatomy
- Public property API
- Variant and state model
- Content contract
- Sizing and responsive behavior
- Platform contract
- Theme, localization, and RTL contract
- Accessibility contract
- Foundation and dependency map
- Acceptance criteria
- Assumptions, open questions, and decisions

If no reliable contract exists, continue the test but set result to `Fail` unless the prompt explicitly asks for contract-free exploratory QA. Record `Missing component contract` as a Major finding.

## Review principles

- Verify; do not assume
- Cite variant, layer, or property path
- Test resizing and mode behavior where tools allow
- Treat semantic variables as approved color/spacing/radius/effect bindings
- Treat the exact existing Text Style as the typography assignment API
- Treat typography variables inside the Text Style as style dependencies, not node substitutes
- Treat Light/Dark as modes
- Treat English/Arabic as content and Text Style concerns
- Do not fail for undocumented taste preferences
- Do not repair findings here — recommend `/ds-fix`

## Severity scale

| Severity | Meaning |
|---|---|
| Critical | Breaks task completion, accessibility, instances, or the component API |
| Major | Significant inconsistency, missing state coverage, or incorrect token/style use |
| Moderate | Friction, weak responsiveness, or maintainability risk |
| Minor | Documentation, naming, or polish with low functional risk |

## Test workflow

### 1. Identify contract and platform rules

Record purpose, anatomy, properties, states, dependencies, themes, RTL, accessibility expectations, contract ID/version/status, and platform-specific rules (hover/keyboard for Web; touch targets for Tablet/Mobile).

### 2. Structural test

Check naming, variant axes/values, duplicate or missing combinations, property linkage, nested instance integrity, detached instances, hidden layers without properties, unnecessary groups, absolute positioning, Auto Layout nesting, layer naming, stable dimensions, and resizing.

Flag variant explosion from Theme, Language, individual icons, icon position, width, or platform without structural need.

Also check contract drift: public API, states, dependencies, responsive/platform/RTL behavior vs `CC-*`.

### 3. Binding and token test

Inspect fills, strokes, text/icon colors, focus rings, padding, gaps, radii, expected dimensions, and effects.

Fail production layers that bind to primitive color when a semantic role should be used.

Fail unexplained raw fills, strokes, text colors, padding, gaps, or radii when Variables are expected.

Fail production text nodes that lack the exact approved Text Style even when visible values match.

Nested dependency reuse: fail rebuilt local Avatar, Badge/Status/Tag, Icon, Checkbox, Button, Input, Spinner, Menu, or Link when an approved component exists. Fail detached nested instances restyled into one-offs.

### 4. Typography and Text Style test

Architecture:

```text
Component text node
  → exact existing approved Text Style
    → typography variables inside that Text Style
```

For every text node (and intentional mixed range), check:

- Exact approved Text Style assigned
- Correct semantic role, language (EN/AR), and platform mode
- Internal typography-variable bindings inside the style
- No direct node-level typography bindings that bypass the style
- No accidental local typography overrides
- Semantic text color bound separately when not owned by the style
- Truncation, multiline, clipping, Arabic glyphs, mixed-direction content

Expected families after verifying active styles: English Inter; Arabic IBM Plex Sans Arabic.

### 5. Theme test

Test Light and Dark. Check role pairing, contrast, borders, focus, disabled clarity, status meaning, raised surfaces, overlays. Theme must not duplicate the component set.

### 6. Responsive and platform test

Minimum stress cases:

- Hug / Fill
- Minimum useful width and narrow container
- Long English and long Arabic labels
- Multiline supporting text
- Icon-only where supported
- Platform documentation example for this run’s platform

Platform focus:

- **Web:** Desktop / Tablet / Mobile viewports; keyboard focus styling must remain
- **Tablet / Mobile:** touch targets, pressed feedback, app layout conventions

Fail on overlap, unexpected clipping, unstable height/width, inconsistent Auto Layout across matching variants, or absolute positioning used to hide layout defects.

### 7. State-coverage test

Use the component checklist for the target (Button, Input, Checkbox, Table, etc.). Required states must be present or explicitly documented as unsupported for this platform.

### 8. Accessibility test (WCAG 2.2 design evidence)

Baseline: WCAG 2.2 Level AA design evidence. Do not claim full WCAG compliance from Figma alone.

Classify each check:

| Evidence class | Meaning |
|---|---|
| Design verified | Confirmed in Figma / screens |
| Documentation verified | Clearly specified for implementation |
| Runtime verification required | Needs code / browser / AT |
| Not applicable | Does not apply |

Cover:

- Contrast (text ≥ 4.5:1; large text / essential UI ≥ 3:1) — measure, do not guess
- Focus visibility (not clipped; distinct from Hover/Pressed/Error; Light + Dark)
- Target size (≥ 24×24 CSS px AA baseline; product Mobile/Tablet touch standard when present)
- Labels and icon-only naming guidance
- Non-color state/status cues
- Errors and validation (text, not color alone)
- Loading / status feedback guidance
- Reflow, long EN/AR, narrow container where applicable
- Reading order and grouping
- Motion / reduced-motion guidance when motion exists

Use stable IDs `A11Y-001`, `A11Y-002`, … for accessibility findings. Include principle, evidence class, variant/layer, platform, theme, language/direction, measurement, user impact, expected result, design fix, documentation fix, runtime handoff, and severity.

Never claim from Figma alone: semantic HTML, ARIA, accessibility-tree names, keyboard handling, screen-reader announcements, focus management, DOM order, live regions, or reduced-motion media queries.

### 9. EN LTR + AR RTL test

Check Leading/Trailing naming, Start/End alignment, directional icon mirroring only, layer order, Arabic typography, mixed-direction field values, action-group order, no duplicate RTL component sets, no Direction variant growth without structural need.

### 10. Documentation test

Check purpose, anatomy, property table, usage, do/don’t, token map, platform example, EN + AR examples, Light + Dark, accessibility guidance, readiness label, and `CC-*` traceability. Gaps that block safe handoff → recommend `/ds-document`.

## Pass gates

The component passes only when:

- No Critical findings remain
- No Critical or Major accessibility findings remain
- No direct primitive color binding on production layers
- No unexplained raw fill/stroke/text color/padding/gap/radius when Variables are expected
- Required nested dependencies are reused as instances when approved equivalents exist
- Required states are present or explicitly unsupported
- Light and Dark verified
- English and Arabic stress tests do not break layout
- Every production text node uses the exact approved Text Style for role, language, and platform mode
- Typography variables verified inside assigned Text Styles
- No unintended local typography overrides
- Auto Layout resizing is stable; no unintended overlap or unexpected clipping
- Matching variants use consistent Auto Layout sizing/padding/gaps
- Focus and disabled behavior are clear at design level
- Runtime-only checks are handed off, not falsely marked verified
- Public properties are usable; nested dependencies remain instances
- Documentation is sufficient for use on this platform
- Contract intake was attempted and drift was reviewed

Result labels:

- `Pass` — no Critical/Major; only optional Minor remain
- `Pass with minor findings` — no Critical/Major; Moderate/Minor only
- `Fail` — any Critical or Major remains, or missing contract without exploratory exemption

## Output format

### Test Result

- Component
- Platform
- Contract ID / version / status
- Result: `Pass`, `Pass with minor findings`, or `Fail`
- Critical / Major / Moderate / Minor counts
- Highest-risk issue

### Contract Intake

| Field | Value | Evidence source |
|---|---|---|

### Contract Drift

| Contract area | Contract says | Observed | Drift severity | Finding ID |
|---|---|---|---|---|

### Findings

| ID | Severity | Area | Variant or layer | Issue | Evidence | Expected result | Recommended fix |
|---|---|---|---|---|---|---|---|

Use stable IDs `QA-001`, `QA-002`, …. Use area `Contract drift` when the issue is mismatch vs `CC-*`. Accessibility findings also get `A11Y-*` IDs (may map to the same row or a linked row).

### Text Style Assignment Review

| Text node or role | Variant/state | Language | Platform/mode | Expected Text Style | Assigned Text Style | Internal variables verified | Local override | Result | Finding ID |
|---|---|---|---|---|---|---|---|---|---|

### Coverage Matrix

| Requirement | Supported | Verified | Notes |
|---|---|---|---|

### Theme and Language Matrix

| Scenario | Result | Evidence |
|---|---|---|

Include Light+EN, Dark+EN, Light+AR, Dark+AR, and this platform’s narrow/wide stress cases.

### Binding Summary

| Binding type | Correct | Raw | Primitive misuse | Missing semantic token |
|---|---:|---:|---:|---:|

### Nested Dependency Reuse

| Need | Approved dependency available | Observed | Result | Finding ID |
|---|---|---|---|---|

### Pixel-Perfect Auto Layout Review

| Check | Result | Evidence | Finding ID |
|---|---|---|---|

### RTL Readiness

| Check | Result | Evidence | Finding ID |
|---|---|---|---|

### Recommended Fix Order

1. Critical → 2. Major → 3. Moderate → 4. Minor  
Prioritize contract-drift findings at the same severity as the behavior they affect.

### Recommended Next Command

Return exactly one:

- `/ds-fix` — Critical or Major findings need repair
- `/ds-document` — component passes but docs/hand-off incomplete
- `/ds-plan` — contract missing, Blocked, or major drift needs replanning
- `Component is ready` — Pass with no blocking follow-up

## Completion gate

Complete only when:

- The component was not modified
- One component + one platform were tested
- Contract intake was attempted and recorded
- Structure, bindings, typography, theme, responsive/platform, states, a11y, RTL, and documentation were covered
- Nested dependency reuse was reviewed when relevant
- Every failure has evidence and a stable `QA-*` (and `A11Y-*` when accessibility)
- Pass result follows the stated gates
