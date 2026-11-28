# Reel study → brand and interaction strategy (2026-11-28)

**Input:** 7 Instagram posts the owner sent (12 videos, because one post is a carousel of 6). Each was downloaded and studied
as 16-frame contact sheets plus its caption.
**Skills used:** `design-superpowers:creative` (Brand Architect), with the `style-contexts.csv` lookup.
**Maturity:** L1 (`docs/DESIGN.md` exists). This document **extends** the locked v3 direction "Systems in motion" (see
`docs/REDESIGN.md` §3). It does not reopen it.

---

## 1. What each reel actually shows

| # | Post (creator) | What is on screen | The lesson |
|---|---|---|---|
| R1 | DePUPpaoVSf (@marina_uiux) | A personal site built around an **AI-illustrated self-portrait** on cobalt blue, with a huge serif name. Each part of the portrait (hair, dress, plants) was split into its own layer, and the layers swap and parallax on hover. Built with an image model, then Figma. | A **single owned hero visual** that is the person, not stock. Layers make it interactive. |
| R2 | DgQMPk_IN0g (@marina_uiux) | "Designer Creative Portfolio": the hero is a **video of a person at a desk**. The camera dollies *into* the monitor, and the monitor screen *is* the website, with stats (17+, 1.5M+) and testimonials. Loop. | **Scroll = camera move.** The hero film continues into the content, so there is no hard cut between "intro" and "site". |
| R3 | DgNl2F1vBX1 (@katarina.uxdesign) | "Quillon / 21 channels of web design": a **pyramid of old CRT TVs** in a dark 3D room. Each TV plays a project. Hover lights one up, and click flies into a case study (blue AI-lab scene). Caption: built with Claude Code. | **The work index *is* the 3D scene.** A single memorable metaphor (TV channels) for "many projects". |
| R4 | DgFuC-XI1Eo (@marina_uiux, ad) | Making launch/teaser videos with an AI video tool. "Sites that move": grid-paper canvas, cards sliding in, kinetic type ("Design. Teach.", "Made for clients."). | **Motion-design language** (cards, grids, kinetic words) carries the brand *off* the site too, in reels and launch teasers. |
| R5 | DgNZh_kJb0i (@aiwithsurabhi) | "Your 3D website doesn't look premium just because it has 3D." Four tools: **Unicorn Studio** (animated or interactive WebGL backgrounds), **Theatre.js** (choreographed camera moves), **Womp** (your own 3D objects, not the stock ones), **Vectary** (interactive 3D product you can rotate). | Premium = **details**: a background that isn't flat, cinematic camera paths, *original* 3D objects, and objects the user can touch. |
| R6 | Dfq_Hysx5aM (@studio_be_design_) | 6 inspiration libraries: Footer (footers), Landingfolio (sections), a real app-screens library, Watermelon UI (560+ dev components), a hero-section library ("3D. Motion. Web."), and an image-board tool. | Process: **reference by section** (hero, footer, cards), not by whole site. |
| R7a | DgNlzzSE6TT: philippeneveu.com | Colourful blobs with **googly eyes that follow the cursor**; hover explodes stickers; the "SHOWREEL" arc; "Drop me a line!" | **Personality through one tiny reactive detail** (eyes track you). |
| R7b | DgNmDlkk6gN: florentbiffi.com | "INTERACTIVE DEVELOPER" in huge serif on a blue gradient; the client list is giant type and **hover shows a floating preview** that follows the cursor; a logo wall; "DROP ME AN EMAIL" with envelopes drifting. | **Type as interface**: lists that reveal media on hover. A gradient used as atmosphere. |
| R7c | DgNmEq_E7nA: renaudrohlinger.com | Japanese-themed **low-poly 3D world** (torii gates, sakura); scroll flies the camera through it; contact is a tiny planet you can spin. Credits its stack (Blender, Draco, three.js…). | A **world you travel through**, with an honest "how I built this" section that shows engineering credibility. |
| R7d | DgNmFw7k1zD: appellemoipapa.fr | A wordmark split in two ("appellemoi · papa.") with **work sliding through the gap** on scroll; black and white with neon project colour. | **The name is the layout.** The brand mark becomes the frame for the work. |
| R7e | DgNmGyDkxnH: phantom.land | A **curved 3D wall of project cards** you drag through; a **point-cloud portrait** whose face changes as you hover team roles; an "All projects (93)" table view. | **Two modes**: an immersive wall *and* a fast list. Delight first, then utility. |
| R7f | DgNlyu8EwtE (cover) | Mascot with eyes peeking around "jaw-drop". | Same as R7a: a character looking at you creates presence. |

