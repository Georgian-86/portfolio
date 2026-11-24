# Google Flow → scroll animation

The site is built so a cinematic clip from **Google Flow (Veo 3.1)** can play frame by frame as the visitor scrolls, before the real, interactive book takes over. The page text stays as HTML so it remains readable, clickable and indexable by search engines.

```
scroll ─▶ [ Flow clip, scrubbed frame by frame ] ─▶ crossfade ─▶ [ interactive CSS book: pages turn on scroll ]
```

## 1. Make the clip in Flow
1. Generate **ingredients** first (an image of the closed book on a desk, in the site palette). Use Nano Banana / Imagen inside Flow, or Higgsfield Soul Cinema.
2. Use **Frame to Video**:
   - **First frame:** a wide shot, e.g. a dim study, warm lamp, the book on a dark desk.
   - **Last frame:** *must match the site's starting state*: the closed bottle-green book, centred, front-on, on a near-black (#15120E) background. Take a screenshot of the site's first screen and use it as the last frame so the handoff is seamless.
3. Camera control: slow dolly-in plus a slight tilt-down. 6–8 s. No people (Flow restricts realistic people) and no on-screen text.

**Prompt starter**
> Cinematic slow dolly-in across a dark walnut desk at night, a single warm brass desk lamp, dust in the light beam, toward a closed bottle-green cloth-bound book with a gold foil monogram. Shallow depth of field, 35mm anamorphic, film grain, muted ink-black and warm paper tones, ends perfectly front-on and centred on the book cover.

Palette to quote in prompts: ink `#15120E`, paper `#F2ECE1`, cloth green `#1F3B31`, brass `#C9A66B`, vermilion accent `#C2412B`.

## 2. Export frames
Download the MP4 from Flow, then (needs ffmpeg):

```bash
mkdir -p public/flow/book
```
```bash
ffmpeg -i flow-book.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/flow/book/frame_%04d.webp
```

Aim for 100–150 frames at 60–120 KB each. Use a 1080-wide export for mobile if the total size is large.

## 3. Switch it on
In `src/config.js`:

```js
export const flow = { frames: 144, path: '/flow/book/frame_', pad: 4, ext: 'webp' };
```

The clip scrubs for the first part of the pinned scroll, fades out, and the CSS book (already in the same position) rises and opens.

## Using your design inspiration
Send the inspiration (link, video or screenshots). Each moment in it gets one of two treatments:
- **Flow clip:** cinematic, photographic moments (camera moves, lighting, materials). These are scrubbed as frames.
- **Code:** anything with your real content (page turns, text, links, work images). This stays as interactive HTML and GSAP so it's sharp, accessible and editable.
