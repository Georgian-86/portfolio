# Portfolio Website Build (Concept B v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old "book" site with Concept B v2, "The Untangling", as a real website. It must work on mobile and desktop and scrub the six Flow films with scroll.

**Architecture:**
- Vanilla JS on Vite (existing repo), with GSAP ScrollTrigger and Lenis (already dependencies).
- One `index.html` holds semantic sections; content is rendered from `src/content.js`.
- A reusable `FrameSequence` canvas scrubber picks the desktop (16:9) or mobile (9:16) frame set by viewport aspect.
- Design tokens are CSS custom properties.
- No framework, so the page is fast and every word is real HTML.

**Tech Stack:** Vite 7.1.12, GSAP 3.13.0 (ScrollTrigger), Lenis 1.3.11, Playwright (pre-installed in the container, used for tests only).

**Spec:**
- **Figma file `xAnp89eU0yXZyMyPS6Zv9I`:** pages `Mobile 390 v2` (49:330), `Desktop 1440 v2` (49:1437), `Scroll keyframes v2` (73:36), `Prototype v2` (78:36). Frame and node ids are in `.superpowers/sdd/2026-11-25-concept-b-final/task-1-report.md` and `task-2-report.md`.
- **Films:** `docs/VIDEO_PROMPTS.md`.
- **Constraints:** `docs/superpowers/plans/2026-11-25-concept-b-final.md` § Global Constraints.

## Global Constraints

- **Palette** (B): Paper `#F3F1EC`, Ink `#121417`, Navy `#0F1E3D`, Navy 2 `#182A4F`, Mint `#3DDC97`, Mint Deep `#0E7A52`, Sticky `#F7D154`, Alert Red `#C9343A`, Fog `#9DA9C2`, Muted per Figma.
  - Never use Mint `#3DDC97` as text on Paper.
  - Never use Sticky as text.
  - At most one red alert per screen.
- **Fonts:** Inter and JetBrains Mono only (Google Fonts, `display=swap`, with a fallback stack).
- **φ type scale:**
  - Mobile (<768 px): 12/16/26/42/68.
  - Desktop: 12/18/29/47/76/123/199.
  - Space scale: mobile 6/10/16/26/42/68, desktop 7/11/18/29/47/76.
