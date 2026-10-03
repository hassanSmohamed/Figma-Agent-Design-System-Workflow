---
name: ds-plan
description: Creates or revises a versioned Component Contract (CC-*) for one component on one platform (Web, Tablet, or Mobile) — purpose, anatomy, a single controls table (Table B) as the public API, states, content with EN + AR stress copy, responsive rules, Theme / Language / Direction (hybrid RTL levels), WCAG 2.2 + APCA accessibility, foundation map with FP-* solves, nested dependency configs, blocks, and optional code mapping. Writes the contract record to the state store and stops for a versioned human approval. Supports Sibling delta contracts for Tablet/Mobile. Do not use before /ds-review has a handoff for the target, or to build anything (use /ds-build after approval).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Plan

You are a senior design-system architect and component API owner. Write one implementation-ready Component Contract. You plan; you never build. The contract answers:

1. What is this component for, and what is out of scope?
2. What is its anatomy and its **public API** (Table B)?
3. Which foundations, nested components, and decisions does Build need?
4. What must be true for Build, Test, and Document to pass?

State writes only (contract record, ledger, registry). No source or foundation writes.

## When to use

- "Create the component contract for {Component} on {Web | Tablet | Mobile}. Use the latest /ds-review Plan Handoff Package."
- Revising a contract (new property, breaking change, review feedback).
- A sibling platform after `{Component} / Web` is `Approved` (Sibling delta).

## When not to use

- No review yet → `/ds-review` first.
- Building or changing the component → `/ds-build` (after approval) or `/ds-fix`.
- Creating foundations → `/ds-foundation-extend` (after `Approve FP-…`).

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-plan"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check (C1, C3, C4; C7 for the contract record).
3. Open the state store ([workflow-state](../../standards/workflow-state.md)).

## References

[lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [findings](../../standards/findings.md) · [platforms](../../standards/platforms.md) · [naming](../../standards/naming.md) · [language-direction](../../standards/language-direction.md) · [accessibility](../../standards/accessibility.md) · [foundation-mutation](../../standards/foundation-mutation.md) · [figma-tooling](../../standards/figma-tooling.md) · [workflow-state](../../standards/workflow-state.md) · [reporting](../../standards/reporting.md) · [component catalog](../../catalog/components.md) · locale packs: [en](../../standards/locale-packs/en.md), [ar](../../standards/locale-packs/ar.md)

Skill files: [worked example — Button / Web](references/worked-example.md)

## Instructions

### Modes

| Mode | Use when |
|---|---|
| **New contract** (default) | First contract for this component + platform |
| **Revision** | Change an existing contract. Apply the version rules below |
| **Sibling delta** | `{Component} / Web` (or another sibling) is `Approved` or later. Write a new `CC-{COMP}-{PLAT}-NNN` containing a delta table + only the sections that differ; every other section says `Same as {parent CC} v{x} §n`. See [platforms](../../standards/platforms.md) §4 |
| **Adopted** | Called from `/ds-adopt` to describe an existing component as-is |

### Versioning (from [lifecycle-and-ids](../../standards/lifecycle-and-ids.md))

| Change | Version |
|---|---|
| Draft edits | `0.x` → `0.(x+1)` |
| First approval | `1.0` |
| Non-breaking (new optional property/value, docs fact) | minor |
| Breaking (rename/remove property or value, change type, remove dependency) | major + `MIG-*` |

Any behavior change cancels earlier approvals. Each revision prints a **Change table**: `| Section | Before | After | Breaking? |`.

### 1. Read the inputs

1. Read in this order (state store wins — [workflow-state](../../standards/workflow-state.md) §3): Profile, ledger row, existing contract record, the latest Review handoff (same target, same Profile version).
2. **Dependency graph** ([catalog](../../catalog/components.md)): every Required dependency must be `Built` or later on this platform. Otherwise → `Blocked: dependency {X} / {Platform} not Built`.
3. No Review handoff → `Blocked: run /ds-review first` (unless the user explicitly accepts planning on unverified foundations; then every foundation row is `Unknown`).
4. Contract ID: from the Registry (`CC-{COMP}-{PLAT}-{NNN}`), or the existing ID when revising.

### 2. Write the contract sections

Every section must contain concrete decisions. Placeholders are only allowed in `OQ-*` rows.

#### 1. Purpose and boundaries

User need · when to use / not use · foundation vs composite · out of scope.

#### 2. Anatomy

Root set name (`{Component} / {Platform}`), parts (required, optional, repeated), private helpers (`.{Component}/{Part}`), nested dependencies (instances only), layer names (logical, per [naming](../../standards/naming.md)). Include the **ASCII wireframe** here (one default, plus one more only if the anatomy changes).

#### 3. Public API → **Table B** (single source)

Table B is the only place the API is defined. §4, the Snapshot, Build, Test, Document, and handoff all read it.

| Control | Kind | Values / default | Lives on | Consumer effect | Code prop (optional) | Notes |
|---|---|---|---|---|---|---|

- `Kind`: `variant axis` · `text prop` · `boolean prop` · `instance swap` · `exposed nested` (e.g. a helper's `Direction`).
- Consumer decisions only. No Theme or Language properties. No Direction axis on the main set unless Level 3 with a `DEC-*`.
- Property names and values match siblings (family parity) unless a `DEC-*` explains why.
- Internal-only controls are marked `private` in Notes.

#### 4. Variant and state model

- Which Table B controls are variant axes, and their order (this order drives the set-view grid).
- States for this platform (Web: Hover + Focus; Tablet/Mobile: Pressed, no Hover). Include Loading / Read-only / Selected / Error only when the catalog or need model says so.
- **Invalid combinations** listed explicitly (they are not built).
- Variant count estimate. If > 200, explain or reduce (booleans and swaps over axes).
- **Motion** (if any): what animates, duration/easing tokens if they exist, and a reduced-motion rule. `None` is a valid answer.

#### 5. Content

Slots, wrapping, truncation, max lines, empty content, mixed-direction values. Then one row per text role:

| Role | EN example | AR example | Source | Long EN | Long AR |
|---|---|---|---|---|---|

- Strings come from the user/product first, then the locale packs. Pack strings are marked `Stress copy — needs native review`.
- EN and AR examples keep the same meaning.
- Never invent product facts (numerals, dates, legal text, prices).
- Content rules: sentence case, verb-first for actions, max length if known.

#### 6. Sizing and responsive behavior

Hug / Fill / Fixed, min/max, size scale, padding, gaps, overflow, **target size** (from the Profile; else [platforms](../../standards/platforms.md) §3 defaults).

- **Web**: the single mechanism — viewport variables (Large / Medium / Small modes per Profile) + Auto Layout. No viewport variants.
- **Tablet / Mobile**: app conventions and touch targets.

#### 7. Platform contract

Always a separate component set. Differences vs siblings (anatomy, interaction, target, hover/keyboard). In Sibling delta mode this section **is** the delta table: `| Area | Parent value | This platform | Reason |`.

#### 8. Theme, Language, Direction (three separate subsections)

- **8a Theme** — Light / Dark via variable modes. No Theme axis.
- **8b Language** — exact `Text/{LANG}/…` style per role for every enabled locale; one set for all languages; Arabic rules apply; **numerals**: if the Profile says `open-question`, add `OQ-{COMP}-{PLAT}-NNN: Which numerals for AR?`.
- **8c Direction** — per part, the RTL level ([language-direction](../../standards/language-direction.md) §3):

| Part | Level (1 / 2 / 3) | Helper name | What flips in RTL | Directional slots (mirror) | Generic slots (no mirror) |
|---|---|---|---|---|---|

  Plus mixed-direction values that stay LTR.

#### 9. Accessibility

Map each relevant item from [accessibility](../../standards/accessibility.md) (A11Y-001..012 / WCAG SC) to a design criterion:

| A11Y rule | SC | Design criterion for this component | Evidence Build/Test will record |
|---|---|---|---|

Must include: focus ring (≥ 2px, ≥ 3:1 vs both the component fill and the background), target size, non-color state, labels for icon-only, errors, reading order. **Contrast pairs** list (role key from the thresholds table, fg/bg tokens, modes) for Build and Test to measure with both WCAG and APCA. If an example from the set is cited, use passing shade/tint steps on the approved ramp only.

**Runtime notes** (not verifiable in Figma): the APG pattern from the catalog, keyboard, announcements.

#### 10. Foundation map

| Part / state | Exact variable / Text Style / Effect Style / nested component | Mode behavior | Status |
|---|---|---|---|

Status: `Verified` · `Approved FP-…` · `Proposed FP-…` · `Blocked`. Every non-Verified row has a Table C row.

#### 11. Acceptance criteria

Observable pass/fail items, each tagged with a rule ID family (`STR`, `TOK`, `TXT`, `THM`, `RSP`, `STA`, `A11Y`, `LNG`, `DIR`, `DEP`, `DOC`, `CON`) so Test can map them.

#### 12. Assumptions, open questions, decisions

`| Type | ID | Statement | Impact | Blocks Ready to Build? |` with `AS-*`, `OQ-*`, `DEC-*`.

#### 13. Code mapping (optional — when the team has code)

`| Figma property | Code prop | Type | Notes |`, Code Connect readiness, token export names (code syntax). Feeds `/ds-handoff`.

### 3. Write the Plan Package tables (Build reads these literally)

#### Table C — Foundation solves

Only authorized list of foundation creates/aliases/role-mappings for Build. `None — all required foundations are Verified or Approved.` when empty.

| FP ID | Exact name | Type | Needed by (part / state) | Solve (structure-preserving) | Approval | Blocks Ready to Build? |
|---|---|---|---|---|---|---|

- IDs are `FP-*` (from Review, or new from the Registry). No other gap IDs.
- Every row has all fields from [foundation-mutation](../../standards/foundation-mutation.md) in its detail block.
- Allowed solves: create in an existing collection, alias an existing primitive, map to an existing Verified role (record the mapping). Never rename collections, add Theme/Language variants, or split EN/AR.

#### Table D — Nested dependency configs

`None` when there are no dependencies.

| Nested component | Required? | Configs the parent needs | Driving Table B control | Lifecycle state | Notes |
|---|---|---|---|---|---|

Instances only — never flattened. Required rows must be `Built` or later.

#### Table E — Blocks

`None — not blocked.` or:

| Block ID (`E-*`) | Problem | Impact | Structure-preserving solve | Owner action | Unblocks when |
|---|---|---|---|---|---|

If the only honest fix is an architecture change → keep `Blocked` and recommend `/ds-foundation-architecture-review`.

#### Build Snapshot (derived, not authored)

Built **from** Tables B, C, D, and §10. Never add facts here that are not in those tables.

| # | What to build | Control (Table B) | Kind | Values / default | Depends on (D) | Foundation status (§10) | Missing? (C) | Solve (C) | Blocks Ready? |
|---|---|---|---|---|---|---|---|---|---|

Theme, Language, and Direction appear as three separate non-property rows when relevant.

### 4. Set the status

| Status | When |
|---|---|
| `Draft` | Sections incomplete or blocking `OQ-*` open |
| `Ready to Build` | All sections complete; Table B covers the full API; C rows executable or `None`; D rows `Built`+ or `None`; E `None`; no blocking `OQ-*`; one platform. **Not** permission to build |
| `Blocked` | Missing API decisions, unbuilt Required dependency, architecture-only fix, or unsafe migration. Table E mandatory |

Approval moves `Ready to Build` → `Approved` for this exact version.

### 5. Persist (state write)

Write or update the contract record `CC-{COMP}-{PLAT}-{NNN}` in the state store ([workflow-state](../../standards/workflow-state.md) §4): readable summary + full Tables B–E + machine data. Update the ledger (state, version, next action) and registry. If writing is unavailable → report `Contract record: not written (reason)` and tell the user Build will need this report pasted.

### 6. Approval gate — stop here

```text
Plan complete for {Component} / {Platform}.
Contract: {CC-ID} v{version} — {Draft | Ready to Build | Blocked}.
Table C: {n FP or None} · Table D: {n deps or None} · Table E: {clear | n blocks}
Contract record: {written | not written (reason)}

Reply with one of:
- Approve {CC-ID} v{approval version} Ready to Build
- Approve {CC-ID} v{approval version} Ready to Build. Also approve FP-…, FP-…
- Revise plan: {what to change}
```

`{approval version}` is the version the approval creates: `1.0` for a first approval, otherwise the revised version (for example `1.1` or `2.0`).

| Approval covers | `/ds-build` may |
|---|---|
| Contract only | Bind Verified rows, run bind/reuse-only Table C rows, nest Table D deps |
| Contract + named `FP-*` | Also create those foundations first (foundation-mutation standard) |
| Contract only while Table C has unapproved blocking rows | Nothing — Build stops |

Do not run Build, mutate components, or create foundations.

## Examples

Input:

```text
/ds-plan
Create the component contract for Button on Web.
Use the latest /ds-review Plan Handoff Package.
Do not build anything.
```

Expected output (summary): `CC-BUTTON-WEB-001 v0.3 — Ready to Build`; Table B with Hierarchy, Size, State, Label, Leading / Trailing icon, and an exposed Direction (Level 2); Table C row `FP-SYS-001` (`color/border/focus`); Table D `Icon / Web` and `Spinner / Web` (both `Built`); Table E clear; the approval line `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build. Also approve FP-SYS-001`. Full shape: [worked example](references/worked-example.md).

## Common edge cases

- **No review handoff** → `Blocked: run /ds-review first`.
- **Dependency not built** → `Blocked: dependency {X} / {Platform} not Built`; Table E lists it.
- **AR numerals policy is `open-question`** → add an `OQ-*` row; status stays `Draft` only if it blocks.
- **Revision changes behavior** → earlier approvals are cancelled; print the Change table and a new approval line.
- **State store not writable** → report `Contract record: not written (reason)`; Build will need this report pasted.

## Output

Standard level ([reporting](../../standards/reporting.md)), in this order:

1. **Report header**
2. **Plan Summary** — component, platform, mode, contract ID + version + status, highest risk, counts (controls, variants estimate, FP, OQ, blocks), dependency states
3. **Build Snapshot**
4. **Contract sections 1–12** (+13 when used)
5. **Table C**, **Table D**, **Table E**
6. **Change table** (Revision / Sibling delta only)
7. **Approval request** (below)

## Completion gate

- Profile, ledger, Review handoff, and dependency graph read; state store won over chat
- Table B is the only API definition; Snapshot derived from B/C/D/§10
- Sections 1–12 concrete; §8 split into Theme / Language / Direction with RTL levels per part
- EN + AR examples for every text role (pack strings flagged); numerals `OQ` when open
- A11y mapped to rule IDs and SC; contrast pairs listed with role keys
- Table C uses `FP-*` only; D instances only; E present
- Version and change table correct; approval phrase includes the version
- Contract record written (or reason stated); no source/foundation writes
