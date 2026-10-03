# Design System Skills — Gap Review and Fix Plan

> **Historical document.** This review covers the old v1.x flat files (`ds-*.md`), which no longer exist. Every finding was resolved in 2.0.0; see the resolution map in [CHANGELOG.md](../CHANGELOG.md). Line numbers and file names below refer to v1.x.

Review date: 2 Oct 2026
Scope: all 11 skill files in this repo (`ds-*.md`) plus `README.md`. About 6,000 lines were reviewed.
Reviewer view: design-system architecture, Figma Variables/Styles, accessibility, bilingual EN/AR, and how well an AI agent can follow the skills.

---

## 1. Summary

The package is strong. It has clear human approval gates, a clean split between read-only and mutating skills, an executable Plan → Build handoff (Tables C and D), and a well-defined rule that **Language ≠ Direction**. Most design-system teams do not have this level of control.

The main problems are **between** skills, not inside them:

1. **The skills disagree on what the foundations look like.** `/ds-foundation-generate` lets the user pick any structure, brand font and naming. But `/ds-review`, `/ds-build`, `/ds-test` and `/ds-document` hardcode `Inter`, `IBM Plex Sans Arabic`, `spacing-none … spacing-11xl`, `width-xxs … width-6xl`. A file made by the generate skill can fail the review skill for no real reason.
2. **Important state lives only in the chat.** The approved Plan Package (Tables C–D) is read from the conversation. A new session, a new agent, or a long chat can lose it.
3. **Approval gates have small holes.** An approval is not tied to a contract **version**, and Build accepts a **paraphrase** of the approval.
4. **Shared vocabularies are not shared.** There are three severity scales, many status words, and IDs (`FP-001`, `G-001`, `QA-001`) that restart in every run, so they collide across components.
5. **Some outputs will not work as written.** Two contrast tables are broken markdown. The worked example teaches the wrong APCA polarity. No skill says how contrast must be calculated, so the agent may make up numbers.

The fixes are mostly small text edits plus one new shared artifact (a **Foundation Profile**). Section 6 lists them in order.

### Gap count

| Priority | Meaning | Count |
|---|---|---|
| P0 | Breaks the workflow or gives wrong results. Fix first | 5 |
| P1 | High risk of wrong output or agent confusion | 25 |
| P2 | Quality, upkeep, or missing lifecycle step | 39 |
| P3 | Polish | 10 |

79 rows in total. Some skill rows (for example REV-01, BLD-03, BLD-04) are the same problem as a package gap, seen from inside one skill. Fixing the package gap fixes them too.

---

## 2. What is already good (keep these)

| Strength | Where | Why it matters |
|---|---|---|
| Hard approval gates (`FG-*`, `CC-*`, `FP-*`, Gap IDs) | generate, plan, build, orchestrator | Nothing changes the shared library without a human "yes" |
| Read-only vs mutating split | every skill states its boundary | Reviews and tests can never damage the file |
| Executable handoff (Plan Tables C and D) | `ds-plan.md`, `ds-build.md` | Build cannot invent tokens or nested parts |
| Language ≠ Direction, and Theme kept separate | all skills | Stops `Theme × Language × Direction` variant explosion |
| Automatic Arabic stress copy | plan §5, build Appendix A | Arabic layout is tested on every build, not at the end |
| "Unknown, don't guess" rule | review, architecture review, build | Lowers hallucinated evidence |
| Variant-set grid rules (40px gap, axis order, reflow) | `ds-build.md` "Variant set canvas layout" | Fixes a real Figma pain point (stacked variants) |
| WCAG 2.2 AA plus APCA as a second check | plan, build, test, fix | Strong dark-mode contrast coverage |
| Docs single-ownership rules, and asking for a template first | `ds-document.md` | Stops repeated facts and made-up page styles |
| Worked examples (Review, Build) | end of those files | Show the agent the depth that is expected |

---

## 3. Package-level gaps (cross-skill)

### PKG-01 · P0 · Hardcoded foundation profile conflicts with `/ds-foundation-generate`

**What:** These skills expect fixed names and fonts:

