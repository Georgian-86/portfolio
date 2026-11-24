# NEXORA Studio — 3D Freelance Portfolio

An immersive, scroll-driven 3D portfolio for a freelance studio offering AI agents, WhatsApp agents, automations, websites, Shopify, WordPress, app development, DevOps and SEO.

**Stack:** Three.js (liquid-glass core with physical materials, bloom, film grain) · GSAP ScrollTrigger · Lenis smooth scroll · Vite.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
```

## Make it yours

Edit **`src/config.js`**: brand name, WhatsApp number, email, Calendly link, services, blueprints and process. All site content is generated from it.

| File | What it controls |
|---|---|
| `src/scene.js` | The 3D world: liquid-glass core shader, chrome rings, shards, particles, post-processing |
| `src/main.js` | Scroll choreography (`poses`), section animations, WhatsApp demo, cursor and magnetic buttons |
| `src/style.css` | Design tokens (colours, fonts) and layout |
| `docs/STRATEGY.md` | Research, missing services, the full workflow, tools, connectors and skills |

## Sections
1. Hero: liquid-glass core with a cinematic intro
2. Manifesto: words light up on scroll
3. Services: pinned horizontal 3D card carousel; the scene re-tints for each service
4. Live demo: a pinned WhatsApp agent conversation played by scroll
5. Blueprints: productised offers
6. Process: five steps with a line that draws on scroll
7. Stack marquee whose speed follows scroll velocity, plus add-on services
8. Contact: WhatsApp and booking CTAs

Includes a reduced-motion fallback, a low-power mode for mobile and low-core devices, and a fallback for browsers without WebGL.

## Deploy
Import the repo in Vercel (framework: Vite). No environment variables needed.
