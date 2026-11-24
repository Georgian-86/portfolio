# Portfolio Research Playbook — tools, connectors, skills & prompts

Research date: **24 Nov 2026**. This is a planning document only: nothing gets built until you pick a direction and send your inspiration.

---

## 0. Why the first two versions didn't land

| Version | What went wrong | Lesson |
|---|---|---|
| v1: rotating glass blob | A generic WebGL hero object, neon gradients, look-alike agency template | Effects aren't a concept. A spinning object says nothing about *you* |
| v2: CSS book | Good idea, flat execution. A book drawn with CSS boxes can never look photoreal; it read as a wireframe | **Realism has to come from rendered or AI-generated footage, not from code.** Code should only drive the scroll and the real text |

**How the best 2026 sites are built:** photoreal or 3D footage is made offline (AI video, Blender, Spline), exported as an image sequence, and **scrubbed by scroll** (the Apple AirPods-page technique). Live HTML type and UI sit on top. Done this way, a book opening can look like a real cinematic object.

---

## 1. What "modern" means right now (2026 trend scan)

Sources: Figma *Web Design Trends 2026*, Awwwards SOTD/Three.js/Scrolling collections (Nov 2026), utsubo "Best Three.js sites 2026", Framer trend roundups.

1. **Scroll is the storyteller.** Cartier Watches & Wonders, Shopify Editions and Sleep Well Creative sequence whole scenes on scroll instead of moving a flat page.
2. **Bold, expressive type as the identity.** Oversized headlines, variable fonts, kinetic text that reacts to scroll.
3. **Vivid colour is back.** "Dopamine" palettes, but used as *one* loud signal colour against calm neutrals, not rainbow gradients.
4. **Bento grids** for services and case studies: scannable, modular, good on mobile.
5. **3D that dignifies unglamorous products.** Hubtown uses a 3D monolith to make real estate feel premium; the same move works for "automation" and "DevOps".
6. **Neo-brutalism / anti-design** for creative studios: raw grids, mono type, visible structure.
7. **Restraint backlash.** Viewers complain about "parallax everywhere". The best sites have a few huge moments and calm reading in between, and they respect reduced-motion settings.

---

## 2. Three design directions (pick one, or send inspiration that overrides them)

All three keep the **golden-ratio type scale** (`base × 1.618ⁿ` ≈ 16 / 26 / 42 / 68 / 110 / 178 px) and a **1 : 1.618 grid**.

### A. "Studio Noir" (recommended)
Cinematic and premium; it feels like a product launch.
- **Palette:** Graphite `#0B0B0C` · Bone `#EDEAE4` · Smoke `#8A8780` · **Signal Orange `#FF4D1A`** (only on CTAs and one word per headline)
- **Type:** *Clash Display* or *Neue Montreal* (display) + *Geist* / *Inter* (text) + *Geist Mono* (labels)
- **Hero:** a photoreal object film scrubbed by scroll (see the prompts in §6). It can still be the **book**, but rendered for real, plus huge kinetic type.
- **Body:** bento case-study grid, with a full-bleed video per project on hover or scroll.

### B. "Soft Chrome"
Apple-calm with a tactile, studio-product feel.
- **Palette:** Fog `#E9E7E3` · Ink `#111214` · Chrome `#B9BCC2` · **Electric Blue `#2B59FF`**
- **Type:** *Satoshi* (display and text) + *Instrument Serif* italic for accents
- **Hero:** one sculptural object per service (liquid metal, frosted glass, ceramic) rendered as product shots; they rotate in as you scroll.

### C. "Swiss Signal"
Smart, technical, neo-brutalist.
- **Palette:** Paper White `#F4F4F0` · Black `#0A0A0A` · **Acid Lime `#C6FF3D`** · Grid Grey `#D6D6D0`
- **Type:** *Neue Haas Grotesk* or *General Sans* + *JetBrains Mono*
- **Hero:** a giant kinetic wordmark that splits on scroll to reveal live dashboards and AI-agent conversations. Visible 12-column grid lines are part of the design.