- `ds-review.md` lines 115–130: `radius-none … radius-full`, `spacing-none … spacing-11xl`, `width-xxs … width-6xl`, Inter, IBM Plex Sans Arabic
- `ds-build.md` lines 343–351, 371, 690: "English → Inter styles; Arabic → IBM Plex Sans Arabic styles"
- `ds-test.md` line 167, `ds-document.md` lines 184–193: same fonts

But `ds-foundation-generate.md` asks the user for the typeface and structure. For example, with Primer the numbers come out as `space/*`, `size/*`, `radius/*` (line 154).

**Why it matters:** A file built by our own generate skill can be flagged as "Mismatch" or "Missing" by review, build, and test. Brands that don't use Inter cannot use the package as written.

**Fix:**

1. Add one shared artifact: a **Foundation Profile** (`FPR-{BRAND}-001`). `/ds-foundation-generate` writes it. `/ds-foundation-architecture-review` can write it for files that already exist. Store it in a frame called `_DS Profile` in the source file.
2. In every other skill, replace hardcoded values with "read from the Foundation Profile". Keep Inter and IBM Plex Sans Arabic only as the **example default**.
3. Suggested profile fields:

```text
Foundation Profile — FPR-ACME-001
- Structure: Primer (Custom allowed)
- Color collections: Primitives (hidden), Semantic (Light, Dark)
- Number scales: spacing → space/*, radius → radius/*, size → size/*
- Platform/breakpoint typography collection: Type (Desktop, Tablet, Mobile) | none
- Text Style prefix: Text/EN/…, Text/AR/…
- Fonts: EN = Inter, AR = IBM Plex Sans Arabic
- Touch target: Web 24×24 min (product 40), Tablet 48, Mobile 44/48
- Contrast policy: WCAG 2.2 AA gate + APCA confirmation (version pinned)
- Numeral policy (AR): Western | Arabic-Indic | Open question
```

---

### PKG-02 · P0 · The Plan Package lives only in the chat

**What:** `ds-build.md` line 211 says: "If the in-file contract frame exists but Plan extras C–D are only in the conversation report, **the conversation report wins for C–D execution**." In `ds-plan.md` line 480, saving the contract in the file is only *recommended*.

**Why it matters:** A new chat, a different agent, or a long chat that drops early messages loses Tables C–D and the approval. Then Build either stops or rebuilds the package from memory, which is exactly what the package tries to stop.

**Fix:**

- Make the in-file **Contract frame** required before `Ready to Build`. It holds the `CC-*` ID, version, status, approval quote, and Tables B–E as text.
- Flip the Build rule: **the file wins**. The chat is only a fallback when it matches the same ID and version.
- Have the orchestrator check that the frame exists before it offers `/ds-build`.

---

### PKG-03 · P0 · Approval is not tied to a version, and Build accepts a paraphrase

**What:** The approval phrase is `Approve CC-BUTTON-WEB-001 Ready to Build`, with no version. `ds-build.md` line 224 asks for "Quote **or paraphrase**".

**Why it matters:** If the plan is revised after approval under the same ID, the old approval still "matches". A paraphrase lets the agent read a loose "looks good" as approval.

**Fix:**

- New phrase: `Approve CC-BUTTON-WEB-001 v1.0 Ready to Build`
- Any plan change bumps the version and **cancels** the earlier approval.
- Build must quote the approval word for word. Remove "or paraphrase".
- Use the same rule for `FG-*` (`Approve FG-ACME-PRIMER-001 v1 Ready to Generate`).

---

### PKG-04 · P0 · No tool-capability check before work starts

**What:** The skills assume the agent can read variable scopes, alias chains, values for every mode, effect geometry, publish state, and Text Style variable bindings, and can also write all of them. Figma MCP setups differ. Some only read design context or screenshots.

**Why it matters:** When a tool is missing, the agent may fill the gap with guesses. That breaks the "Unknown, don't guess" rule without anyone seeing it.

**Fix:** Add a short **Phase 0 · Capability check** to every skill:

| Capability | Needed by | If missing |
|---|---|---|
| List collections, modes, values per mode | review, arch review, generate, build | Mark rows `Unknown`; mutating skills stop |
| Read alias target and scopes | review, arch review | `Unknown` |
| Read effect geometry | review, build, test | `Unknown`; never invent values |
| Read Text Style variable bindings | review, test | `Unknown` |
| Create or edit variables and styles | generate, build, fix | **Stop**: `Blocked: write tools unavailable` |
| Calculate contrast from resolved hex | build, test, fix | `Unverified`; do not print numbers |

