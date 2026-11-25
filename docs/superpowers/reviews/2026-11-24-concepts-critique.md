# Concept critique: A "24 Hours" · B "The Untangling" · C "The Conversation"

Date: 2026-11-25 · Plan: `docs/superpowers/plans/2026-11-24-portfolio-figma-concepts.md` (Task 6)

**Audience:** small business owners who want more leads and less manual work.
**Brand feel:** reliable, modern, results-driven, trustworthy and responsive.
**Hard requirement from Golu:** mobile must feel as immersive as desktop, with zero layout issues.

## How this was reviewed

- I used the `design-critique` and `accessibility-review` frameworks (WCAG 2.1 AA).
- For each concept I took screenshots of:
  - the mobile hero;
  - the desktop hero;
  - one mobile work frame.

| Concept | Mobile hero | Desktop hero | Mobile work frame |
|---|---|---|---|
| A | `A-M-01-Hero` 10:24 | `A-D-01-Hero` 10:62 | `A-M-07-Work-1000` 20:24 |
| B | `B-M-01-Hero-Chaos` 9:18 | `B-D-01-Hero-Chaos` 16:18 | `B-M-05-StepQ` 11:388 |
| C | `C-M-01-Hero-Chips` 4:21 | `C-D-01-Hero-Chips` 9:21 | `C-M-03r-Work-Reordered` 5:158 |

- I also took an extra screenshot of A-M-05 (17:24) to check a contrast flag.
- I re-ran read-only audits on the Mobile and Desktop pages of all three files. They checked:
  - frame widths;
  - every text size against the type scale;
  - font families;
  - WCAG contrast on A. Tasks 4 and 5 had already run a full WCAG pass on B and C, but Task 3 only checked Coral on A.
- **About the scores:** they are my design judgement from the screenshots and audits. They have not been tested with users, and none of them is a measured metric.

## Comparison

| Score (1–10) | A · 24 Hours | B · The Untangling | C · The Conversation |
|---|---|---|---|
| Immersion | **9** | 7 | 7 |
| Trust | 7 | **8** | **8** |
| Mobile parity | 7 | 7 | **9** |
| Hierarchy | 8 | **9** | 8 |
| Golden-ratio compliance | **9** | 8 | 6 |
| **Total / 50** | **40** | **39** | **38** |

The totals are close, so they should not decide this on their own. The recommendation below weighs them against the audience, the mobile requirement and production risk.

### What each score means

- **Immersion:** how strongly the first screen and the signature moment pull you in.
- **Trust:** whether it reads as a reliable, results-driven person you could hire tomorrow.
- **Mobile parity:** whether the 390 px version feels as rich as the 1440 px version, not like a reduced copy.
- **Hierarchy:** whether the reading order and emphasis are right on the hero and work frames.
- **Golden-ratio compliance:**
  - Is the desktop split on the 38.2 / 61.8 guides?
  - Is the mobile CTA below 61.8% of the screen height (y 522)?
  - Are type and spacing on the φ scale?

## Global Constraint check (re-run for this review)

| Check | A | B | C |
|---|---|---|---|
| Mobile frames 390 wide · desktop 1440 wide | ✅ 11 + 11 | ✅ 10 + 10 | ✅ 10 + 10 |
| Font families (after substitution) | ✅ Bricolage Grotesque / Geist / Geist Mono | ✅ Inter / JetBrains Mono | ✅ Manrope / Geist Mono |
| Text sizes on the φ scale | ✅ 0 off-scale | ⚠️ off-scale only inside scaled illustration props (see note) | ✅ 0 off-scale |
| Text under 12 px | ✅ none | ✅ none | ✅ none |
| Mobile CTA in the thumb zone (below y 522) | ✅ button at about y 694 | ✅ button at about y 698 | ✅ chips start at y 636 |
| Mobile CTA pattern | ✅ WhatsApp pill on 01b–09 | ✅ WhatsApp pill on 01b–08 | ✅ sticky input bar |
| Accent text on light backgrounds | ✅ Ember used | ✅ Mint Deep used | ✅ Volt never used as text |
| Prototype start point set | ✅ 26:24 | ✅ 33:6128 | ✅ 22:21 |

**Fixes applied in Figma during this review: none.** No frame breaks a Global Constraint. Two audit flags turned out not to be breaks:

