# DESIGN.md · v3.1 "Desk by day, agent by night"

Source of truth for tokens and section specs. Values live in `src/tokens.css`; styles in `src/style.css`.
Maturity: L1 (this file + tokens; no component library). Strategy: `docs/research/2026-11-28-reel-study-and-brand-strategy.md`.

## Palette (sampled from the films, owner-approved 2026-11-28)
Every colour comes from the footage, so a full-bleed film meets the page with no seam and needs no dark scrim.

| Token | Hex | Sampled from | Use | Contrast |
|---|---|---|---|---|
| `--paper` | `#EFE7DC` | hero/sheet desk | page background, day sections | — |
| `--paper-2` / `--paper-3` | `#E6DCCE` / `#D9CDBC` | | cards / hairlines on paper | |
| `--ink` | `#14171C` | phones, cables | text on paper | 14.7:1 |
| `--ink-2` | `#5C5549` | | secondary text on paper | 6.0:1 |
| `--signal-ink` | `#0F6B4C` | | mint as text on paper | 5.3:1 |
| `--night` | `#07111B` | night film shadows | night layer, night sections | — |
| `--night-2` / `--night-3` | `#0E1B27` / `#1C2A36` | | cards / hairlines on night | |
| `--mist` / `--mist-2` | `#E9EEF0` / `#8FA0A6` | | text on night | 16.3:1 / 7.0:1 |
| `--signal` | `#74D8B2` | chat bubbles, chart bar | the Node, CTAs, live states; text on it = night | 11.1:1 |
| `--note` | `#F0D890` | sticky notes | TBC chips and the real sticky notes. Never text | |
| `--alert` | `#E05C5C` | missed call | at most one per page | |

**Theme engine:** sections are transparent and carry `data-theme="paper|night"`, which sets `--fg/--fg-2/--line/--card/--wash`.
A fixed `.nightfall` layer fades in (opacity only) for runs of night sections (02–03, 07). The header takes the theme
of the section under it and turns to glass after 40px.

**Type:** Inter (optical size axis, 400–600) for everything, labels included, in sentence case. JetBrains Mono only
for numeric data (loader counter, flow-node badges). Anti-slop rules (2026-11-28): no italic/serif accent word, no
all-caps mono eyebrows, no numbered section eyebrows (numbers only on real sequences, e.g. How I work), no `A · B · C`
strings (write a sentence), no spaced em-dash labels. Locked honesty credits keep their exact wording. Fluid scale: label 12 · body 16–18 ·
lead 19–26 · h3 24–38 · h2 40–96 · h1 42–128 · display 64–240. Display tracking −3.5% to −5.5%.
**Space:** φ 6/10/16/26/42/68 + section rhythm `--s-7` 96–180. **Radius:** pills 999, cards 14/22.
**Motion:** `--ease: cubic-bezier(0.16,1,0.3,1)`; scroll = ScrollTrigger scrub 0.6–0.8 on Lenis (lerp 0.085);
transform + opacity only; time-based tweens only for direct input (cursor, clicks). Reduced motion → end states, no pins.

## Signature elements
- **The Node** (`cursor.js`): 10px mint dot following the mouse (quickTo 0.22s). Over links/buttons a ring grows and a
  mono verb shows (`data-node`, defaults: wa.me → CHAT, #anchor → GO, link → OPEN). Fine pointer only; off under reduced motion.
- **The Wire**: a 1.5px line that draws with scroll and lights nodes as it passes (automations flow, process steps).
- **Magnetic buttons** (`magnetic()` in `ui.js`) on hero, header and contact CTAs.

## Components
| Component | Variants / states | A11y |
|---|---|---|
| `.btn` | `--primary` (signal/night), `--ink`, `--ghost`; magnetic; active scale .98 | 52px tall |
| `.pill` | `aria-pressed` toggles (WhatsApp demo) | 44px |
| `.toggle` | Stage / List with sliding thumb, remembered in localStorage | buttons with `aria-pressed` |
| `.chip`, `.tbc`, `.label` | mono caps; TBC is a note-yellow chip | decorative copy only |
| Header | transparent on hero, glass after; theme follows section | fixed, 64/76px |
| Bar (mobile) | night glass, signal send | fixed 76px, 44px targets |
| Film | full-bleed canvas, cover anchored bottom-right, "AI-generated footage" chip | `aria-hidden` |

## Hard rule: the watermark corner
The Flow watermark sits at the film's bottom-right. No element with opacity > 0.1, no wash, no blur may cover the
watermark zone (desktop 12%×14% CSS guard, mobile 30%×18%). On mobile the frame is drawn above the pinned bar
(`--film-inset-b: var(--bar-h)`); mobile hero copy sits above the zone, never beside it.

## Section specs
0. **Loader** (paper): G·K mark draws, real-progress counter, curtain lifts.
1. **Hero** (paper, 400svh pin): hero film full-bleed; paper wash on the left (desktop) / a mid band (mobile, copy below
   the film's phone). Three lines, one at a time: "Every business runs on a little chaos." (letters jumbled; they scatter
   from the Node and straighten as you scroll) → "I build the systems that untangle it." →
   "AI agents · automations · websites · apps." + magnetic CTAs. Focus pull over the first 30%.
2. **What I build** (night, 340svh pin): particle field (three.js lazy via `three-lite.js`, canvas 2D fallback) morphs
   cloud → browser → chat bubble → phone; pointer repels points and tilts the field. Grow / Automate / Ship light in turn.
3–4. **The desk world** (`src/world/`, owner-approved 2026-11-28): one code-built three.js desk behind both sections,
   on a fixed canvas that fades in/out (opacity only) and renders only while on screen. No footage, no watermark.
   - **03 WhatsApp** (night, 320svh pin): the phone wakes on the dark desk, a missed call becomes a chat that types
     itself to "Booked"; the camera circles in. Salon / Clinic / Store pills swap the conversation on the phone
     (screen-reader transcript in `.demo__transcript`). Subject framed right (`shift` 0.2), copy left.
   - **04 Automations** (paper, 320svh pin): dawn; printed sheets tidy away, the laptop opens, the sample dashboard
     fills in, camera pushes toward the screen. The Wire runs New order → Invoice → CRM → You.
   - three.js loads when 02–04 come within 1.5 viewports; DPR ≤ 1.5; no WebGL → plain night/paper page.
   - Preview of the full desk (with a code-built hero chapter that was *not* adopted): `/lab/scenes.html`.
5. **Selected work** (paper): **Stage** = sticky full-screen tone panels that stack (the one below scales to .92 and
   dims via an overlay); **List** = big rows that expand, with a preview card following the pointer.
6. **How I work** (paper): Listen → Map → Build → Hand over on a drawing Wire.
7. **About** (night): bio, CV/LinkedIn/GitHub as TBC chips, "How this site is built" readout.
8. **Contact** (paper): giant "Let's build yours." (chars rise on scroll, lean toward the Node), WhatsApp / Book a call / Email TBC.