---

### PKG-05 · P1 · IDs restart every run and collide

**What:** `FP-001` is "stable within this review" (`ds-review.md` line 182). `G-001`, `QA-001` and `F-001` also restart each run.

**Why it matters:** `FP-001` for Button and `FP-001` for Input are different proposals. "Approve FP-001" becomes unclear in a long chat or in Jira.

**Fix:** Add the target to the ID: `FP-BUTTON-WEB-001`, `G-BUTTON-WEB-001`, `QA-BUTTON-WEB-001`. Or keep one global registry page (`_DS Registry`) and number IDs from there.

---

### PKG-06 · P1 · Three different severity scales

**What:**

- Review: `Blocking / Major / Minor / Info` (`ds-review.md` line 158)
- Architecture review: `Critical / Major / Moderate / Minor`. It calls this "the shared severity scale" (line 651), but it is not shared.
- Test and Fix: `Critical / Major / Moderate / Minor`
- Build "Remaining Findings": `Critical / Major / Moderate / Minor / Info`

**Fix:** Use one scale everywhere, with a separate "Blocks next step?" column:

| Severity | Use for | Blocks next step? |
|---|---|---|
| Critical | Broken API, instances, a11y, or architecture | Yes |
| Major | Wrong token or style use, missing state, missing mode value | Yes (unless the risk is accepted in writing) |
| Moderate | Friction, weak responsiveness, upkeep risk | No |
| Minor | Naming, docs polish | No |
| Info | Observation only | No |

Map Review's `Blocking` to `Critical`.

---

### PKG-07 · P1 · Status words are not one lifecycle

**What:** Statuses used across skills include `Draft`, `Ready to Build`, `Blocked`, `Built`, `Approved`, `Ready for Test`, `Ready`, `Ready for QA`, `Needs fixes`, `Deprecated`, and `Unknown`. `Approved` (in `ds-document.md` line 133) is never defined.

**Fix:** Define one lifecycle in `README.md` and point every skill to it:

```text
Draft → Ready to Build → Approved (human) → Built → Tested → Documented → Published → Deprecated
                    ↘ Blocked (can happen at any step)
```

---

### PKG-08 · P1 · Wrong idea that "Text Styles have platform modes"

**What:** `ds-review.md` line 128 ("Desktop / Tablet / Mobile where used"), line 273 ("Platform modes … on those styles"), and the worked example ("`Text/EN/Label/Medium` … Desktop/Tablet/Mobile") suggest Text Styles have modes.

**Fact:** In Figma, styles have no modes. A Text Style can bind its size and line height to typography **variables**. The variable collection has the Desktop/Tablet/Mobile modes, and the mode is set on the frame or page.

**Why it matters:** The agent may create three copies of each style, or flag a correct file as broken.

**Fix:** Change the wording to: "One Text Style per role and language. Platform values come from typography variables in the `{Type}` collection (modes Desktop/Tablet/Mobile), set by the frame mode." Record which pattern the file uses (one style plus modes, **or** separate styles per platform) in the Foundation Profile (PKG-01).

---

### PKG-09 · P1 · Contrast numbers have no calculation method

**What:** Plan, Build, Test and Fix all require WCAG ratios and APCA Lc values, but none of them says how to get them. `ds-foundation-generate.md` line 125 only asks for "approximate WCAG AA" and has no APCA check, while the rest of the package requires both.

**Why it matters:** A language model will produce believable but made-up numbers unless it has a set method.

**Fix:** Add one shared "Contrast procedure" (in the README or a shared reference file):

1. Resolve each alias chain **per mode** to the final hex.
2. If the foreground has transparency, blend it over the real background first.
3. WCAG: use the WCAG 2.x relative luminance formula.
4. APCA: pin the version (for example APCA-W3 0.0.98G-4g). Record the signed Lc.
5. Put both hex values in the table, so anyone can repeat the check.
6. If there is no calculation tool, write `Unverified`. Never estimate.

Also make the generate skill use the same WCAG + APCA check.

---

### PKG-10 · P1 · Arabic typography rules are missing

**What:** The package handles Arabic *content* and *direction* well, but not Arabic *type quality*.