> Free fonts: Clash Display, Satoshi and General Sans are on Fontshare; Geist is from Vercel; Inter, Instrument Serif and JetBrains Mono are on Google Fonts. Neue Montreal and Neue Haas are paid.

---

## 3. Which app for which job

### 3.1 Video generation (ranked for this portfolio)
| Tool | Best at | Use it for | Notes (Nov 2026) |
|---|---|---|---|
| **Higgsfield** (connected) | One hub for the top models: **Seedance 2.5** (4–30 s, native 4K, up to 50 reference inputs), **Kling 4.0** (image-to-video, motion), **Veo 3.1**, **Cinema Studio 4.0** (camera, lens and lighting rig), **Editing Room** (change angle or light of an existing clip) | Hero film, service-object loops, transitions | **Claude can drive it directly** through the Higgsfield MCP: generate, batch and upscale without leaving chat |
| **Google Flow** (Veo 3.1) | **Frame-to-Video** (first and last frame), **Ingredients** for consistent objects, camera controls, Flow Agent | Shots where the start and end frames must match exactly (perfect for scroll scrubbing) | **No connector, so it's manual.** Flow is retiring Veo 3.1 Fast/Quality on **5 Dec 2026**, leaving Veo 3.1 Lite + Omni Flash 1.2. SynthID watermark; realistic people restricted |
| **Runway Gen-4.5** | Shot-by-shot direction, restyling footage | Optional: restyle real screen recordings of your work | 2–10 s clips, no native audio |
| **Luma Ray3.2** | Keyframe direction | Optional alternative to Flow's Frame-to-Video | — |
| ~~Sora 2~~ | — | — | **Discontinued**; OpenAI shut the API down in Sept 2026 |

**Recommendation:** make the stills in Higgsfield **Soul Cinema** (its **Soul HEX** feature locks your palette), make the hero and object films in **Higgsfield Seedance 2.5 / Kling 4.0**, and use **Flow** wherever you need an exact first-to-last-frame match.

### 3.2 3D and 3D motion graphics
| Tool | Use |
|---|---|
| **Higgsfield `generate_3d`** (connected) | Turn a service-object still into a textured **GLB** model for interactive 3D on the site |
| **Higgsfield 3D Jutsu / Scene Builder** (connected) | Cloud Blender scene, then render the camera move with Seedance 2.5, all from chat |
| **Spline** | No-code interactive 3D (hover, drag, scroll states), embedded in one line. Best for the "touchable" objects |
| **Unicorn Studio** | No-code WebGL shaders: grain gradients, liquid distortion, light effects. **Has its own MCP for AI agents** (not connected yet; worth adding) |
| **Blender** | Full control if you want hand-made 3D; render image sequences directly |

### 3.3 2D motion and micro-interactions
| Tool | Use |
|---|---|
| **Figma motion** (connected) | Design keyframes in Figma. `get_motion_context` exports **CSS @keyframes and motion.dev code** |
| **Rive** | Interactive vector animations with state machines (animated icons, toggles, cursor-reactive mascots) |
| **Lottie** | Lightweight looping vector animations |
| **Claude Motion** | If available to you, its MP4s import straight into **Canva, Higgsfield and Vercel** through their connectors |

### 3.4 Scroll animation (the engine)
| Library | Role |
|---|---|
| **GSAP 3.13+** | Fully free since 2025, every plugin included: **ScrollTrigger** (pin and scrub), **SplitText** (kinetic type), **ScrollSmoother**, **Flip**, **MorphSVG**, **DrawSVG** |
| **Lenis** | Buttery smooth scrolling |
| **Canvas frame-sequence scrub** | Plays the AI films frame by frame as you scroll. This is how AI video becomes scroll animation |
| **Motion (motion.dev)** | Use it if the site moves to React/Next.js; hardware-accelerated scroll |
| **CSS scroll-driven animations** | Only for light reveals; browser support is still uneven |