1. **A: 37 contrast flags, all false positives.**
   - What was flagged:
     - 12 on A-M-05, and the matching 20 on A-D-05 (the sunrise frames);
     - 5 timestamps on A-D-04.
   - Why A-05 is a false positive: the audit averaged the sunrise gradient behind the text. In the screenshot, the text sits on the dark chart card and the dark upper sky.
   - Why the A-D-04 timestamps pass: they are Porcelain at 50% on the Status board, which is Midnight at 55% over Dusk. Composited, that measures **4.70 : 1**, which passes AA (4.5).
   - The A-D-04 timestamps are the closest call in the file. In the build, give them a little more opacity.
2. **B: off-scale text inside the mess props.**
   - The affected props are stickies, missed-call cards and the spreadsheet: mobile 13.4 / 18.7 / 20.8 px and desktop 13.2–33.3 px.
   - They are scaled illustrations, not UI type. Task 4 recorded this on B's Cover under "Notes on fidelity", and the Task 4 review accepted it.
   - In code, render these props at 1× with on-scale type and position them with CSS transforms.

---

## A — "24 Hours"

The page tells one day, from 2 AM to noon, in which Golu's systems work while the owner sleeps.

**First impression:** this is the most cinematic of the three. A large headline, "Your business, awake at 2 AM.", sits over a night film, with a live clock. It reads premium and calm. The purpose is clear within 2 seconds.

### Strengths

- **The strongest premise.** "Your business, awake at 2 AM" sells less manual work without listing services, and the clock structure makes the scroll feel like time passing.
- **The desktop is a textbook golden split.**
  - The left rail (x 80–470) holds the large mono clock.
  - Content starts at x 550, on the 38.2% guide.
  - The 123 px H1 is the clear first read.
- **The light changes from night to day** (Midnight, then Dusk, then a sunrise, then Porcelain). It gives the long scroll a real sense of progress, and the switch from Coral to Ember is handled correctly for contrast.
- **The mobile clock bar** ("02:07 AM · NIGHT · 01 / 11") carries the concept into 390 px.
- **The work frame is honest and well ordered:**
  - each item has a time slot (10:00 StepQ, 10:30 TeachGenie, 10:45 Brivia, 10:50 Automations);
  - the credits are correct;
  - TBC tags are visible.

### Weaknesses

- **Immersion depends on assets that don't exist yet.** HERO-NIGHT is still a placeholder; without the film, the mobile hero is a dark gradient with a pill label. Of the three concepts, A carries the highest production risk.
- **Real work appears late.** It starts at frame 07 of 11, and the mobile page has no menu: only the clock bar and the WhatsApp pill. An owner who wants proof has to scroll through five night scenes first.
- **Mobile 07-Work is 2681 px tall**, three times the next-longest typical section.
- **A dark-first page** suits "night shift" but feels less "trustworthy local expert" to some small-business owners than a light page. This is a judgement call, not data.

### Accessibility notes

- Coral on Midnight is about 7.4 : 1. Midnight text on the Coral button is the same pair, so it passes too.
- Ember on Porcelain is about 5.4 : 1, and on white about 6.0 : 1.
- The A-D-04 timestamps are the closest pair, at 4.70 : 1.
- The clock changes on scroll, so in code:
  - mark the large clock `aria-hidden`, or keep it out of live regions;
  - offer a `prefers-reduced-motion` fallback with a static scene per section, no film scrub and no digit roll.
- The hero text sits over film, so keep the scrim when the real footage arrives and re-test contrast on the actual frames.
- Mobile tap targets are 44 px or more (checked in Task 3).

### Top 5 fixes (suggestions)

1. **Produce HERO-NIGHT, or a fallback, before committing to A.** The fallback could be a high-quality still with slow parallax and a glowing window. Without it, the "immersive" score drops to about 6.
2. **Add a mobile menu to the clock bar** (Work · Services · About · WhatsApp), and a "See the work ↓" text link under the hero CTA. Then proof is one tap away, not five scenes away.
3. **Split A-M-07-Work (2681 px) into two sections:** 10:00 Work (StepQ, TeachGenie, Brivia) and 10:50 Automations. The page keeps one scroll axis.
4. **Put a real proof line in 01b-Proof** (client logos or "StepQ · live on iOS + Android") once the facts are confirmed. Trust is A's weakest score.
5. **Define a motion budget:** film scrub plus gradient plus clock roll is a lot for a low-end Android phone on 4G. Use a poster frame first, lazy-load the film, and provide the reduced-motion version.