**Missing checks (add to generate, review D1, test §4, and build Phase 6a):**

- Letter spacing for Arabic must be **0**. Tracking breaks letter joining.
- No uppercase or text-case transforms on Arabic styles.
- Line height: Arabic usually needs more room than Latin. Check that diacritics (tashkeel) are not clipped in tight boxes.
- Optical size: Arabic often looks smaller at the same px. Decide whether AR styles get a size bump, and record the decision.
- Numerals: Western (0–9) or Arabic-Indic (٠–٩). Make this a required `OQ-*` in Plan, not a silent default.
- Font fallback when the Arabic font is missing in Figma.
- Avoid justified text with stretched letters (kashida) in UI components.

---

### PKG-11 · P1 · No component tiers or build order

**What:** Nested parts such as `Icon`, `Icon Button`, `Spinner`, `Menu`, `Divider`, and `Tooltip` are required by Build and Test (`ds-build.md` lines 307, 411–413; `ds-review.md` line 431). But they are **not** in the supported list, and Build says "If the target is outside this list, stop and ask" (line 123). The Jira example even uses `Tooltip / Web` (`ds-jira.md` line 47). There is no build order either: Button Group needs Button, and Table needs Checkbox and Icon Button.

**Fix:**

- Add a **Tier 0** list: Icon, Spinner, Divider, Focus ring (if it is a component).
- Add a dependency order to the README, for example: Icon → Spinner → Button → Icon Button → Link → Badge → Avatar → Checkbox/Radio/Toggle → Input → Text Area → Button Group → Banner → Calendar → Table.
- The orchestrator warns when a Table D dependency has not been built yet.
- Make the naming the same everywhere: `Radio` in `ds-build.md` line 121, `Radio Button` in other files.

---

### PKG-12 · P1 · Orchestrator does not fully know the foundation-generate skill

**What:** `ds-run-workflow.md`:

- "Skill routing rules" (lines 168–177) list 8 skills and leave out `/ds-foundation-generate`.
- "Possible phases" (line 263) leaves out Foundation generate.
- There is no limit on Test → Fix loops.

**Fix:** Add the skill to both lists. Add: "After 2 Fix → Test cycles with Critical/Major still open, stop and recommend `/ds-plan`."

---

### PKG-13 · P2 · Skills are long and repeat themselves

**What:** `ds-build.md` is 1,330 lines. The public API is described four times in Plan (§3, §4, Table B, Build Snapshot). "Foundation Dependencies" repeats Table D. Platform and Language/Direction rules are copied into every file.

**Why it matters:** Long skills cost context and attention. Repeated rules drift apart over time. PKG-06 and PKG-07 are already examples of this drift.

**Fix:**

- Keep each skill file under about 500 lines. Move worked examples and appendices into reference files (for example `ds-build/reference/worked-example.md`, `ds-build/reference/arabic-glossary.md`).
- Move shared rules into one shared file (`_shared/rules.md`): Language ≠ Direction, platforms, severity, lifecycle, contrast procedure. Each skill links to it.
- In Plan, make **Table B** the single API source. §3 and the Snapshot should point to it, not copy it.

---

### PKG-14 · P2 · Packaging and repo hygiene

- Skills are flat files. For Cursor (and most skill loaders), each skill should be a folder: `ds-build/SKILL.md`, plus reference files.
- `debug.log` is a Windows Chrome crashpad error that was committed by mistake. Delete it and add a `.gitignore`.
- The skills have no version and there is no `CHANGELOG.md`. Add `version:` to each file's frontmatter.
- No `LICENSE` file (README says "private", which is fine, but say it in a file).

---

### PKG-15 · P2 · No save point before changes

**What:** Generate, Build and Fix change the shared library, but none of them creates a restore point first.

**Fix:** Before the first change, save a version-history checkpoint. The Figma Plugin API has `saveVersionHistoryAsync` when the tool exposes it; if not, ask the user to save a named version. Record the checkpoint name in the report. For `Replace` in generate, make this required.

---

### PKG-16 · P2 · No handoff to code (developers)

**What:** There is no code mapping in the contract, no Code Connect step, no variable `codeSyntax` in generate, and token export (DTCG) only appears as an optional architecture review mode.

