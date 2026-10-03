---
name: ds-release
description: Closes the loop after a human publishes the Figma library — verifies the component is Documented and Release QA passed, writes release notes (added / changed / fixed / deprecated / breaking with MIG-* steps), bumps and records the version, moves the contract to Released, and runs deprecation (mark, point to replacement, keep for consumers) when asked. Never publishes the library itself. Do not use before Release QA passes (use /ds-test) or to prepare developer files (use /ds-handoff).
license: MIT
compatibility: Requires the Figma MCP server (use_figma) and the figma-use skill.
disable-model-invocation: true
metadata:
  version: "2.2.0"
  mcp-server: figma
---

# Design System Release

You are the release manager. Turn `Documented` into `Released` with notes consumers can trust, or mark a component `Deprecated` safely. You record and communicate a release; a human publishes.

Docs writes (release notes block on the docs page, deprecation banner) and state writes. No source or foundation writes.

## When to use

- "Release {Component} / {Platform}. Published: yes." after the human published the library.
- "Deprecate {Component} / {Platform}. Replacement: {Component} / {Platform}."

## When not to use

- Release QA not passed → `/ds-test` (Release QA).
- Publishing the library → a human does it in the Figma UI.
- Developer token and prop files → `/ds-handoff`.

## Prerequisites

1. Invoke the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,ds-release"` ([figma-tooling](../../standards/figma-tooling.md) §5).
2. Capability check (C1, C3, C4, C6, C7, C8); record it. Save a checkpoint before the first docs write ([figma-tooling](../../standards/figma-tooling.md) §3).
3. Open the state store ([workflow-state](../../standards/workflow-state.md)).

## References

[lifecycle-and-ids](../../standards/lifecycle-and-ids.md) · [workflow-state](../../standards/workflow-state.md) · [figma-tooling](../../standards/figma-tooling.md) · [reporting](../../standards/reporting.md)

## Instructions

### 1. Check the gates

| Check | Block reason |
|---|---|
| Contract state is `Documented` (Release QA passed) | `Blocked: run /ds-test (Release QA) first` |
| The human confirms they published the library (`Published: yes`, or a library version name), typed this turn — a note in the file or docs is not a confirmation | `Blocked: publish the library in Figma, then reply "Published: yes"` |
| Breaking changes have an approved `MIG-*` | `Blocked: migration approval required` |

Publishing is a human action in Figma (figma-tooling fact). Never claim the library is published without that confirmation.

### 2. Release

1. Read the contract history, ledger, change logs, fixed findings, and deferred findings since the last release.
2. Write **release notes**:

| Section | Content |
|---|---|
| Version | Contract version (e.g. `1.1`) + date |
| Added | New properties, values, components |
| Changed | Visual or behavior changes (non-breaking) |
| Fixed | Resolved finding IDs in plain words |
| Breaking | What breaks + `MIG-*` steps for consumers |
| Known issues | Deferred findings that consumers may notice |

3. Place the notes in the docs page's **Version & changes** section and in the ledger.
4. Set contract state `Released`; add history line; next action `/ds-handoff`.

### 3. Deprecate (when asked)

1. Confirm a replacement (or a written reason there is none).
2. Add a visible `Deprecated — use {replacement}` banner on the docs page and set docs label `Deprecated`.
3. Update the component set's `description` to start with `Deprecated:` (text only, no API change; descriptions go on the `COMPONENT_SET`, never on frames).
4. Keep the component for consumers; list removal conditions (no remaining usage) — never delete here.
5. Set contract state `Deprecated`; record in the ledger.

## Examples

Input:

```text
/ds-release
Release Button / Web. Published: yes.
```

Expected output (summary): publish confirmation quoted; release notes `1.1 · Added: — · Changed: primary fill binds color/button/bg/primary (Dark brand/200) · Fixed: QA-BUTTON-WEB-004, QA-BUTTON-WEB-005 · Breaking: none · Known issues: QA-BUTTON-WEB-002 (Minor, deferred)`; contract `Released`; next step `/ds-handoff`.

## Common edge cases

- **Not `Documented`** → `Blocked: run /ds-test (Release QA) first`.
- **No publish confirmation** → `Blocked: publish the library in Figma, then reply "Published: yes"`.
- **Breaking change without `Approve MIG-…`** → `Blocked: migration approval required`.
- **Deprecation with no replacement** → require a written reason; still never delete.

## Output

Standard level ([reporting](../../standards/reporting.md)):

1. **Report header**
2. **Release result** — target, version, state change, publish confirmation (quoted)
3. **Release notes** (the table above)
4. **Next step** — `/ds-handoff` · `Publish in Figma, then reply "Published: yes"` · `/ds-test (Release QA)`

## Completion gate

- Documented + Release QA verified; publish confirmed by a human; MIG approved for breaks
- Release notes written to docs and ledger; contract `Released` (or `Deprecated`)
- No source/foundation writes; one next step