---

## B — "The Untangling"

The page shows the owner's mess (missed calls, sticky notes, broken sheets) and then snaps it into a clean system.

**First impression:** "Less chaos. More clients." is the clearest value proposition of the three. A small-business owner sees their own WhatsApp badge, missed calls and "Send bill to Priya??" sticky, and recognises the problem straight away.

### Strengths

- **It speaks the audience's language.** The props are their actual pains, so B needs the least explaining.
- **Hierarchy is the best of the three:**
  - the 4-line H1 has its payoff in Mint Deep;
  - a one-line sub follows;
  - then the Navy WhatsApp button;
  - then status and "Book a call".
- **Its immersion does not depend on generated film.** The mess is built from UI cards and stickies, so it looks finished today, not after an asset sprint.
- **The snap (Paper mess → Navy system) is a strong, repeatable signature moment.** The "Untangled n/4" progress bar gives the scroll a goal.
- **Desktop 02–05 use the 550 / 890 golden split** (mess column against system sheet).
- **The work frame turns StepQ into a story:** "One scribble became three products." It is credited and TBC-tagged correctly.

### Weaknesses

- **The mobile hero shows 3 mess items; the desktop shows 8.** The right-middle of the mobile hero is mostly empty tangle line, so mobile feels like a reduced copy. This is the main parity gap.
- **In B-M-05 the StepQ media slot is 326 px wide inside a 358 px column.** Its right edge does not line up with the body text, quote card or button. This is polish, not a constraint break.
- **TBC is signalled twice on the same quote:** "STEPQ TEAM · TBC" and "CLIENT QUOTE PENDING · TBC".
- **The visual chaos could read as "messy designer" to a skimming visitor** if the snap does not happen early. Red is used for both the tangle and the alerts, so it reads as "error" in several places at once.
- **The mess props are scaled**, so their type is off the φ scale (documented on the Cover).

### Accessibility notes

Contrast was checked in Task 4:

| Pair | Ratio |
|---|---|
| Mint Deep on Paper | 4.74 |
| Alert red on Paper | 4.61 |
| Fog on Navy | 6.98 |
| Muted on Paper | 5.49 |

- Alert red on Paper is used for 12 px mono labels and passes, but only just; never lighten it.
- The rotated, overlapping props need `aria-hidden` or a single text alternative, such as "A messy desk: unread WhatsApp messages, missed calls, sticky notes", so screen readers don't read fragments.
- The sticky note is decorative. Keep its copy out of the heading order.
- Mobile tap targets are 44 px or more (Task 4 audit).

### Top 5 fixes (suggestions)

1. **Restore mobile richness in the hero.** Add a fourth, smaller prop in the empty right-middle (the Instagram DM card from desktop, peeking in), and let the tangle line run through the H1 zone. Desktop has 8 items; mobile should feel just as crowded, without covering any text.
2. **In B-M-05, set the media placeholder (11:423) to fill the 358 px column**, so it lines up with the body text, quote card and button.
3. **Keep one TBC signal per quote, and reserve red for one alert per screen.** Draw the tangle line in Ink or Fog so red keeps its "problem" meaning.
4. **Trigger the snap early.** On mobile, the first scroll past the hero should show order; with reduced motion, show the tidy state straight away. The calm after the chaos is what builds trust.
5. **Add a mobile menu to the top bar** (it has the logo and progress, but no navigation), and decide whether the stickies get a handwriting face. Neither is in the spec font list, so this needs a ruling.

---

## C — "The Conversation"

The whole site is a chat thread. The visitor taps an answer and the page reorders around it, then the chat continues on WhatsApp.

**First impression:** it feels native on a phone. "Hi. What are you building?" with a Volt highlighter and a blinking cursor is friendly and modern, and the chips invite a tap within 2 seconds. It shows "responsive" more directly than either other concept.

### Strengths

- **Best mobile parity.** The chat form is phone-native, so mobile is the primary version. Desktop adds tiles in the gutters and margin notes.
- **Trust through responsiveness:**
  - an "Online · replies within [TBC]" header;
  - a sticky input bar that opens WhatsApp;
  - a live agent demo in section 07, which is itself a demo of the WhatsApp-agent service.