**Why it matters:** Front-end developers (for example on MUI) have to guess how Figma properties and tokens map to code.

**Fix:**

- Plan: add an optional **§13 Code mapping** table (Figma property → code prop, token → CSS variable or theme key).
- Generate: set variable code syntax (WEB / ANDROID / iOS) and descriptions.
- Document: add a short **Developer notes** block that links to §13.

---

### PKG-17 · P2 · Missing lifecycle steps: release, deprecation, foundation docs, family parity

| Missing | Today | Suggested fix |
|---|---|---|
| Publish / release | Jira "Handoff" only adds a link | New `/ds-release`: publish checklist, release notes, version bump, consumer impact |
| Deprecation | Only mentioned in architecture review | Add a deprecation flow: mark, replacement mapping, removal after usage check |
| Foundation docs | `ds-document.md` lines 84–95 say it is out of scope | Add `/ds-document-foundations`, or a "Foundations" mode in ds-document |
| Web / Tablet / Mobile parity | Partly covered by Review "Consistency pass" | Add a "Family parity" mode: same property names, values, and token roles across platforms |

---

### PKG-18 · P3 · No way to test the skills themselves

**Fix:** Add a small `evals/` folder with one sample Figma file link plus the expected Review, Plan and Test reports for Button / Web. Re-run it after every skill change to catch regressions.

---

## 4. Skill-by-skill gaps

### 4.1 `ds-run-workflow.md` (Orchestrator)

| ID | P | Gap | Fix |
|---|---|---|---|
| ORC-01 | P1 | `/ds-foundation-generate` missing from routing list (lines 168–177) and phase list (line 263) | Add it to both |
| ORC-02 | P1 | Does not check that the in-file Contract frame exists before Build | Add to "Step control rules" #5 (see PKG-02) |
| ORC-03 | P2 | No Fix ↔ Test loop limit | Stop after 2 cycles and go back to Plan |
| ORC-04 | P2 | No dependency check (for example, Table needs Checkbox built first) | Warn using the tier order (PKG-11) |
| ORC-05 | P3 | No "resume" mode for a workflow stopped in an earlier session | Add "Resume from file state" using the Contract frame and Registry |

### 4.2 `ds-foundation-generate.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| FG-01 | P1 | No minimum list of semantic roles. The Review worked example's top gap is a missing focus ring, which generate should prevent | Add a required role checklist: surface/bg levels, text (primary, secondary, disabled, inverse, on-brand), icon, border, divider, **focus ring**, link (default, visited), selected, disabled, overlay/scrim, feedback ×4 (bg, border, text, icon) |
| FG-02 | P1 | Primitives are not hidden from publishing, and scopes are not set to "none" | Step 6: primitives get `hiddenFromPublishing = true` and empty scopes. Semantic variables get exact scopes (FILL, STROKE, TEXT_FILL, GAP, CORNER_RADIUS …) |
| FG-03 | P1 | No method for making color ramps, type scales, or spacing, so results cannot be repeated | Set defaults and record them in the blueprint: ramp method (for example OKLCH or HCT), step count, which step equals the brand hex, spacing base (4 or 8), type ratio, and line-height rules (Latin and Arabic) |
| FG-04 | P1 | Contrast check is "approximate WCAG AA" (line 125) | Use the shared WCAG + APCA procedure (PKG-09) |
| FG-05 | P2 | "Extend" path has no merge rules | Define what happens on name collision, mode mismatch, or an existing equal value |
| FG-06 | P2 | Mentions a "light architecture check" (line 40) that no skill defines | Add a "Post-generate check" mode to the architecture review |
| FG-07 | P2 | Does not offer the platform typography collection (Desktop/Tablet/Mobile) that the rest of the package expects | Add the input "Platform/breakpoint typography modes? yes/no" and save it in the Profile |
| FG-08 | P2 | Does not check the Figma plan's mode limit before proposing Light/Dark plus density | Check the mode limit per collection in step 1 |
| FG-09 | P2 | Report template only shows counts, but the quality bar wants exact names (line 410) | Add a "Created names" appendix |
| FG-10 | P2 | Does not write the Foundation Profile | Add a final step that writes the `_DS Profile` frame (PKG-01) |