## 2. What makes these feel premium (distilled)

1. **One owned metaphor.** TV channels, a world, a monitor you fall into, a split name. Each site commits to *one* idea and
   builds every section from it. Clutter comes from having no metaphor (this is why B v2 was rejected).
2. **Continuity, no cuts.** Scroll moves a camera (R2, R3, R7c). Sections are *places* in one space, not stacked blocks.
3. **Original assets.** Their own portrait, their own 3D objects, their own footage (R1, R5). Stock 3D and stock gradients
   read cheap at once.
4. **Reactive micro-detail.** Eyes follow the cursor, previews follow the cursor, a TV lights up on hover. The page
   *notices you*. That is what "interactive" means in these reels, more than heavy WebGL.
5. **Typography as structure.** Giant display type (serif or grotesk) is used as navigation and frame (R7b, R7d).
6. **Restraint in colour.** Each site has 1 stage colour + 1 accent (cobalt + white, navy + gradient, black + neon).
7. **Two speeds.** An immersive mode for impact plus a plain list or table for people in a hurry, like recruiters (R7e).
8. **Craft is visible.** Loaders, cursor states, smooth easing, and a "how I built it" section (R7c). Engineering
   credibility is itself a brand asset for a developer.
9. **The site travels.** The same motion language is cut into reels and teasers (R4), so Instagram feeds the site.
10. **Cheap trick ≠ premium.** R5's core point: 3D alone doesn't help. Lighting, camera paths and interaction do.

## 3. Brand strategy (Brand Architect)

**Philosophy:** *Point-of-view first.* Golu sells one belief: "chaos becomes a system". Every surface demonstrates it
instead of claiming it.

**Architecture:** branded house. One master brand ("Golu Kumar"), descriptive service lines (Grow · Automate · Ship).
Rule for the next offering: it joins one of the three groups with a plain descriptive name, with no sub-brand.

**Theme statement (unchanged):** *Calm, precise systems in motion.*

**Archetype:** **Magician** (transformation: the messy business becomes a smooth machine), with **Sage** second (proof,
clarity, honesty rules). The `style-contexts.csv` row "Developer Tools / Technical B2B" independently prescribes the locked
choices: grotesque sans (Inter) plus mono accents, dark-mode-first, and a single saturated accent. So the v3 tokens are
already right for this audience. **AVOID:** AI-purple gradients and neon overload, which read as generic "AI startup".

**What the audiences should feel:**
| Audience | Feel (3 words) | Proof the site must show |
|---|---|---|
| Client (SMB owner) | relieved, understood, confident | a live agent demo, before→after flows, WhatsApp in one tap |
| Recruiter | competent, rigorous, honest | a fast list view, stack, CV, "how this site is built" notes |

