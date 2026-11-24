# Portfolio Strategy, Workflow & Toolkit

Research notes and a step-by-step playbook for turning this repo into a portfolio that sells the services. Researched November 2026.

---

## 1. Design direction (v2 — "The Book")

The first version (neon, rotating 3D glass) was dropped: that look has become common. v2 is editorial and slower.

| Principle | How it's applied |
|---|---|
| **Concept over effect** | The portfolio *is* a book. The cover opens on scroll, and each spread is one project: story on the left, visual on the right |
| **Golden-ratio type scale** | Every font size is `base × φⁿ` (≈ 10 / 16 / 26 / 42 / 68 / 110 / 178 px). Spacing uses the same steps. Inside the book the scale is relative to the page width, so it stays φ at any size |
| **Golden proportions** | The open spread is a golden rectangle (φ : 1); section layouts use a `1fr : 1.618fr` grid |
| **Restrained palette** | Ink `#15120E`, paper `#F2ECE1`, cloth green `#1F3B31`, brass `#C9A66B`, a single vermilion accent `#C2412B` |
| **Type pairing** | Cormorant Garamond (display, editorial) + Inter (text) + IBM Plex Mono (folios and labels) |
| **Motion with meaning** | Only the page turn, the book rising and content settling on the page. No decorative spinning |
| **Cinematic layer from Google Flow** | Optional scroll-scrubbed Flow clip before the book; see `docs/FLOW.md` |

## 2. Services: what you have and what's missing

**You offer now:** AI Agents · WhatsApp Agents · Automations · Websites · Shopify · WordPress · DevOps · App Dev · SEO

### Gaps worth adding (ranked by demand and how well they fit your current services)

| # | Service | Why add it |
|---|---|---|
| 1 | **Voice AI agents** (inbound/outbound calls) | Comes after WhatsApp agents. Clinics, real estate and restaurants want phones answered. Tools: ElevenLabs Agents, Vapi, Retell, Twilio |
| 2 | **CRM setup & integration** (HubSpot, Zoho, GoHighLevel, Pipedrive) | Every agent and automation ends up in a CRM. Sell it as its own line item |
| 3 | **AEO / GEO (AI search visibility)** | Clients now ask "why doesn't ChatGPT recommend us?" It's already folded into your SEO card; market it loudly |
| 4 | **Brand identity + UI/UX design** | You build sites and apps but don't list design. Clients pay more for design + build together |
| 5 | **AI video ads & UGC content** (Higgsfield, Google Flow/Veo, Kling, Seedance) | Shopify clients need ad creatives. You'll already use these tools for your own portfolio |
| 6 | **Email/SMS marketing automation** (Klaviyo, Mailchimp) | A natural Shopify upsell with monthly recurring revenue |
| 7 | **Instagram & Messenger DM bots** | Same engine as WhatsApp. Sell it as "omnichannel agent" |
| 8 | **Analytics, tracking & CRO** (GA4, GTM, Meta CAPI, Hotjar) | Lets you prove ROI and opens performance retainers |
| 9 | **Care / maintenance plans** | Monthly recurring revenue: hosting, uptime, updates, backups, small changes |
| 10 | **Custom dashboards & internal tools** (Supabase, Retool) | Owners love seeing their numbers in one place |
| 11 | **Payment gateways & checkout** (Stripe, Razorpay, UPI) | Small fixed-price add-on that often blocks launches |
| 12 | **Security & compliance basics** (SSL, backups, GDPR/DPDP cookie consent) | Bundle it into the DevOps and care plans |

Optional later: paid ads management (Meta/Google), chatbot training data and fine-tuning, Web3. Only add these if a client asks.

**Packaging tip:** sell **outcomes**, not services. The site already has four "Blueprints" (Lead-to-Booking Agent, Store Growth Engine, Immersive Launch Site, Ship-Daily Pipeline). Price them as fixed packages with optional monthly retainers.

---

## 3. The workflow (idea → launched portfolio)