### 4.3 `ds-foundation-architecture-review.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| AR-01 | P2 | No short summary table at the top. The report is very long | Lead with a "Missing points & solutions" table, like Review does |
| AR-02 | P2 | No worked example | Add a short one (for example, a Primer-based file with one broken alias) |
| AR-03 | P2 | Calls its severity scale "shared", but Review uses another one | Fix with PKG-06 |
| AR-04 | P2 | No "Post-generate check" mode (needed by FG-06) | Add a small mode: alias direction, mode completeness, scopes, hidden primitives, Text Style bindings |
| AR-05 | P3 | Does not write or refresh the Foundation Profile for files made outside this package | Add an optional output: "Profile draft" |

### 4.4 `ds-jira.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| JIRA-01 | P2 | Says "No `#` headings" (line 97), but the template uses `###` headings | Remove the `###` lines, or allow them |
| JIRA-02 | P2 | No optional subtasks for foundation work on new files | Add "Generate foundations" and "Review foundation architecture" as optional subtasks |
| JIRA-03 | P3 | Example uses `Tooltip / Web`, which Build refuses | Use a supported component, or add Tooltip to the tiers |
| JIRA-04 | P3 | "Done when" lines don't point to the real skill gates | Example: "Done when `/ds-test` result is Pass or Pass with findings" |
| JIRA-05 | P3 | Draft-only is right, but an Atlassian connection may exist | Optional mode: create issues **only** after an explicit "Create in Jira" approval |

### 4.5 `ds-review.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| REV-01 | P0 | Hardcoded expected profile (lines 115–130) | Read from the Foundation Profile (PKG-01) |
| REV-02 | P1 | Rules disagree. Severity table (line 162): Major lets Plan go on "only with **explicit risk acceptance**". Rubric (line 457): "Plan may proceed **if it tracks them**" | Choose one. Suggestion: tracking is enough for Plan; Build needs written acceptance |
| REV-03 | P1 | Text Style "platform modes" wording (PKG-08) | Reword |
| REV-04 | P2 | Runs in full before *every* component, which is heavy | Add a "Delta review" mode: reuse the last review when foundation counts and names have not changed, and check only the new needs |
| REV-05 | P2 | The A11y need group doesn't name touch-target numbers | Read targets from the Profile |

### 4.6 `ds-plan.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| PLAN-01 | P1 | API written in four places (§3, §4, Table B, Snapshot), so they can drift | Table B is the only API source. Others point to it |
| PLAN-02 | P1 | No numeral-policy question for Arabic | Required `OQ-*` (PKG-10) |
| PLAN-03 | P2 | No version rules (starts at `0.1 Draft`, the example uses `1.0`) | Define: 0.x while Draft, 1.0 at first approval, minor for non-breaking, major for breaking |
| PLAN-04 | P2 | "Web responsive … min-screens" (§6) is unclear: variants, modes, or frame widths? | State the method: platform variable modes for type and spacing, plus Fill/Hug behavior. No viewport variants |
| PLAN-05 | P2 | Arabic stress strings are written by the model, with no quality flag | Mark them "Stress copy — needs native review before product use". Use the same meaning as the EN example where possible |
| PLAN-06 | P2 | No code mapping section | Optional §13 (PKG-16) |
| PLAN-07 | P3 | No motion or content-style rules (casing, punctuation, max length) | Add optional lines to §5 and §9 |

### 4.7 `ds-build.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| BLD-01 | P1 | **Broken table**: Contrast Confirmation (lines 998–999) has 10 header cells and 11 separator cells. GitHub-style markdown will not render it as a table | Remove one `---\|` from the separator row |
| BLD-02 | P1 | Worked example teaches the wrong APCA polarity (lines 1209–1210): Light shows `+78`, Dark shows `−76` for the same "label on primary fill". Polarity depends on the **colors** (light text on dark fill is negative), not the theme. With white text on a brand fill, both should be negative | Fix the signs, or use real calculated values (PKG-09) |
| BLD-03 | P1 | Accepts a "paraphrase" of the approval (line 224) | Quote word for word, with version (PKG-03) |
| BLD-04 | P1 | Conversation wins over the file for Tables C–D (line 211) | File wins (PKG-02) |
| BLD-05 | P2 | "Variables and Styles Compliance" uses convention status words (`Verified convention`, `Unresolved policy`, …) for pass/fail checks (line 968) | Use `Pass / Fail / Partial / Unknown` |
| BLD-06 | P2 | Worked example: EN label `Button` with AR stress `حفظ` ("Save"). The meanings differ, which confuses reviewers | Use the same meaning (for example EN `Save` / AR `حفظ`) |
| BLD-07 | P2 | Toggle in RTL: "do not invert state meaning" is correct, but it doesn't say the knob travel **mirrors** in RTL | Add: "Mirror the knob position and travel. Keep On/Off meaning" |
| BLD-08 | P2 | Manual grid placement needs a reflow after every size change | Optional: if the Figma version supports auto layout (wrap or grid) on component sets, use it to keep the grid stable. Keep manual rules as the fallback |
| BLD-09 | P2 | No save point before changes | PKG-15 |
| BLD-10 | P3 | 1,330 lines | Move the worked example and Appendix A into reference files (PKG-13) |