**Distinctive assets to build (the fixed cues):**
| Asset | Fixed rule |
|---|---|
| **The Node**: a mint dot that is the status light, the cursor, the loader seed, and the particle that the services stage morphs from | always `--mint`, always circular, always "alive" (it pulses slowly) |
| **The Wire**: a 1px line that connects things (process line, hover connectors, the cursor's trail to the CTA) | `--hair`, draws with scroll, never decorative-only: it always connects two meaningful things |
| **G·K mark** (loader) | stroke-drawn, same timing everywhere |
| **Mono labels** | JetBrains Mono caps, used like machine readouts ("SYS · ONLINE", "STEP 02/04") |

**Translation contract:**
| Brand asset | Product translation |
|---|---|
| Mint | CTA, status, the Node only. Never body text, never large fills, never error states |
| Navy stage | every section except Contact (paper) |
| Inter / Mono | Inter for everything read; Mono for readouts and labels only |
| Voice: calm, plain, specific | motion is *productive* (ease-out, 0.6–1 scrub); no bounce, no shake |
| Honesty | "Sample", "Illustrative", "TBC" chips are part of the visual system, styled as readouts, not hidden |

**Master image brief (for any owned visual):** night-blue environments lit by one cool-mint practical light; real
objects (phone, laptop, receipt, WhatsApp chat) in soft focus; no faces generated to look like real people; no
purple. A person shown from behind or as hands only, so the visitor is in the operator's seat.

## 4. Interaction strategy: what to adopt, mapped to the v3 sections

Priority: **P1** = do in Tasks 2–3, **P2** = polish (Task 4), **P3** = later or optional.

| v3 section | Reel pattern borrowed (as a *technique*, not a copy) | Concrete build | Prio |
|---|---|---|---|
| Global | Reactive micro-detail (R7a/f) | **The Node cursor**: a 10px mint dot with lerp follow; it grows into a ring over links, shows a mono verb ("OPEN", "CHAT", "DRAG"). Desktop + fine pointer only | P1 |
| 1 Hero | Scroll = camera (R2) | Already built (focus pull). Add: the last hero frame hands off into section 2 with no cut; the Node lands where the particle field starts | P2 |
| 2 What I build | Not-flat background + touchable 3D (R5) | three.js particle field (planned) that **reacts to the pointer** (particles repel and connect with Wires within a radius). Shapes: chat bubble → flow graph → phone. Lazy import, DPR ≤2, paused off-screen | P1 |
| 3 WhatsApp | The page notices you | The agent demo types *your* choice: 3 tap chips ("Restaurant", "Clinic", "Store") change the sample conversation. Labelled "Sample" | P1 |
| 4 Automations | Before → after | A Wire diagram drawn on scroll over the sheet film: "form → sheet → WhatsApp → invoice". Each node lights when the scroll reaches it | P1 |
| 5 Work | Index *is* the scene (R3) + two speeds (R7e) + type as UI (R7b) | **Channel strip**: projects as large mono-numbered rows ("CH 01 · StepQ"). Hover or focus shows a cursor-following preview (desktop); tap expands to the full panel (mobile). A "List / Stage" toggle: Stage = full-screen clip-path panels (planned), List = fast table for recruiters | P1 |
| 6 How I work | Wire | Process line draws with scroll (planned); each step's Node pulses once as the line arrives | P1 |
| 7 About | Visible craft (R7c) | A "**How this site is built**" card: stack chips, the performance budget, the honesty rules. Strong recruiter signal, costs nothing | P1 |
| 8 Contact | Personality (R7a/b) | The giant kinetic "Let's build yours." with letters that lean towards the cursor (transform only, small amplitude). The Node becomes the WhatsApp button | P2 |
| Off-site | The site travels (R4) | Record 9:16 scroll captures of each scene (Task 4 already records videos) and cut them into reels | P3 |
| Hero visual | Owned portrait (R1) | Optional: an illustrated (not photoreal) layered portrait of Golu from **his own photo**, labelled as an illustration. Needs his photo and consent | P3 |

### Tools from R5, judged against the constraints (zero budget, vanilla JS + GSAP + three.js)
| Tool | Verdict |
|---|---|
| **Theatre.js** | **Use if needed.** It is open source (Apache-2.0 core). Good for authoring a camera path for the services stage. GSAP timelines may be enough, so try those first |
| Unicorn Studio | Skip. Its embeds tie the site to their runtime and free-tier branding. Write the shader in three.js instead |
| Womp / Vectary | Optional, to *model* 1–2 original low-poly objects (phone, chat bubble) and export glTF. Check that the free-tier export licence allows commercial use before using any |
| Inspiration libraries (R6) | Use them for reference by section only. Never lift a layout whole |

### Explicitly not adopting
- Copying any one site's signature (TV pyramid, split wordmark, googly eyes, Japanese world). We take the *principle*.
- A full 3D world you fly through. It conflicts with the mobile budget (<2 MB first screen, 60 fps mid-range) and with
  "one idea per screen".
- Hiding or cropping the Flow watermark in any of these moves (REDESIGN §3.3 still holds).
- Invented stats such as "17+ websites / 1.5M users" (R2). We show such numbers only when the owner supplies real ones.

## 5. Guardrails for every new interaction
- Transform and opacity only; ScrollTrigger scrub 0.6–1 on Lenis; ease `cubic-bezier(0.16,1,0.3,1)`.
- Every pointer effect has a keyboard/focus equivalent and is off on coarse pointers and under reduced motion.
- No horizontal scroll from 320 to 1920; tap targets ≥44px; the pinned bar is never covered.
- Each P1 item ships with a Playwright test (no jump or stall, reduced-motion end state, focus parity).

## 6. Needs the owner
1. OK to add the **Node cursor** and **List/Stage toggle** to the v3 plan (Tasks 2–3)?
2. A real photo, if he wants the P3 illustrated portrait.
3. Real numbers (projects shipped, clients) if any stats are to appear.
4. Which 3 industries to use for the WhatsApp demo chips.
