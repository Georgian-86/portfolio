# START HERE: portfolio redesign workflow

Any agent or session working on this repo starts here. This file holds the current state, the decisions already made (do not re-open them), and how to resume work.

## 1. What this is
- **Owner and audience:** Golu Kumar's portfolio, for two audiences:
  - **clients**, who buy AI agents, WhatsApp agents, automations, websites, Shopify, WordPress, app development, DevOps support and SEO;
  - **recruiters**, so it must look professional and engineering-credible.
- **Live site:** https://golu-portfolio-one.vercel.app. It is the Vercel project `golu-portfolio` in team `golus-projects`. Every push to `claude/busy-edison-3b74z2` redeploys production.
- **Stack:** Vite 7, vanilla JS, GSAP 3.13 (ScrollTrigger and SplitText are free and included), Lenis, Playwright tests (`npm test`), and three.js where a scene needs real 3D (see §4).

## 2. Current phase
**Redesign v3, "Systems in motion".**
- **Plan:** `docs/superpowers/plans/2026-11-28-redesign-v3.md`. This is the spec: section flow, constraints and tasks.
- **Ledger:** `.superpowers/sdd/2026-11-28-redesign-v3/progress.md` and `task-N-report.md`. This folder is git-ignored, so in a fresh cloud session it may be missing; if so, use `git log` and the plan checkboxes.
- **Design tokens and section specs:** `docs/DESIGN.md`, written in Task 1.

## 3. Decisions already made (do not re-open)
1. **Direction:** "Balanced: Systems in motion". Dark navy stage (`#0B1426`), one mint accent (`#3DDC97`), Inter with JetBrains Mono labels, φ type and space scales, one idea per screen, full-screen scenes, no collage clutter.
2. **Build approach:** build on the existing code. Do not start from scratch.
3. **Flow films** (`public/film/{hero,night,sheet}/{desktop,mobile}`) are used full-bleed as scroll-scrubbed scenes.
   - **Their visible Flow watermark must stay visible.** Never crop, blur, cover, darken or scale it out of view. Keep the "AI-generated footage" label.
   - The owner asked to hide it several times. The answer is no. Offer the alternatives instead: free stock footage (Pexels/Pixabay), the owner's own phone footage, a paid tool's legitimately clean export, or code or three.js scenes.
4. **Honesty rules:**
   - StepQ: "Client project · Website + iOS + Android".
   - TeachGenie and Brivia Club: "Founding team · [role TBC]".
   - No invented metrics. Demos are labelled "Sample". Anything unknown shows a `TBC` chip.
5. **Mobile is a first-class target:**
   - no horizontal scroll from 320 to 1920;
   - tap targets ≥44 px;
   - the header and WhatsApp bar are pinned on mobile and content clears them;
   - the 9:16 film sets are used on phones.
6. **Motion:**
   - Every scroll animation is ScrollTrigger scrub (0.6–1) driven by Lenis, animating only transform and opacity, with ease `cubic-bezier(0.16,1,0.3,1)`.
   - Reduced motion shows the end states.
   - Tests fail on jumps or stalls.
7. **Zero budget:** no paid tools unless the owner approves a cost first.

## 4. three.js usage
- Allowed wherever a scene benefits from real 3D. Example: the services stage, with a particle field morphing between shapes, or a hero depth effect.
- **Import it lazily** (`import('three')` when the section is within one viewport) so it is not in the first-screen bundle. Pin an exact version in `package.json`.
- **Fallbacks:** a canvas 2D or CSS fallback when WebGL is unavailable, and a static end state under reduced motion.
- **Budget:** keep the mobile first-screen transfer under 2 MB and hold 60 fps on a mid-range phone. Cap the device pixel ratio at 2 and pause rendering when the scene is off-screen.

## 5. How to resume in a new session
1. Read this file, then the plan in §2, then `docs/DESIGN.md` if it exists.
2. Follow the CLAUDE.md graphify rules: run `graphify query "<question>"` before grepping or reading source. If the `graphify` command is missing, install it with `pip install graphifyy`, then run `graphify update .`.
3. Run `git log --oneline -15` to see which plan tasks are committed (commit messages start with `feat(v3)`, `fix(v3)` or `perf(v3)`). Continue with the first uncommitted task.
4. Work with superpowers subagent-driven development: one implementer per task, then a reviewer, then fixes. Run `npm test` before every commit, and push only to `claude/busy-edison-3b74z2`.
5. **Design skills to use:** `design:design-system`, `design-superpowers:design`, `design-superpowers:creative`, and `figma:*` if Figma work is needed.

## 6. Open items needing the owner
- WhatsApp number, email, Calendly link and reply-time promise.
- His roles at TeachGenie and Brivia, a StepQ quote, real automation examples, a photo, project screenshots, CV, LinkedIn and GitHub URLs, a logo, and a custom domain.
- The book-flip inspiration reel (details pending).

## 7. History (for context only)
- **Figma concepts:** A, B and C were designed, and B v2 was chosen. Links are in `docs/FIGMA_LINKS.md` and the critique in `docs/superpowers/reviews/`.
- **Earlier code:** v1 (three.js blob) and v2 (CSS book) were rejected.
- **B v2 build:** shipped, then judged too cluttered; v3 replaces its look.
- **Video prompts:** `docs/VIDEO_PROMPTS.md`. Source clips are in `assets/film-src/`.