```
 RESEARCH ─▶ BRAND ─▶ DESIGN ─▶ VISUAL ASSETS ─▶ BUILD ─▶ CONTENT/SEO ─▶ LAUNCH ─▶ GROW
 Firecrawl   Canva/   Stitch →   Higgsfield /    Claude    searchfit     Vercel    Notion CRM,
 Awwwards    Figma    Figma      Flow / Blender  Code      SEO skills    + domain  Gmail, Sheets
```

### Step 1 — Research and positioning (1 day)
- Browse **Awwwards → Three.js / Scrolling / Portfolio** and **curated.design** for references. Save 10 you love.
- Look up 5 competing freelancers and agencies with Firecrawl and note their pricing, positioning and gaps.
- Decide on **one niche headline** (for example "AI + WhatsApp systems for D2C brands"). Niche portfolios convert better than "I do everything".
- Skills: `marketing:competitive-brief`, `product-management:brainstorm`, `searchfit-seo:competitor-analyzer`.

### Step 2 — Brand (1 day)
- Name, logo, palette and type. This repo uses violet → cyan → lime on near-black, with Inter Tight and Instrument Serif.
- **Canva** connector: logo variations, brand kit, social templates.
- **Figma** connector: lock design tokens (colours, type scale) as variables.
- Skill: `marketing:brand-review`, `design:design-system`.

### Step 3 — UI design (1–2 days)
- **Google Stitch** (free, about 350 generations a month): prompt the full multi-screen layout, export React/Tailwind or paste into Figma with the official Stitch-to-Figma plugin (Sep 2026).
- Polish in **Figma**, then hand off with the `figma:figma-design-to-code` skill or Figma MCP `get_design_context`.
- For motion specs: `figma:figma-use-motion` and `figma:figma-implement-motion`.

### Step 4 — Visual assets: the hyper-realistic layer (2–3 days)
| Asset | Tool | How |
|---|---|---|
| Hero stills / mood frames | **Higgsfield Soul Cinema / Soul 2.0**, Nano Banana Pro, GPT Image | Cinematic keyframes in your palette (Soul HEX keeps colours consistent) |
| Hero background video loop | **Higgsfield** (Seedance 2.5, Kling 4.0, Veo 3.1), **Cinema Studio 4.0** for camera moves | 8–10 s seamless loop; first/last frame set to the same image |
| Product-style 3D shots of "your services" | **Google Flow (Veo 3.1)**: Ingredients-to-Video, Frame-to-Video, camera controls | Keep consistent "ingredients" (logo object, glass core) across clips |
| Real 3D models (GLB) | Higgsfield `generate_3d` / Scene Builder 3D, or Blender, Spline, Meshy | Export `.glb` with Draco compression; load into Three.js with `GLTFLoader` |
| Voice-over / sound design | **ElevenLabs** connector | Hover sounds and a short ambient track (keep them off by default) |
| Case-study mockups | Higgsfield Marketing Studio, Canva | Phone and laptop mockups of client work |

> Note: Flow output carries a SynthID watermark, and depictions of real people are restricted. Use the clips for abstract and product shots.

### Step 5 — Build (this repo)
- Claude Code + Three.js + GSAP + Lenis (done).
- Next upgrades: real project images/videos on each spread, a Flow intro clip (`docs/FLOW.md`), and a case-study page per project.
- Skills: `engineering:code-review`, `run`, `design:accessibility-review`.

### Step 6 — Content & SEO (ongoing)
- One service page per service (`/services/whatsapp-agents`), each targeting a keyword cluster.
- Skills: `searchfit-seo:keyword-clustering`, `searchfit-seo:schema-markup`, `searchfit-seo:on-page-seo`, `searchfit-seo:ai-visibility` (AEO/GEO), `marketing:content-creation`.
- Add **case studies with real numbers only**. The Blueprint KPIs on the site describe capabilities (for example "< 5s first reply"), not invented client results. Keep it that way until you have real data.

