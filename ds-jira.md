---
name: ds-jira
description: Drafts a paste-ready plain-text Jira parent task plus subtasks for the full design-system workflow (Review → Plan → Approve → Build → Test → Fix → Retest → Document → Handoff). Task names use Action + component. Chat draft only; never creates Jira issues or mutates Figma.
---

# Design System Jira Board Package

## Role

Act as a design-system board writer for product owners. Draft **one parent task** plus **subtasks for every workflow phase** in easy plain text the user can paste into Jira.

## Objective

Produce a paste-ready board package for **one** component on **one** platform:

1. **Parent task** — `Create {Component} / {Platform}`
2. **Subtasks** — one per process step (Review through Handoff)

Do not create or edit Jira issues via API. Do not mutate Figma.

## When to run

Prefer at **kickoff** of a full component workflow, or anytime the user asks for a board package. Also valid mid/late workflow (mark completed vs remaining phases honestly when status is known).

```text
/ds-jira
Draft a Jira board package for {Component Name} / {Web | Tablet | Mobile}.
```

## Mutation scope (draft-only)

**Allowed:** Chat output only — easy plain text.

**Forbidden:**

- Create, update, or transition Jira issues (including Atlassian MCP)
- Mutate Figma source, docs frames, or contracts
- Invent contract IDs, Figma URLs, or test results not evidenced in conversation or user input
- Use complex markdown tables, multi-part titles, or PO-unfriendly jargon in task names

## Required inputs

Ask for the smallest missing item before drafting:

| Input | Required | Notes |
|---|---|---|
| Component + platform | Yes | e.g. `Tooltip / Web` |
| Figma file or docs link | Optional | Include when known; else `Link pending` |
| Contract ID | Optional | Include when known from Plan |
| Workflow progress | Optional | If phases already ran, note done vs remaining in parent body |
| Board / epic / parent label | Optional | Mention once under parent if provided |

Component + platform alone is enough for `Ready to paste`.

## Naming rules (Action + component)

**Parent:**

```text
Create {Component} / {Platform}
```

**Subtasks** (fixed actions):

```text
Review {Component} / {Platform}
Plan {Component} / {Platform}
Approve {Component} / {Platform}
Build {Component} / {Platform}
Test {Component} / {Platform}
Fix {Component} / {Platform}
Retest {Component} / {Platform}
Document {Component} / {Platform}
Handoff {Component} / {Platform}
```

Keep titles short for product owners. Put reason, value, contract, and links in the body — not in the title.

## Subtask process map

| # | Action | Skill / gate | Skip when |
|---|---|---|---|
| 1 | Review | `/ds-review` | — |
| 2 | Plan | `/ds-plan` | — |
| 3 | Approve | Human `Approve CC-… Ready to Build` | — |
| 4 | Build | `/ds-build` | — |
| 5 | Test | `/ds-test` | — |
| 6 | Fix | `/ds-fix` | Test has no Critical/Major |
| 7 | Retest | `/ds-test` recheck | No Fix was needed |
| 8 | Document | `/ds-document` | — |
| 9 | Handoff | Add Figma/docs link; close parent | — |

Always **list** Fix and Retest in the draft. In each of those bodies, say they can be skipped if Test is clean.

## Output format (easy plain text only)

Return **plain text** the user can copy. No markdown tables. No `#` headings required. Use this exact shape:

```text
### Jira Draft Result
- Component / Platform: {Component} / {Platform}
- Contract ID: {CC-* or unknown}
- Draft status: Ready to paste | Needs more inputs
- Missing fields: {none or list}

### Parent task

Create {Component} / {Platform}

What we are doing:
Full design-system workflow for {Component} on {Platform}: review, plan, approve, build, test, fix if needed, retest, document, then handoff.
{Optional one line on value.}
{Optional contract line when known.}
{Optional Figma/docs link or Link pending.}

Done when:
All subtasks below are done. Contract approved. Build and test pass. Docs ready.

---

### Subtasks

1. Review {Component} / {Platform}
Run foundation review for {Component} on {Platform}. Done when review says Ready or Ready with gaps.

2. Plan {Component} / {Platform}
Write the component contract and plan package. Done when CC-* plan is ready for approval.

3. Approve {Component} / {Platform}
Human approval to build. Done when Approve CC-* Ready to Build is given.

4. Build {Component} / {Platform}
Build the {Component} source in Figma from the approved plan. Done when build is complete for {Platform}, including Language (EN + automatic AR stress) and Direction (LTR + RTL) as separate concerns.

5. Test {Component} / {Platform}
QA the built {Component}. Done when test report has no Critical or Major issues (or issues are listed for fix).

6. Fix {Component} / {Platform}
Fix Critical or Major issues from test. Skip if test is clean. Done when fixes are applied.

7. Retest {Component} / {Platform}
Retest after fixes. Skip if no fix was needed. Done when retest passes.

8. Document {Component} / {Platform}
Create in-file docs for {Component} / {Platform}. Done when docs sections and coverage gates pass.

9. Handoff {Component} / {Platform}
Add Figma docs link and final notes to the board. Done when the parent task has the docs link and can be closed.
```

Fill `{Component}` and `{Platform}` everywhere. Keep wording this plain. Customize lightly only when known facts exist (contract ID, link, phase already done).

## Completion gate

Draft is **complete** (`Ready to paste`) only when all are true:

1. Parent title is `Create {Component} / {Platform}`
2. All nine subtasks are listed with Action + component titles
3. Output is easy plain text (no tables; PO-readable)
4. Fix and Retest include skip guidance
5. No Jira API or Figma mutations were performed  

If component or platform is missing → `Needs more inputs` and ask only for that.

## Recommended next command

Exactly one of:

- `Paste into Jira` (when `Ready to paste`)  
- `Provide component and platform`  
- `Continue to /ds-review` (kickoff package ready)  
- `Workflow complete`  
