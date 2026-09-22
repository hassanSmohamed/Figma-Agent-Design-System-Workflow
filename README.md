# Figma Agent Design System Workflow

A package of **Figma Custom Skills** (also usable with Cursor + Figma MCP) that walks an AI agent through building production-ready foundation components in a live Figma design-system file — with human approval gates, evidence-based QA, and bilingual / bidirectional support.

## What we built

A full end-to-end skill suite for one component × one platform at a time:

| Skill | File | Role |
|---|---|---|
| **Orchestrator** | `ds-run-workflow.md` | Runs the full sequence and returns one combined results report |
| **Jira board package** | `ds-jira.md` | Paste-ready parent + subtasks (draft only; no API creates) |
| **Review** | `ds-review.md` | Read-only foundations coverage + Plan Handoff Package |
| **Foundation architecture** | `ds-foundation-architecture-review.md` | Deep Variables/Styles architecture health check |
| **Plan** | `ds-plan.md` | `CC-*` Component Contract + Plan Package extras A–E |
| **Build** | `ds-build.md` | Mutating build from an approved plan (executes Tables C–D) |
| **Test** | `ds-test.md` | Read-only QA (structure, tokens, a11y, Language, Direction) |
| **Fix** | `ds-fix.md` | Safe repairs for Critical/Major findings |
| **Document** | `ds-document.md` | In-file component docs (docs-only; no API changes) |

## Default workflow

```text
/ds-jira → /ds-review → /ds-plan → [human approval]
  → /ds-build → /ds-test → /ds-fix (if needed) → /ds-test → /ds-document
```

**Hard gates**

- Build starts only after explicit `Approve CC-… Ready to Build`
- Plan Package extras **C** (Variables/Styles solves) and **D** (nested configs) are executable handoffs — Build must not reinvent them
- One component + one platform per run: `{Component} / Web | Tablet | Mobile`

## Plan → Build handoff

`/ds-plan` produces more than a contract. After approval, `/ds-build` consumes:

| Extra | Purpose |
|---|---|
| **A.** ASCII wireframe | Anatomy blueprint |
| **B.** Controls table | Public API blueprint |
| **C.** Missing Variables/Styles — solve table | Executable creates / aliases / binds |
| **D.** Dependent components — configuration matrix | Executable nested instance configs |
| **E.** Blocking remedies | Gate only — must be clear before mutation |

## Language ≠ Direction

Language and Direction are **independent axes** across the whole package (not “EN LTR + AR RTL” as one thing):

| Axis | Meaning | Mechanism |
|---|---|---|
| **Language** | Content locale preview (EN / AR) | Content strings + approved `Text/EN/…` and `Text/AR/…` Text Styles |
| **Direction** | Layout direction (LTR / RTL) | Direction-neutral Auto Layout; Leading/Trailing/Start/End |

- Theme (Light/Dark), Language, and Direction stay separate — no `Theme × Language × Direction` variant explosion
- Every full workflow supplies **automatic Arabic stress copy** for contracted text roles (layout / Text Style simulation, not final product translation)

## Supported foundation components

Button, Button Group, Input, Text Area, Avatar, Toggle, Checkbox, Radio Button, Calendar, Table, Banner, Badge, Link

## Platforms

| Platform | Meaning |
|---|---|
| **Web** | Responsive web / portal |
| **Tablet** | Tablet app |
| **Mobile** | Mobile app |

Sibling platforms are separate builds. Web responsive breakpoints live inside the Web component.

## How to use

**Primary install target:** Figma Custom Skills — add the skill markdown files from this repo.

**Also works with:** Cursor + Figma MCP when those skills are available in the agent environment.

Example prompts:

```text
/ds-run-workflow
Run the full workflow for Button / Web.
```

```text
/ds-review
Review foundations for Button on Web.
Do not modify the file.
```

```text
/ds-plan
Plan Button for Web.
```

```text
Approve CC-BUTTON-WEB-001 Ready to Build
```

```text
/ds-build
Build Button / Web from approved contract CC-BUTTON-WEB-001.
```

## Status

- [x] First skill suite (Review, Plan, Build, Test, Fix, Document, Foundation architecture, Orchestrator)
- [x] Structured output reports per skill
- [x] Jira board package skill (`/ds-jira`)
- [x] Plan Package A–E handoff into Build
- [x] Language separated from Direction + automatic Arabic stress copy

## License / ownership

Private workflow package for building and maintaining a Figma design system with an AI agent.