### 3.5 Sound
**ElevenLabs** (connected): page-flip foley, a soft room tone, UI ticks, and an optional voice-over for the showreel. Always muted by default with a sound toggle.

---

## 4. Connectors: what to use and what's missing

| Connector | Status | Job in this project |
|---|---|---|
| **Higgsfield** | ✅ connected | Stills, video, 3D models, upscaling, social cutdowns (the main production tool) |
| **Figma** | ✅ connected | Design system, page layouts, motion keyframes, design-to-code, shaders |
| **Canva** | ✅ connected | Brand kit, social posts, pitch deck, Claude Motion import |
| **ElevenLabs** | ✅ connected | Sound design and voice |
| **Vercel** | ✅ connected | Hosting, preview links, analytics |
| **Firecrawl** | ✅ connected | Competitor and inspiration research, scraping reference sites |
| **GitHub** | ✅ connected | Code (`georgian-86/portfolio`) |
| **Supabase** | ✅ connected | Contact-form leads |
| **Notion / Google Drive** | ✅ connected | Shot list, prompt log, asset tracker |
| Google Flow | ❌ no connector exists | Use by hand in the browser |
| Unicorn Studio MCP | ➕ worth adding | Lets Claude author WebGL shader effects |
| Spline | ➕ optional | Interactive 3D embeds |
| Wix, HubSpot | ⚠️ failed to connect (blocked by the network) | Not needed for this project |

---

## 5. Skills to use, by phase

| Phase | Skills |
|---|---|
| Research | `anthropic-skills:firecrawl`, `anthropic-skills:deep-research`, `marketing:competitive-brief`, `product-management:brainstorm` |
| Brand & system | `marketing:brand-review`, `design:design-system`, `figma:figma-generate-library` (tokens: φ type scale, palette) |
| Layout design | `figma:figma-generate-design`, `figma:figma-use`, `design:design-critique`, `design:ux-copy` |
| Motion design | **`figma:figma-use-motion`**, **`figma:figma-implement-motion`**, **`figma:figma-3d-transforms`**, **`figma:figma-shaders`** |
| AI footage | Higgsfield workflows: `get_workflow_instructions` (multi-shot video), preset **/3d-jutsu** (3D scenes), **/editing-room** (re-light / re-angle), Marketing Studio (device mockups) |
| Build | `figma:figma-design-to-code`, `run`, `code-review`, `design:accessibility-review` |
| SEO / launch | `searchfit-seo:seo-audit`, `searchfit-seo:schema-markup`, `searchfit-seo:ai-visibility`, `engineering:deploy-checklist` |
| Content | `marketing:content-creation`, `marketing:campaign-plan` |

---

## 6. Prompt library