- **Motion:** ease `cubic-bezier(0.16,1,0.3,1)`. Snap keyframes at 0/38.2/61.8/100% of each section's scroll. Under `prefers-reduced-motion`, show the 100% state (the film's last frame) with no transforms.
- **Mobile (the user's top priority):**
  - No horizontal scroll at any width from 320 to 1920.
  - Tap targets ≥44 px.
  - Pinned `Header/Online` (60 px) and `Bar/Input` (76 px: 52 px input, 44 px send) on viewports under 768 px. The bar opens WhatsApp.
  - Content always clears the bar.
- **Desktop:** nav carrying "Online · replies within [TBC]", a WhatsApp CTA button, and the 550/890 golden split for 02–07.
- **Films:** frame sets in `public/film/{hero,night,sheet}/{desktop,mobile}/frame_NNNN.webp`. Frame counts: hero 188/190, night 190/188, sheet 161/106 (desktop/mobile).
  - Each film carries a small "Illustrative footage" label.
  - The Flow watermark corner stays visible; never crop or cover it.
  - Preload the first 20 frames, then the rest in the background.
- **Content honesty:**
  - StepQ: "Client project · Website + iOS + Android".
  - TeachGenie and Brivia: "Founding team · [role TBC]".
  - No invented metrics. Demos tagged "Sample". Times tagged "Sample · illustrative times".
  - Anything unknown shows a visible `TBC` chip.
- **Contact:** WhatsApp number, email and Calendly live in `src/content.js` as placeholders marked TBC.
- **Old code:** remove the old book code (`src/mockups.js`, book sections). Keep `FrameSequence` and upgrade it.

## Review Focus

1. **Width sweep:** at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px, `document.documentElement.scrollWidth <= innerWidth`. Test: `tests/layout.spec.js`.
2. **Bar clearance:** on mobile, the pinned bar never covers the last line of any section at its end state, and the final CTA is fully visible above the bar. Test: `tests/layout.spec.js` checks that the 09 CTA button's rect bottom is at most `innerHeight - 76`, scrolled to the end.
3. **Wrong frame set:** a device rotated or resized across 768 px or the aspect boundary must switch frame sets without a blank canvas. Test: `tests/film.spec.js` resizes 390→1440 and asserts the canvas has non-transparent pixels.
4. **Reduced motion:** the page is fully readable with no pinned scrub jank, and the canvas shows the last frame. Test: `tests/film.spec.js` with `reducedMotion: 'reduce'`.
5. **Slow network:** before the frames load, a poster (the first frame) shows instead of an empty box. Test: route-delay the webp requests and assert the poster `<img>` is visible.

---

### Task 1: Foundation: tokens, shell, FrameSequence v2, test harness

**Files:**
- Create: `src/tokens.css`, `src/content.js`, `src/film.js`, `tests/layout.spec.js`, `tests/film.spec.js`, `playwright.config.js`
- Modify: `index.html`, `src/main.js`, `src/style.css`, `package.json`
- Delete: `src/mockups.js`, `src/config.js`, `src/sequence.js` (replaced by `film.js`)

**Interfaces (produces):**
- `film.js`: `export function mountFilm(el: HTMLElement, opts: { name: 'hero'|'night'|'sheet', desktop: number, mobile: number, start?: string, end?: string }): { destroy(): void }`.
  - It creates the canvas, a poster `<img>` and the "Illustrative footage" label.
  - It picks the set by `matchMedia('(max-width: 767px), (max-aspect-ratio: 1/1)')`.
  - It wires ScrollTrigger scrub (`start`/`end` default `'top top'`/`'bottom bottom'`) and handles reduced motion.
- `content.js`: `export const brand`, `sections`, `services`, `work`, `team`, `faqs`, each a plain object or array, with TBC markers as the string `'TBC'`.
- **Shell markup:** `<header class="hdr">` (Header/Online, with a menu button that opens `#menu`), `<nav id="menu">` sheet, `<main>` with `<section data-sec="01">…`, and `<form class="bar">` (mobile only).
- **Test command:** `npm test` runs `playwright test` against `vite preview` (port 4173).

- [ ] **Step 1:** Add `"test": "vite build && playwright test"` and devDependency `@playwright/test` pinned to the container's Playwright version (`node -e "console.log(require('playwright/package.json').version)"`). Write `playwright.config.js` with a `webServer` that runs `vite preview --port 4173`, launching Chromium via `executablePath: '/opt/pw-browsers/chromium'` if needed, and `trace: 'off'`.
- [ ] **Step 2:** Write the failing tests:
  - `tests/layout.spec.js`: the width sweep (Review Focus 1), header and bar visible at 390 and hidden bar at 1440, every `a,button,input` at 390 at least 44×44, and the bar-clearance check on the final CTA (Review Focus 2).
  - `tests/film.spec.js`: Review Focus 3, 4 and 5 against the hero film.
  - Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the tokens, shell, menu, bar (submitting opens `https://wa.me/<number>?text=<input>`), `film.js`, and the hero section 01 with the hero film and H1 copy from Figma B2-M-01/B2-D-01. Read the design with `get_design_context` (load the `figma:figma-design-to-code` skill first).
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Run `graphify update .`, then commit with the message `feat: B v2 foundation, shell and hero film`.

### Task 2: Sections 01b–03 (proof, missed calls with the night film, live agent, notes pipeline)

**Files:** Modify `index.html`, `src/main.js`, `src/style.css`, `src/content.js`. Create `src/agent-demo.js`. Test: `tests/sections.spec.js`.

**Interfaces:**
- **Consumes:** `mountFilm` from Task 1.
- **Produces:** `agent-demo.js` exports `mountAgentDemo(el)`. It plays the Figma 02b sequence (customer → typing → reply → booking card) on scroll. The typing row hides when the reply lands. Under reduced motion it shows the end state.

- [ ] **Step 1:** Write a failing `tests/sections.spec.js`:
  - `[data-sec="01b"]`, `"02"`, `"02b"` and `"03"` exist.
  - 02 contains the text "Sample · illustrative times".
  - At the end of the 02b scroll, the typing row is hidden and the reply and booking card are visible.
  - The booking card contains "Sample booking".
- [ ] **Step 2:** Build the sections from Figma frames B2-M/D-01b, 02, 02b and 03, using the night film in 02 and the snap animations from `Scroll keyframes v2`.
- [ ] **Step 3:** Run `npm test`. Expected: all PASS.
- [ ] **Step 4:** Run `graphify update .`, then commit with the message `feat: proof, missed-calls, live agent and pipeline sections`.

### Task 3: Sections 04–09 and menu content (dashboard with the sheet film, StepQ, founding team, services, about, CTA)

**Files:** Modify `index.html`, `src/main.js`, `src/style.css`, `src/content.js`. Test: `tests/sections.spec.js` (extend it).

- [ ] **Step 1:** Extend the tests:
  - Sections 04–09 exist.
  - 04 shows "Illustrative numbers · not client data".
  - The 05 chip row has 4 buttons, each ≥44 px tall, on one row at 390.
  - The StepQ credit text matches Global Constraints.
  - TeachGenie and Brivia each show a `TBC` chip.
  - Every menu link scrolls to its section.
- [ ] **Step 2:** Build the sections from Figma B2-M/D-04 to 09:
  - the sheet film goes in 04;
  - the D-06 and D-07 left-rail layout (550 rail, 890 content) on desktop;
  - the chip filter in 05 filters the work cards, with no selection by default.
- [ ] **Step 3:** Run `npm test`. Expected: all PASS.
- [ ] **Step 4:** Run `graphify update .`, then commit with the message `feat: dashboard, work, team, services, about and CTA sections`.

### Task 4: Polish, performance and accessibility pass

**Files:** any `src/*`, `index.html`. Test: `tests/a11y.spec.js`.

- [ ] **Step 1:** Write a failing `tests/a11y.spec.js`:
  - exactly one `h1`;
  - every `img` has `alt`;
  - decorative mess props have `aria-hidden`;
  - the page has a `lang`, a meta description, and Open Graph tags;
  - the contrast of body text against its background is ≥4.5, checked on 5 sampled elements via computed styles.
- [ ] **Step 2:** Fix whatever fails.
- [ ] **Step 3:** Performance:
  - Fonts use `preconnect` and `display=swap`.
  - Film frames are not requested before their section is within one viewport.
  - Total transfer for the first screen on mobile is under 3 MB: measure in a test with `page.on('response')` and sum sizes until `load`.
- [ ] **Step 4:** Run `npm test`. Expected: all PASS. Then take one screenshot per section at 390 and 1440 into the scratchpad (not committed) for the controller's review.
- [ ] **Step 5:** Commit with the message `perf/a11y: polish pass`.
