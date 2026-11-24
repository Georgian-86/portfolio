# Portfolio Figma Concepts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create four Figma files in Golu Kumar's team (one Foundations file and three full concept files) so Golu can compare the concepts on desktop and on his phone and pick one.

**Architecture:** Every file is created and edited through the Figma MCP connector (`create_new_file`, `create_session`, `use_figma`, `get_screenshot`, `get_metadata`). Foundations holds the variables, text styles and logos. Each concept file rebuilds its own local variables from the same token values (cross-file library publishing isn't available through the connector), so each file stands alone. Every task ends with an **audit script**, run through `use_figma`, that measures the frames against the spec's rules. The audit is this plan's test.

**Tech Stack:** Figma MCP (Plugin API via `use_figma`), skills `figma:figma-use` (mandatory before `use_figma`), `figma:figma-generate-library`, `figma:figma-generate-design`, `figma:figma-use-motion`, `design:design-critique`, `design:accessibility-review`.

**Spec:** `docs/superpowers/specs/2026-11-24-portfolio-figma-concepts-design.md`

## Global Constraints
- Team plan key: `team::1309461206659100916`. File names: `Portfolio 2026 · 00 Foundations`, `Portfolio 2026 · A — 24 Hours`, `Portfolio 2026 · B — The Untangling`, `Portfolio 2026 · C — The Conversation`.
- Frames: mobile **390×844** (a section may be taller, but stays 390 wide); desktop **1440×900** (may be taller, stays 1440 wide).
- Type, mobile (base 16): 12 (label min) / 16 / 26 / 42 / 68 / 110. Desktop (base 18): 12 / 18 / 29 / 47 / 76 / 123 / 199. Body never under 16.
- Spacing: mobile 6 · 10 · 16 · 26 · 42 · 68; desktop 7 · 11 · 18 · 29 · 47 · 76.
- Grids: mobile 4 cols / 16 margin; desktop 12 cols / 80 margin; golden guides at 38.2% and 61.8%.
- Motion: durations 382 / 618 / 1000 / 1618 ms; ease `cubic-bezier(0.16,1,0.3,1)`; keyframes at 0 / 38.2 / 61.8 / 100%.
- Palettes, exact hexes (spec §8 + §9b):
  - **A:** `#0B1020` `#1E2A5A` `#FF7A59` `#F6F3EC` `#5A6278` `#B23A1E`
  - **B:** `#F3F1EC` `#F7D154` `#C9343A` `#0F1E3D` `#3DDC97` `#9DA9C2` `#121417` `#0E7A52`
  - **C:** `#FAF9F6` `#111111` `#3D5AFE` `#E8E4FF` `#D7F25C` `#6B6B66`
- Fonts:
  - **A:** Clash Display / Geist / Geist Mono
  - **B:** General Sans / JetBrains Mono
  - **C:** Satoshi / Geist Mono
  - If a font isn't returned by `figma.listAvailableFontsAsync()`, substitute: Clash Display → **Bricolage Grotesque**, General Sans → **Inter Tight**, Satoshi → **Manrope**, Geist → **Inter**. Record each substitution on the file's Cover page.
- Copy rules:
  - First person, Golu's name.
  - Credits: StepQ is "Client project · Website + iOS + Android"; TeachGenie and Brivia are "Founding team · [role TBC]".
  - Any number in A's 09:00 section carries the label *illustrative*.
  - TBC items are shown as visible `TBC` tags.
- Media placeholders: a filled rectangle with the label `ASSET-ID · ratio · prompt ref` (e.g. `HERO-NIGHT · 9:16 · prompt A-1`).
- Mobile CTA: A and B use a floating WhatsApp pill (52 px high) on every frame after the hero, except the final CTA frame. C uses a sticky input bar instead.

## Review Focus
1. **Text overflowing its frame at 390 px** (long headlines like "Give your business a night shift."). Expected: wraps inside the frame, never clipped. Checked by audit check `overflow` in Tasks 3–5.
2. **Missing font in Figma's cloud.** Expected: the substitute from Global Constraints is used and noted on Cover, with no Roboto fallback left behind. Checked by audit check `fonts` in Tasks 1, 3–5.
3. **Accent colour as text on a light background** (Coral or Mint on Porcelain/Paper). Expected: never; Ember / Mint Deep are used instead. Checked by audit check `contrast` in Tasks 3–4.
4. **Tap targets under 44 px on mobile** (chips, pill, nav). Checked by audit check `targets` in Tasks 3–5.
5. **Prototype links that dead-end** on the phone mirror. Expected: every mobile frame links to the next one. Checked by audit check `proto` in Tasks 3–5.

---

### Task 1: Foundations file — variables, text styles, grids, palette cover

**Files:** Figma file `Portfolio 2026 · 00 Foundations` (new). Pages: `Cover`, `Type & Space`, `Logos`.

**Interfaces:**
- Produces:
  - Variable collections `Type` (modes `Mobile`, `Desktop`; vars `type/label, body, lead, h3, h2, h1, display`), `Space` (modes `Mobile`, `Desktop`; vars `space/1..6`) and `Color` (modes `A`, `B`, `C`; semantic vars `bg, bg-alt, text, text-muted, accent, accent-on-light, cta-bg, cta-text`).
  - The fileKey, recorded in `docs/FIGMA_LINKS.md`.
- Consumes: nothing.

- [ ] **Step 1:** Load skills `figma:figma-use` and `figma:figma-generate-library`. Call `create_new_file` (planKey above), then `create_session` with the returned fileKey.
- [ ] **Step 2:** Create the three collections with the exact values from Global Constraints. Map semantic colours per mode:
  - **A:** bg `#0B1020`, bg-alt `#F6F3EC`, text `#F6F3EC`, text-muted `#5A6278`, accent `#FF7A59`, accent-on-light `#B23A1E`, cta-bg `#FF7A59`, cta-text `#0B1020`
  - **B:** bg `#F3F1EC`, bg-alt `#0F1E3D`, text `#121417`, text-muted `#5B6170`, accent `#3DDC97`, accent-on-light `#0E7A52`, cta-bg `#0F1E3D`, cta-text `#F3F1EC`
  - **C:** bg `#FAF9F6`, bg-alt `#E8E4FF`, text `#111111`, text-muted `#6B6B66`, accent `#3D5AFE`, accent-on-light `#3D5AFE`, cta-bg `#3D5AFE`, cta-text `#FFFFFF`
- [ ] **Step 3:** Check font availability and create text styles per concept (`A/Display`, `A/H1` … `C/Label`) bound to the `Type` variables. Create grid styles `Grid/Mobile` and `Grid/Desktop`.
- [ ] **Step 4:** Build a `Cover` page: three palette columns with swatches, each text pairing and its contrast ratio (from spec §8), the type specimen at both modes, and the font-substitution notes.
- [ ] **Step 5 — Audit (test):** run a `use_figma` script that returns `{collections, varCount, fontsMissing:[], stylesCount}`. Expected: 3 collections, Type 7 vars × 2 modes, Space 6 × 2, Color 8 × 3; `fontsMissing` empty after substitution. Then `get_screenshot` of Cover and check it visually.
- [ ] **Step 6:** Add the file URL to `docs/FIGMA_LINKS.md` and commit (`docs: add Figma foundations link`).

### Task 2: Logos — three directions

**Files:** Foundations › page `Logos`.

**Interfaces:** Produces components `Logo/A-Clock`, `Logo/B-Untangle` and `Logo/C-Bubble`, each with variants `Wordmark-Light`, `Wordmark-Dark`, `Monogram-Light`, `Monogram-Dark`, `Avatar` (circle 400). Consumes Task 1 colour variables.

- [ ] **Step 1:** Build the components (per spec §8):
  - **A:** GK inside a thin clock ring with one coral tick at 12; wordmark "Golu Kumar" in A's display font.
  - **B:** one vector path that runs tangled and then straightens into GK; wordmark in General Sans.
  - **C:** lowercase "golu kumar" wordmark; GK inside a speech bubble whose tail is a cursor.
  - Each has the tagline variant "Independent studio for AI, automation & product".
- [ ] **Step 2:** Add a test strip per logo showing it at 16, 32 and 64 px, in a WhatsApp-style circle avatar at 48 px, and on light and dark backgrounds.
- [ ] **Step 3 — Audit:** a script returns the component and variant counts (expected 3 × 5). Take a `get_screenshot` of the test strips and confirm the monogram is legible at 32 px and nothing is clipped by the circle.
- [ ] **Step 4:** Commit the link update if it changed.

### Task 3: Concept A — "24 Hours" file

**Files:** Figma file `Portfolio 2026 · A — 24 Hours`. Pages: `Cover`, `Mobile 390`, `Desktop 1440`, `Scroll keyframes`, `Prototype`.

**Interfaces:**
- Consumes: token values and the `Logo/A-Clock` design from Tasks 1–2 (recreated locally).
- Produces: frames named `A-M-01-Hero` … and `A-D-01-Hero` …, in section order.

Sections (spec §8 A, with 1b and the demos from §9b):
1. `01-Hero`
2. `01b-Proof`
3. `02-WhatsApp-0208` (demo)
4. `03-Automation-0430` (demo)
5. `04-Deploy-0600`
6. `05-SEO-0745`
7. `06-Morning-0900`
8. `07-Work-1000` (StepQ expanded + TeachGenie + Brivia + automation cards)
9. `08-Services-1100`
10. `09-About`
11. `10-CTA-1200`

- [ ] **Step 1:** Load `figma:figma-generate-design`. Create the file and session, and recreate the variables (A mode only) and text styles.
- [ ] **Step 2:** Build all mobile frames (390) on `Mobile 390`.
  - Background steps through the palette from night to day across the sections.
  - The clock bar sits at the top of every frame.
  - The floating WhatsApp pill appears on frames 01b–09.
  - The CTA sits in the bottom 38.2%.
- [ ] **Step 3:** Build all desktop frames (1440) on `Desktop 1440` with the same content and order. The clock sits in the left column on the golden split.
- [ ] **Step 4:** On `Scroll keyframes`, show the hero, WhatsApp demo, automation demo and the night-to-day transition at 0 / 38.2 / 61.8 / 100%, mobile beside desktop, each annotated with duration and ease. Load `figma:figma-use-motion` and add real keyframe animation to the clock digits and the chat bubbles.
- [ ] **Step 5:** On `Prototype`, duplicate the mobile frames and link each one to the next with Smart Animate (On tap → next, 618 ms).
- [ ] **Step 6:** Fill `Cover` with the summary, palette, type, logo and any font substitutions.
- [ ] **Step 7 — Audit (test):** a script over all `A-M-*` and `A-D-*` frames returns these checks:
  - `widths`: every mobile frame is 390 and every desktop frame is 1440.
  - `overflow`: no text node extends past its frame.
  - `fonts`: no text below 16 except nodes named `label*` (≥ 12).
  - `targets`: every node named `btn*`, `chip*` or `pill*` on mobile is at least 44 px high.
  - `contrast`: no text filled with `#FF7A59` sits on a `#F6F3EC` background.
  - `proto`: every `Prototype` frame except the last has a reaction.

  All checks must return an empty list of violations. Fix and re-run until they do, then `get_screenshot` the hero (mobile and desktop) and check it visually.
- [ ] **Step 8:** Update `docs/FIGMA_LINKS.md` and commit (`docs: add concept A Figma link`).

### Task 4: Concept B — "The Untangling" file

Same structure as Task 3, with these differences:
- Frames are prefixed `B-`.
- Sections:
  1. `01-Hero-Chaos`
  2. `01b-Proof`
  3. `02-MissedCalls-Agent` (demo)
  4. `03-Notes-Pipeline` (demo)
  5. `04-Sheet-Dashboard`
  6. `05-StepQ`
  7. `06-FoundingTeam`
  8. `07-Services`
  9. `08-About`
  10. `09-CTA-CleanDesk`
- The mobile hero shows only 3–4 chaos items; each mobile section shows one item snapping to order.
- The keyframes page shows each snap (0 / 38.2 / 61.8 / 100) for sections 02–04.
- Audit `contrast` check: no `#3DDC97` text on `#F3F1EC`, and no `#F7D154` used as text.
- Commit: `docs: add concept B Figma link`.

### Task 5: Concept C — "The Conversation" file

Same structure as Task 3, with these differences:
- Frames are prefixed `C-`.
- Sections:
  1. `01-Hero-Chips`
  2. `02-ChipSent`
  3. `03-Work-Attachments` (default order)
  4. `03r-Work-Reordered` ("App" chosen, StepQ first)
  5. `04-StepQ-Expanded`
  6. `05-Services-VoiceNotes`
  7. `06-ClientWords`
  8. `07-LiveAgent` (demo: message → typing → reply → booking)
  9. `08-About`
  10. `09-ContinueWhatsApp`
- Desktop is a centred 640 px chat column with floating attachment-tile placeholders in the margins.
- Mobile uses a sticky input bar (≥ 52 px) on every frame instead of the pill.
- The keyframes page shows the chip-send, the reorder and the agent sequence.
- Audit `targets` includes the chips and the input.
- Commit: `docs: add concept C Figma link`.

### Task 6: Cross-concept review and hand-off

**Files:** `docs/FIGMA_LINKS.md`, `docs/superpowers/reviews/2026-11-24-concepts-critique.md` (new).

- [ ] **Step 1:** Run `design:design-critique` and `design:accessibility-review` on the three hero frames and one work frame per concept (via `get_screenshot`). Score immersion, trust, mobile parity, hierarchy and golden-ratio compliance, with the top 5 fixes each.
- [ ] **Step 2:** Apply any fix that breaks a Global Constraint. List the others as suggestions.
- [ ] **Step 3:** Write the critique doc, plus phone-mirror instructions (Figma mobile app → open file → Mirror → `Prototype` page).
- [ ] **Step 4:** Commit and push (`docs: add concept critique and Figma links`).
