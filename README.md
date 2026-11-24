# Nexora — Selected Works

A portfolio presented as a book. On scroll, a cloth-bound volume rises from the desk and opens; every page turn reveals one project: the story on the left, the work on the right. After the book come services, process and contact, set on paper.

**Design:** golden-ratio type scale (`base × φⁿ`), a golden-rectangle spread, and an ink, paper, bottle-green, brass and vermilion palette. Fonts are Cormorant Garamond, Inter and IBM Plex Mono.
**Stack:** GSAP ScrollTrigger, Lenis and Vite. No WebGL; the book is CSS 3D.

## Run
```bash
npm install
```
```bash
npm run dev
```

## Make it yours
- **`src/config.js`**: brand, contact, **works** (one spread each), services and process.
  - Add real media by putting files in `public/works/` and setting `image: '/works/x.jpg'` or `video: '/works/x.mp4'`.
  - Works marked `sample: true` print a "Sample" mark. Replace them with real projects and delete the flag.
- **`docs/FLOW.md`**: how to add a Google Flow clip that plays on scroll before the book opens.
- **`docs/STRATEGY.md`**: design principles, service gaps, workflow and tools.

| File | Role |
|---|---|
| `src/main.js` | Builds the book, page-turn timeline, contents links, folio counter, section reveals |
| `src/mockups.js` | Designed placeholder plates for works without images |
| `src/sequence.js` | Scroll-scrubbed frame player for Flow clips |
| `src/style.css` | Tokens (φ type scale, palette), book geometry, pages, sections |

The book shows full spreads on desktop. On phones it reads one page at a time.