- **The signature reorder** ("Reordered for: An app", "↑ from #2") is clever and personal, and it shows a technical capability.
- **Accessibility is the cleanest of the three:**
  - a full WCAG audit, 0 failures (Task 5);
  - Volt is never used as text;
  - every target is 44 px or more, including chips, send and play.

### Weaknesses

- **The weakest immersion, especially on desktop.**
  - The desktop hero is a centred 640 px column with four floating placeholder tiles. Its lower third is empty, and the only WhatsApp CTA is in the nav.
  - Until the 3D tiles (prompts C-T1…T9) exist, the page is flat paper.
- **It follows the golden guides least.** The column runs from x 400 to 1040 (27.8% to 72.2%), not 550 or 890.
- **The mobile hero has a dead zone of about 140 px** between the sub-line and the chips (around y 460–600).
- **The StepQ 4:5 lead image (346 × 432) dominates 03r.** 03r is 1814 px and 04 is 1925 px.
- **Some copy duplicates or weakens signals:**
  - "[ROLE TBC]" plus a separate TBC chip on the founding-team rows;
  - the lowercase "golu kumar" header may read less established to an owner audience;
  - the strikethrough "before" text in Automations is harder to read.
- **The reorder needs JavaScript and a decided default order**; see the TBC list.

### Accessibility notes

Contrast pairs (Task 5):

| Pair | Ratio |
|---|---|
| Ink on Paper | 17.9 |
| Blue on Paper | 4.9 |
| White on Blue | 5.1 |
| Stone on Paper | 5.1 |

- In code, the chips must be real buttons: `aria-pressed` for the selected one, and keyboard reachable.
- Announce the reorder politely, e.g. "Work reordered for: An app", and move focus only when the visitor asks.
- The live agent thread needs `role="log"` so new messages are announced.
- The strikethrough "before" lines should use a visible "Before:" label, not strikethrough alone (WCAG 1.3.1).

### Top 5 fixes (suggestions)

1. **Make the desktop hero start the conversation.**
   - Put the input bar (or a primary WhatsApp button) in the column under the chips, so the conversation starts above the fold.
   - Use the empty lower third for a "Golu · typing…" preview bubble.
2. **Move the desktop column onto the golden guides:** start the column at x 550 and keep the margin notes in the left 38.2%. If a centred column is kept on purpose, write that down.
3. **Close the mobile hero dead zone** with a short Golu bubble, e.g. "Pick one and I'll show you the right work first". Keep the chips at y 636 or below, in the thumb zone.
4. **Shorten 03r and 04 on mobile:** use 1:1 or 16:9 for the StepQ lead image and cap each section at about 2 screens.
5. **Copy hygiene:**
   - one TBC signal per founding-team row;
   - test "Golu Kumar" in title case in the header;
   - replace the strikethrough with "Before: … → After: …".

---

## Recommendation

**Build B, "The Untangling", as the base, and borrow from C and A.**

### Why B

1. **It matches the audience best.** Small-business owners don't buy "AI agents"; they buy relief from missed calls and messy sheets, and B shows exactly that in the first screen. It also has the clearest hierarchy.
2. **It is the lowest production risk with high immersion.**
   - B's immersion is built from UI and props that already look finished.
   - A's immersion depends on a night film that hasn't been made.
   - C's desktop depends on 3D tiles that haven't been made.
3. **Its mobile gap is the easiest to close.** It is a richer hero (fix 1 above) plus the snap firing early. A's late proof and C's flat desktop are structural problems, not polish.
4. **Its trust score is high, and fix 4 (the early snap) raises it further.**

### What to borrow

- **From C:**
  - **The live agent demo (C-07):** it is the strongest proof of the WhatsApp-agent service and the most "responsive" moment in any concept. It can replace or extend B-02.
  - **The "Online · replies within …" header and the sticky input bar** as B's mobile CTA in place of the floating pill. *Check first:* the Global Constraints currently say B uses the pill, so this needs a ruling.
  - **The chip question "What are you building?"** as an optional filter at the top of B's work section, not as the hero.
- **From A:**
  - **The time-stamped framing of the demos,** e.g. the missed call at "11:42 PM" answered by the agent. It adds "while you sleep" without the dark theme.
  - **A's left-rail desktop layout** for long sections (06 Founding Team, 07 Services), so B's desktop stays on the golden split beyond 02–05.

