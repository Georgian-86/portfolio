# Design — Three portfolio concepts in Figma

**Date:** 24 Nov 2026 · **Status:** reviewed, awaiting Golu's approval · **Owner:** Golu Kumar (freelancer)

## 1. Intent — the why
Golu is a freelancer selling AI agents, WhatsApp agents, automations, websites, Shopify, WordPress, app development (web/iOS/Android), DevOps and SEO. The portfolio has to **win freelance clients**, mainly **small business owners who want more leads and less manual work** (any industry). Visitors often arrive from a link (LinkedIn, Upwork, referral) and decide in seconds.

After visiting, people should describe him as **reliable, modern, results-driven**, and feel **trust** and **responsiveness**.

Before any code, **three entirely different concepts are designed in full in Figma**. Golu picks one (or a hybrid) after comparing them on desktop and on his phone.

## 2. Goals
- Three complete Figma concepts. Every section is designed at **mobile 390×844** and **desktop 1440×900**, with scroll keyframes for every animated scene.
- Each concept has its **own palette, type pairing, logo direction and scroll story**, and must not feel like a variant of another.
- **Mobile is as immersive as desktop:** same story beats, same signature moment, re-framed rather than shrunk.
- A **personal brand** for Golu: wordmark plus GK monogram, one direction per concept.
- **Real work shown early** (within the first two scroll screens after the hero).

## 3. Non-goals (this phase)
- No code, no production site, no AI video generation yet. Video and image areas are **labelled placeholders** that reference the prompt to be used later.
- No tablet (834) or wide (1920) frames for all three; only the chosen concept gets those later.
- No final copywriting polish. Copy is solid draft copy.

## 4. Anti-goals (failure even if "done")
- Any concept that reads as a template, or that relies on spinning 3D, neon gradients or effects with no meaning (both earlier versions were rejected for this).
- A mobile frame that is a squeezed desktop: horizontal scrolling, hover-only content, text under 16 px, or tap targets under 44 px.
- Invented metrics or overstated credits (founding-team work presented as "my startup", fake client numbers).
- Proof hidden behind long intros.

## 5. Constraints
- **Type:** golden-ratio scale, `base × φⁿ`.
  - Mobile base 16: 16 / 26 / 42 / 68 / 110.
  - Desktop base 18: 18 / 29 / 47 / 76 / 123 / 199.
  - Labels are clamped to 12 px minimum.
  - On mobile the display steps drop one notch.
- **Spacing:** φ steps. Mobile 6 · 10 · 16 · 26 · 42 · 68; desktop 7 · 11 · 18 · 29 · 47 · 76.
- **Grids:** mobile 4 columns / 16 margin; desktop 12 columns / 80 margin; plus a 38.2/61.8 golden split guide.
- **Scroll keyframes:** at 0%, 38.2%, 61.8% and 100% progress for every pinned scene.
- **Contrast:** WCAG AA for all text. The pairings below are verified.
- **Mobile rules:**
  - Vertical scroll only.
  - Pinned scenes assume `100svh`.
  - Primary CTA in the bottom 38.2% (thumb zone).
  - Cinematic areas are framed separately for 9:16, with the subject inside a centre 1:1 safe zone.
- **Brand:** first person, Golu's real name, a placeholder for a real photo (no AI portrait).
- **Fonts:** all free.
  - Fontshare: Clash Display, General Sans, Satoshi.
  - Google Fonts: Geist, Geist Mono, JetBrains Mono.
  - If a font isn't available in Figma, substitute the closest Google font and note it on the cover page.
- **Figma:** account on "Golu Kumar's team" (team::1309461206659100916), full seat. Files are created through the Figma connector.

## 6. Content (shared by all three concepts)
**Work, in this order:**
1. **StepQ**, client project. A walking-rewards app for India with a mascot, Piko. Golu built the **website plus the Android and iOS apps**. Credit: *"Client project · Website + iOS + Android"*. Room for a client quote (placeholder).
2. **TeachGenie.ai**: an AI teaching assistant that makes lesson plans, slides, quizzes and diagrams in 1–2 minutes. Credit: *"Founding team · [role TBC]"*.
3. **Brivia Club**: a networking platform, "Swipe. Match. Build." Credit: *"Founding team · [role TBC]"*.
4. **Automations:** 2–3 "before → after" cards with placeholder content, marked TBC.

