# Portfolio Design Guide — from zero to three Figma concepts

Design first in Figma, no code until a concept is chosen. This guide covers **what to install, where to run each step, the exact prompts, three different concepts with brand colours, and the rules that make mobile feel as immersive as desktop.**

```
STAGE 1 Setup ─▶ STAGE 2 Brainstorm ─▶ STAGE 3 Foundations ─▶ STAGE 4 Three concepts ─▶ STAGE 5 Scroll prototypes ─▶ STAGE 6 Review & pick
 (15 min)        (Superpowers)          (Figma tokens)          (Figma, mobile+desktop)   (Figma motion / Make)        (critique + phone test)
```

---

## STAGE 1 — Setup: what to install and where

### 1.1 Already connected (verified 24 Nov 2026)
| Tool | Status | Used for |
|---|---|---|
| **Figma connector** | ✅ signed in with a full seat on your team plan | Claude creates and edits your Figma files directly |
| **Figma skills** (`figma:*`) | ✅ available | `figma-generate-library`, `figma-generate-design`, `figma-use`, `figma-use-motion`, `figma-implement-motion`, `figma-3d-transforms`, `figma-shaders` |
| **Design skills** | ✅ available | `design:design-critique`, `design:accessibility-review`, `design:ux-copy`, `design:design-system` |
| **Higgsfield** | ✅ connected | Hero images and video for each concept |
| **Canva / ElevenLabs** | ✅ connected | Brand kit and sound (later) |

### 1.2 Install now
| What | Where | Why |
|---|---|---|
| **Superpowers** plugin (by obra) | Card shown in chat, or claude.ai → Settings → Plugins → search "Superpowers" | Its **brainstorming** skill runs the structured ideation in Stage 2 |
| **design-superpowers** plugin (optional) | Same place | `creative` (art direction) and `design-review` give a second opinion on concepts |
| **Figma desktop app** | figma.com/downloads | Needed to use local fonts and smoother prototyping |
| **Figma mobile app** (iOS/Android) | App Store / Play Store | **Mirror** each design on your real phone. This is the mobile-parity test |
| **Fonts** | Fontshare: *Clash Display, General Sans, Satoshi*. Google Fonts: *Instrument Serif, Geist, Geist Mono, JetBrains Mono* | Install locally, then restart Figma desktop |

> After installing a plugin, start a **new Claude session** so its skills load. Then type `/` to confirm `brainstorming` is listed.

### 1.3 Where each thing runs
| Step | Run it in |
|---|---|
| Brainstorm, Figma generation, critique | **Claude Code** (this app or desktop/web) or **claude.ai** chat. Both have the Figma connector |
| Hand-tweaking layouts, prototyping | **Figma desktop** |
| Live scroll prototype you can open on a phone | **Figma Make** (figma.com → New → Make) |
| Hero images and video | **Higgsfield** via Claude (connector) or higgsfield.ai |
| First-to-last-frame video | **Google Flow** (labs.google/flow), by hand |

---

## STAGE 2 — Brainstorm with Superpowers

### 2.1 Kickoff prompt (paste into a new Claude session after installing Superpowers)
```
Use the superpowers brainstorming skill.

Context: I'm a freelancer selling AI agents, WhatsApp agents, automations, websites,
Shopify, WordPress, app development, DevOps and SEO. I need a portfolio that builds
TRUST with small-business owners and feels CLASS-APART and immersive, equally on mobile
and desktop. Text sizes follow a golden-ratio scale (base × 1.618ⁿ). Scroll animation
is the main storytelling device; hero visuals will be AI-generated video (Higgsfield /
Google Flow) scrubbed by scroll.

Already rejected: rotating 3D glass blob (generic), CSS-drawn book (flat).

Seed concepts are in docs/DESIGN_GUIDE.md §2.2 (24 Hours, Powers of Ten, The
Conversation). Challenge them, generate alternatives, then converge on exactly 3
concepts that are entirely different from each other. Ask me one question at a time.
For each final concept give: one-line idea, why it builds trust, scroll storyboard
(mobile AND desktop), signature moment, palette, type, assets needed.
```

