# DESIGN.md · v3 "Systems in motion"

Source of truth for tokens and section specs. Plan: `docs/superpowers/plans/2026-11-28-redesign-v3.md`.
Maturity: L1 (this file + `src/tokens.css`; no component library). All values below live in `src/tokens.css`.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--stage` | `#0B1426` | page background, loader |
| `--surface` | `#12203A` | cards, glass panels, bar field |
| `--line` | `#1E2E4D` (solid) / `--hair` `rgba(238,241,247,.14)` | dividers, outlines |
| `--text` | `#EEF1F7` | body and display text (16.0:1 on stage) |
| `--muted` | `#9DA9C2` | secondary text, labels (7.6:1 on stage) |
| `--mint` | `#3DDC97` | the only saturated colour: primary CTA, status dot, accents (text on mint = `--stage`, 10.4:1) |
| `--paper` | `#F3F1EC` | light section (contact only, Task 3) |
| `--scrim` | `rgba(11,20,38,…)` | navy legibility gradient over films |

Legacy names (`--navy`, `--ink`, `--white`, `--fog`, `--mint-deep`, `--sticky`) are aliased to the dark set so
not-yet-restyled sections (Tasks 2–3) render dark without broken contrast.

**Type:** Inter 500/600, display tracking −2%; JetBrains Mono 500 uppercase for labels (`.label`).
φ scale mobile 12/16/26/42/68, desktop 12/18/29/47/76/123/199 (`--t-label … --t-display`).
**Space:** φ mobile 6/10/16/26/42/68, desktop 7/11/18/29/47/76 (`--s-1 … --s-6`).
**Radius:** buttons 12px, pills 999px. **Elevation:** none; depth comes from film + scrim, not shadows.
**Motion:** `--ease: cubic-bezier(0.16,1,0.3,1)` (`easeOut` in `ui.js`); scroll motion = ScrollTrigger scrub 0.8 on
Lenis; transform + opacity only; text reveals = SplitText words, masked. Reduced motion → static end states.

## Components

| Component | Variants / states | A11y |
|---|---|---|
| `.btn` | `--primary` (mint/stage), `--ghost` (hair outline); hover lift, active scale .98 | ≥44px tall (52) |
| `.label` | mono caps 12px muted; `--mint` | decorative copy only |
| Header | translucent stage glass (blur 14px), name + status, desktop links + CTA | fixed, 60/76px |
| Bar (mobile) | stage glass, surface field, mint send | fixed 76px, 44px targets |
| Film | full-bleed canvas, cover-fit anchored bottom-right, "AI-generated footage" chip | `aria-hidden` |
| Loader | G·K mark stroke-draw, 0–100 counter, curtain | `role=status`, skipped under reduced motion |

## Hard rule: the watermark corner
The Flow watermark sits at the film's bottom-right (desktop: in the bottom-right 6%×8%; mobile 9:16: around 83%×91%).
No element with opacity > 0.1, no scrim, no blur may cover the **watermark zone** (desktop 6%×8%, mobile 24%×14% of the
drawn frame). On mobile the frame is drawn above the pinned bar (`--film-inset-b: var(--bar-h)`), so the bar never hides it.

## Section specs (Task 1)

**0 · Loader.** Fixed stage-colour layer. The G·K mark strokes draw in (1.1s); a mono counter shows real progress:
DOMContentLoaded 20, fonts 20, first 8 hero frames 60 (monotonic, eased). At 100 (or a 6s cap) the curtain lifts
(`yPercent −100`, 0.9s ease) and line 1 of the hero reveals. Target ≤2.5s on fast connections. Reduced motion: static
mark, removed within 300ms.

**1 · Hero.** Section 400svh (300vh of pinned scroll), stage `sticky; top:0; 100svh`, film canvas = viewport.
- Focus pull: a `backdrop-filter: blur(8px)` layer over the film fades 1→0 over the first 30% of the pin
  (opacity only). It is clipped and masked out of the watermark zone, so the corner is sharp from frame 1.
- Scrim: navy gradient; desktop = left column (≤65% width), mobile = top band ending above the watermark zone.
- Copy (one idea per screen, two sizes + label): kicker label; H1 of three lines, one visible at a time, masked word
  reveals scrubbed across the pin — 0–28% "Every business runs on a little chaos." → 33–60% "I build the systems that
  untangle it." → 66–100% "AI agents · automations · websites · apps." + CTA (WhatsApp, Book a call) + status.
- "Scroll" cue at rest, fades on first scroll. Film autoplays to 38.2% after the curtain, then scroll continues it.
- Reduced motion: no pin, last frame, no blur, all three lines and the CTA shown statically.