**Live demos (proof for small-business services):** "Message my WhatsApp agent" and "Watch an automation run", designed as UI only.

**Services, grouped by outcome:**
- **More leads:** Websites, Shopify, WordPress, SEO & AI search, WhatsApp agents.
- **Less manual work:** AI agents, Automations, App development, DevOps.

**CTA:** primary "Message me on WhatsApp" with a status line ("● Online · usually replies within [X]"; X is TBC and must be a promise he can keep). Secondary "Book a call".

**Tagline:** "Independent studio for AI, automation & product."

## 7. Approaches considered (for how far to take them)
| Approach | Trade-off | Decision |
|---|---|---|
| All three in full, every section at mobile and desktop | Fairest comparison; most work goes on concepts that will be discarded | **Chosen by Golu** |
| Key moment only (hero + signature moment) | Fast, but judging from fragments | Rejected |
| Key moments for all three, then the winner in full | Efficient (Claude's pick) | Rejected by Golu in favour of seeing everything |

## 8. The three concepts (decided)

### A — "24 Hours": *Your business, awake at 2 AM*
- **Story:** scroll moves a clock from 02:07 to 12:00, and the background goes from night to day.
- **Palette:** Midnight `#0B1020` · Dusk Indigo `#1E2A5A` · Dawn Coral `#FF7A59` (on Midnight 7.4; Midnight text on a Coral button 7.4) · Porcelain `#F6F3EC` (Midnight on it 17.1) · Slate `#5A6278` (on Porcelain 5.5) · **Ember `#B23A1E`** (the accent and link colour on daylight sections, on Porcelain 5.4; white on an Ember button 6.0).
- **CTA colour:** night sections use a Coral button with Midnight text; daylight sections use an Ember button with white text.
- **Type:** Clash Display / Geist / Geist Mono (clock).
- **Logo:** GK monogram in a thin clock ring with one coral tick at 12.
- **Sections:**
  1. Hero 02:07 (night window film placeholder, headline "Your business, awake at 2 AM.", WhatsApp CTA).
  1b. **Proof strip** (right after the hero): three compact work cards (StepQ · TeachGenie · Brivia) with their credits, each linking down to the full appointment.
  2. 02:08 WhatsApp agent replies: **this is the live WhatsApp demo**.
  3. 04:30 order → invoice → CRM: **this is the "watch an automation run" demo**.
  4. 06:00 deploy green.
  5. 07:45 sunrise SEO.
  6. 09:00 "Good morning. While you slept…" (numbers labelled *illustrative*).
  7. 10:00 work as the day's appointments (StepQ, TeachGenie, Brivia, automations).
  8. 11:00 services by outcome.
  9. About Golu (photo).
  10. 12:00 CTA "Give your business a night shift."
- **Signature moment:** night turns to day under the thumb.

### B — "The Untangling": *From chaos to clockwork*
- **Story:** a messy desk seen from above (sticky notes, missed calls, unread WhatsApps, a tangled spreadsheet); each scroll beat snaps one mess into a clean system, ending on a calm desk.
- **Palette:**
  - Chaos side: Paper `#F3F1EC` · Sticky Yellow `#F7D154` (Ink on it 12.5) · Alert Red `#C9343A` (on Paper 4.6).
  - Order side: Clarity Navy `#0F1E3D` · System Mint `#3DDC97` (on Navy 9.3) · Fog `#9DA9C2` (on Navy 7.0).
  - Text: Ink `#121417`.
  - **Mint Deep `#0E7A52`**: the accent and link colour on the Paper side (4.7; white on a Mint Deep button 5.4).
  - **CTA colour:** on Paper, a Clarity Navy button with Paper text (14.6); on Navy, a Mint button with Navy text (9.3).
- **Type:** General Sans / JetBrains Mono.
- **Logo:** one tangled line resolving into a clean, straight GK.
- **Sections:**
  1. Hero desk of chaos, headline "Less chaos. More clients."
  1b. **Proof strip**: the same three compact work cards, styled as tidy index cards pinned at the edge of the desk.
  2. Missed calls → WhatsApp agent: **this is the live WhatsApp demo**.
  3. Sticky notes → automated pipeline: **this is the "watch an automation run" demo**.
  4. Spreadsheet → live dashboard.
  5. "We need a website" scribble → StepQ case study unfolding.
  6. TeachGenie + Brivia as "systems I helped build from day one".
  7. Services by outcome.
  8. About Golu.
  9. Clean desk CTA "Hand me your mess."
- **Mobile:** one piece of mess at a time, so the screen never looks cluttered.
- **Signature moment:** the chaos-to-order snap.

### C — "The Conversation": *Talk to the work*
- **Story:** the site is a chat. "Hi, I'm Golu. What are you building?" with chips (Online store · AI agent · Automation · App · Website); the chosen chip reorders the work.
- **Palette:** Paper `#FAF9F6` · Ink `#111111` (17.9) · Signal Blue `#3D5AFE` (on Paper 4.9; white on it 5.1) · Lilac `#E8E4FF` (Ink on it 15.3) · Volt `#D7F25C` (Ink on it 15.1) · Stone `#6B6B66` (5.1).
- **Type:** Satoshi / Geist Mono.
- **Logo:** lowercase wordmark "golu kumar"; GK monogram in a speech bubble whose tail is a cursor.
- **Sections:**
  1. Hero chat with chips.
  2. Sent-chip moment.
  3. Work as attachment cards plus one expanded case study (StepQ).
  4. Services as voice notes.
  5. Client words as messages.
  6. Live agent "Ask me anything" (sticky input on mobile).
  7. About Golu.
  8. "Continue on WhatsApp →".
- **Desktop:** a centred 640 px chat column with large typographic margins and floating 3D "attachment" tiles (placeholders).
- **Signature moment:** the page rearranges itself around the visitor's answer. Show the default order plus one reordered example (e.g. "App" chosen → StepQ first).

## 9. Figma deliverables
- **File 0 — "Portfolio 2026 · 00 Foundations":**
  - Variables:
    - Type: modes Mobile / Desktop.
    - Space: modes Mobile / Desktop.
    - Color: modes A / B / C.
  - Text styles bound to the variables, grids, and the three logo directions (wordmark plus monogram; light and dark; tested at 32 px and in a circle avatar).
  - A cover page comparing the three palettes with their contrast ratios.
- **Files A, B, C**, each with these pages:
  1. *Cover*: concept summary, palette, type, logo.
  2. *Mobile 390*: every section as its own 390×844 frame, in story order (longer frames allowed where a section scrolls).
  3. *Desktop 1440*: every section as its own 1440×900 frame, in the same order.
  4. *Scroll keyframes*: each animated scene at 0 / 38.2 / 61.8 / 100%, mobile and desktop side by side, with notes on easing and duration (φ durations 382 / 618 / 1000 / 1618 ms, ease `cubic-bezier(0.16,1,0.3,1)`).
  5. *Prototype*: a mobile flow linking the frames with Smart Animate, so Golu can mirror it on his phone.
- Media placeholders are filled rectangles labelled with the asset name and ratio (e.g. "HERO-NIGHT · 9:16 · prompt A-1").

## 9b. Decisions made after the builder review (Claude's calls; check while reading)
1. **Work shown early:** A and B get a **proof strip** directly after the hero, so real work is visible within the second screen, as the goal requires. The full stories stay where the narrative places them.
2. **Accessible accents on light backgrounds:** added **Ember `#B23A1E`** to A and **Mint Deep `#0E7A52`** to B (verified above). Coral and Mint on light backgrounds fail AA, so they are used only on dark backgrounds.
3. **Live demos:**
   - In A and B, the WhatsApp beat and the automation beat *are* the demos. In C they sit in the "Live agent" section.
   - "UI only" means a short designed sequence: visitor message → typing indicator → agent reply → booking confirmation. It has keyframes on the Scroll keyframes page and is linked in the mobile prototype. No real backend yet.
4. **Mobile CTA:**
   - In A and B, a **floating WhatsApp pill** (bottom-right, 52 px high, with the online dot) appears after the hero and hides over the final CTA section. It's a small pill rather than a full-width bar, so it never covers content.
   - In C, the **sticky message input** is the CTA: sending a message opens WhatsApp with that text, so the pill is not used.
   - Desktop: the WhatsApp button stays in the nav.

## 10. Left to the builder
- Exact layouts within the rules above, icon choices, and draft micro-copy.
- Whether to build the frames with Figma auto layout or absolute positioning (auto layout preferred).
- Placeholder imagery style.

## 11. Open items (do not block design; marked TBC in the files)
- Golu's role on TeachGenie and Brivia.
- StepQ client quote.
- Real reply-time promise.
- Real automation examples.
- Photo of Golu.