### 2.2 Seed brainstorm (first pass, done here)
**Ten ideas generated:**
1. **24 Hours**: one business day told on scroll; you sleep while your systems work
2. **Powers of Ten**: one continuous zoom from Earth to a single chat message
3. **The Conversation**: the whole site is a chat with your AI agent
4. The Book, photoreal: the earlier idea, now as rendered film
5. Mission Control: a calm control room where your agents work
6. Blueprint to Building: wireframe lines draw into a photoreal storefront
7. The Workshop: a craftsman's bench with one object per service
8. Museum Rooms: one exhibition room per case study
9. The Elevator: each floor is a service
10. Signal: a sound or waveform visual language

**Scored (1–5) on what you asked for:**
| Idea | Immersive | Builds trust | Same on mobile | Different from others | Effort (5 = easy) | Total |
|---|---|---|---|---|---|---|
| **24 Hours** | 5 | 5 | 5 | 5 | 3 | **23** |
| **Powers of Ten** | 5 | 4 | 5 | 5 | 2 | **21** |
| **The Conversation** | 4 | 5 | 5 | 5 | 4 | **23** |
| Book (photoreal) | 4 | 4 | 3 | 3 | 3 | 17 |
| Mission Control | 4 | 4 | 3 | 3 | 3 | 17 |

The top three each use a different kind of immersion: **time** (cinematic), **space** (zoom) and **dialogue** (interactive). They can't be confused with one another.

---

## STAGE 3 — Mobile parity rules (non-negotiable)

These rules make mobile *as immersive* as desktop, not a shrunk copy.

1. **Design mobile first.** Every frame is drawn at **390 × 844** first, then **834** (tablet), **1440** (desktop) and **1920** (wide). Check the minimum, **360 × 740**, before approving anything.
2. **Every cinematic asset has two renders: 16:9 and 9:16.** Never crop a landscape film for phones. Generate a portrait version with its own framing (prompts below always come in pairs).
3. **Keep the subject in a centre safe zone** (the middle 1:1 square) so it never gets cut at any ratio.
4. **One scroll axis.** No horizontal scrolling or sideways-pinned carousels on mobile. Vertical scroll drives everything.
5. **No hover-only content.** Anything revealed on hover on desktop is revealed by scroll position or tap on mobile.
6. **Real viewport units.** Pinned scenes use `100svh` (not `100vh`), so the mobile browser bar never jumps the layout. Leave room for the safe area at the bottom (home indicator).
7. **Touch targets of at least 44 × 44 px**, and the thumb zone (bottom 38.2% of the screen) holds the primary CTA on mobile.
8. **The type scale steps down one φ notch on mobile**, but the ratio stays golden. Body text is never under 16 px.
9. **Same story, same beats.** Mobile gets every scroll moment desktop gets: same order and same signature moment. Only the framing changes.
10. **Performance is part of immersion.** Mobile frame sequences use 1080 px wide WebP, about 120 frames, preloaded progressively.

### 3.1 Golden-ratio tokens (Figma variables with two modes)
| Token | Mobile (base 16) | Desktop (base 18) | Use |
|---|---|---|---|
| `type/xs` = base ÷ φ | 10 → set 12 min* | 11 → 12 min* | Labels only |
| `type/body` = base | 16 | 18 | Body |
| `type/lead` = base × φ | 26 | 29 | Lead / H4 |
| `type/h3` = base × φ² | 42 | 47 | H3 |
| `type/h2` = base × φ³ | 68 | 76 | H2 |
| `type/h1` = base × φ⁴ | 68 (one step down) | 123 | Hero |
| `type/display` = base × φ⁵ | 110 | 199 | Display words |
| `space/1…6` | 6 · 10 · 16 · 26 · 42 · 68 | 7 · 11 · 18 · 29 · 47 · 76 | All spacing |

*Labels are clamped to 12 px minimum for legibility. That is the only exception to the ratio.

**Grids:** mobile 4 columns / 16 margin; tablet 8 / 32; desktop 12 / 80. Add a **golden split guide** (38.2% | 61.8%) to every frame.

