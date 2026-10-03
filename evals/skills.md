# Eval — One positive case per skill

Every skill has at least one golden case here, so a change to any skill has something to check. `button-web.md` holds the longer end-to-end path; these cases are short and stand alone. `node scripts/check-evals.mjs` fails if a skill is missing from this table.

| # | Skill | Starting state / prompt | Expected (MUST) |
|---|---|---|---|
| K1 | ds-run-workflow | Plan stopped at approval; user types `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build` | Records the approval with approver and date; does **not** start the build; one next step `/ds-build Build Button / Web from CC-BUTTON-WEB-001 v1.0.` |
| K2 | ds-status | `ledger.md` has Button / Web (`Built`), Icon / Web (`Released`), Input / Web (`Approved`) | One board row per target with its `Next action`; writes nothing (ledger `rev` unchanged) |
| K3 | ds-adopt | Existing `Button / Web` set, no Profile, no contract | Profile draft `FPR-…` with `unknown` fields; contract-as-is `CC-BUTTON-WEB-001 v0.1` (`Draft`); first-pass scan counts recorded as `Info`; no source writes; next step `Confirm Profile FPR-… v1` |
| K4 | ds-foundation-generate | Empty file; brand Acme, Primer, `#0B5FFF` | Blueprint `FG-ACME-PRIMER-001 v1`; nothing created until `Approve FG-ACME-PRIMER-001 v1 Ready to Generate` is typed in this turn |
| K5 | ds-foundation-architecture-review | Right after K4, mode Post-generate check | Lead table of findings with IDs; `Profile matches file` (or drift listed); no variable or style writes |
| K6 | ds-foundation-extend | `FP-SYS-001` complete; user types `Approve FP-SYS-001` | Variable created in the existing collection, every mode filled, rollback row with the variable ID, checkpoint name, next step back to the skill that raised it |
| K7 | ds-foundation-extend | `FPV-SYS-001` (Dark alias of `color/bg/brand` → `brand/200`) with a 7-consumer contrast table; user types `Approve FPV-SYS-001` | Consumer list re-scanned and contrast re-run; alias changed per mode; rollback = previous alias; STATE: every consumer at `Tested`+ shows `Re-test needed: FPV-SYS-001` |
| K8 | ds-review | Profile present, Button not built | Uses Profile names only; Plan Handoff Package with `CC-BUTTON-WEB-001`; readiness label per the shared rules |
| K9 | ds-plan | Review handoff present | Contract `v0.x Ready to Build` with Tables B–E; contrast pairs use role keys (`placeholder` for placeholder text, never `disabled`); approval line with a version |
| K10 | ds-build | Contract v1.0 approved this turn | Checkpoint before first write; helper `.Button/Content` with no `hiddenFromPublishing` step (the `.` prefix hides it); change log with node IDs and rollback; sandbox cleaned |
| K11 | ds-test | Button / Web `Built`; sandbox AR stress copy applied | `auditTextStyles({ rootId })` run on the sandbox frame before clean-up; TXT rows cover AR content; script rows with `status: Unverified` are not counted as `Pass` |
| K12 | ds-fix | `QA-BUTTON-WEB-004` (TOK-001) open | Repairs that fingerprint only; `Fix cycles: 1`; change log with rollback; next step `/ds-test` (Build QA) |
| K13 | ds-document | Contract `Tested`, docs style recorded | 12 sections; Developer notes include the WCAG 2.4.11 sticky-overlay warning; Theme / Language / Direction in separate columns; checkpoint before first docs write |
| K14 | ds-release | Contract `Documented`, Release QA passed; user types `Published: yes` | Release notes (added / changed / fixed / breaking / known issues); contract `Released`; checkpoint before the docs write; next step `/ds-handoff` |
| K15 | ds-handoff | Button / Web `Released` | Token export per theme with every mapping labelled `Direct` / `Transform required` / `Lossy` / `Unsupported`; prop mapping from contract §13; runtime notes marked `Implementation requirement` |
| K16 | ds-jira | Ledger row at `Built`; prompt "Draft the Jira package for Button / Web" | Plain-text package; done steps listed from the ledger; no Jira writes; next step `Paste into Jira` |
| K17 | ds-jira | Draft shown; Jira tool available; user types `Create in Jira` | Parent and subtasks created through the tool; issue keys reported; no Figma writes |

Also check for each case:

- MUST load `figma-use` and pass `skillNames` for every `use_figma` call (Figma skills).
- MUST end with exactly one next step.
