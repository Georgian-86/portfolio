# Concept B Final ("The Untangling" v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Concept B into the chosen final design by merging in the elements borrowed from Concepts A and C and applying B's top-5 critique fixes. All work happens in the existing B Figma file.

**Architecture:**
- Work in Figma file `xAnp89eU0yXZyMyPS6Zv9I`.
- Duplicate the current `Mobile 390`, `Desktop 1440`, `Scroll keyframes` and `Prototype` pages into `v2` pages, so the original B stays intact for comparison. All edits go on the v2 pages.
- Reuse C's components by rebuilding them in B's palette and type. Do not link libraries across files.

**Tech Stack:**
- Figma MCP: create_session, use_figma, get_screenshot, get_metadata, get_motion_context.
- Skills: figma:figma-use (mandatory before use_figma), figma:figma-use-motion.

**Spec:** `docs/superpowers/specs/2026-11-24-portfolio-figma-concepts-design.md`. Supporting docs:
- the critique `docs/superpowers/reviews/2026-11-24-concepts-critique.md` (sections "B — Top 5 fixes" and "What to borrow");
- `.superpowers/sdd/2026-11-24-portfolio-figma-concepts/global-constraints.md`.

## Global Constraints

- Everything in `global-constraints.md` still applies, with one exception below.
- **The ruling that replaces the pill.** The user chose "go with B and borrow from A and C". On mobile, B v2 drops the floating WhatsApp pill and uses C's pattern:
  - a pinned top header reading "Golu · Online · replies within [TBC]";
  - a pinned bottom input bar, 76 px tall, containing a 52 px input and a 44 px send button;
  - in the prototype, the bar sits at y 768 with a MIN constraint, and `numberOfFixedChildren` = 2;
  - every static frame keeps ≥110 px of bottom padding.
  - **Desktop:** the same header goes into the top nav, and the WhatsApp CTA button stays.