### 6.0 Style bible (append to every prompt so everything looks like one film)
> **STYLE:** photoreal commercial product cinematography, shot on ARRI Alexa 35, 50mm prime, f/2.8, soft key light from top-left at 45°, subtle warm rim light, deep graphite background (#0B0B0C) with gentle falloff, single accent of signal orange (#FF4D1A), fine 35mm film grain, high dynamic range, crisp micro-detail, no text, no logos, no people, no watermark.

**Negative / avoid:** cartoon, plastic CGI look, oversaturated neon, lens flares, shaky handheld, warped geometry, extra objects, text artifacts, distorted hands, morphing shapes.

**Scroll-scrub rules (important):** one continuous shot with no cuts · locked or single smooth camera move · constant lighting (no flicker) · 6–8 s · 24 fps · the first and last frames must be clean "rest" compositions, because the site freezes on them.

---

### 6.1 HERO: "The Book of Work", photoreal (Studio Noir)
Make the **3 keyframe stills** first (Higgsfield Soul Cinema or Nano Banana Pro, 16:9, 4K), then animate between them.

**Still 1 — closed**
> A closed, oversized hardcover book lying on a matte black stone table, cover wrapped in charcoal linen with a debossed geometric monogram and a thin signal-orange foil line along the spine, seen from a low 3/4 angle, dramatic soft top light, dust motes in the beam. + STYLE

**Still 2 — opening (cover at 90°)**
> Same book, same angle and lighting, front cover lifted to vertical, revealing thick cream pages; warm light spilling from inside the pages as if they glow faintly. + STYLE

**Still 3 — open spread**
> Same book fully open flat, camera now directly overhead, the open spread shows two blank cream pages with a soft inner glow, gentle page curvature at the gutter, the table edges falling into darkness. + STYLE

**Video 1 → 2 → 3** (Flow Frame-to-Video, or Higgsfield Kling 4.0 / Seedance 2.5 with start and end image)
> The camera slowly cranes up and over the book as the cover opens on its own with realistic weight and paper resistance, pages fanning slightly, light blooming from inside the pages, ending in a perfectly centered top-down view of the open spread. Smooth, continuous, no cuts, 8 seconds. + STYLE

*How the site uses it:* scroll scrubs the opening. On the final top-down frame, **real HTML pages** (your project text and images) fade onto the blank spread, so they stay sharp and clickable.

**Video 4 — page turn** (one per project; Frame-to-Video)
> Top-down locked camera on an open book, the right-hand page lifts and turns from right to left with natural paper bend and a soft moving shadow, 3 seconds, realistic physics. + STYLE
- First frame = open spread A; last frame = open spread A with the page turned. Overlay the project content in HTML.

---

### 6.2 HERO alternative: "The Monolith of Systems"
> A tall, perfectly polished obsidian monolith standing in a vast dark studio, thin seams of signal-orange light tracing circuit-like paths across its surface, light pulses travelling upward like data, slow orbit of the camera from low angle to eye level, 8 seconds, seamless loop. + STYLE

---

### 6.3 Service objects: one hero object per service
Make each as a **4K still (1:1)**, then a **5 s turntable loop**, then optionally a **GLB via Higgsfield `generate_3d`** for an interactive version.

| Service | Still prompt (+ STYLE) |
|---|---|
| AI Agents | A suspended lattice of brushed-brass nodes connected by hair-thin glass filaments, a few nodes glowing signal orange as if thinking |
| WhatsApp Agents | A thick speech bubble sculpted from frosted glass, a tiny warm light orb inside pulsing like a heartbeat, resting on black stone |
| Automations | A precision mechanism of interlocking matte-black gears and a polished steel ball rolling along a track, Swiss-watch craftsmanship |
| Websites | Five ultra-thin floating glass panes stacked in depth with small gaps, each pane etched with faint layout lines, light refracting through |
| Shopify | A minimalist shopping bag carved from unglazed white ceramic, handles in orange leather, soft shadow on graphite |
| WordPress | Rows of antique letterpress metal type blocks forming an abstract grid, ink-black with one orange block |
| App Development | A slab of polished black stone in phone proportions with a soft light leaking from one edge, floating above its reflection |
| DevOps | A compact brushed-aluminium server tower with rhythmic orange light pulses running down vertical slits |
| SEO & AI Search | A heavy glass magnifying lens hovering over a topographic relief map in matte black, the lens focusing a bright orange point |

**Turntable motion prompt (all objects)**
> The object rotates slowly 30° on its vertical axis while the camera drifts gently closer, lighting fixed, subtle reflections travelling across surfaces, 5 seconds, seamless loop. + STYLE

---

### 6.4 Case-study shots (your real work inside the scene)
Upload a **real screenshot** of each project as a reference image.
> A thin aluminium laptop on a black stone desk at night, screen showing [reference screenshot], soft desk light, shallow depth of field, slow push-in toward the screen until the screen fills the frame, 6 seconds. + STYLE

> A smartphone held steady on a black matte stand, screen showing [WhatsApp agent conversation screenshot], soft rim light, gentle 15° camera arc, 5 seconds. + STYLE

> Higgsfield tip: use **Marketing Studio** for device mockups, and **Editing Room** to re-light or re-angle an existing clip without regenerating it.

---

### 6.5 Transitions between sections
> Camera dives straight down through a field of fine black ash particles that part to reveal a soft orange glow, 3 seconds, ends on pure graphite black. + STYLE

> A sheet of thin dark glass sweeps across frame left to right, refracting the scene behind it, 2 seconds, ends on clean black. + STYLE

---

### 6.6 3D motion graphics (Spline / Unicorn Studio / Figma)
- **Spline (interactive object):** import the GLB from §6.3. States: *idle* (slow 6°/s rotation), *hover* (tilt toward the cursor 12°, rim light up 30%), *scroll* (rotate 90° across the section). Material: physical, roughness 0.15, clear-coat. Environment: dark studio HDRI.
- **Unicorn Studio (background shader):** grain gradient in graphite with a faint orange bloom that follows the cursor. Liquid distortion strength 0.15 on image hover. Noise scale 1.6. Respect reduced motion.
- **Figma motion (kinetic type):** headline splits by character. Each character rises 110% from a clipped line with `cubic-bezier(0.16, 1, 0.3, 1)`, 900 ms, 18 ms stagger. The accent word changes to signal orange 200 ms after it lands. Export with `get_motion_context` and run it with GSAP SplitText.

---

### 6.7 Sound (ElevenLabs)
- *"Single heavy hardcover book page turning slowly, close-mic, quiet room, no music, 1.2 seconds"*
- *"Very soft dark ambient room tone with distant low hum, warm, loopable, 30 seconds"*
- *"Tiny soft mechanical click, like a premium camera dial, 0.2 seconds"*

### 6.8 Social cutdowns (9:16)
> Re-frame the hero film to 9:16 with the book centered, add a 0.5 s hold at the end on the open spread. (Higgsfield `reframe` + Editing Room)

---

## 7. The production pipeline (in order)

```
1 Decide direction (A/B/C or your inspiration)
2 Lock style bible + palette ──────────── Figma tokens (φ scale) · Canva brand kit
3 Keyframe stills ─────────────────────── Higgsfield Soul Cinema (Soul HEX palette lock)
4 Animate between keyframes ───────────── Flow Frame-to-Video / Higgsfield Kling 4.0 · Seedance 2.5
5 Upscale + re-light if needed ────────── Higgsfield upscale · Editing Room
6 3D versions of objects (optional) ───── Higgsfield generate_3d → Spline
7 Export frames ────────────────────────── ffmpeg → WebP sequence (desktop 1920w, mobile 1080w)
8 Motion specs for type/UI ────────────── Figma motion → get_motion_context
9 Build scroll engine ──────────────────── GSAP ScrollTrigger + Lenis + canvas scrub
10 Sound ───────────────────────────────── ElevenLabs
11 QA + launch ─────────────────────────── accessibility-review, seo-audit, Vercel
```

**Frame export:**
```bash
ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 frames/hero_%04d.webp
```
Budget: about 150 frames × ~80 KB ≈ 12 MB for the hero. Preload the first 20 frames and stream the rest.

---

## 8. Decisions needed from you
1. **Direction:** A (Studio Noir), B (Soft Chrome), C (Swiss Signal), or your inspiration.
2. **Keep the book concept?** Rendered for real (§6.1) or swapped for the monolith or service objects.
3. **Your real projects:** title, what you did, a result, and screenshots or recordings.
4. **Brand name and logo** (or should we design one?).
5. **Budget for Higgsfield credits.** Video generations are paid. Claude will quote the cost before generating anything.
