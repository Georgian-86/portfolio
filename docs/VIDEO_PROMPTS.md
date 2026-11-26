# Video prompt sheet — Concept B v2 "The Untangling"

The scroll films for the final design: Figma `xAnp89eU0yXZyMyPS6Zv9I`, pages **Mobile 390 v2** and **Desktop 1440 v2**.

> **Honesty rule.** Every clip and still is **illustrative footage**. On the site, each one carries a visible "Illustrative footage" note (or "Still from planned film" in Figma). No real or invented brand, client, logo, name, number or readable message appears on any screen in the footage. All readable content (times, chat text, numbers) is live HTML laid on top, with its own "Sample" tag.

This sheet replaces the graphite/orange style bible in `docs/RESEARCH_PLAYBOOK.md` §6.0 for this design. That section's pipeline and scrub rules still apply.

---

## 0. Shared rules

### 0.1 B palette (quote the HEX values in prompts)
| Token | HEX | Role in footage |
|---|---|---|
| Paper | `#F3F1EC` | Desk surface, walls, the "mess" side, rest frames |
| Sticky Yellow | `#F7D154` | Sticky notes, highlighter marks |
| Alert Red | `#C9343A` | At most **one** red accent per shot (missed-call glow, a red pen mark) |
| Navy | `#0F1E3D` | Night, screens, the "system" side |
| Navy 2 | `#182A4F` | Screen cards on Navy |
| Mint | `#3DDC97` | Calm signal: chat bubbles, the one bright chart bar |
| Mint Deep | `#0E7A52` | Deep green accents on Paper |
| Fog | `#9DA9C2` | Cables, soft shadows on Navy, hairlines |
| Ink | `#121417` | Cable ink, pen, phone bodies |

Fonts on the site are Inter and JetBrains Mono. The footage contains **no type at all**.

