# Findings: Severity, Rule IDs, Fingerprints

<!-- core -->
## 1. One severity scale (all skills)

| Severity | Use for | Blocks next step? |
|---|---|---|
| **Critical** | Broken API, broken instances, broken architecture, accessibility failure that stops a task, a required foundation that is missing | **Yes** |
| **Major** | Wrong token/style use, missing required state, missing mode value, contract drift, nested part rebuilt locally | **Yes**, unless a human accepts the risk in writing (`DEC-*`) |
| **Moderate** | Friction, weak responsiveness, upkeep risk, inconsistent naming that will confuse consumers | No |
| **Minor** | Naming polish, docs polish, low-risk cleanup | No |
| **Info** | Observation only | No |

Every findings table has a `Blocks next step?` column. Old labels map like this: `Blocking` → `Critical`.

### Readiness rules that use this scale

| Skill result | Rule |
|---|---|
| Review `Ready` | No Critical or Major |
| Review `Ready with gaps` | No Critical; Major allowed **only if tracked** as `FP-*` / `OQ-*` in the Plan handoff. Build later needs them approved or accepted (`DEC-*`) |
| Review `Blocked` | Any Critical, missing target, or architecture handoff |
| Test `Pass` | No findings, or Info only |
| Test `Pass with findings` | Moderate / Minor / Info only |
| Test `Fail` | Any Critical or Major |
<!-- /core -->

## 2. Rule IDs (stable checks)

Every repeatable check has a rule ID so results can be compared across runs. Families:

| Prefix | Area |
|---|---|
| `STR` | Structure, naming, variant matrix, set-view grid |
| `TOK` | Variable bindings (color, number) |
| `TXT` | Text Style assignment and typography |
| `THM` | Theme modes |
| `RSP` | Responsive / platform behavior |
| `STA` | State coverage |
| `A11Y` | Accessibility design evidence |
| `LNG` | Language (EN + AR content, Text Styles) |
| `DIR` | Direction (LTR / RTL layout) |
| `DEP` | Nested dependency reuse |
| `DOC` | Documentation |
| `CON` | Contract drift |

The full rule list lives in `skills/ds-test/references/rules.md`. Review, Build self-check and Fix revalidation use the same IDs.

## 3. Finding fingerprint

```text
fingerprint = {rule ID} + {variant path} + {layer path}
example:      TOK-002 | Hierarchy=secondary, State=hover | Root/Container
```

- If a new run finds the same fingerprint → reuse the existing `QA-*` ID.
- If a fingerprint disappears → mark the old finding `Resolved` in the ledger.
- `/ds-fix` targets fingerprints, so a retest can say exactly what changed.

## 4. Deferred findings

Moderate / Minor findings that are not fixed now go to the **Deferred findings log** in the ledger (see [workflow-state.md](workflow-state.md)) with: ID, fingerprint, severity, reason deferred, suggested owner. `/ds-jira` (mode: from findings) turns this log into tickets.