**Scroll keyframes:** storyboard each pinned scene at **0%, 38.2%, 61.8% and 100%** scroll progress (golden progress points), on both mobile and desktop.

---

## STAGE 4 — The three concepts

### CONCEPT A — "24 HOURS": *A business that never sleeps*
**Idea:** the scroll is a clock. The site starts at **2:07 AM** in darkness and ends at **noon** in daylight. Each hour is one of your services quietly working while the owner sleeps. The page background shifts from night to day as you scroll, a metaphor for moving from uncertainty to clarity.

**Why it builds trust:** it shows outcomes in a story every business owner recognises (lost night-time leads, morning admin), so the proof is concrete rather than abstract.

**Palette — "Night to Noon"**
| Role | Hex | Contrast |
|---|---|---|
| Midnight (night bg) | `#0B1020` | — |
| Dusk Indigo (transition) | `#1E2A5A` | Porcelain on it 12.4 ✅ |
| Dawn Coral (accent) | `#FF7A59` | on Midnight 7.4 ✅ |
| Porcelain (day bg) | `#F6F3EC` | Midnight on it 17.1 ✅ |
| Slate (muted text, day) | `#5A6278` | on Porcelain 5.5 ✅ |
| Coral Deep (accent on day) | `#C4472B` | 4.4: large text and icons only |

**Type:** *Instrument Serif* (display, cinematic italic) + *Geist* (text) + *Geist Mono* (clock and labels).

**Scroll storyboard**
| # | Time | Desktop (1440) | Mobile (390) | Motion |
|---|---|---|---|---|
| 0 | **02:07** | Full-bleed film: a dark apartment window, a phone lights up on the nightstand. Huge mono clock on the left; headline *"Your business, awake at 2 AM."* | Same film in 9:16; clock as a slim top bar; headline in the thumb zone | Clock digits roll with scroll; film scrubs |
| 1 | **02:08** WhatsApp agent | Chat appears on the phone screen in the film; the message bubbles are real HTML on the right | Bubbles overlay the phone in the centre of the film | Messages type in with scroll |
| 2 | **04:30** Automations | Order → invoice → CRM drawn as a glowing line across the night city | Same line, drawn vertically down the screen | SVG path draws on scroll |
| 3 | **06:00** DevOps | Status board: tests ✓, deploy ✓, uptime 100% | Stacked status cards | Ticks land one by one |
| 4 | **07:45** SEO | Sunrise; a ranking line climbs with the sun | Same, vertical | Background shifts to dawn coral |
| 5 | **09:00** AI Agents | "Good morning. While you slept…" summary card; the page is now daylight | Full-width card | Numbers count up (shown as *illustrative* until real) |
| 6 | **10:00–11:00** Work | Case studies as "appointments" on a day planner | Vertical agenda list; tap opens the case study | Cards slide in on scroll |
| 7 | **12:00** CTA | *"Give your business a night shift."* + WhatsApp and Book buttons | CTA in the thumb zone | Clock hits 12:00; the light peaks |

**Signature moment:** the whole page goes from night to day under your thumb.

**Hero asset prompts (Higgsfield Seedance 2.5 / Kling 4.0, or Flow)**
- **16:9:** *"Locked-off cinematic shot of a modern apartment bedroom window at night overlooking a quiet city, a smartphone on a wooden nightstand lights up softly with a notification, then the sky outside slowly transitions from deep navy night to warm coral dawn to soft daylight, curtains move gently, no people visible, photoreal, 35mm, gentle film grain, 8 seconds, continuous, no cuts."*
- **9:16:** *"Vertical framing, same scene: smartphone on the nightstand in the lower third, window and sky filling the upper two-thirds, sky transitions from deep navy night to coral dawn to daylight, locked camera, photoreal, 8 seconds, no cuts."*

---

### CONCEPT B — "POWERS OF TEN": *Every scale of your business*
**Idea:** one continuous zoom, from **Earth at night → your city → a street → a shopfront → a phone in a customer's hand → a chat message → the code underneath**. Each zoom level is a layer of what you build. A precise readout ("10⁴ m") is the scroll indicator.