- **Fonts and type:** only Inter and JetBrains Mono (B's fonts). There is no handwriting face; the stickies use Inter.
  - Mobile φ scale: 12/16/26/42/68.
  - Desktop φ scale: 12/18/29/47/76/123/199.
  - Space scale: mobile 6/10/16/26/42/68; desktop 7/11/18/29/47/76.
- **Colours:** B's palette only. Red is the alert colour, used at most once per screen; the tangle line is drawn in Ink or Fog.
- **Motion:** keyframes at 0/38.2/61.8/100, ease cubic-bezier(0.16,1,0.3,1), Smart Animate at 618 ms.
- **Mobile layout:** 390 wide, no horizontal scroll, tap targets ≥44 px. The occlusion check, bar-overlap check and width/overflow checks must all return 0.
- **Content honesty:**
  - StepQ reads "Client project · Website + iOS + Android".
  - TeachGenie and Brivia read "Founding team · [role TBC]".
  - No invented metrics. Demos are labelled "Sample".
  - Times in the demos are illustrative, and the scene says so with a "Sample" tag.
  - Each quote carries one TBC signal only.
- **Notes** go in the SECTION "Notes (not part of the flow)".

## Review Focus

1. **The pinned header and bar on short mobile frames** (01 hero): the H1, CTA and chaos props must stay visible between the header and the bar at 844 px high, not hidden behind them. Test: run the occlusion check on the Prototype v2 frames at scroll 0 for the hero only.
2. **The extra chaos prop on the mobile hero:** a 4th prop must not cover any H1 or sub text. Test: occlusion = 0 on B-M-01 v2.
3. **The agent-demo bubbles** at 390 px: long messages must wrap inside a bubble no wider than 78% of the column, with no overflow. Test: width/overflow audit on the new 02 frames.
4. **The left-rail desktop sections:** rail plus content must sit on the 550 / 890 split with no text under 12 px. Test: width audit plus a type-scale audit on D-06 and D-07 v2.
5. **The reduced-motion state:** each snap needs a static "tidy" end frame. Test: every keyframe group has a 100% board, and a Notes entry gives the reduced-motion rule.

---

### Task 1: B v2 mobile + desktop frames (fixes + borrowed sections)

**Files:**
- Figma `xAnp89eU0yXZyMyPS6Zv9I`: new pages `Mobile 390 v2` and `Desktop 1440 v2`, plus a cover note.
- Modify: `docs/FIGMA_LINKS.md` (add a "B v2 (final)" line with page links).

**Interfaces:**
- **Produces:** the frame names `B2-M-<section>` and `B2-D-<section>`, covering the same 10 sections as B plus `02b-LiveAgent`. Also two components, `Header/Online` and `Bar/Input`.

- [ ] **Step 1: Duplicate the pages.** Copy `Mobile 390` and `Desktop 1440` to their v2 pages and rename the frames from the `B-` prefix to `B2-`.
- [ ] **Step 2: Build `Header/Online` and `Bar/Input`** in B's palette, using the sizes from Global Constraints. On mobile, replace the pill with both components on every mobile frame.
- [ ] **Step 3: Hero (B2-M-01).**
  - Add a 4th smaller prop in the right-middle, the Instagram DM card from desktop, so it peeks in.
  - Run the tangle line through the H1 zone in Ink or Fog.
  - Make sure no prop covers any text.
- [ ] **Step 4: Fix B2-M-05.** Set the media slot (the copy of 11:423) to fill the 358 px column, and keep one TBC signal per quote.
- [ ] **Step 5: Red audit.** Leave at most one red alert per frame and redraw the other red tangle lines in Ink or Fog.
- [ ] **Step 6: Timestamps on 02-MissedCalls-Agent** (mobile and desktop):
  - Use A's framing: the missed call at "11:42 PM", answered by the agent "11:42 PM · 38 s later".
  - Tag the scene "Sample · illustrative times".
- [ ] **Step 7: New section `02b-LiveAgent`** (mobile and desktop), rebuilt from C-07:
  - Sequence: customer message → typing → agent reply → booking confirmation card.
  - Tag it "Sample · demo conversation" and the card "Sample booking · not a real slot".
  - Bubbles are at most 78% of the column wide.
  - On desktop it sits on the golden split: the chat in the 550 column, the explainer in 890.
- [ ] **Step 8: Chip filter at the top of 05-StepQ** (C's "What are you building?" with Website / App / Automation / Store chips, each ≥44 px) as a filter row. The default state has no chip selected.
- [ ] **Step 9: A's left-rail layout on desktop** for B2-D-06-FoundingTeam and B2-D-07-Services:
  - a 550 sticky rail holding the section title, the "n/4"-style progress and a one-line summary;
  - an 890 content column.
- [ ] **Step 10: Mobile menu.** Add a ≥44 px menu button to the header, plus one frame `B2-M-00-Menu` showing the open sheet with the section links.
- [ ] **Step 11: Audit both v2 pages.** Run the width, overflow, font, type-scale, targets, contrast, occlusion and bar-overlap audits. Expected: 0 violations on every page; print the counts table.
- [ ] **Step 12: Screenshot check.** get_screenshot of B2-M-01, B2-M-02b and B2-D-07 at 1×, with a visual check that nothing is clipped or overlapping.
- [ ] **Step 13: Commit.** Run `git add docs/FIGMA_LINKS.md`, then commit with the message `docs: add concept B v2 frames`.

### Task 2: B v2 keyframes + prototype

**Files:**
- Figma `xAnp89eU0yXZyMyPS6Zv9I`: new pages `Scroll keyframes v2` and `Prototype v2`.
- Modify: `docs/FIGMA_LINKS.md` (add the Prototype v2 link).

**Interfaces:**
- **Consumes:** the `B2-M-*` and `B2-D-*` frames and the `Header/Online` and `Bar/Input` components from Task 1.

- [ ] **Step 1: Keyframe boards** at 0/38.2/61.8/100 for these sequences, each mobile beside desktop:
  - the snaps in 02, 03 and 04 (re-based on the v2 frames);
  - the 02b agent sequence;
  - the early hero→01b snap.
  - **Early-snap rule:** the first 38.2% of the scroll past the hero already shows order.
- [ ] **Step 2: Real keyframe motion** on the 02b and hero-snap frames, using the custom bezier.
- [ ] **Step 3: Notes entry for reduced motion:** "show the 100% state and no transforms".
- [ ] **Step 4: Prototype v2.** Copy the mobile v2 frames and link them in scroll order with Smart Animate at 618 ms. Pin the header and bar (`numberOfFixedChildren` = 2, bar at y 768 with a MIN constraint). The flow starts at B2-M-01.
- [ ] **Step 5: Audit the prototype and keyframes.** Run the proto, width, occlusion (pinned elements excluded, except the Review Focus 1 hero check) and bar-overlap audits. Expected: 0.
- [ ] **Step 6: Commit.** Add the prototype link to `docs/FIGMA_LINKS.md`, then commit with the message `docs: add concept B v2 prototype link`.

### Task 3: Video prompt sheet + Higgsfield stills (needs credit approval)

**Files:**
- Create `docs/VIDEO_PROMPTS.md`.
- Modify the Figma v2 pages, replacing the placeholders with the generated stills.

- [ ] **Step 1: Write `docs/VIDEO_PROMPTS.md`** with one block per shot. Each block gives: the purpose and section, the tool (Higgsfield model or Google Flow), the aspect ratios (16:9 desktop, 9:16 mobile), the duration (6–8 s, 24 fps), the first-frame and last-frame descriptions, the camera move, the palette HEX values, a negative prompt (no people, no text, no cuts, no flicker), and the frame-export command.
  - Shot 1: hero "Untangling" desk film.
  - Shot 2: the "11:42 PM" phone-at-night agent scene.
  - Shot 3: spreadsheet printouts → laptop dashboard.
  - Shot 4: the book flip, shown as a TBC placeholder until the reel details arrive.
  - The last frame of each shot must match the B v2 frame it hands over to.
- [ ] **Step 2: Get a cost estimate.** Check the Higgsfield balance and estimate the cost of the stills (first and last frame per shot, mobile and desktop). Then STOP and report the cost to the controller; the user approves before anything is generated.
- [ ] **Step 3: Generate the stills** after approval, using Soul Cinema with palette lock, then upscale them.
- [ ] **Step 4: Place the stills** in the B v2 hero, 02 and 04 frames on mobile and desktop, labelled "Still from planned film".
- [ ] **Step 5: Re-audit** the touched frames for occlusion and contrast. Text over imagery needs ≥4.5:1, so add a scrim if needed.
- [ ] **Step 6: Commit** with the message `docs: add video prompt sheet`.

### Task 4: Generate the scroll films (needs approval of the stills)

- [ ] **Step 1: Generate each shot** with image-to-video, using the approved stills as the first and last frames. Kling or Seedance in Higgsfield, or Flow by the user with the prompts from the prompt sheet.
- [ ] **Step 2: Check each clip** against the scroll-scrub rules: one continuous shot, a smooth camera move, constant light, and clean rest frames at both ends.
- [ ] **Step 3: Record the asset links** in `docs/VIDEO_PROMPTS.md`, then commit with the message `docs: record generated film assets`.