### Step 7 — Launch
- **Vercel** connector: import the GitHub repo, attach the domain, turn on Web Analytics and Speed Insights.
- Lighthouse goal: Performance 80+ on mobile even with WebGL. Use `this.low`, reduce particles, and lazy-init the scene below the fold if needed.
- Submit to **Awwwards, CSS Design Awards, Godly, Land-book, One Page Love**. An award badge works as social proof.

### Step 8 — Grow (lead engine)
- WhatsApp click → your own **WhatsApp agent**, so prospects try the product while they talk to you.
- **Supabase** for a contact form table → **Gmail** auto-reply → **Notion** or **Google Sheets** CRM.
- Weekly content: short-form clips made with Higgsfield, cut-downs of the site's 3D scenes, build-in-public posts.
- Skills: `marketing:campaign-plan`, `marketing:email-sequence`, `marketing:draft-content`.

---

## 4. Connectors in your Claude workspace and what each is for

| Connector | Use for this portfolio |
|---|---|
| **Higgsfield** | Cinematic hero images and videos, 3D models, AI ads (also a service you can resell) |
| **Figma** | Design system, page layouts, motion specs, design-to-code |
| **Canva** | Logo, brand kit, social posts, pitch decks, proposals |
| **ElevenLabs** | Voice for demos, and **voice AI agents** you can sell (it has a WhatsApp channel too) |
| **Vercel** | Hosting, domains, analytics, preview deploys |
| **Supabase** | Contact form DB, lead storage, agent memory for demos |
| **GitHub** | Source control; repo `georgian-86/portfolio` |
| **Firecrawl** | Competitor research and scraping inspiration sites |
| **Notion** | CRM, project board, proposal templates, client wiki |
| **Gmail / Google Drive / Sheets** | Lead replies, proposals, simple CRM |
| **Postman** | Test the WhatsApp Cloud API / agent webhooks you build for clients |
| **Apify** | Lead-gen scraping (Google Maps businesses without websites → outreach) |

Two connectors in this session didn't connect: **Wix** and **HubSpot** (proxy-blocked), and **ActiveCampaign** (invalid configuration). Reconnect them in claude.ai connector settings if you want CRM/Wix workflows.

**Worth adding:** Calendly or Cal.com (booking), Stripe (deposits), Slack (client comms), Meta / WhatsApp Business (your own agent).

---

## 5. Higgsfield / Flow prompt starters (in the site's style)

**Hero loop (Higgsfield Seedance 2.5 / Kling 4.0, 16:9, 8s, seamless):**
> Macro shot of a floating liquid-glass sphere with iridescent violet and cyan refractions, a glowing knot of light pulsing inside, thin chrome orbit rings slowly rotating, tiny particles drifting, pitch-black studio, anamorphic lens, shallow depth of field, slow dolly-in, ultra-realistic, 8K, seamless loop.

**Service icons as 3D objects (Soul Cinema / Nano Banana Pro, 1:1):**
> A [WhatsApp speech bubble / gear cog / shopping bag / server rack / rocket] sculpted from frosted iridescent glass and brushed chrome, floating on black, violet rim light, cyan fill light, studio product photography, 85mm, hyper-real.

**Google Flow scene (Frame-to-Video):** first frame = sphere closed, last frame = sphere opening into 9 glowing shards (one per service). Camera: slow orbit.

---

## 6. 30-day launch checklist

- [ ] Fill in `src/config.js` (brand, WhatsApp number, email, Calendly)
- [ ] Generate a hero video loop and 9 service renders in Higgsfield
- [ ] Generate the Flow intro clip and export frames (docs/FLOW.md)
- [ ] Add 2–3 real case studies (even small or unpaid ones, with honest metrics)
- [ ] Add a testimonial strip once you have quotes
- [ ] Connect a Supabase contact form and WhatsApp agent
- [ ] Deploy to Vercel with a custom domain and analytics
- [ ] Add service landing pages for SEO
- [ ] Submit to Awwwards and other galleries
- [ ] Post one build-in-public clip per week
