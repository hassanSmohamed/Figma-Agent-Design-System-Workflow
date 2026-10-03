# Evals

These files check that the skills still behave after you edit them. Each case has a **prompt**, a **starting file state**, and **assertions**. An assertion is a fact the agent's report or the file must show, or must not show.

| File | What it covers |
|---|---|
| [button-web.md](button-web.md) | The happy path for `Button / Web`, from generate to handoff |
| [gates.md](gates.md) | Negative cases: each gate must stop the agent with the exact block reason |
| [rtl.md](rtl.md) | Direction and Language cases (helper levels, mirroring, mixed-direction values, Arabic rules) |
| [state.md](state.md) | Where workflow state lives: workspace default, in-file opt-in, switching, paste fallback, revisions |
| [skills.md](skills.md) | One positive case per skill (all 15) |

## How to run

1. Use a scratch Figma file (or duplicate a fixture file), never a real library.
2. Set up the **starting state** the case describes.
3. Paste the prompt. Save the report text.
4. Check every assertion by hand, or let a second agent grade it (prompt: "Grade this report against these assertions. Answer PASS or FAIL per line, with the quote that proves it").
5. A skill change is safe to merge when `node scripts/validate-skills.mjs` and `node scripts/check-evals.mjs` pass, every case in `gates.md`, `state.md` and `skills.md` passes, and no `button-web.md` assertion regresses.

`check-evals.mjs` is a cheap first check that needs no agent run: every block reason an eval expects must be one a skill can emit, and every skill must have a case in `skills.md`.

## Assertion style

- `MUST` — the report or the file shows this.
- `MUST NOT` — this never appears.
- `FILE` — check it in the Figma file, not just in the report.
- `STATE` — check it in the state store (`ds-state/{file-key}/` files, or the `_DS System` page when in-file), not just in the report.

Pure code is covered by `node --test scripts/test/*.test.mjs`. These evals cover agent behavior.
