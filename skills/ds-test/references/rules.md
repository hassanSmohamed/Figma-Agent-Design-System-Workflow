# Test Rule Catalog

Each check has a stable rule ID. Review, Build self-check, Test, and Fix all use these IDs, so results can be compared across runs.

How to read the columns:

- **Default severity** is the starting severity. Raise it when the user impact is worse. Lower it only with a written reason.
- **Scope** says when the rule runs: `Build` means Build QA (every test run), and `Release` means Release QA only.
- **Script** names the function that checks the rule automatically. `Manual` means you check it by inspection or in the sandbox. Script rows with `status: Unverified` (mixed values, unresolvable bindings) are checked by hand and never reported as `Pass`.

## STR — Structure

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| STR-001 | No forbidden axes (Theme, Language, viewport; Direction outside Level 3); no EN/AR duplicate sets | Critical | Build | Manual |
| STR-002 | Set name `{Component} / {Platform}`; helpers `.{Component}/{Part}`; logical layer names | Moderate | Build | Manual |
| STR-003 | Variant matrix complete for valid combinations; invalid ones absent; no duplicates | Major | Build | Manual |
| STR-004 | No variant bounding boxes overlap in the set view (render bounds) | Major | Build | `checkSetOverlap` |
| STR-005 | No variant clipped by the set frame | Major | Build | `checkSetOverlap` |
| STR-006 | No absolute positioning inside Auto Layout used to fake layout | Major | Build | `auditBindings` |
| STR-007 | Grid readable: one property changes per row/column in contract order; panel order = grid order | Moderate | Build | `layoutVariantSet` (dry run) |
| STR-008 | No hidden layers without a controlling property; no stray groups | Minor | Build | Manual |

## TOK — Variable bindings

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| TOK-001 | No raw colors on production layers or in nested-instance overrides | Major | Build | `auditBindings` |
| TOK-002 | No primitive variables on production layers | Major | Build | `auditBindings` |
| TOK-003 | Padding, gap, radius (any node), fixed width/height, min/max, and stroke weight bound to semantic number variables | Major | Build | `auditBindings` |
| TOK-004 | Bindings match contract §10 (right role for the part/state) | Major | Build | Manual |

## TXT — Typography

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| TXT-001 | Every text node has a Text Style | Major | Build | `auditTextStyles` |
| TXT-002 | No local typography overrides on top of the style | Major | Build | `auditTextStyles` |
| TXT-003 | Language matches the style prefix (Arabic text → `Text/AR/…`) | Major | Build | `auditTextStyles` (set, then sandbox `rootId` for stress copy) |
| TXT-004 | Style role matches contract §8b (Label vs Body, size) | Moderate | Build | Manual |
| TXT-005 | No node-level typography variables bypassing the style | Moderate | Build | Manual |
| TXT-006 | Arabic styles: letter spacing 0 | Major | Build | `auditArabicStyles` |
| TXT-007 | Arabic styles: no case transform | Major | Build | `auditArabicStyles` |
| TXT-008 | Arabic styles: line height ≥ Profile minimum in every viewport mode | Moderate | Build | `auditArabicStyles` |
| TXT-009 | Diacritics not clipped in fixed-height boxes | Major | Build | Manual (sandbox, AR pack diacritics line) |

## THM — Theme

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| THM-001 | Light and Dark both render with correct roles | Major | Build | Manual (sandbox modes) |
| THM-002 | Every bound variable has a value in every mode | Critical | Build | `checkContrastPairs` (missing → Unverified) |

## RSP — Responsive / platform

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| RSP-001 | Hug / Fill / min / max behave per §6 at narrow and wide widths | Major | Build | Manual (sandbox) |
| RSP-002 | Web: viewport values come from viewport variables (Large / Medium / Small), not viewport variants | Major | Build | Manual |
| RSP-003 | Tablet / Mobile: pressed feedback, no hover-only affordance | Major | Build | Manual |
| RSP-004 | Matching variants share padding, gap, and sizing | Moderate | Build | Manual |