### 4.8 `ds-test.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| TST-01 | P1 | **Broken table**: Contrast Confirmation (lines 397–398) has the same 10 vs 11 column problem | Remove one `---\|` |
| TST-02 | P2 | Result labels are confusing: "Pass — only optional Minor remain" vs "Pass with minor findings — Moderate/Minor only" | Rename to `Pass` (no findings, or Info only) and `Pass with findings` (Moderate/Minor) |
| TST-03 | P2 | Touch target numbers for Tablet/Mobile are missing ("product touch standard") | Read from the Profile. Common baselines: 44×44 pt (iOS), 48×48 dp (Android) |
| TST-04 | P2 | Focus ring rules are thin | Add: ring is ≥ 3:1 against **both** the component fill and the page background, ≥ 2px, not clipped by "clip content", visible in Light and Dark |
| TST-05 | P3 | No text-resize, text-spacing, or forced-colors checks | Optional design checks: 200% text, WCAG text-spacing overrides, high-contrast notes |

### 4.9 `ds-fix.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| FIX-01 | P1 | With no test report, Fix runs its own check and then **changes the file right away** (line 46). This skips independent QA and the user | Show the issue list first and wait for "Fix these: QA-…" |
| FIX-02 | P2 | Change log is hidden by default (line 249). Mutations need an audit trail | Always print a short change log (object, action, finding ID) |
| FIX-03 | P2 | `FP-*` IDs made in Fix can collide with Review IDs | PKG-05 |
| FIX-04 | P2 | No save point before changes | PKG-15 |

### 4.10 `ds-document.md`

| ID | P | Gap | Fix |
|---|---|---|---|
| DOC-01 | P1 | The Usage Evidence table merges `Theme/dir` and drops Language (line 473). This breaks the package's own Language ≠ Direction rule | Split into `Theme`, `Language`, `Direction` columns |
| DOC-02 | P2 | Hardcoded fonts (lines 190–191) | Read from the Profile |
| DOC-03 | P2 | No changelog or version section on the docs page | Add "Version and changes" to Status, linked to the `CC-*` version |
| DOC-04 | P2 | No developer notes | Add a short block that links to Plan §13 (PKG-16) |
| DOC-05 | P3 | Uses the status `Approved`, which is never defined | PKG-07 |

---

## 5. Accessibility notes (design-system expert view)

What is already right: WCAG 2.2 AA is the gate, APCA is only a second check, polarity is mentioned, runtime checks are handed off, and "never claim ARIA from Figma" is stated.

Add these:

1. **Pin the APCA version and thresholds** in one table, so Plan, Build, Test and Fix use the same numbers.
2. **Non-text contrast (WCAG 1.4.11)**: name it for borders of inputs, checkbox and radio outlines, toggle tracks, and focus rings, each against the color next to it.
3. **Focus Not Obscured (WCAG 2.4.11)**: mostly a page-level issue, but note it in docs for sticky headers and toasts.
4. **Disabled states**: WCAG excludes disabled controls from contrast, but APCA guidance still suggests a minimum for readability. Record which rule applies.
5. **Touch targets** per platform from the Profile (TST-03).

---

## 6. Fix roadmap (in order)

### Step 1 — Quick wins (about 1 hour, text edits only)