### 0.2 Style bible (append to every still and motion prompt)
> **STYLE:** photoreal editorial still-life cinematography, calm and tactile, shot on ARRI Alexa 35, 50mm prime, f/4, soft diffused daylight from top-left through a large window scrim, gentle long shadows, warm off-white paper surfaces (#F3F1EC) with a subtle matte paper texture, ink-black objects (#121417), accents limited to sticky yellow (#F7D154), mint green (#3DDC97), deep green (#0E7A52) and deep navy (#0F1E3D), cool grey-blue fog tones (#9DA9C2) in shadows, at most one small red accent (#C9343A), low saturation, clean negative space, fine film grain, high micro-detail, no text, no readable writing, no logos, no brand marks, no people, no hands, no watermark.

### 0.3 Negative prompt (all shots)
> people, hands, fingers, faces, reflections of people, text, letters, numbers, readable writing, UI labels, logos, brand marks, app icons, watermark, signature, cartoon, plastic CGI look, oversaturated colours, neon, orange, purple, lens flare, bokeh balls, handheld shake, camera shake, cuts, jump cuts, scene change, flicker, light pulsing, exposure change, colour shift, warping, melting, morphing objects, objects popping in or out, duplicated objects, extra phones, extra cables, distorted geometry, motion blur smear, low resolution, jpeg artifacts.

### 0.4 Scroll-scrub rules
- **One continuous shot.** No cuts, no scene change.
- **One smooth camera move** (or locked off). No reversal, no handheld.
- **Constant light.** No flicker, no exposure or colour drift between first and last frames.
- **6–8 s at 24 fps** (144–192 frames). Generate at 8 s and trim if needed.
- **Clean rest frames.** The first and last 12 frames (0.5 s) hold nearly still, because the site freezes on them.
- **No people, no text, no logos** (see the negative prompt).
- **Silent.** Turn native audio off (`sound: off` / `generate_audio: false`); it also lowers the cost.
- **Safe zones.** Desktop: keep the left 38.2% (x 0–550 of 1440) quiet, because the H1 sits there. Mobile: keep the lower 60% quiet in the hero, because the H1, sub and CTA sit there between the header (60 px) and the input bar (76 px).
- **Reduced motion:** the site shows the last-frame still only.

### 0.5 Tools and pipeline
1. **Stills:** Higgsfield **Soul Cinema** (`soul_cinematic`, quality 2k), one first-frame and one last-frame still per shot, per aspect ratio. Use the first still as the image reference for the last still, so the desk, light and lens stay the same.
2. **Upscale:** Higgsfield `upscale_image` to 4k.
3. **Motion:** image-to-video with **start_image + end_image**:
   - **Default:** Kling 3.0 (`kling3_0`, mode `pro`, `sound: off`, duration 8): first + last frame at the lowest cost.
   - **Higher quality:** Kling 4.0 (`kling4_0`, mode `image-to-video`, 1080p, duration 8).
   - **Premium:** Seedance 2.5 (`seedance_2_5`, mode `omni_reference`, 1080p, `generate_audio: false`). About 4× Kling 4.0; use only for the hero if Kling fails.
4. **Manual alternative: Google Flow, Frame-to-Video.** Upload the same two stills as first and last frames and paste the motion prompt. **Veo 3.1 Fast and Quality retire in Flow on 5 Dec 2026**; after that, only Veo 3.1 Lite and Omni Flash 1.2 remain. Flow adds a SynthID watermark.
5. **Aspect ratios:** generate **16:9 (desktop)** and **9:16 (mobile)** as separate runs from their own stills. Do not crop 16:9 to 9:16: the safe zones differ.
6. **Frame export:** ffmpeg to WebP. Desktop 1920 wide, mobile 1080 wide (commands per shot).

Common ffmpeg extras:
```bash
# rest-frame posters (first and last frame) for reduced motion and the loading state
ffmpeg -i in.mp4 -vf "select=eq(n\,0)" -frames:v 1 -c:v libwebp -quality 80 first.webp
ffmpeg -sseof -0.05 -i in.mp4 -frames:v 1 -c:v libwebp -quality 80 last.webp
# trim to 7 s if the motion settles early
ffmpeg -i in.mp4 -t 7 -c copy trimmed.mp4
```

---

## Shot 1 — HERO "The Untangling" (desk film)

| | |
|---|---|
| **Section** | 01 Hero-Chaos → hands over to 01b Proof |
| **Figma frames** | B2-M-01 (49:331), B2-D-01 (49:1438) → B2-M-01b (49:356), B2-D-01b (49:1466) |
| **Placeholder label** | `HERO-DESK · 16:9 / 9:16 · PROMPT B-1` |
| **Tool** | Soul Cinema stills → Kling 3.0 pro first + last frame (Kling 4.0 or Seedance 2.5 as the upgrade); Flow Frame-to-Video as the manual alternative |
| **Aspect / length** | 16:9 and 9:16 · 8 s · 24 fps · silent |
| **Camera** | Locked-off top-down, with a very slow 3% push-in (dolly down) across the whole shot |
| **Hands over to** | The flat Paper `#F3F1EC` background of 01b ("Real work first."). The last frame is a clean, almost empty paper desk that cross-fades into 01b's paper |

**How the site uses it.** The hero's live HTML props (Riya · WhatsApp, 3 missed calls, Arjun · Instagram, the stickies, the LEADS sheet) sit on top of the film. As the visitor scrolls, the film tidies the desk underneath while the HTML props fade, then the frame settles to paper and 01b scrolls in.

### First-frame still (mess)
**Desktop 16:9**
> Top-down view of a large warm off-white paper desk (#F3F1EC) in soft window daylight. The right 60% of the frame is a tangled mess: two black smartphones (#121417) face-up with blank dark screens, one tilted, slightly vibrating with a faint motion trail; five square sticky notes in sticky yellow (#F7D154), some curled, with only illegible pencil scribbles; crumpled paper receipts with faded unreadable print; a printed spreadsheet page with yellow highlighter strokes; long black and grey-blue (#9DA9C2) charging cables tangled in loops across everything; one small red (#C9343A) glow from a phone's notification light. The left 40% of the frame is mostly clear paper with only a cable end and one receipt edge entering, leaving space for a headline. Soft long shadows to the lower right, a gentle warm vignette darkening the lower-right corner. + STYLE

**Mobile 9:16**
> Top-down view of a warm off-white paper desk (#F3F1EC) in soft window daylight. The top 40% of the frame holds the mess: two black smartphones (#121417) with blank dark screens, one tilted; four sticky-yellow (#F7D154) sticky notes with illegible pencil scribbles; crumpled receipts with faded unreadable print; black and grey-blue (#9DA9C2) cables tangled in loops; one small red (#C9343A) notification glow. A single grey-blue cable trails down through the middle of the frame. The lower 60% is calm, mostly empty paper for a headline and button. Soft shadows, gentle warm vignette. + STYLE

### Last-frame still (order)
**Desktop 16:9**
> The same desk, same light and same lens, now perfectly tidy. Almost the whole frame is clean warm off-white paper (#F3F1EC) with a subtle paper grain and no vignette. At the right side, on the 61.8% vertical line, a single black smartphone (#121417) lies face-up, square to the frame, its screen showing a calm generic chat thread: a deep navy (#0F1E3D) background with three soft rounded message bubbles, two light grey and one mint green (#3DDC97), containing only blurred abstract lines, no readable text, no logos. Beside it, a neat closed stack of sticky-yellow notes and one coiled grey-blue cable, aligned. Everything else has left the frame. Soft, even daylight; the edges of the frame fade into flat paper. + STYLE

**Mobile 9:16**
> The same desk, same light and same lens, now tidy. The top third shows a single black smartphone (#121417) square to the frame, slightly right of centre, its screen showing a calm generic chat thread: deep navy (#0F1E3D) background with soft rounded bubbles in light grey and mint green (#3DDC97), blurred abstract lines only, no readable text, no logos. A small aligned stack of sticky-yellow notes beside it. The lower two thirds are clean, flat warm off-white paper (#F3F1EC) with no objects and no vignette. + STYLE

### Motion prompt
> Hold still for half a second on the messy desk. Then, in one calm continuous motion, the clutter untangles itself: the tangled cables slowly unknot and slide out of frame, the receipts and the spreadsheet page drift off the edges, the sticky notes glide together into one neat stack, the extra phone slides away, and the remaining phone settles square to the frame as its dark screen softly lights to show a calm chat thread. Objects move like they are pulled by gentle invisible strings, with realistic weight and soft shadows; nothing pops, morphs or duplicates. Very slow top-down push-in the whole time. Lighting stays exactly constant. Hold still for the last half second on the clean desk. 8 seconds, one continuous shot, no cuts. + STYLE

### Frame export
```bash
mkdir -p public/film/hero/desktop public/film/hero/mobile
ffmpeg -i hero-16x9.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/film/hero/desktop/frame_%04d.webp
ffmpeg -i hero-9x16.mp4 -vf "fps=24,scale=1080:-2" -c:v libwebp -quality 72 public/film/hero/mobile/frame_%04d.webp
```

---

## Shot 2 — "11:42 PM" phone at night (agent scene)

| | |
|---|---|
| **Section** | 02 MissedCalls-Agent (the snap to the Navy system sheet) and 02b LiveAgent |
| **Figma frames** | B2-M-02 (49:399), B2-D-02 (49:1506) → B2-M-02b (57:549), B2-D-02b (58:478) |
| **Placeholder label** | `NIGHT-PHONE · 16:9 / 9:16 · PROMPT B-2` |
| **Tool** | Soul Cinema stills → Kling 3.0 pro first + last frame (Kling 4.0 as the upgrade); Flow Frame-to-Video as the manual alternative |
| **Aspect / length** | 16:9 and 9:16 · 7 s · 24 fps · silent |
| **Camera** | Slow push-in from a 45° high angle toward the phone, ending closer and slightly more top-down |
| **Hands over to** | The Navy `#0F1E3D` system sheet in 02 ("Every call gets an answer, even at 11:42 PM.") and the chat in 02b. The last frame is dominated by deep navy, with the mint-lit phone screen as the only bright area |

**Honesty.** The time "11:42 PM" is never in the footage. It stays HTML, tagged "Sample · illustrative times". The chat on the phone screen is abstract; the real demo conversation is HTML in 02b, tagged "Sample · demo conversation".

### First-frame still (missed call)
**Desktop 16:9**
> A dark, quiet shop counter at night, seen from a 45° high angle. Deep navy darkness (#0F1E3D) fills the room, with cool grey-blue (#9DA9C2) moonlight from a window at the back left. A single black smartphone (#121417) lies face-up on the counter, right of centre, its screen lit with an abstract incoming-call screen: a soft red (#C9343A) circle glow on a dark background, no text, no icons, no numbers. The red glow spills faintly onto the counter. A closed paper notebook (#F3F1EC) and a pen sit in shadow nearby. The left 40% of the frame is quiet darkness. Calm, still, cinematic night light. + STYLE

**Mobile 9:16**
> A dark shop counter at night from a 45° high angle. Deep navy darkness (#0F1E3D), cool grey-blue (#9DA9C2) moonlight from the top. A single black smartphone (#121417) lies face-up in the upper-middle of the frame, its screen showing an abstract incoming-call glow: a soft red (#C9343A) circle on dark, no text, no icons. A closed paper notebook in shadow. The lower half is quiet navy darkness. + STYLE

### Last-frame still (answered)
**Desktop 16:9**
> The same counter, same night light, camera now closer and more top-down. The phone fills the right half of the frame, its screen showing a calm generic chat thread: deep navy (#182A4F) background, alternating soft rounded bubbles in muted navy-grey and mint green (#3DDC97), blurred abstract lines only, no readable text, no logos, and a small mint check-mark circle at the bottom. A soft mint glow spills onto the counter. The red glow is gone. Everything else is deep, even navy (#0F1E3D) darkness that blends into a flat navy edge. + STYLE

**Mobile 9:16**
> The same counter, camera closer and more top-down. The phone fills the centre of the frame, its screen showing a calm generic chat thread: navy (#182A4F) background, soft rounded bubbles in muted navy-grey and mint green (#3DDC97), blurred abstract lines only, no readable text, no logos, a small mint check circle at the bottom. A soft mint glow on the counter. Top and bottom of the frame are flat deep navy (#0F1E3D). + STYLE

### Motion prompt
> Hold for half a second on the phone glowing red on the dark counter. The red call glow softly fades out, and the screen calmly transitions to a chat thread as rounded message bubbles slide up one by one, the last one mint green, then a small mint check appears. At the same time the camera pushes in slowly and tilts slightly more top-down toward the phone. The room light stays exactly the same, deep navy night with cool moonlight; only the phone screen changes. Hold still for the last half second. 7 seconds, one continuous shot, no cuts. + STYLE

### Frame export
```bash
mkdir -p public/film/night/desktop public/film/night/mobile
ffmpeg -i night-16x9.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/film/night/desktop/frame_%04d.webp
ffmpeg -i night-9x16.mp4 -vf "fps=24,scale=1080:-2" -c:v libwebp -quality 72 public/film/night/mobile/frame_%04d.webp
```

---

## Shot 3 — Spreadsheet printouts → laptop dashboard

| | |
|---|---|
| **Section** | 04 Sheet-Dashboard |
| **Figma frames** | B2-M-04 (49:477), B2-D-04 (49:1582) |
| **Placeholder label** | `SHEET-DASH · 16:9 / 9:16 · PROMPT B-3` |
| **Tool** | Soul Cinema stills → Kling 3.0 pro first + last frame (Kling 4.0 as the upgrade); Flow Frame-to-Video as the manual alternative |
| **Aspect / length** | 16:9 and 9:16 · 8 s · 24 fps · silent |
| **Camera** | One slow dolly forward and tilt-up from a top-down view of the papers to a straight-on view of the laptop screen, ending with the screen filling most of the frame |
| **Hands over to** | B2-D-04: the Navy dashboard panel on the right 61.8% (x 550–1440), with Paper on the left. B2-M-04: the Navy sheet that rises from the bottom. The last frame is a navy screen with abstract stat cards and one mint bar, matching the "This week" panel's layout |

**Honesty.** The screen shows abstract shapes only. The real numbers (48, 38 s, 17, 0) are HTML tagged "Illustrative numbers · not client data". No spreadsheet text is readable; no client names appear.

### First-frame still (messy sheets)
**Desktop 16:9**
> Top-down view of a warm off-white paper desk (#F3F1EC) in soft daylight. Several printed spreadsheet pages overlap at angles, their grid lines visible but every cell's content an illegible grey blur; some cells marked with sticky-yellow (#F7D154) highlighter, one cell circled in red pen (#C9343A); a black pen (#121417) and a grey-blue (#9DA9C2) paper clip on top. At the right, partly in frame, the edge of a closed dark slim laptop. The left 40% of the frame is calm paper. + STYLE

**Mobile 9:16**
> Top-down view of a warm off-white paper desk (#F3F1EC). In the upper half, printed spreadsheet pages overlap at angles, grid lines visible but cell contents illegible blurs, some cells marked with sticky-yellow (#F7D154) highlighter, one cell circled in red pen (#C9343A), a black pen on top. The edge of a dark slim laptop at the bottom of the frame. Calm paper elsewhere. + STYLE

### Last-frame still (dashboard)
**Desktop 16:9**
> The same desk and light, the camera now straight-on and close to an open dark slim laptop (#121417, no logo) on the right, its screen filling the right 60% of the frame. The screen shows a calm abstract dashboard on deep navy (#0F1E3D): one large rounded navy-2 (#182A4F) panel with a row of four small rounded stat cards (blank, no numbers) and below them seven rounded vertical bars in muted grey-blue (#9DA9C2), the sixth bar taller and mint green (#3DDC97). No text, no numbers, no logos. The tidy paper pages are now a single neat stack at the left edge, softly out of focus on warm off-white paper (#F3F1EC). + STYLE

**Mobile 9:16**
> The same desk and light, the camera straight-on and close to the open laptop screen, which fills the lower two thirds of the frame: deep navy (#0F1E3D) with one rounded navy-2 (#182A4F) panel holding four blank stat cards in a 2×2 grid and seven rounded vertical bars in grey-blue (#9DA9C2), one bar mint green (#3DDC97). No text, no numbers, no logos. The top third is a neat paper stack on warm off-white paper (#F3F1EC), softly out of focus. + STYLE

### Motion prompt
> Hold for half a second on the scattered spreadsheet printouts. Then the pages slide together into one neat stack and move aside, while the laptop lid opens on its own with realistic weight, and the camera dollies forward and tilts up smoothly to face the screen. The screen lights up deep navy, and the stat cards and chart bars rise into place one after another, the sixth bar growing tallest in mint green. Light stays constant; no flicker. Hold still for the last half second on the dashboard. 8 seconds, one continuous shot, no cuts. + STYLE

### Frame export
```bash
mkdir -p public/film/sheet/desktop public/film/sheet/mobile
ffmpeg -i sheet-16x9.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/film/sheet/desktop/frame_%04d.webp
ffmpeg -i sheet-9x16.mp4 -vf "fps=24,scale=1080:-2" -c:v libwebp -quality 72 public/film/sheet/mobile/frame_%04d.webp
```

---

## Shot 4 — Book flip (work section) · **TBC**

| | |
|---|---|
| **Status** | **TBC placeholder.** Waiting for the user's inspiration reel (timing, page style, camera, where it sits). Do not generate. |
| **Section** | Work / case studies (05 StepQ and the 06 Founding-team stories), exact frames TBC |
| **Placeholder label** | `BOOK-FLIP · 16:9 / 9:16 · PROMPT B-4 · TBC` |
| **Tool (provisional)** | Soul Cinema stills → Kling 3.0 / 4.0 first + last frame, or Flow Frame-to-Video |
| **Aspect / length** | 16:9 and 9:16 · 3–6 s per flip · 24 fps · silent |

**Provisional direction**, to be replaced once the reel arrives:
- **First frame:** a closed hardcover book on the Paper desk (#F3F1EC), cloth cover in Navy (#0F1E3D), no title, no monogram, top-down.
- **Last frame:** the book open flat, two blank warm-white pages, top-down, centred. The project content is HTML laid onto the blank spread, so the pages stay blank in the footage.
- **Motion:** the cover lifts and the pages fan with natural paper bend and a soft moving shadow; locked camera.
- **Open questions for the user:** which reel; one flip per project or one opening; where the book sits relative to 05/06; whether pages show real screenshots (they must be the user's own work, labelled).

Frame export (once generated):
```bash
ffmpeg -i book-16x9.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/film/book/desktop/frame_%04d.webp
ffmpeg -i book-9x16.mp4 -vf "fps=24,scale=1080:-2" -c:v libwebp -quality 72 public/film/book/mobile/frame_%04d.webp
```

---

## Budget notes
- A full 8 s clip is 192 frames. At about 60–90 KB per WebP, that is 12–17 MB on desktop and about half that on mobile. Preload the first 20 frames and stream the rest.
- Credit costs and the approval gate are recorded in `.superpowers/sdd/2026-11-25-concept-b-final/task-3-report.md`. Nothing is generated until the user approves the cost.

---

## Free route: Google Flow free tier (₹0)

Golu chose to spend no money, so this is now the default route. The numbers come from third-party write-ups as of Nov 2026; check them on Flow's own help page.
- **Allowance:** a free Google account gets about **50 Flow credits a day**. They don't roll over, and they reset daily.
- **Clip cost:** a **Veo 3.1 Lite** clip costs about 10 credits (4, 6 or 8 s at 720p), so about **5 clips a day**.
- **Busy hours:** free generation can be blocked roughly 14:00–17:00 UTC (19:30–22:30 IST), so generate in the morning IST.
- **Fast/Quality models:** Veo 3.1 Fast and Quality are out of reach on free credits, and both retire on 5 Dec 2026. Lite is what we use.

**Plan (6 clips over 2 days):**

| Day | Clips |
|---|---|
| 1 | Shot 1 at 16:9 and at 9:16, then Shot 2 at 16:9 (plus 2 spare credits' worth for one retry) |
| 2 | Shot 2 at 9:16, then Shot 3 at 16:9 and at 9:16 |

**Steps for each clip in Flow (labs.google/flow):**
1. Create the **first** and **last** stills with Flow's built-in image tool, using the still prompts above plus the style bible. If the stills cost credits, make them on a day you don't generate video. The Gemini app's free image generation also works.
2. Choose **Frames to Video**, upload the first and last stills, and paste the motion prompt plus the negative prompt.
3. Model: **Veo 3.1 Lite**, 8 s, at the aspect ratio for that clip.
4. Download the MP4 and save it as `shot1-16x9.mp4`, `shot1-9x16.mp4` and so on.
5. Send the files to Claude. Claude runs the frame-export commands, upscales (free, locally), and wires up the scroll scrub.

**720p is enough:** frames are exported as WebP. On mobile, 720p (9:16) is close to the screen's real resolution. On desktop, the film sits behind HTML text with a scrim, so it can be slightly softer. A free local upscale (Real-ESRGAN in ffmpeg or Upscayl) takes it to 1440 if needed.

**Fallback at zero cost:** if Flow's limits block a shot, that section uses the coded Figma animation (the CSS/GSAP snap from the Scroll keyframes v2 page) instead of film. B's design works without film.
