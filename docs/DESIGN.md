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
| `--note` | `#F0D890` | sticky notes | highlighter sweeps, TBC chips. Never text | |
| `--alert` | `#E05C5C` | missed call | at most one per page | |

**Theme engine:** sections are transparent and carry `data-theme="paper|night"`, which sets `--fg/--fg-2/--line/--card/--wash`.
A fixed `.nightfall` layer fades in (opacity only) for runs of night sections (02–03, 07). The header takes the theme
of the section under it and turns to glass after 40px.

**Type:** Inter (optical size axis, 400–600) for everything; **Instrument Serif italic** for one accent word per heading
only (`.serif`); JetBrains Mono 500 caps for labels/readouts (`.label`). Fluid scale: label 12 · body 16–18 ·
lead 19–26 · h3 24–38 · h2 40–96 · h1 42–128 · display 64–240. Display tracking −3.5% to −5.5%.
**Space:** φ 6/10/16/26/42/68 + section rhythm `--s-7` 96–180. **Radius:** pills 999, cards 14/22.
**Motion:** `--ease: cubic-bezier(0.16,1,0.3,1)`; scroll = ScrollTrigger scrub 0.6–0.8 on Lenis (lerp 0.085);
transform + opacity only; time-based tweens only for direct input (cursor, clicks). Reduced motion → end states, no pins.

## Signature elements
- **The Node** (`cursor.js`): 10px mint dot following the mouse (quickTo 0.22s). Over links/buttons a ring grows and a
  mono verb shows (`data-node`, defaults: wa.me → CHAT, #anchor → GO, link → OPEN). Fine pointer only; off under reduced motion.
- **The Wire**: a 1.5px line that draws with scroll and lights nodes as it passes (automations flow, process steps).
- **Highlighter**: a `--note` stroke swept in with `scaleX` under one key word.
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
   the film's phone). Three lines, one at a time: "Every business runs on a little *chaos*." (letters jumbled; they scatter
   from the Node and straighten as you scroll) → "I build the systems that *untangle* it." (highlighter sweep) →
   "AI agents · automations · websites · apps." + magnetic CTAs. Focus pull over the first 30%.
2. **What I build** (night, 340svh pin): particle field (three.js lazy via `three-lite.js`, canvas 2D fallback) morphs
   cloud → browser → chat bubble → phone; pointer repels points and tilts the field. Grow / Automate / Ship light in turn.
3. **WhatsApp agents** (night, 320svh pin): night film; demo with Salon / Clinic / Store pills that replays a "Sample
   conversation" (owner to confirm industries). On phones the demo follows the pinned film.
4. **Automations** (paper, 320svh pin): sheet film; the Wire runs New order → Invoice → CRM → You, lighting each node.
5. **Selected work** (paper): **Stage** = sticky full-screen tone panels that stack (the one below scales to .92 and
   dims via an overlay); **List** = big rows that expand, with a preview card following the pointer.
6. **How I work** (paper): Listen → Map → Build → Hand over on a drawing Wire.
7. **About** (night): bio, CV/LinkedIn/GitHub as TBC chips, "How this site is built" readout.
8. **Contact** (paper): giant "Let's build yours." (chars rise on scroll, lean toward the Node), WhatsApp / Book a call / Email TBC.