- [ ] BLD-01, TST-01: fix the two broken contrast tables
- [ ] BLD-02: fix the APCA polarity in the worked example
- [ ] DOC-01: split `Theme/dir` into Theme, Language, Direction
- [ ] ORC-01: add `/ds-foundation-generate` to the routing and phase lists
- [ ] JIRA-01, JIRA-03: heading contradiction and Tooltip example
- [ ] PKG-11 (part): use the same name for `Radio` / `Radio Button`
- [ ] PKG-14: delete `debug.log`, add `.gitignore`

### Step 2 — Safety gates (P0)

- [ ] PKG-03: versioned approval phrase, word-for-word quote, revision cancels approval
- [ ] PKG-02: required in-file Contract frame; file wins over chat
- [ ] PKG-04: Phase 0 capability check in every skill
- [ ] FIX-01: Fix must show the list and wait before changing anything without a test report

### Step 3 — Shared vocabulary (one shared file)

- [ ] Create `_shared/rules.md` with: severity scale (PKG-06), lifecycle (PKG-07), ID format (PKG-05), contrast procedure (PKG-09), Language ≠ Direction, platforms
- [ ] Replace the copied blocks in each skill with a link to it (PKG-13)

### Step 4 — Foundation Profile

- [ ] Define the Profile format (PKG-01)
- [ ] Generate writes it (FG-10). Architecture review can draft it (AR-05)
- [ ] Review, Build, Test and Document read it (REV-01, DOC-02, TST-03)
- [ ] Fix the Text Style "modes" wording (PKG-08)

### Step 5 — Quality depth

- [ ] Generate: role checklist, scopes and hidden primitives, ramp/type/spacing method (FG-01 to FG-03)
- [ ] Arabic typography checklist (PKG-10) and numeral `OQ-*` (PLAN-02)
- [ ] Component tiers and build order (PKG-11)
- [ ] Plan: single API source, version rules, clear Web responsive method (PLAN-01, 03, 04)

### Step 6 — Lifecycle growth

- [ ] Code mapping §13, codeSyntax, developer notes (PKG-16)
- [ ] `/ds-release`, deprecation flow, foundation docs, family parity (PKG-17)
- [ ] Split long skills into folders with reference files (PKG-13, PKG-14)
- [ ] Add `evals/` with a Button / Web golden run (PKG-18)

---

## 7. Gap index (all IDs)

| ID | P | One-line summary |
|---|---|---|
| PKG-01 | P0 | Hardcoded fonts and token names conflict with generate; add Foundation Profile |
| PKG-02 | P0 | Plan Package only in chat; make the in-file Contract frame required |
| PKG-03 | P0 | Approval has no version; Build accepts a paraphrase |
| PKG-04 | P0 | No tool-capability check |
| PKG-05 | P1 | IDs restart each run and collide |
| PKG-06 | P1 | Three severity scales |
| PKG-07 | P1 | Status words are not one lifecycle |
| PKG-08 | P1 | "Text Styles have platform modes" misconception |
| PKG-09 | P1 | No contrast calculation method |
| PKG-10 | P1 | Arabic typography rules missing |
| PKG-11 | P1 | No component tiers or build order |
| PKG-12 | P1 | Orchestrator misses generate skill and loop limit |
| PKG-13 | P2 | Long, repeated skills drift |
| PKG-14 | P2 | Packaging and repo hygiene |
| PKG-15 | P2 | No save point before changes |
| PKG-16 | P2 | No code handoff |
| PKG-17 | P2 | Missing release, deprecation, foundation docs, family parity |
| PKG-18 | P3 | No evals for the skills |
| ORC-01…05 | P1–P3 | Orchestrator items (section 4.1) |
| FG-01…10 | P1–P2 | Foundation generate items (section 4.2) |
| AR-01…05 | P2–P3 | Architecture review items (section 4.3) |
| JIRA-01…05 | P2–P3 | Jira items (section 4.4) |
| REV-01…05 | P0–P2 | Review items (section 4.5) |
| PLAN-01…07 | P1–P3 | Plan items (section 4.6) |
| BLD-01…10 | P1–P3 | Build items (section 4.7) |
| TST-01…05 | P1–P3 | Test items (section 4.8) |
| FIX-01…04 | P1–P2 | Fix items (section 4.9) |
| DOC-01…05 | P1–P3 | Document items (section 4.10) |
