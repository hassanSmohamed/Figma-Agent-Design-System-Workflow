# Language, Direction, and Theme

## 1. Three independent axes

| Axis | What it is | Mechanism | Never |
|---|---|---|---|
| **Theme** | Light / Dark | Variable modes on the semantic collection | Theme variants on the component set |
| **Language** | Content locale (EN, AR, …) | Content strings + the matching `Text/{LANG}/…` Text Styles | Language variants; EN/AR duplicate sets; faking Arabic by right-aligning a Latin font |
| **Direction** | Layout direction (LTR / RTL) | The hybrid mechanism in §3 | Treating "Arabic" as a Direction value; assuming Language ≡ Direction |

Rules for every skill:

1. Reports, intake fields, and table columns name `Theme`, `Language`, and `Direction` separately. Never one "RTL/i18n" cell.
2. Primary stress pairs are **EN + LTR** and **AR + RTL**, but evidence is recorded per axis.
3. Never explode `Theme × Language × Direction` into variants.

## 2. Why a mechanism is needed

Figma Auto Layout has **no RTL switch**: child order and text alignment are physical. "Direction-neutral" names (`Leading`, `Trailing`) help people read the layers, but they do not flip anything by themselves. So RTL must be built on purpose.

## 3. The RTL mechanism (hybrid — package default)

Pick the lowest level that works, per component part. Record the choice in contract §8c and in Build's Direction Implementation table.

### Level 1 — Direction-neutral (no extra structure)

Use when the part looks correct in both directions without reordering:

- A single child, centered content, or a symmetric shape (Avatar, Badge dot, Spinner).
- Vertical stacks whose text nodes **Hug** their width (alignment then does not matter).

Not allowed when the part has ordered horizontal children (icon + label), Fill-width text that must align to the start, or directional icons.

### Level 2 — Private direction helper (preferred for ordered parts)

1. Create a private component set for the ordered part, named `.{Component}/{Part}` (example `.Button/Content`), with one axis `Direction = LTR | RTL`.
2. `LTR` variant: children in reading order Start → End; Fill-width text aligned **left**.
3. `RTL` variant: the same children in **reversed physical order**; Fill-width text aligned **right**; directional slots flipped (see §5).
4. Nest one helper instance in every variant of the main set.
5. **Expose the helper's properties** on the parent ("expose nested instances"), so consumers set `Direction` on the instance. The main set gets **no** Direction axis.
6. Keep all other helper properties (label text, icon swaps, booleans) wired through the parent's component properties.

### Direction is set per instance (known cost)

A Figma variable mode can't switch a component's variant, so a frame-level "RTL mode" does not flip nested helpers. Every Level 2 helper's `Direction` is set **on each instance** by the consumer (through the exposed property). There is no page-level or frame-level inheritance.

What this means:

| Component | Helpers per instance | Consumer cost in an RTL screen |
|---|---|---|
| Button, Input, Chip, Tab | 1 | One `Direction` change per instance |
| Menu, Select (open list) | 1 per item row | One change per row; expose on each item instance |
| Table | 1 per header row + 1 per body row (`.Table/Row`), plus 1 per cell whose content is ordered (for example Avatar + name) | One change per row, plus one per ordered cell. A 10-row table is 11+ changes |
| Calendar | Header (month nav) + weekday row + 1 per week row (up to 6) | Up to 8 changes per calendar instance |

Rules:

1. Contract §8c lists every helper a consumer must set, so the docs can show it (Document, Behavior section, Direction notes).
2. For Table and Calendar, the docs page includes a ready-made **RTL starter** instance with every helper already set. Consumers duplicate it instead of setting each helper.
3. Do not add a Direction axis to the main set to save consumer clicks; that is still Level 3 and needs a `DEC-*`.

### Level 3 — Direction axis on the main set (last resort)

Only when anatomy differs in more than order (rare). Needs a `DEC-*` with the reason and must not multiply other axes needlessly.

### Proof (test harness)

Direction is proven, not assumed: `/ds-build` self-check and `/ds-test` place instances on the `_DS Sandbox` page (see [workflow-state.md](workflow-state.md)), set `Direction = RTL`, apply AR stress content with AR Text Styles, check order, alignment, icon flips, wrapping and clipping, then delete the sandbox frame. LTR is re-checked the same way so it did not regress.

## 4. Arabic typography rules

Apply to every `Text/AR/…` style (generate, extend) and check them (review D1, test TXT rules):

| Rule | Why |
|---|---|
| Letter spacing **0** | Tracking breaks letter joining |
| No case transform (`UPPER`, `Title`) | Arabic has no case; transforms can break rendering |
| Line height ≥ **1.5×** font size for body and labels (Profile may raise it) | Room for ascenders, descenders and diacritics |
| Check diacritics (tashkeel) are not clipped in fixed-height boxes | Clipped marks change meaning |
| Size adjustment decided and recorded (`+0`, `+1px`, `+2px`) | Arabic often looks smaller at the same px |
| No justified text with stretched letters (kashida) in components | Unstable widths |
| Fallback font named in the Profile | Missing fonts silently swap |
| Numerals policy: `western`, `arabic-indic`, or `open-question` in the Profile | Plan must ask (`OQ-*`) when open; never decide silently |

## 5. Mirroring

**Usually mirror (directional):** back/forward, previous/next, left/right arrows, directional chevrons, undo/redo when the glyph shows direction, enter/exit arrows, calendar month navigation, progress and slider fill direction, toggle knob travel.

**Usually do not mirror:** brand logos, checkmarks, close, search, info/warning/success/error symbols, plus/minus, vertical upload/download, clocks, pins, photos, avatars, QR codes, charts, media artwork.

How to mirror in Figma:

- **Directional slot** (a slot that always holds a direction glyph, such as a trailing arrow): in the Level 2 helper's `RTL` variant, flip the icon instance horizontally.
- **Generic slot** (consumer can swap any icon): do not flip. Document that consumers choose the mirrored glyph from the icon library.
- Toggle: mirror the knob position and travel in RTL. **Keep the meaning** (On is still On).

Record every decision in the Directional Icon Decisions table.

## 6. Mixed-direction content

Values stay LTR inside RTL layouts: email, URL, phone, OTP, IDs, file paths, version numbers, Latin units, and dates when the product format is LTR. Never reverse characters. Keep the Arabic label/helper/error in Arabic styles around the LTR value.

## 7. Locale packs and stress copy

Stress strings live in `standards/locale-packs/`. Default packs: [en.md](locale-packs/en.md) and [ar.md](locale-packs/ar.md). A file may enable more packs in the Profile (for example Hebrew or Persian for RTL coverage).

Rules:

1. Every contracted text role gets a string from **every enabled pack** (Plan §5 first, pack fallback second). Empty AR = failure.
2. Stress copy is **layout simulation, not translation**. Mark it `Stress copy — needs native review before product use`.
3. Keep the same meaning as the EN example where possible (EN `Save` ↔ AR `حفظ`), so reviewers are not confused.
4. Never invent product facts: numeral policy, date format, legal text, prices.
5. Use neutral fixtures for IDs, emails, and phones (no real names or brands).
