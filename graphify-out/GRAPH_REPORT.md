# Graph Report - portfolio  (2026-11-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 233 nodes · 254 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `105c1862`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14

## God Nodes (most connected - your core abstractions)
1. `Design — Three portfolio concepts in Figma` - 13 edges
2. `Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation"` - 11 edges
3. `Portfolio Research Playbook — tools, connectors, skills & prompts` - 10 edges
4. `6. Prompt library` - 10 edges
5. `3. The workflow (idea → launched portfolio)` - 9 edges
6. `Portfolio Design Guide — from zero to three Figma concepts` - 8 edges
7. `Video prompt sheet — Concept B v2 "The Untangling"` - 8 edges
8. `Portfolio Strategy, Workflow & Toolkit` - 7 edges
9. `Review Focus` - 7 edges
10. `head()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `media()` --calls--> `mockup()`  [EXTRACTED]
  src/main.js → src/mockups.js

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (28): brand, flow, process, services, works, book, buildBook(), colophon() (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (29): Figma links, Review, A — "24 Hours", Accessibility notes, Accessibility notes, Accessibility notes, B — "The Untangling", C — "The Conversation" (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): 0.1 B palette (quote the HEX values in prompts), 0.2 Style bible (append to every still and motion prompt), 0.3 Negative prompt (all shots), 0.4 Scroll-scrub rules, 0.5 Tools and pipeline, 0. Shared rules, Budget notes, First-frame still (mess) (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (21): 1.1 Already connected (verified 24 Nov 2026), 1.2 Install now, 1.3 Where each thing runs, 2.1 Kickoff prompt (paste into a new Claude session after installing Superpowers), 2.2 Seed brainstorm (first pass, done here), 3.1 Golden-ratio tokens (Figma variables with two modes), 5.1 File structure (one foundation file + three concept files), 5.2 Prompts to run in Claude (Figma connector). Run them in order. (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): 0. Why the first two versions didn't land, 1. What "modern" means right now (2026 trend scan), 2. Three design directions (pick one, or send inspiration that overrides them), 3.1 Video generation (ranked for this portfolio), 3.2 3D and 3D motion graphics, 3.3 2D motion and micro-interactions, 3.4 Scroll animation (the engine), 3.5 Sound (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (16): 1. Design direction (v2 — "The Book"), 2. Services: what you have and what's missing, 3. The workflow (idea → launched portfolio), 4. Connectors in your Claude workspace and what each is for, 5. Higgsfield / Flow prompt starters (in the site's style), 6. 30-day launch checklist, Gaps worth adding (ranked by demand and how well they fit your current services), Portfolio Strategy, Workflow & Toolkit (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): 10. Left to the builder, 11. Open items (do not block design; marked TBC in the files), 1. Intent — the why, 2. Goals, 3. Non-goals (this phase), 4. Anti-goals (failure even if "done"), 5. Constraints, 6. Content (shared by all three concepts) (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (16): dependencies, gsap@3.13.0, lenis@1.3.11, devDependencies, vite@7.1.12, name, private, scripts (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (10): 6.0 Style bible (append to every prompt so everything looks like one film), 6.1 HERO: "The Book of Work", photoreal (Studio Noir), 6.2 HERO alternative: "The Monolith of Systems", 6.3 Service objects: one hero object per service, 6.4 Case-study shots (your real work inside the scene), 6.5 Transitions between sections, 6.6 3D motion graphics (Spline / Unicorn Studio / Figma), 6.7 Sound (ElevenLabs) (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): Global Constraints, Portfolio Figma Concepts Implementation Plan, Review Focus, Task 1: Foundations file — variables, text styles, grids, palette cover, Task 2: Logos — three directions, Task 3: Concept A — "24 Hours" file, Task 4: Concept B — "The Untangling" file, Task 5: Concept C — "The Conversation" file (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.31
Nodes (5): app(), kinds, lines(), store(), web()

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): Concept B Final ("The Untangling" v2) Implementation Plan, Global Constraints, Review Focus, Task 1: B v2 mobile + desktop frames (fixes + borrowed sections), Task 2: B v2 keyframes + prototype, Task 3: Video prompt sheet + Higgsfield stills (needs credit approval), Task 4: Generate the scroll films (needs approval of the stills)

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (5): 1. Make the clip in Flow, 2. Export frames, 3. Switch it on, Google Flow → scroll animation, Using your design inspiration

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (3): Make it yours, Nexora — Selected Works, Run

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `gsap` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10227272727272728 - nodes in this community are weakly interconnected._
- **Why does `lenis` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._