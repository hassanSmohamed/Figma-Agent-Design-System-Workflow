# Eval — Button / Web happy path

Starting state: an empty Figma file with write access and Plugin API JavaScript available.

## 1. Generate

Prompt:

```text
/ds-foundation-generate
Generate Variables and Styles for Acme. Structure: Primer. Brand primary: #0B5FFF.
Typefaces: Inter (EN), IBM Plex Sans Arabic (AR). Themes: Light, Dark. Viewport typography: yes.
```

- MUST load `figma-use` before every `use_figma` call and pass `skillNames: "figma-use,ds-foundation-generate"`.
- MUST print the capability check, `Package 2.2.0`, and `State: workspace (ds-state/{file-key}/)` in the header.
- MUST output a blueprint with ID `FG-ACME-PRIMER-001` and stop for `Approve FG-ACME-PRIMER-001 v1 Ready to Generate`.
- MUST NOT create anything before that phrase.
- After approval, FILE: primitives are hidden from publishing with empty scopes. Semantic variables alias primitives and have a value in every mode. `color/border/focus` exists.
- FILE: every `Text/AR/…` style has letter spacing 0, no case transform, and line height ≥ 1.5.
- STATE: `ds-state/{file-key}/` holds `profile.md` (`FPR-ACME-001 v1`), `registry.md` and `ledger.md`. The Figma file has **no** `_DS System` page.
- MUST report contrast rows with signed APCA Lc and a checkpoint name.

## 2. Architecture review (Post-generate check)

- MUST lead with the Missing Points & Solutions table.
- MUST say `Profile matches file` (or list the drift).
- MUST NOT write any variable or style.

## 3. Dependencies

Prompt: `/ds-run-workflow Run the full workflow for Button on Web.`

- MUST stop with `Blocked: dependency Icon / Web not Built` and offer to run Icon first. Spinner is optional, so it doesn't block.
- After Icon / Web reaches `Built`, the workflow continues to Review.

## 4. Review

- MUST read the Profile and use its names. MUST NOT mention `spacing-11xl` or `Color/Semantic` unless they are in the file.
- MUST include Variables and all four style types (or `N/A` with a reason).
- MUST include the Plan Handoff Package with a suggested `CC-BUTTON-WEB-001`.
- Readiness MUST follow the rule: `Ready with gaps` only when every Major is tracked.

## 5. Plan

- MUST define the API only in Table B. The Snapshot rows MUST match Table B values exactly.
- §8c MUST give a Level per part (Content row = Level 2 helper `.Button/Content`).
- §5 MUST have an AR string for every role, flagged `Stress copy`, with the same meaning as the EN string.
- MUST add a numerals `OQ-*` if the Profile says `open-question`.
- Table C MUST use `FP-*` IDs only. MUST NOT contain `G-0`.
- STATE: contract record `contracts/CC-BUTTON-WEB-001.md` exists with Tables B–E.
- MUST stop with an approval request that includes a version (`v1.0`).

## 6. Build

Prompt: `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build` then `/ds-build`.

- MUST quote the approval word for word.
- MUST save a checkpoint before the first write.
- FILE: `.Button/Content` exists with `Direction = LTR | RTL`. The main set has no Direction, Theme or Language axis. The helper's properties are exposed on the parent.
- FILE: there are no overlapping variants (`checkSetOverlap` returns 0).
- MUST print the contrast table with 10 columns and signed Lc values. The focus ring MUST be checked against both the fill and the background.
- MUST print a change log where every row has a Rollback value.
- MUST report `Sandbox cleaned: Yes`. FILE: `_DS Sandbox` has no leftover frames.
- STATE: the ledger shows state `Built` and the node IDs of the set and the helper.

## 7. Test (Build QA)

- MUST show `Gates checked: n/total`.
- Every finding MUST have a rule ID from the catalog and a fingerprint.
- MUST NOT fail because docs are missing.
- Result label MUST be one of `Pass`, `Pass with findings` or `Fail`.

## 8. Fix → retest

Starting state: manually bind one secondary fill to a primitive.

- Test MUST report `TOK-002` with fingerprint `TOK-002 | Hierarchy=secondary, State=… | …`.
- Fix MUST repair only that fingerprint, print a change log with rollback, and set `Fix cycles: 1`.
- The retest MUST reuse the same QA ID and mark it `Resolved`.

## 9. Document → Release QA → Release → Handoff

- Document MUST ask for the template the first time, save the docs style record (`docs-style.md`), and NOT ask again on a second run.
- The docs example tables MUST have separate Theme, Language and Direction columns.
- Release MUST refuse until `Published: yes` is given.
- Handoff MUST label every token mapping (`Direct` / `Transform required` / `Lossy` / `Unsupported`) and mark the runtime notes as `Implementation requirement`.
