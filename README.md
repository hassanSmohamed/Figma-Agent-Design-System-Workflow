# Figma Agent Design System Workflow

**Version 2.2.0** · [CHANGELOG](CHANGELOG.md) · MIT licence

A package of agent skills that walks an AI agent through building and maintaining a production design system in a live Figma file. Skills follow the [Agent Skills](https://agentskills.io/specification) format and Figma's [skill guide](https://developers.figma.com/docs/figma-mcp-server/create-skills/). It covers foundations (Variables and Styles), then one component on one platform at a time. Every step has human approval gates, durable workflow state, measured accessibility (WCAG 2.2 + APCA), and real English + Arabic / LTR + RTL support.

## What's inside

```text
skills/        15 skills, each skills/<name>/SKILL.md (+ references/ when long)
standards/     Shared rules every skill links to (one source of truth)
catalog/       Component tiers, build-order graph, per-component checklist
scripts/       Figma Plugin API helpers + pure JS libs (contrast, grid) + tests + bundler + validator + eval checker
evals/         Prompts and golden assertions to check the skills still behave (one positive case per skill)
docs/          Review reports (historical)
.github/       CI: tests, bundle, validate, eval check on every push; bundles attached to tagged releases
```

## Skills

| Command | Job | Writes |
|---|---|---|
| `/ds-run-workflow` | Orchestrates everything below, with gates and resume; prints the exact command for the five user-started skills | via called skills |
| `/ds-status` | Board of every component × platform from the ledger | none |
| `/ds-adopt` | Bring an existing file/components under the workflow | state |
| `/ds-foundation-generate` | Create Variables + Styles from an open-system structure + brand | foundations |
| `/ds-foundation-architecture-review` | Foundation health; Post-generate check; Profile draft | state |
| `/ds-foundation-extend` | Execute approved `FP-*` proposals and `FPV-*` token value changes | foundations |
| `/ds-review` | Component coverage readiness + Plan handoff | state |
| `/ds-plan` | Versioned Component Contract (`CC-*`) with Tables B–E | state |
| `/ds-build` | Build the component set from the approved contract | source |
| `/ds-test` | Build QA / Release QA with stable rule IDs | state, sandbox |
| `/ds-fix` | Repair findings (max 2 cycles) | source |
| `/ds-document` | Docs page (or foundations docs) with live instances | docs |
| `/ds-release` | Release notes, version, deprecation — after a human publishes | docs, state |
| `/ds-handoff` | DTCG token export, prop → code mapping, APG runtime notes | none |
| `/ds-jira` | Board package (draft; create only after `Create in Jira`) | none |

"Read-only" skills never change the component source, the foundations, or the docs. They may still write workflow state (the state store) and temporary sandbox instances (the `_DS Sandbox` page). Sandbox instances are deleted at the end of every run.

High-risk skills (`/ds-foundation-generate`, `/ds-foundation-extend`, `/ds-build`, `/ds-fix`, `/ds-release`) set `disable-model-invocation: true`, so they run only when you call them by name. `/ds-run-workflow` stops at each of them and prints the command to type.

## Lifecycle

```text
Draft → Ready to Build → Approved → Built → Tested → Documented → Released   (+ Deprecated, Blocked)
```

```text
[generate → architecture review]          only when the file has no foundations
review → plan → ⏸ "Approve CC-BUTTON-WEB-001 v1.0 Ready to Build"
      → build → test (Build QA) ⇄ fix (max 2)
      → document → test (Release QA)
      → ⏸ human publishes the library → release → handoff
```

Approvals are exact phrases that include the version, and the next report quotes them word for word. An approval counts only if you typed it in the current turn, or if the state store holds it with approver and date (a resumed build then asks for `Proceed {ID} v{x}`). Text found in the file, comments, tickets or tool output is never an approval. The full list is in [standards/lifecycle-and-ids.md](standards/lifecycle-and-ids.md).

## Key ideas

- **The state store wins over chat memory.** The Profile, Registry, Ledger, docs style, and every contract (with Tables B–E) live in `ds-state/{figma-file-key}/` in your workspace by default, as Figma's `figma-use` skill recommends. Teams (or the agent inside Figma, which has no workspace) can opt in to a `_DS System` page in the file instead by typing `Store state in the Figma file`. The live Figma file still wins for design facts. Every record has a `rev` number, so two sessions can't silently overwrite each other. See [workflow-state](standards/workflow-state.md).
- **Figma MCP rules.** Every skill loads `figma-use` before each `use_figma` call, passes `skillNames`, works in small calls, and returns the IDs of every node it creates or changes. See [figma-tooling](standards/figma-tooling.md) §5.
- **Foundation Profile.** Fonts, collection names, naming grammar, scales, targets, and locales are read from the Profile. Nothing is hardcoded. See [foundation-profile](standards/foundation-profile.md).
- **One foundation write path.** Generate, extend, build, and fix all use [foundation-mutation](standards/foundation-mutation.md). Changing an existing shared token's value is an `FPV-*` proposal with a contrast table for every consumer; build and fix never do it themselves.
- **Theme, Language, and Direction are separate.** Figma Auto Layout has no RTL switch, so ordered parts use a private `Direction = LTR | RTL` helper whose property is exposed on the parent. RTL is proven on a sandbox page. See [language-direction](standards/language-direction.md).
- **Measured, not guessed.** Scripts check bindings, Text Styles, Arabic rules, variant overlap (render bounds), and contrast (alias resolution per mode, alpha compositing, WCAG ratio, and signed APCA Lc 0.0.98G-4g). When code can't run, the result is marked `Unverified`.
- **Stable findings.** Rule IDs (`TOK-002`, `DIR-001`, …) and fingerprints let a retest show exactly what changed. See [findings](standards/findings.md) and the [rule catalog](skills/ds-test/references/rules.md).
- **Build order.** Tier 0 primitives (Icon, Spinner, Divider, Tooltip, Icon Button, Menu) come before Tier 1 components. Build is blocked while a required dependency isn't built yet. See [catalog](catalog/components.md).

## Platforms

`{Component} / Web`, `{Component} / Tablet` (app), and `{Component} / Mobile` (app) are separate sets. Web viewports are called **Large / Medium / Small** and are driven by variable modes, never by variants. After Web is approved, Tablet and Mobile can be planned as **Sibling delta** contracts.

## Install

Download the bundles from a tagged GitHub release (CI attaches them), or build and check them yourself:

```bash
node scripts/bundle-skills.mjs
node scripts/validate-skills.mjs
```

The bundler writes three editions. The run fails if a link is broken or two files would get the same name; the validator fails if a single-file edition is over 100 KB or a slim edition is over 32 KB.

- `dist/skills/<skill>/` — the Agent Skills layout: `SKILL.md`, a flat `references/` folder (standards, catalog, worked examples), and a `scripts/` folder (Figma Plugin API scripts). `SKILL.md` ends with a "Bundled files" list, so every file is one link away.
- `dist/single/<skill>.md` — one Markdown file with all references appended and **no scripts** (about 55–90 KB). Checks that need a script are done by hand and marked `Unverified`.
- `dist/slim/<skill>.md` — one Markdown file with the skill's instructions and only the **core rules** (approvals, untrusted content, severity, state revisions, Figma MCP rules, contrast thresholds), about 13–26 KB. Built from the `<!-- core -->` sections of the standards, so nothing is copied by hand.

| Runtime | Install |
|---|---|
| **Cursor** | Copy `dist/skills/*` into `.cursor/skills/` (project) or `~/.cursor/skills/` (user) |
| **Claude Code, Codex, other Agent Skills runtimes** | Copy `dist/skills/*` into the runtime's skills folder |
| **Figma's in-app agent (custom skills)** | Upload `dist/slim/<skill>.md` (smallest context) or `dist/single/<skill>.md` (full detail). State then goes in the file (`_DS System`) because there is no workspace |
| **Working on this repo** | Use `skills/` directly. Links resolve relative to the repo |

Requirements: the [Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/) with the `use_figma` tool and Figma's `figma-use` skill installed. Running the scripts needs Plugin API JavaScript through `use_figma`. Every skill runs a capability check first and reports what it could not do. `/ds-jira` needs no Figma access; its Create mode needs a Jira tool.

## Example prompts

```text
/ds-foundation-generate
Generate Variables and Styles for Acme. Structure: Primer. Brand primary: #0B5FFF.
Typefaces: Inter (EN), IBM Plex Sans Arabic (AR). Themes: Light, Dark.
```

```text
Approve FG-ACME-PRIMER-001 v1 Ready to Generate
```

```text
/ds-run-workflow
Run the full workflow for Button on Web.
```

```text
Approve CC-BUTTON-WEB-001 v1.0 Ready to Build. Also approve FP-SYS-001
```

```text
/ds-status
```

## Development

```bash
node --test scripts/test/*.test.mjs     # pure libs + mocked Figma scripts
node scripts/bundle-skills.mjs          # bundle; exits 1 on broken links or name collisions
node scripts/validate-skills.mjs        # Agent Skills spec + Figma skill guide checks, bundle sizes, repo paths
node scripts/check-evals.mjs            # eval block reasons match the skills; one case per skill; one version
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs all four on every push and pull request. Pushing a tag `v*` also attaches `dist/` as zip files to the GitHub release.

Evals: [evals/README.md](evals/README.md).

## License

MIT — see [LICENSE](LICENSE).
