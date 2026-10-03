# Shared Standards

Every skill in `skills/` follows these files. A skill may be **stricter** than a standard, never looser.
When a skill and a standard disagree, the standard wins and the skill must be fixed.

| File | What it owns |
|---|---|
| [lifecycle-and-ids.md](lifecycle-and-ids.md) | Lifecycle states, ID formats, approval phrases, contract versioning |
| [findings.md](findings.md) | Severity scale, rule IDs, finding fingerprints, deferred findings |
| [platforms.md](platforms.md) | Web / Tablet / Mobile, Web viewports, sibling delta contracts |
| [foundation-profile.md](foundation-profile.md) | The Foundation Profile (manifest) every skill reads instead of hardcoded names |
| [naming.md](naming.md) | Naming grammar for variables, styles, components, layers |
| [workflow-state.md](workflow-state.md) | Where workflow state lives (workspace `ds-state/` by default, `_DS System` page opt-in): contracts, ledger, registry, sandbox |
| [figma-tooling.md](figma-tooling.md) | Capability check, write categories, checkpoint, rollback, resume, Figma facts, Figma MCP rules (`figma-use`, `skillNames`, node IDs) |
| [foundation-mutation.md](foundation-mutation.md) | The one path for creating or changing shared Variables/Styles |
| [language-direction.md](language-direction.md) | Language ≠ Direction, the RTL mechanism, Arabic typography, locale packs |
| [accessibility.md](accessibility.md) | WCAG 2.2 mapping, contrast procedure, APCA thresholds, targets, focus |
| [reporting.md](reporting.md) | Report header, output levels, gates-checked line, next-step rule |

Package version: **2.2.0** (see `CHANGELOG.md`). Every report header shows it.
