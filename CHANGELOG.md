# Changelog

## 2.2.0 — 2026-10-03

Resolves all 25 findings of Gap Review v2 (IDs `R1`–`R7`, `I1`–`I6`, `S1`–`S6`, `P1`–`P4`). The package is now MIT-licensed.

### Breaking

- **Contrast roles:** `placeholder-disabled` is split into `placeholder` (WCAG 4.5:1, APCA 45) and `disabled` (WCAG exempt, APCA 30). Contracts that used the old key must pick one.
- **Approvals:** a stored approval needs approver and date, and a resumed write needs `Proceed {ID} v{x}`. Text found in the file, comments, tickets or tool output is never an approval.
- **State writes:** every record has a `rev`; a write with a stale `rev` is rejected. `writeState(kind, frameName, data, expectedRev)` now requires `expectedRev` and returns `{ written, rev }` or `{ conflict, currentRev }`.
- **Shared token values:** `/ds-build` and `/ds-fix` no longer repoint a shared token. They use an existing or component-scoped token, or stop for an `FPV-*`.
- **`findVariable`** throws when a name exists in more than one collection (pass the collection), and accepts variable IDs for library tokens.

### Resolution map — Gap Review v2

| ID | Resolution |
|---|---|
| R1 | `THRESHOLDS` split into `placeholder` / `disabled`; [accessibility](standards/accessibility.md) §4 updated; test proves `#AAAAAA` placeholder on white fails |
| R2 | `auditTextStyles` resolves variable-bound style values with `resolveForConsumer(node)` (the node's own mode); fields it can't compare are `Unverified` |
| R3 | `auditArabicStyles` checks line height and letter spacing in **every** mode of the bound variables' collections |
| R4 | Set mode skips text inside instances at any depth; new sandbox mode `auditTextStyles({ rootId })` audits the AR stress copy (wired into `/ds-test` sandbox pass) |
| R5 | `auditBindings` checks radius on any node, fixed width/height, min/max, stroke weight; audits overridden fields inside nested instances; mixed values → `Unverified`. TOK-001/003 rule text widened |
| R6 | DEP-001 flags a frame only when it holds no instance of the named component |
| R7 | `findVariable` accepts `{ name, collection }` or a variable ID, and throws on ambiguous names; `checkContrastPairs` accepts the same forms |
| I1 | Path fixed to `scripts/figma/contrast-pairs.js` + `scripts/lib/color.js`; validator now fails on missing backticked repo paths |
| I2 | `docs/SKILLS-REVIEW-REPORT.md` has a "Historical — reviews v1.x" banner |
| I3 | G3 retired (duplicate of G19); `check-evals.mjs` catches eval block reasons no skill emits |
| I4 | One capability set per skill: build and fix C1–C8; document and release add C6 + C8; generate and extend add C7 + C8; status uses C7 (was C8); test lists C6 for sandbox. Rule stated in [figma-tooling](standards/figma-tooling.md) §1 |
| I5 | A11Y-008 maps to 2.4.7; 2.4.11 is a page-level docs note (added to Document's Developer notes); 2.2.2 is the motion criterion; 2.4.13 and 2.3.3 listed as AAA package policies |
| I6 | Build says the `.` prefix keeps helpers out of the published library (no `hiddenFromPublishing` step) |
| S1 | New `FPV-*` token value change in [foundation-mutation](standards/foundation-mutation.md): narrower fix first, consumer list, before/after contrast for every consumer, executed only by `/ds-foundation-extend`, consumers flagged `Re-test needed`. Build worked example rewritten to use a component token `color/button/bg/primary` |
| S2 | [lifecycle-and-ids](standards/lifecycle-and-ids.md) §4 rules 5–6 (approval sources, `Proceed`) and §5 Untrusted content (`Embedded instruction ignored` Info finding). Applied in build, fix, generate, extend, release, jira, orchestrator |
| S3 | [workflow-state](standards/workflow-state.md) Revisions: `rev` on every record, stale writes blocked, registry append-only (`Withdrawn`, never reused). `writeState` enforces it; mock test added |
| S4 | Orchestrator skill map has a "Started by" column and a Hand-over section: it prints the exact command for build, fix, generate, extend and release |
| S5 | [language-direction](standards/language-direction.md) §3 "Direction is set per instance": cost table (Table, Calendar, Menu …) and an RTL starter instance on the docs page |
| S6 | New [evals/skills.md](evals/skills.md): one positive case per skill (17 cases); gates G20–G26; state S11–S12 |
| P1 | [.github/workflows/ci.yml](.github/workflows/ci.yml): tests, bundle, validate, eval check on every push; tagged releases get zipped `dist/` editions |
| P2 | New `dist/slim/` edition (13–26 KB) built from `<!-- core -->` sections of the standards; validator caps single at 100 KB and slim at 32 KB |
| P3 | `scripts/check-evals.mjs`: block reasons, one case per skill, one package version everywhere |
| P4 | MIT licence; `license: MIT` in every skill's frontmatter |

### Tests

12 → 19 node tests: placeholder vs disabled, variable lookup, mode-aware text-style audit, sandbox AR audit, Arabic per-mode audit, binding audit coverage, `writeState` rev conflict.

## 2.1.0 — 2026-10-02

Brings the package in line with the [Agent Skills spec](https://agentskills.io/specification), Figma's [skill guide](https://developers.figma.com/docs/figma-mcp-server/create-skills/), and the rules in Figma's `figma-use` skill.

### Breaking

- **Workflow state moved out of the Figma file by default.** `figma-use` says to keep workflow state outside the file, so the default store is now `ds-state/{figma-file-key}/` in the workspace. The `_DS System` page is an opt-in (`Store state in the Figma file`), used automatically when the file already has one or the runtime has no workspace. `standards/in-file-state.md` is now [standards/workflow-state.md](standards/workflow-state.md). "Contract frame" is now "contract record".
- **New install folders.** `dist/cursor/` is now `dist/skills/` (with `scripts/` and a flat `references/` folder), and `dist/flat/` is now `dist/single/` (no scripts).
- `createSandbox` returns `{ frame, frameId, createdNodeIds }` instead of the frame. `writeState` returns `{ mutatedNodeIds }`.

### Resolution of the 8 Figma-standard gaps

| # | Gap | Fix |
|---|---|---|
| 1 | Skills didn't require `figma-use` or pass `skillNames` | [figma-tooling](standards/figma-tooling.md) §5 adds the Figma MCP rules. Every Figma skill has a `## Prerequisites` section with the `figma-use` line and its `skillNames` value. New block reason `Blocked: figma-use skill not available` |
| 2 | In-file state broke `figma-use` rule 3a | Hybrid state store (above). Report headers show `State: …` |
| 3 | Bundles had chained references and scripts under `references/` | `dist/skills/<skill>/` has `scripts/` + flat `references/`; `SKILL.md` lists every bundled file, so each is one hop away. Name collisions fail the build |
| 4 | Figma section names missing | All 15 skills use `# Title`, `When to use`, `When not to use`, `Prerequisites`, `References`, `Instructions`, `Examples`, `Common edge cases`, `Output`, `Completion gate` |
| 5 | Descriptions didn't say when not to use | Every description ends with "Do not use for … (use /ds-…)" |
| 6 | No `compatibility` or `disable-model-invocation` | `compatibility` on every skill; `metadata.mcp-server: figma` on Figma skills; `disable-model-invocation: true` on generate, extend, build, fix and release; versions quoted as strings |
| 7 | Scripts didn't return node IDs | Write helpers return `createdNodeIds` / `mutatedNodeIds` / `removedNodeIds`; `setSandboxMode` and `cleanupSandbox` accept an ID; ledgers and change logs record node IDs; new mock test for clean-up by ID |
| 8 | Single-file bundles were large and embedded scripts | `dist/single/` drops scripts (checks by hand, `Unverified`) |

### Added

- `scripts/validate-skills.mjs`: checks names, description / compatibility length, string metadata, YAML-safe values, body under 500 lines and about 5,000 tokens, required headings, the `figma-use` prerequisite, links, and (for bundles) self-contained one-hop files.
- `scripts/lib/skill-files.mjs`: link and frontmatter helpers shared by the bundler and the validator.
- `evals/state.md` (S1–S10) and gates G18–G19.
- Approval phrases `Store state in the Figma file` and `Move state to workspace` / `Move state to the Figma file`.

## 2.0.0 — 2026-10-02

A major rewrite based on two gap reviews: [docs/SKILLS-REVIEW-REPORT.md](docs/SKILLS-REVIEW-REPORT.md) (IDs `PKG-*`, `ORC-*`, `FG-*`, …) and the Claude gap review (IDs `A1`–`G7`). Every gap from both reports is resolved below.

### Breaking

- New layout: each skill moved to `skills/<name>/SKILL.md`. The shared rules moved to `standards/`, the components to `catalog/`, and the code to `scripts/`. Install from the `dist/` folders (see the README).
- The approval phrases now include a version (`Approve CC-BUTTON-WEB-001 v1.0 Ready to Build`). Paraphrased approvals are rejected.
- IDs are namespaced (`FP-BUTTON-WEB-001`, `QA-BUTTON-WEB-004`), and the old Plan `G-*` gap IDs are retired.
- There is now one severity scale (Critical / Major / Moderate / Minor / Info) and one lifecycle (Draft → … → Released).
- Web viewports are named Large / Medium / Small, so they can't be confused with the Tablet and Mobile platforms.
- Test is split into Build QA and Release QA. Missing docs no longer fail Build QA.

### Added

- **Skills:** `/ds-foundation-extend`, `/ds-status`, `/ds-adopt`, `/ds-release` and `/ds-handoff`.
- **Standards:** lifecycle and IDs, findings, platforms, Foundation Profile, naming, in-file state, Figma tooling, foundation mutation, language and direction, accessibility, reporting, and EN/AR locale packs.
- **Catalog:** Tier 0 primitives (Icon, Spinner, Divider, Tooltip, Icon Button, Menu), the build-order graph, and a checklist for each of the 19 components.
- **Scripts:** WCAG + APCA contrast with alias resolution and compositing, binding audit, Text Style and Arabic audits, render-bound overlap check, variant grid layout, checkpoint and sandbox helpers, node tests, and the bundler.
- **Rule catalog:** `skills/ds-test/references/rules.md`.
- **Evals:** `evals/`.
- **Package files:** `LICENSE` and `.gitignore`. `debug.log` was removed.

### Resolution map — my report

| ID | Resolution |
|---|---|
| PKG-01 | Foundation Profile (`standards/foundation-profile.md`). Review, Build, Test and Document read fonts and names from it |
| PKG-02 | In-file state, where the file wins (`standards/in-file-state.md`). Plan writes the contract frame with Tables B–E |
| PKG-03 | Versioned, verbatim approvals (`standards/lifecycle-and-ids.md` §4). Build gate checks 3–4 |
| PKG-04 | Capability check C1–C9 (`standards/figma-tooling.md` §1) in every skill |
| PKG-05 | Namespaced IDs plus the Registry |
| PKG-06 | One severity scale (`standards/findings.md` §1) |
| PKG-07 | One lifecycle state machine (`standards/lifecycle-and-ids.md` §1) |
| PKG-08 | Figma fact 1 ("Text Styles have no modes"). Review D1 and Plan §8b reworded |
| PKG-09 | Contrast procedure (`standards/accessibility.md`) plus `scripts/lib/color.js` and `contrast-pairs.js` |
| PKG-10 | Arabic typography rules (`standards/language-direction.md` §4), checked by TXT-006..009 |
| PKG-11 | `catalog/components.md` tiers and build order. Dependency gates in Review, Plan, Build and the orchestrator |
| PKG-12 | Orchestrator routes every skill and limits the fix loop to 2 cycles |
| PKG-13 | Short SKILL.md files with `references/`, and shared standards |
| PKG-14 | Folder layout, `.gitignore`, `debug.log` removed, bundler, README install matrix |
| PKG-15 | Checkpoint, rollback and resume (`standards/figma-tooling.md` §3) |
| PKG-16 | Plan §13 code mapping, Document developer notes, `/ds-handoff` |
| PKG-17 | `/ds-release` (release and deprecation), Document Foundations mode, Review family-parity mode |
| PKG-18 | `evals/` |
| ORC-01 | Skill map lists all 15 skills |
| ORC-02 | Build gate check 2 (contract read from the file) |
| ORC-03 | Fix loop limit of 2 (orchestrator plus `/ds-fix` gate) |
| ORC-04 | Dependency check in orchestrator Phase 0 |
| ORC-05 | Resume from the ledger, plus `/ds-status` |
| FG-01 | Required semantic roles (generate defaults, Profile `required_roles_present`) |
| FG-02 | Primitives hidden with empty scopes (foundation-mutation steps) |
| FG-03 | OKLCH ramps, scales and type defaults (`ds-foundation-generate/references/defaults.md`) |
| FG-04 | Generate smoke check uses `checkContrastPairs` (WCAG + APCA) |
| FG-05 | Extend diff rules in generate, plus `/ds-foundation-extend` |
| FG-06 | Architecture review Post-generate check mode |
| FG-07 | Viewport collection is an option in generate and is recorded in the Profile |
| FG-08 | Plan-limit check (C9) |
| FG-09 | Generate "Created names" appendix |
| FG-10 | Generate writes `_DS Profile` |
| AR-01 | Missing Points & Solutions table at the top of the report |
| AR-02 | `ds-foundation-architecture-review/references/worked-example.md` |
| AR-03 | Uses the shared severity scale |
| AR-04 | Post-generate check mode |
| AR-05 | Profile draft mode |
| JIRA-01 | Plain-text template with no heading contradiction |
| JIRA-02 | Optional foundation and dependency subtasks |
| JIRA-03 | Tooltip is now in the catalog (Tier 0). Examples use catalog components |
| JIRA-04 | "Done when" lines match the skill gates |
| JIRA-05 | Create mode, only after `Create in Jira` |
| REV-01 | Reads the Profile, and blocks when the Profile is missing |
| REV-02 | One readiness rule (tracked Majors allowed in `Ready with gaps`) |
| REV-03 | D1 wording follows the Profile's `text_style_platform_pattern` |
| REV-04 | Delta review mode |
| REV-05 | Targets come from the Profile or the platform defaults |
| PLAN-01 | Table B is the only API source. The Snapshot is derived from it |
| PLAN-02 | Numerals `OQ-*` in §8b |
| PLAN-03 | Versioning table and change table |
| PLAN-04 | §6 single Web mechanism (viewport variables plus Auto Layout) |
| PLAN-05 | Pack strings flagged `Stress copy`, with the same meaning in EN and AR |
| PLAN-06 | §13 code mapping |
| PLAN-07 | Motion in §4, content rules in §5 |
| BLD-01 | Contrast table rebuilt with 10 matching columns |
| BLD-02 | Worked example uses real computed signed Lc values |
| BLD-03 | Verbatim approval quote required |
| BLD-04 | The file wins (gate check 2) |
| BLD-05 | Self-check uses Pass / Fail / Unverified |
| BLD-06 | EN `Save` / AR `حفظ` |
| BLD-07 | Toggle knob mirrors in RTL and On stays On (Phase 6b, language-direction §5) |
| BLD-08 | Auto Layout component sets are kept. `layoutVariantSet` skips them |
| BLD-09 | Checkpoint before the first write |
| BLD-10 | Worked example and appendix moved to references and locale packs |
| TST-01 | Contrast table fixed (10 columns) |
| TST-02 | Labels are Pass / Pass with findings / Fail |
| TST-03 | Targets from the Profile, with platform defaults |
| TST-04 | Focus ring policy (accessibility §5), rules A11Y-003/007/008 |
| TST-05 | Optional checks (accessibility §7), A11Y-005/006 in Release QA |
| FIX-01 | Asks `Confirm fix …` before writing when no test report exists |
| FIX-02 | Change log with Rollback is always printed |
| FIX-03 | Namespaced FP IDs from the Registry |
| FIX-04 | Checkpoint per fix cycle |
| DOC-01 | Separate Theme / Language / Direction columns |
| DOC-02 | Fonts come from the Profile |
| DOC-03 | Version & changes section |
| DOC-04 | Developer notes section |
| DOC-05 | Docs labels kept separate from the contract lifecycle |

### Resolution map — Claude review

| ID | Resolution |
|---|---|
| A1 | Build QA vs Release QA scopes. Docs are not part of Build QA |
| A2 | Plan writes the contract frame. Every skill reads the file first |
| A3 | Sandbox writes on `_DS Sandbox`. "Read-only" is defined in figma-tooling §2 |
| A4 | One foundation-mutation path, plus `/ds-foundation-extend` |
| A5 | One severity scale, with a mapping (`Blocking` → `Critical`) |
| A6 | Registry, namespaced IDs, `G-*` retired (Table C uses `FP-*`) |
| A7 | Tooltip added to Tier 0 |
| B1 | Profile replaces hardcoded collection and scale names |
| B2 | Component tokens only when the Profile's `token_layers` allows them. Examples use semantic roles |
| B3 | Typefaces come from the Profile |
| B4 | One slash-separated grammar (`standards/naming.md`) |
| B5 | Generate smoke check uses WCAG + APCA |
| B6 | OKLCH ramp algorithm, steps and Light/Dark map pinned in defaults |
| B7 | Extend diff rules, collision handling, additive only |
| B8 | Code syntax, descriptions and hidden primitives in the blueprint Variables table |
| B9 | Text Style wording fixed (Figma fact 1) |
| C1 | Hybrid RTL: Level 1 neutral, Level 2 private helper with an exposed `Direction`, Level 3 last resort. Proven in the sandbox |
| C2 | Capability check plus a Tooling line for prerequisite tool skills |
| C3 | C9 plan-limit check in generate and extend |
| C4 | Checkpoint plus a Rollback column on every change log |
| C5 | Phase markers and the resume rule |
| D1 | Tier 0 primitives plus the build-order graph and dependency gate |
| D2 | `/ds-adopt` |
| D3 | `_DS Ledger` plus `/ds-status` |
| D4 | `/ds-release` |
| D5 | `/ds-handoff` |
| D6 | Per-component checklist in `catalog/components.md` |
| D7 | `/ds-document` Foundations mode |
| D8 | Contract versioning tied to the breaking-change gate |
| D9 | Sibling delta contracts. Web viewport naming fixed |
| E1 | `scripts/` with node tests |
| E2 | Versioned approvals, plus a stale-approval check |
| E3 | Rule IDs plus fingerprints |
| E4 | Output levels summary / standard / full (`standards/reporting.md`) |
| E5 | `Gates checked: n/total` in every report header |
| E6 | Snapshot derived from Tables B/C/D and §10. Foundation Dependencies table dropped |
| E7 | `_DS Docs Style` record is reused |
| E8 | Deferred findings log feeds `/ds-jira` From findings mode |
| F1 | WCAG success criteria mapped to A11Y-001..012 |
| F2 | Platform target defaults, editable in the Profile |
| F3 | AR locale pack: short, medium and long strings, compound words, diacritics, both digit styles, mixed IDs |
| F4 | Neutral fixtures (`user@example.com`, `ORD-0000-1234`) |
| F5 | Locale packs, configurable in the Profile |
| G1 | `debug.log` removed, `.gitignore` added |
| G2 | `<skill>/SKILL.md` layout, bundler, install matrix |
| G3 | Progressive disclosure with `references/` |
| G4 | `standards/` folder |
| G5 | Package version 2.0.0 in every frontmatter and report header, CHANGELOG, LICENSE |
| G6 | `evals/` |
| G7 | Jira optional fields plus From findings mode |

## 1.x

The earlier flat-file package (`ds-*.md` in the repo root). See the git history.