### When to choose differently

- If Golu's priority is **a wow-factor brand piece** and he can produce the night film, choose **A**.
- If he wants **the WhatsApp agent itself to be the portfolio**, choose **C**, but only after fixes 1–3, which deal with the desktop.

---

## Open TBC list (needs Golu)

1. **Roles at TeachGenie.ai and Brivia Club.** All three concepts show "Founding team · [role TBC]".
2. **The StepQ client quote:** real words, the person's name and role, and permission to publish.
3. **The reply-time promise** ("Online · usually replies within [TBC]"). Every concept depends on it; pick a promise you can keep, e.g. working hours and a time zone.
4. **Real automation examples.** All before → after rows are placeholders tagged TBC.
5. **A real photo of Golu** (`GOLU-PHOTO · 4:5 · real photo (no AI)`).
6. **Sign-off on placeholder copy** written by the design agents:
   - the salon / Riya / Mehta / Priya demo conversations;
   - the automation step texts;
   - the status-board rows;
   - the principles ("Clear scope, in writing, before I start", …);
   - the service one-liners;
   - C's margin lines and "What I built" wording.
7. **C's default work order** when no chip is tapped. The file currently leads with TeachGenie and puts StepQ second, so that the "App → StepQ first" reorder is visible. This deviates from spec §6.
8. **Illustrative numbers.** A-09:00 and B-04 are labelled *illustrative*. Replace them with real, permitted numbers, or keep the label.

## Note: the book-flip inspiration

Golu shared an Instagram reel with a book-flip effect; the details are still pending. It could become the **work-presentation section** in whichever concept is chosen:

- each project (StepQ, TeachGenie.ai, Brivia Club, Automations) would be a spread;
- pages would turn as you scroll, on desktop and mobile alike, with no horizontal swipe;
- with reduced motion, it would become a stacked list.

**How it fits each concept:**
- **B:** the "untangled" system could arrive as a clean bound book of case studies.
- **A:** it could be the 10:00 "appointment book".

`docs/FLOW.md` and `docs/DESIGN_GUIDE.md` already describe an earlier book idea; the CSS-drawn book was rejected there as flat. So this should be prototyped as rendered pages or real 3D, not CSS shapes. Wait for the reel details before designing it.

## Viewing the prototypes on a phone

Each file has a `Prototype` page with a mobile flow. Tap anywhere to go to the next frame; every frame links to the next one.

| Concept | Flow name | Start frame |
|---|---|---|
| A | A — 24 Hours (mobile) | 26:24 |
| B | B — The Untangling (mobile) | 33:6128 |
| C | C — The Conversation (mobile) | 22:21 |

**Option 1: Figma mobile app (best)**

1. Install the **Figma** app (iOS or Android) and sign in with the account that owns the files.
2. Open the file from **Recents**, or from the team project.
3. Open the **Prototype** page and play the flow. You can also use **Mirror** on the desktop app: select a `Proto · …` frame on your computer, and the phone shows it live.
4. Turn the phone to portrait. The frames are 390 × 844 and scale to fit.

**Option 2: phone browser**

Open the prototype link on the phone:

- A: https://www.figma.com/proto/v9bIvAKYEyphMr5N3GT2ib?page-id=2%3A5&node-id=26-24&starting-point-node-id=26%3A24&scaling=scale-down
- B: https://www.figma.com/proto/xAnp89eU0yXZyMyPS6Zv9I?page-id=2%3A5&node-id=33-6128&starting-point-node-id=33%3A6128&scaling=scale-down
- C: https://www.figma.com/proto/sxCVVYLbJhp0yktPswVOYn?page-id=1%3A5&node-id=22-21&starting-point-node-id=22%3A21&scaling=scale-down

To share a link with someone else, set the file's sharing to "Anyone with the link can view" first.

**Known prototype limits**

- The pinned bars (clock bar, top bar, chat header) and the WhatsApp pill or input bar are fixed children. They can cover scrolled content at scroll 0; that is inherent to a floating CTA.
- Each section has a bottom padding of at least 104 px, so the end of a section always clears the CTA.
- The motion lives on each file's `Scroll keyframes` page, not in the tap-through prototype.
