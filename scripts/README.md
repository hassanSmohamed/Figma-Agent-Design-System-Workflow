# Reference Scripts

Deterministic checks the skills use instead of eyeballing. They need a runtime that can execute **Figma Plugin API JavaScript** through `use_figma` (capability C5 in [figma-tooling.md](../standards/figma-tooling.md)). When code cannot run, the skill does the same steps by hand and marks numbers `Unverified`.

Load the `figma-use` skill before every `use_figma` call and pass `skillNames: "figma-use,{ds-skill}"` ([figma-tooling.md](../standards/figma-tooling.md) §5).

## Files

| File | Kind | Used by | Writes? |
|---|---|---|---|
| [lib/color.js](lib/color.js) | Pure | contrast checks | No |
| [lib/grid.js](lib/grid.js) | Pure | set-view grid + overlap math | No |
| [figma/helpers.js](figma/helpers.js) | Figma | every Figma script (variables, nodes, in-file state, checkpoint, sandbox) | State (in-file mode) / sandbox only |
| [figma/contrast-pairs.js](figma/contrast-pairs.js) | Figma | `/ds-build` Phase 7, `/ds-test` A11Y, `/ds-fix`, `/ds-foundation-generate` smoke check | No |
| [figma/binding-audit.js](figma/binding-audit.js) | Figma | `/ds-build` self-check, `/ds-test` TOK/DEP, `/ds-fix` revalidation | No |
| [figma/text-style-audit.js](figma/text-style-audit.js) | Figma | `/ds-test` TXT, `/ds-review` D1, generate smoke check (Arabic rules) | No |
| [figma/set-layout.js](figma/set-layout.js) | Figma | `/ds-build` Phase 4 / 6, `/ds-fix` layout repairs, `/ds-test` STR-004 | `layoutVariantSet` moves variants (source write) |

## How to run inside Figma

Each `use_figma` call is plain JavaScript with top-level `await` and `return`. Paste the dependency files first, then the check, then one `return` line:

```text
1. color.js        (only for contrast)
2. grid.js         (only for set-layout)
3. helpers.js
4. <check>.js
5. return await <function>({ … });
```

Each check file shows its usage at the top. Results are JSON; skills copy them into their report tables (with rule IDs) and never "round" or edit the numbers.

## Rules

1. Read-only checks never change the source. `layoutVariantSet` defaults to `dryRun: true`; run it for real only inside `/ds-build` or `/ds-fix` after the gates and a checkpoint.
2. **Write helpers return node IDs** (`createdNodeIds`, `mutatedNodeIds`, `removedNodeIds`). Nothing carries over between `use_figma` calls, so later calls pass these IDs as strings. `setSandboxMode` and `cleanupSandbox` accept a node or an ID.
3. Sandbox helpers (`createSandbox`, `cleanupSandbox`) work only on the `_DS Sandbox` page. Always clean up, even after a failure.
4. `readState` / `writeState` are for the **in-file** state mode only. In the default workspace mode, skills write `ds-state/{file-key}/*.md` files instead ([workflow-state.md](../standards/workflow-state.md)).
5. If a script throws, report the error text and mark the affected rows `Unverified`. Read the canvas before retrying a write. Rows a script returns with `status: 'Unverified'` (mixed values, bindings that can't be resolved) are checked by hand.
6. Variables are found by name, by ID (`'VariableID:…'`, needed for library tokens in a consumer file), or by `{ name, collection }`. A name used in more than one collection throws instead of guessing.
7. Audits resolve variable-bound Text Style values in the node's own mode, check Arabic styles in every viewport mode, and audit only overridden fields inside nested instances.

## Tests

```bash
node --test scripts/test/*.test.mjs
```

The tests check WCAG and APCA reference values (APCA-W3 0.0.98G-4g), polarity, placeholder vs disabled thresholds, transparency compositing, the grid planner, and the Figma scripts against a mocked runtime (sandbox clean-up by node ID, variable lookup, mode-aware text-style and Arabic audits, and binding audit coverage).

## Build and validate the install bundles

```bash
node scripts/bundle-skills.mjs     # writes dist/skills/, dist/single/ and dist/slim/
node scripts/validate-skills.mjs   # checks source skills and dist/
node scripts/check-evals.mjs       # checks evals against the skills
```

| Output | Layout | For |
|---|---|---|
| `dist/skills/<skill>/` | `SKILL.md` + `references/*.md` + `scripts/*.js`, every file linked from `SKILL.md` | Cursor, Claude Code, Codex, and other [Agent Skills](https://agentskills.io/specification) runtimes |
| `dist/single/<skill>.md` | One Markdown file, no scripts (checks done by hand, marked `Unverified`); max 100 KB | Figma's in-app agent custom skills and other single-file runtimes |
| `dist/slim/<skill>.md` | `SKILL.md` + the `<!-- core -->` sections of the standards it uses; max 32 KB | Single-file runtimes where context is tight |

`check-evals.mjs` checks that every `Blocked: …` reason an eval expects matches a template a skill or standard can emit, that every skill has a case in `evals/skills.md`, and that every package version mention agrees with the skills' `metadata.version` and the top CHANGELOG entry.

The validator checks the Agent Skills rules (name, description and compatibility length, string metadata, body under 500 lines and about 5,000 tokens) and Figma's skill guide (`# Title`, `When to use`, `When not to use`, `Instructions`, `Examples`, `Common edge cases`, a description that says when not to use the skill, and the `figma-use` + `skillNames` prerequisite for Figma skills). For bundles it also checks that links stay inside the skill and every file is one hop from `SKILL.md`, and it fails when a backticked repo path in the docs (for example `scripts/figma/contrast-pairs.js`) does not exist.

Shared helpers for both tools live in [lib/skill-files.mjs](lib/skill-files.mjs).