**Why it builds trust:** it shows you understand the business at every level, from market reach down to the last line of code. It reads as rigorous and in control.

**Palette — "Deep Instrument"**
| Role | Hex | Contrast |
|---|---|---|
| Abyss (bg) | `#06181A` | — |
| Porcelain (text) | `#EEF2EF` | 16.1 ✅ |
| Verdigris (primary accent, trust) | `#35C2AE` | 8.2 ✅ |
| Signal Amber (data highlights) | `#F2B33D` | 9.8 ✅ |
| Sea Glass (muted) | `#8FA7A3` | 7.1 ✅ |
| Deep Verdigris (accent on light) | `#0F7466` | on Porcelain 5.0 ✅ |

**Type:** *General Sans* (display and text) + *JetBrains Mono* (scale readouts, coordinates).

**Scroll storyboard**
| # | Scale | Layer | Desktop | Mobile | Motion |
|---|---|---|---|---|---|
| 0 | 10⁷ m | Hero | Earth at night, city lights; headline *"From market to machine."* | Same, centred, which suits portrait naturally | Zoom film scrubs; readout counts down |
| 1 | 10⁴ m | **Reach**: SEO & AI search | City grid with glowing "search demand" points | Same | Points ping in with scroll |
| 2 | 10² m | **Storefront**: Websites, Shopify, WordPress | Street → shopfront becomes a live website mockup | Mockup fills the screen | Shopfront glass dissolves into the UI |
| 3 | 10⁰ m | **Conversation**: WhatsApp and AI agents | Phone in a hand, real HTML chat on the screen | Phone fills the screen | Messages type in |
| 4 | 10⁻² m | **Engine**: Automations, DevOps, Apps | Into the circuit: flows, pipelines, deploy lines | Same, vertical flow | Paths draw |
| 5 | Zoom out | **Work** | Case studies as circular "lenses"; scrolling into one opens it | Lenses stacked vertically; tap to dive in | Lens scales up to fullscreen |
| 6 | 10⁷ m | CTA | Back to Earth: *"Let's scale yours."* | Same | Reverse zoom |

**Signature moment:** a single unbroken zoom that feels like a nature documentary, and it works identically in portrait because it's centred.

**Asset prompts (chain the clips: each clip's LAST frame = the next clip's FIRST frame; Flow Frame-to-Video is ideal)**
- **Clip 1 (16:9 and 9:16):** *"Continuous straight-down zoom from orbit toward a city at night, Earth's curvature and glowing city lights, smooth acceleration, centred composition, photoreal, no text, 6 seconds."*
- **Clip 2:** *"Continuous zoom down into a single lit street in that city at dusk, ending on the glowing front window of a small modern shop, centred, photoreal, 6 seconds."*
- **Clip 3:** *"Continuous push through the shop window toward a customer's hand holding a smartphone, the screen glowing, ending with the phone screen filling the frame, shallow depth of field, 6 seconds."*
- **Clip 4:** *"Macro zoom into a smartphone screen until the pixels become a glowing circuit landscape of teal light paths, abstract, 6 seconds."*
- Make every clip in **both 16:9 and 9:16**, with the subject in the centre 1:1 safe zone.

---

### CONCEPT C — "THE CONVERSATION": *Talk to the work*
**Idea:** the site *is* a conversation. It opens with huge kinetic type, *"Hi. What are you building?"*, and quick-reply chips (*An online store · An AI agent · Automations · An app · A website*). **Your choice reorders the page** to lead with the most relevant work. Projects arrive as rich "attachments" that expand into full-screen case studies. Later, a **real AI agent** answers questions live, so the portfolio becomes the proof of the service.

**Why it builds trust:** it's personal (it answers *their* need first), transparent (a real conversation), and it demonstrates the product.

**Palette — "Paper & Signal"**
| Role | Hex | Contrast |
|---|---|---|
| Paper (bg) | `#FAF9F6` | — |
| Ink (text) | `#111111` | 17.9 ✅ |
| Signal Blue (primary, trust) | `#3D5AFE` | on Paper 4.9 ✅; white on it 5.1 ✅ |
| Lilac Mist (their bubbles) | `#E8E4FF` | Ink on it 15.3 ✅ |
| Volt (highlights and chips) | `#D7F25C` | Ink on it 15.1 ✅ |
| Stone (muted) | `#6B6B66` | 5.1 ✅ |

