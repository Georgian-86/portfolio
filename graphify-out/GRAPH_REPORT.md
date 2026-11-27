# Graph Report - portfolio  (2026-11-27)

## Corpus Check
- 27 files · ~33,599 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 297 nodes · 454 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4fd225e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.js
- Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation"
- Video prompt sheet — Concept B v2 "The Untangling"
- Portfolio Design Guide — from zero to three Figma concepts
- 6. Prompt library
- 3. The workflow (idea → launched portfolio)
- Design — Three portfolio concepts in Figma
- package.json
- Review Focus
- Review Focus
- CLAUDE.md
- Review Focus
- Google Flow → scroll animation
- mountFilm
- Nexora — Selected Works
- bar.js
- sections.js

## God Nodes (most connected - your core abstractions)
1. `esc()` - 31 edges
2. `mountFilm()` - 21 edges
3. `Design — Three portfolio concepts in Figma` - 13 edges
4. `renderMissedCalls()` - 12 edges
5. `waLink()` - 11 edges
6. `tbc()` - 11 edges
7. `Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation"` - 11 edges
8. `6. Prompt library` - 10 edges
9. `Portfolio Research Playbook — tools, connectors, skills & prompts` - 10 edges
10. `renderStepQ()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Task 2: Sections 01b–03 (proof, missed calls with the night film, live agent, notes pipeline)` --references--> `mountFilm()`  [INFERRED]
  docs/superpowers/plans/2026-11-27-website-build.md → src/film.js
- `scrub()` --indirect_call--> `progress()`  [INFERRED]
  src/film.js → src/main.js
- `renderHero()` --calls--> `mountFilm()`  [EXTRACTED]
  src/main.js → src/film.js
- `renderDashboard()` --calls--> `mountFilm()`  [EXTRACTED]
  src/sections-late.js → src/film.js
- `renderMissedCalls()` --calls--> `mountFilm()`  [EXTRACTED]
  src/sections.js → src/film.js

## Import Cycles
- None detected.

## Communities (17 total, 1 thin omitted)

### Community 0 - "main.js"
Cohesion: 0.15
Nodes (17): bookLink(), brand, faqs, menu, nav, sections, services, team (+9 more)

### Community 1 - "Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation""
Cohesion: 0.06
Nodes (29): Figma links, Review, A — "24 Hours", Accessibility notes, Accessibility notes, Accessibility notes, B — "The Untangling", C — "The Conversation" (+21 more)

### Community 2 - "Video prompt sheet — Concept B v2 "The Untangling""
Cohesion: 0.08
Nodes (25): 0.1 B palette (quote the HEX values in prompts), 0.2 Style bible (append to every still and motion prompt), 0.3 Negative prompt (all shots), 0.4 Scroll-scrub rules, 0.5 Tools and pipeline, 0. Shared rules, Budget notes, First-frame still (mess) (+17 more)

### Community 3 - "Portfolio Design Guide — from zero to three Figma concepts"
Cohesion: 0.09
Nodes (21): 1.1 Already connected (verified 24 Nov 2026), 1.2 Install now, 1.3 Where each thing runs, 2.1 Kickoff prompt (paste into a new Claude session after installing Superpowers), 2.2 Seed brainstorm (first pass, done here), 3.1 Golden-ratio tokens (Figma variables with two modes), 5.1 File structure (one foundation file + three concept files), 5.2 Prompts to run in Claude (Figma connector). Run them in order. (+13 more)

### Community 4 - "6. Prompt library"
Cohesion: 0.07
Nodes (27): 0. Why the first two versions didn't land, 1. What "modern" means right now (2026 trend scan), 2. Three design directions (pick one, or send inspiration that overrides them), 3.1 Video generation (ranked for this portfolio), 3.2 3D and 3D motion graphics, 3.3 2D motion and micro-interactions, 3.4 Scroll animation (the engine), 3.5 Sound (+19 more)

