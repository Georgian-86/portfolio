# DESIGN.md · "Riso Press" look (branch `claude/look-riso`)

Source of truth for tokens and section specs. Plan: `docs/superpowers/plans/2026-11-28-redesign-v3.md` (section flow
unchanged). This look replaces the v3 dark navy / mint / Inter tokens everywhere (loader, header, hero, sections, menu, bar).
Maturity: L1 (this file + `src/tokens.css`; no component library). All values below live in `src/tokens.css`.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F6F2EA` | main ground (body, loader, hero page, header, menu, bar) |
| `--paper-2` / `--paper-3` | `#EDE5D6` / `#E4DAC7` | second and third sheets: alternate sections, kpis, visitor bubbles |
| `--surface` | `#FFFCF6` | cards (uncoated stock) |
| `--ink` | `#141414` | all text, 1.5–2px rules, primary buttons (17.6:1 on paper) |
| `--muted` | `#4B4740` | secondary text (8.0:1 on paper, 6.2:1 on paper-3, 6.8:1 on yellow) |
| `--pink` | `#FF4FA3` | fluoro ink: shapes, hover plates, highlight bars. **Never text.** |
| `--teal` | `#00A5A0` | riso ink: shapes, status dot, ticks, bars. **Never text.** |
| `--yellow` | `#FFE45C` | butter ink: shapes, sticky notes, chips; text colour only on ink buttons (13.9:1) |
| `--alert` | `#C8102E` | at most one per screen (5.6:1 on surface) |
| `--grain` | inline SVG fractal noise, ~16% | paper grain on paper surfaces (never on a film) |

Legacy names (`--stage`, `--navy`, `--navy-2`, `--mint`, `--mint-deep`, `--fog`, `--white`, `--text`) are aliased onto
the riso set so no dark surface remains; `--mint` now means teal (decorative only) and `--mint-deep` means ink.

**Colour as shapes:** big flat circles/blobs with `mix-blend-mode: multiply`, each with a second plate ring offset
~7px/−5px (misregistration). Overlaps make the overprint colours. Shapes sit in corners and margins; body text
never sits on pink, teal or an overlap. Shapes never touch a film stage.

**Type:** Archivo `wdth 125`, `wght 800`, uppercase, leading 0.92–0.98 for headlines (`--font-display`); Instrument
Sans 400–600 for body (`--font-sans`); Space Mono 400/700 uppercase for labels, chips and buttons (`--font-mono`).
Google Fonts, `display=swap`, system fallbacks. φ scale unchanged: mobile 12/16/26/42/68, desktop
12/18/29/47/76/123/199 (`--t-label … --t-display`); wide headlines use `clamp()` capped at those steps so the longest
word fits its column from 320 to 1920.
**Space:** φ mobile 6/10/16/26/42/68, desktop 7/11/18/29/47/76 (`--s-1 … --s-6`).
**Radius:** 4px (buttons, chips, cards). **Elevation:** none; depth is overprint (offset flat plates), not shadows.
**Motion:** unchanged: `--ease: cubic-bezier(0.16,1,0.3,1)`, ScrollTrigger scrub 0.8 on Lenis, transform + opacity only.

## Components

| Component | Variants / states | A11y |
|---|---|---|
| `.btn` | `--primary` ink fill + yellow Space Mono caps; `--ghost` paper + 2px ink; hover slips a pink/teal plate out of register | ≥44px tall (52) |
| `.label` | Space Mono caps 12px muted/ink | decorative copy only |
| Header | paper 95% + 2px ink rule, Archivo name, mono links | fixed, 60/76px |
| Bar (mobile) | paper + grain, 2px ink rule, ink-bordered field, ink send with yellow icon | fixed 76px, 44px targets |
| Film | full-bleed canvas, unfiltered, cover-fit anchored bottom-right; "AI-generated footage" chip ink/paper | `aria-hidden` |
| Hero page | `.hero__scrim` is now a solid paper panel (left column ≤55% desktop; band above the watermark zone on mobile) holding three `.riso-blob` shapes | no gradient over the film |
| Loader | paper + grain; G·K mark printed as pink + teal plates (multiply) that slide into register; Space Mono counter | `role=status`, static under reduced motion |

## Hard rule: the watermark corner
The Flow watermark sits at the film's bottom-right (desktop: in the bottom-right 6%×8%; mobile 9:16: around 83%×91%).
No element with opacity > 0.1, no scrim, no blur may cover the **watermark zone** (desktop 6%×8%, mobile 24%×14% of the
drawn frame). On mobile the frame is drawn above the pinned bar (`--film-inset-b: var(--bar-h)`), so the bar never hides it.

## Section specs (Task 1)

**0 · Loader.** Fixed paper layer. The G·K mark strokes draw in (1.1s) on two ink plates that slide into register; a mono counter shows real progress:
DOMContentLoaded 20, fonts 20, first 8 hero frames 60 (monotonic, eased). At 100 (or a 6s cap) the curtain lifts
(`yPercent −100`, 0.9s ease) and line 1 of the hero reveals. Target ≤2.5s on fast connections. Reduced motion: static
mark, removed within 300ms.

**1 · Hero.** Section 400svh (300vh of pinned scroll), stage `sticky; top:0; 100svh`, film canvas = viewport.
- Focus pull: a `backdrop-filter: blur(8px)` layer over the film fades 1→0 over the first 30% of the pin
  (opacity only). It is clipped and masked out of the watermark zone, so the corner is sharp from frame 1.
- Paper page (was the scrim): solid paper + grain with overprint shapes; desktop = left column (≤55% width, 2px ink
  edge), mobile = band from just above the copy to above the watermark zone. The film is never filtered.
- Copy (one idea per screen, two sizes + label): kicker label; H1 of three lines, one visible at a time, masked word
  reveals scrubbed across the pin — 0–28% "Every business runs on a little chaos." → 33–60% "I build the systems that
  untangle it." → 66–100% "AI agents · automations · websites · apps." + CTA (WhatsApp, Book a call) + status.
- "Scroll" cue at rest, fades on first scroll. Film autoplays to 38.2% after the curtain, then scroll continues it.
- Reduced motion: no pin, last frame, no blur, all three lines and the CTA shown statically.
