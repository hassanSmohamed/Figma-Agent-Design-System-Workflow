# Foundation Mutation (the one path)

Creating or changing a shared Variable, collection, mode, or Style changes **every consumer**. There is exactly one procedure for it. Skills that need it:

| Skill | Calls this procedure for |
|---|---|
| `/ds-foundation-generate` | Bootstrap after `Approve FG-… vN Ready to Generate` |
| `/ds-foundation-extend` | Approved `FP-*` items and approved `FPV-*` value changes, run on their own |
| `/ds-build` Phase 1 | Approved `FP-*` rows in Plan Table C |
| `/ds-fix` | Approved `FP-*` found during repair |

## Gate

1. Each item has an `FP-*` (or `FG-*` table row) with every field below.
2. The human typed an approval that names the ID (and version for `FG`).
3. Capability check passed C1, C2, C6 (and C9 for new modes).
4. A checkpoint was saved.

## Required proposal fields

ID · type (variable / text style / effect style / paint style / layout guide / collection / mode) · exact name (per [naming.md](naming.md) or the Profile grammar) · collection or style group · data type · scopes · modes and values (alias first) · code syntax (WEB/ANDROID/iOS, when the Profile uses it) · description · hidden from publishing? · rationale · affected components · alternative considered · risk · approval status.

## Execution (in order)

1. **Re-verify** the gap still exists. If an equivalent now exists under another name → stop with `Blocked: live file drift` (never create a parallel token).
2. Create in the **existing** collection or style group named in the proposal. Never create a new collection unless the proposal type is `collection`.
3. Primitives: raw value, `hiddenFromPublishing = true`, scopes `[]`.
4. Semantic/component tokens: **alias** a primitive (or semantic) per mode; exact scopes (`FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR`, `GAP`, `CORNER_RADIUS`, `WIDTH_HEIGHT`, …); no `ALL_SCOPES` without a reason.
5. Fill **every mode**. An empty Dark value is a failure.
6. Set description and code syntax.
7. Styles: bind to variables where Figma allows; never invent shadow geometry; Arabic Text Styles follow [language-direction.md](language-direction.md) §4.
8. Re-read what was created and compare to the proposal (name, type, scopes, values per mode).
9. Log each item: ID · action · result · **rollback** (inverse action).
10. Update the Registry, Ledger, and — if the role set changed — the Foundation Profile (version bump).

## Token value change (`FPV-*`)

Changing the value or alias of an **existing** token (for example moving the Dark alias of `color/bg/brand` from `brand/300` to `brand/200`) changes every component that binds it. It is never a component-contract note.

**Prefer a narrower fix first:**

1. Bind an existing semantic token that already resolves to the passing step, or
2. Create a component-scoped token (`FP-*`, for example `color/button/bg/primary`) that aliases the passing step, and bind it in this component only (contract revision through `/ds-plan`).

Use `FPV-*` only when the shared token itself is wrong for most consumers.

**Proposal fields:** ID (`FPV-{COMP}-{PLAT}-{NNN}` or `FPV-SYS-{NNN}`) · token · collection · modes changed · before → after per mode (alias target and resolved hex) · **consumer list** (every component set and style that binds the token, from a file scan) · **before/after contrast table for every consumer pair** in every changed mode (WCAG + APCA, [accessibility.md](accessibility.md) §3) · rationale · alternative considered (the narrower fixes above) · risk · approval status.

**Rules:**

1. Only `/ds-foundation-extend` executes an `FPV-*`, after `Approve FPV-…` that names the ID. `/ds-build` and `/ds-fix` never repoint a shared token; they stop with `Blocked: shared token change needs FPV-… (run /ds-foundation-extend)`.
2. Any consumer pair that passes before and fails after → the proposal is rejected or revised. Never trade one component's contrast for another's.
3. Execution follows the gate and steps 1, 5, 8–10 above; the rollback is the previous alias per mode.
4. After execution, every consumer in state `Tested` or later gets `Re-test needed: FPV-…` in the ledger, and its next step is `/ds-test` (Build QA).

## Never

- Repoint a shared token from inside a component build or fix (use the narrower fix or an `FPV-*`).
- Rename or delete existing foundations (that is a migration: `MIG-*` + approval).
- Duplicate a solid color as both a Paint Style and a variable without a written migration reason.
- Combine axes in one mode name (`Dark-Mobile-AR`).
- Publish the library.