### Community 5 - "3. The workflow (idea → launched portfolio)"
Cohesion: 0.12
Nodes (16): 1. Design direction (v2 — "The Book"), 2. Services: what you have and what's missing, 3. The workflow (idea → launched portfolio), 4. Connectors in your Claude workspace and what each is for, 5. Higgsfield / Flow prompt starters (in the site's style), 6. 30-day launch checklist, Gaps worth adding (ranked by demand and how well they fit your current services), Portfolio Strategy, Workflow & Toolkit (+8 more)

### Community 6 - "Design — Three portfolio concepts in Figma"
Cohesion: 0.12
Nodes (16): 10. Left to the builder, 11. Open items (do not block design; marked TBC in the files), 1. Intent — the why, 2. Goals, 3. Non-goals (this phase), 4. Anti-goals (failure even if "done"), 5. Constraints, 6. Content (shared by all three concepts) (+8 more)

### Community 7 - "package.json"
Cohesion: 0.12
Nodes (17): dependencies, gsap@3.13.0, lenis@1.3.11, devDependencies, @playwright/test@^1.63.0, vite@7.1.12, name, private (+9 more)

### Community 8 - "Review Focus"
Cohesion: 0.25
Nodes (7): Global Constraints, Portfolio Website Build (Concept B v2) Implementation Plan, Review Focus, Task 1: Foundation: tokens, shell, FrameSequence v2, test harness, Task 2: Sections 01b–03 (proof, missed calls with the night film, live agent, notes pipeline), Task 3: Sections 04–09 and menu content (dashboard with the sheet film, StepQ, founding team, services, about, CTA), Task 4: Polish, performance and accessibility pass

### Community 9 - "Review Focus"
Cohesion: 0.20
Nodes (9): Global Constraints, Portfolio Figma Concepts Implementation Plan, Review Focus, Task 1: Foundations file — variables, text styles, grids, palette cover, Task 2: Logos — three directions, Task 3: Concept A — "24 Hours" file, Task 4: Concept B — "The Untangling" file, Task 5: Concept C — "The Conversation" file (+1 more)

### Community 11 - "Review Focus"
Cohesion: 0.25
Nodes (7): Concept B Final ("The Untangling" v2) Implementation Plan, Global Constraints, Review Focus, Task 1: B v2 mobile + desktop frames (fixes + borrowed sections), Task 2: B v2 keyframes + prototype, Task 3: Video prompt sheet + Higgsfield stills (needs credit approval), Task 4: Generate the scroll films (needs approval of the stills)

### Community 12 - "Google Flow → scroll animation"
Cohesion: 0.33
Nodes (5): 1. Make the clip in Flow, 2. Export frames, 3. Switch it on, Google Flow → scroll animation, Using your design inspiration

### Community 13 - "mountFilm"
Cohesion: 0.28
Nodes (15): frameUrl(), mountFilm(), decode(), ensureWindow(), fetchFrame(), load(), nearestDecoded(), paint() (+7 more)

### Community 14 - "Nexora — Selected Works"
Cohesion: 0.50
Nodes (3): Make it yours, Nexora — Selected Works, Run

### Community 15 - "bar.js"
Cohesion: 0.16
Nodes (9): @playwright/test, BAR_H, expectClearsBar(), HDR_H, scrollToEnd(), scrollToSectionEnd(), WIDTHS, SECS (+1 more)

### Community 16 - "sections.js"
Cohesion: 0.14
Nodes (39): gsap, mountAgentDemo(), build(), endState(), bookingCard(), bubble(), callCard(), chatHead() (+31 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `gsap` connect `sections.js` to `main.js`, `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Why does `mountFilm()` connect `mountFilm` to `Review Focus`, `sections.js`, `main.js`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation"` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `bar.js` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `Video prompt sheet — Concept B v2 "The Untangling"` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Portfolio Design Guide — from zero to three Figma concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._