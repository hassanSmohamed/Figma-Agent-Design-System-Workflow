# Reporting Standard

## 1. Report header (every skill, every run)

```text
Skill: /ds-build · Package 2.2.0 · Mode: New component build (mutating)
Target: Button / Web · Contract: CC-BUTTON-WEB-001 v1.0 (Approved)
Profile: FPR-ACME-001 v1 · State: workspace (ds-state/abc123/) · Capability: C1–C9 OK (C5 yes, C8 yes)
Tooling: figma-use loaded · skillNames "figma-use,ds-build"
Gates checked: 24/24 · Checkpoint: "ds-build CC-BUTTON-WEB-001 v1.0 start 2026-10-02 14:05"
Sandbox cleaned: Yes   (only when a sandbox was used)
```

`Gates checked: n/m` shows how many completion-gate items were actually evaluated, even when the full matrices are not printed. Any unchecked gate must be listed by name.

## 2. Output levels

| Level | Contains | Default for |
|---|---|---|
| `summary` | Header, one result block, one findings/changes table, one next step | `/ds-test`, `/ds-fix`, `/ds-status`, `/ds-jira` |
| `standard` | Summary + the skill's required detail sections | `/ds-review`, `/ds-plan`, `/ds-build`, `/ds-document`, `/ds-foundation-generate`, `/ds-foundation-architecture-review`, `/ds-release`, `/ds-handoff`, `/ds-adopt`, `/ds-foundation-extend` |
| `full` | Every matrix and appendix the skill defines | Only when the user asks ("full report", "show matrices") |

The checks run are the same at every level. Only the printing changes.

Worked examples live in each skill's `references/` folder. Follow their **shape**, never their sample names.

## 3. Language

- Easy, plain English. Short sentences.
- Exact Figma names in backticks.
- `Unknown` when evidence is missing; `Unverified` when a number was not computed. Never present a guess as fact.
- Theme, Language, Direction always as separate fields.

## 4. Change logs (every mutating run, every level)

| Step | Object | Action | Finding / FP ID | Rollback |
|---|---|---|---|---|

## 5. Next step

End with **exactly one** recommended next command or human action, and update the ledger's `Next action` to match.