**Type:** *Satoshi* (display and text) + *Geist Mono* (timestamps, labels).

**Scroll storyboard**
| # | Section | Desktop | Mobile | Motion |
|---|---|---|---|---|
| 0 | Hero | Display-size *"Hi. What are you building?"* (φ⁵), chips below; 3D-rendered "attachments" float in the side gutters | Type fills the screen, chips in the thumb zone | Letters type on; chips spring in |
| 1 | Your answer | Chosen chip flies into a sent bubble; reply streams in | Same, native chat feel | Shared-element transition |
| 2 | Work as attachments | Rich cards (video previews) in a centred chat column, wide margins with big typographic quotes | Cards full-width | Cards rise in on scroll; tap expands to fullscreen |
| 3 | Services as voice notes | Each service is a "voice note" with a waveform; play for a 10 s explainer (ElevenLabs) | Same | Waveform animates with scroll |
| 4 | Proof | Client messages and testimonials as screenshots of real replies | Same | Stack and fan out |
| 5 | Live agent | *"Ask me anything about working together"*: real input box | Sticky input at the bottom, like WhatsApp | Typing indicator |
| 6 | CTA | *"Continue on WhatsApp →"* hands off the same conversation | Same | Bubble slides into the WhatsApp icon |

**Signature moment:** the page **rearranges itself around the visitor's first answer**. It's the most personal and the most mobile-native of the three.

**Asset prompts (Higgsfield Soul Cinema stills + short loops)**
- **Floating attachments (1:1):** *"A glossy 3D app-icon-style tile made of frosted glass, containing a tiny photoreal miniature of an online store, soft studio light, paper-white background, subtle shadow, product photography, no text."* (one per project type)
- **Card preview loop (4:5, 5 s):** *"Slow camera push on a laptop showing [your project screenshot], paper-white studio, soft daylight, minimal, photoreal."*

---

## STAGE 5 — Build the concepts in Figma

### 5.1 File structure (one foundation file + three concept files)
```
📁 Portfolio 2026
 ├─ 00 Foundations        → variables (type φ scale with Mobile/Desktop modes, spacing, colours per concept), grids, text styles
 ├─ A — 24 Hours          → pages: Moodboard · Mobile 390 · Tablet 834 · Desktop 1440 · Scroll Keyframes · Prototype
 ├─ B — Powers of Ten     → same pages
 └─ C — The Conversation  → same pages
```

### 5.2 Prompts to run in Claude (Figma connector). Run them in order.
**P1 — Foundations**
```
Use the figma-generate-library skill. Create a new Figma file "Portfolio 2026 — 00 Foundations"
in my team "Golu Kumar's team". Read docs/DESIGN_GUIDE.md §3.1 and §4.
Create variable collections:
 - Type: modes Mobile (base 16) and Desktop (base 18), steps xs/body/lead/h3/h2/h1/display by φ
 - Space: 6 steps by φ, same two modes
 - Color: modes A-24Hours, B-PowersOfTen, C-Conversation with the exact hexes from §4
Create text styles bound to the variables, layout grids (4/8/12 columns + 38.2/61.8 golden guide),
and a cover page showing the three palettes with their contrast ratios.
```

**P2 — One concept at a time** (repeat for A, B, C)
```
Use the figma-generate-design skill. Create the file "Portfolio 2026 — A — 24 Hours".
Use the variables and styles from the Foundations file. Follow the Concept A storyboard in
docs/DESIGN_GUIDE.md §4 exactly.
1. Design MOBILE 390×844 first: one frame per storyboard row, using the 9:16 hero framing.
2. Then Tablet 834 and Desktop 1440 versions of every frame.
3. Respect the mobile-parity rules in §3 (thumb-zone CTA, no hover-only content, 44px targets).
4. Use placeholder rectangles labelled with the asset prompt name where video/images go.
5. On the "Scroll Keyframes" page, draw each pinned scene at 0%, 38.2%, 61.8% and 100% scroll,
   for mobile and desktop side by side.
```