## STA — States

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| STA-001 | Every contracted state exists (catalog states for this component) | Major | Build | Manual |
| STA-002 | States are visually distinct (focus ≠ hover ≠ pressed ≠ error) | Major | Build | Manual |

## A11Y — Accessibility (WCAG 2.2 mapping in `standards/accessibility.md`)

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| A11Y-001 | Non-color cue for state/status (1.4.1) | Major | Build | Manual |
| A11Y-002 | Text contrast WCAG + APCA per role (1.4.3) | Major | Build | `checkContrastPairs` |
| A11Y-003 | Non-text contrast ≥ 3:1 + APCA (1.4.11), incl. focus ring vs fill **and** background | Major | Build | `checkContrastPairs` |
| A11Y-004 | Reflow with long EN/AR (1.4.10) | Moderate | Build | Manual (sandbox) |
| A11Y-005 | Text spacing tolerance, Latin (1.4.12) | Moderate | Release | Manual |
| A11Y-006 | Text can grow (1.4.4) | Moderate | Release | Manual |
| A11Y-007 | Focus state exists for every focusable variant, Light and Dark (2.4.7); ring ≥ 2px (2.4.13 policy) | Critical | Build | Manual |
| A11Y-008 | Focus ring not clipped by the component or a clipping parent (2.4.7) | Major | Build | Manual (render bounds) |
| A11Y-009 | Target size ≥ Profile target (2.5.8 + platform) | Major | Build | Manual (measure) |
| A11Y-010 | Error text not color alone; icon-only has a label property (3.3.1 / 3.3.2) | Major | Build | Manual |
| A11Y-011 | Motion has a non-motion cue (2.2.2) + reduced-motion note (2.3.3 policy) | Moderate | Release | Manual |
| A11Y-012 | Runtime handoff written (4.1.2, APG pattern) | Minor | Release | Manual |

## LNG — Language

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| LNG-001 | Every text role has EN + AR (every enabled pack) | Major | Build | Manual |
| LNG-002 | Long EN and long AR wrap/truncate per §5 without breaking layout | Major | Build | Manual (sandbox) |
| LNG-003 | Mixed-direction values stay LTR, characters not reversed | Major | Build | Manual |
| LNG-004 | Stress copy is flagged, EN/AR keep the same meaning | Minor | Release | Manual |

## DIR — Direction

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| DIR-001 | RTL order and alignment correct; LTR not regressed | Critical | Build | Manual (sandbox) |
| DIR-002 | Directional slots mirror; generic slots and symbols don't | Major | Build | Manual |
| DIR-003 | Level 2 helper properties exposed on the parent; no Direction axis on main set (unless Level 3 + `DEC-*`) | Major | Build | Manual |
| DIR-004 | State meaning preserved in RTL (Toggle On stays On; primary stays primary) | Major | Build | Manual |

## DEP — Nested dependencies

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| DEP-001 | Nested system parts are instances, not rebuilt layers | Major | Build | `auditBindings` (frame named like the part with no instance of it inside) |
| DEP-002 | Nested instances not detached; driven by the Table D control | Major | Build | Manual |

## DOC — Documentation (Release QA)

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| DOC-001 | Docs page exists with all required sections | Major | Release | Manual |
| DOC-002 | Every public property has a capability line and a live example | Major | Release | Manual |
| DOC-003 | Theme, Language, Direction shown in separate columns | Moderate | Release | Manual |
| DOC-004 | Foundations linked, not redefined; no section overlap | Minor | Release | Manual |
| DOC-005 | Contract ID + version + change history shown | Moderate | Release | Manual |

## CON — Contract

| Rule | Check | Default severity | Scope | Script |
|---|---|---|---|---|
| CON-001 | Built API = Table B (names, values, defaults, order) | Critical | Build | Manual |
| CON-002 | Built states, deps, responsive, Language, Direction match the contract | Major | Build | Manual |
| CON-003 | Contract record state and version match the ledger | Moderate | Build | Manual |