**P3 — Motion**
```
Use the figma-use-motion skill on the "A — 24 Hours" file. Add keyframe animations for:
the clock digits rolling, the night→day background colour shift, and chat bubbles typing in.
Ease cubic-bezier(0.16,1,0.3,1). Durations on the φ scale: 382ms, 618ms, 1000ms, 1618ms.
```

**P4 — Critique**
```
Use design:design-critique and design:accessibility-review on all three concept files.
Score each on: immersion, trust, mobile parity, visual hierarchy, golden-ratio compliance.
List the top 5 fixes per concept.
```

### 5.3 Figma Make: live scroll prototypes you can open on a phone
Figma → **New → Make**, then paste one prompt per concept:

**A — 24 Hours**
```
Build a single-page vertical scroll prototype. Mobile-first (390px) and responsive to 1440px.
A large monospace clock pinned at the top counts from 02:07 to 12:00 as the user scrolls.
The page background interpolates #0B1020 → #1E2A5A → #FF7A59 → #F6F3EC with scroll progress.
Seven full-height sections (02:07, 02:08, 04:30, 06:00, 07:45, 09:00, 12:00), each with a
headline in Instrument Serif, body in Geist, and a placeholder video box (9:16 on mobile,
16:9 on desktop). Chat bubbles type in on scroll in section 02:08. Use 100svh, no horizontal
scroll, CTA buttons fixed in the bottom third on mobile. Type sizes 16/26/42/68/110px.
```

**B — Powers of Ten**
```
Build a single-page scroll prototype, mobile-first (390px) to 1440px. A centred placeholder
"zoom" image scales from 1 to 8 while scrolling through each of 6 sections, then the next
section's image starts at scale 1 (continuous zoom illusion). A monospace readout in the corner
shows 10⁷ m → 10⁻² m. Colours #06181A background, #EEF2EF text, #35C2AE accent, #F2B33D data.
Fonts General Sans + JetBrains Mono. Case studies as circular lens cards that expand to
fullscreen on tap. 100svh, vertical scroll only.
```

**C — The Conversation**
```
Build a mobile-first chat-style portfolio prototype (390px to 1440px, centred 640px column on
desktop). Hero: huge "Hi. What are you building?" with 5 quick-reply chips. Tapping a chip
sends it as a bubble, then reorders the project cards below so matching ones come first.
Project cards look like rich chat attachments and expand to a fullscreen case study. A sticky
message input at the bottom. Colours #FAF9F6, #111111, #3D5AFE, #E8E4FF, #D7F25C.
Fonts Satoshi + Geist Mono. Type sizes 16/26/42/68/110px.
```
Open each Make link on your phone and on desktop. **If anything feels weaker on mobile, fix the design, not the code.**

### 5.4 Test on your phone (every concept)
1. Install the **Figma mobile app**, then open the file and choose **Mirror**. The selected frame shows live on the phone.
2. Check: thumb reach for the CTA, readability at arm's length, whether the hero subject is centred, whether anything needs hover.
3. Test the smallest size (360) and a landscape phone.

---

## STAGE 6 — Choose
Score the three concepts together after the critique (P4) and the phone test:

| | A — 24 Hours | B — Powers of Ten | C — Conversation |
|---|---|---|---|
| Immersion (desktop) | | | |
| Immersion (mobile) | | | |
| Trust | | | |
| Memorable after 1 day | | | |
| Production effort | Medium | High (4–5 chained clips × 2 ratios) | Low–medium |

You can also **hybridise**, e.g. C's personalised chat hero leading into A's night-to-day case studies.

---

## Order of operations (summary)
1. Install Superpowers (+ design-superpowers), the Figma desktop and mobile apps, and the fonts
2. New Claude session → **Stage 2 kickoff prompt** → lock 3 concepts
3. **P1** Foundations → **P2** × 3 concepts → **P3** motion
4. **Figma Make** prototypes → phone test
5. **P4** critique → pick one → only then generate Higgsfield assets and start code
