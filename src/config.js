// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to make the portfolio yours.
//  Everything visible on the site (brand, contact, services,
//  blueprints) is driven from here.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'NEXORA',             // your studio / personal brand
  suffix: 'Studio',
  tagline: 'AI systems, automations & digital products — engineered to sell while you sleep.',
  whatsapp: '910000000000',   // international format, digits only (e.g. 919876543210)
  email: 'hello@example.com',
  calendly: 'https://calendly.com/your-handle/discovery',
  location: 'Remote · Worldwide',
  socials: {
    LinkedIn: 'https://www.linkedin.com/',
    GitHub: 'https://github.com/',
    Instagram: 'https://www.instagram.com/',
    X: 'https://x.com/',
  },
};

// Core services. `hue` tints the 3D scene while the card is in view.
export const services = [
  {
    id: '01', title: 'AI Agents', hue: 0.72,
    line: 'Autonomous agents that research, decide and act inside your tools.',
    bullets: ['Sales & support agents', 'RAG knowledge bases', 'Tool-calling + MCP', 'Human-in-the-loop'],
    stack: ['Claude', 'OpenAI', 'LangGraph', 'MCP'],
  },
  {
    id: '02', title: 'WhatsApp Agents', hue: 0.38,
    line: 'A 24/7 salesperson inside the app your customers already open 50× a day.',
    bullets: ['Lead capture & qualification', 'Catalog + payments', 'Bookings & reminders', 'CRM sync'],
    stack: ['WhatsApp Cloud API', 'Twilio', 'Interakt', 'n8n'],
  },
  {
    id: '03', title: 'Automations', hue: 0.08,
    line: 'Kill the copy-paste. Workflows that move data and money on their own.',
    bullets: ['Lead → CRM → invoice', 'Reporting on autopilot', 'Email / SMS flows', 'Ops & HR pipelines'],
    stack: ['n8n', 'Make', 'Zapier', 'Supabase'],
  },
  {
    id: '04', title: 'Websites', hue: 0.6,
    line: 'Immersive, lightning-fast sites built to convert — like the one you are on.',
    bullets: ['3D / WebGL experiences', 'Next.js & headless', 'Framer / Webflow', 'Core Web Vitals 95+'],
    stack: ['Next.js', 'Three.js', 'GSAP', 'Vercel'],
  },
  {
    id: '05', title: 'Shopify', hue: 0.33,
    line: 'Stores that look premium and scale from first sale to seven figures.',
    bullets: ['Custom themes (OS 2.0)', 'Headless Hydrogen', 'Apps & checkout UX', 'CRO audits'],
    stack: ['Shopify', 'Liquid', 'Hydrogen', 'Klaviyo'],
  },
  {
    id: '06', title: 'WordPress', hue: 0.55,
    line: 'Custom WordPress & WooCommerce without the plugin spaghetti.',
    bullets: ['Custom themes & blocks', 'WooCommerce', 'Speed & security hardening', 'Migrations'],
    stack: ['WordPress', 'WooCommerce', 'ACF', 'Elementor'],
  },
  {
    id: '07', title: 'App Development', hue: 0.8,
    line: 'iOS, Android and web apps — from MVP to App Store launch.',
    bullets: ['Cross-platform apps', 'SaaS MVPs', 'Admin dashboards', 'Payments & auth'],
    stack: ['React Native', 'Flutter', 'Expo', 'Firebase'],
  },
  {
    id: '08', title: 'DevOps Support', hue: 0.5,
    line: 'Ship daily, sleep nightly. CI/CD, cloud and monitoring done right.',
    bullets: ['CI/CD pipelines', 'Docker & Kubernetes', 'AWS / GCP / Vercel', 'Monitoring & uptime'],
    stack: ['GitHub Actions', 'Docker', 'AWS', 'Terraform'],
  },
  {
    id: '09', title: 'SEO + AI Search', hue: 0.15,
    line: 'Rank on Google — and get recommended by ChatGPT, Gemini and Perplexity.',
    bullets: ['Technical SEO', 'Content & schema', 'Local SEO / GBP', 'AEO / GEO visibility'],
    stack: ['Search Console', 'Ahrefs', 'Schema.org', 'GA4'],
  },
];

// Recommended add-ons (the "what's left" gaps — see docs/STRATEGY.md)
export const addons = [
  'Voice AI calling agents', 'CRM setup & integrations', 'Brand identity & UI/UX',
  'AI video ads & UGC', 'Analytics & CRO', 'Email / SMS marketing',
  'Instagram & Messenger bots', 'Monthly care plans', 'Custom dashboards',
];

// Productised offers. Capabilities — not invented client results.
export const blueprints = [
  {
    tag: 'WhatsApp · AI',
    title: 'Lead-to-Booking Agent',
    text: 'Replies in seconds, qualifies the lead, answers FAQs from your docs, books the call and pushes everything to your CRM.',
    kpi: ['< 5s', 'first reply'],
  },
  {
    tag: 'Shopify · Automation',
    title: 'Store Growth Engine',
    text: 'Premium theme, abandoned-cart WhatsApp + email flows, review automation and a weekly revenue report in your inbox.',
    kpi: ['24/7', 'recovery flows'],
  },
  {
    tag: 'Web · 3D',
    title: 'Immersive Launch Site',
    text: 'Scroll-driven WebGL storytelling, AI-generated cinematic visuals, SEO foundations and analytics from day one.',
    kpi: ['95+', 'Lighthouse target'],
  },
  {
    tag: 'DevOps · Cloud',
    title: 'Ship-Daily Pipeline',
    text: 'Preview deploys on every PR, automated tests, zero-downtime releases, alerts to Slack/WhatsApp when anything breaks.',
    kpi: ['1-click', 'rollbacks'],
  },
];

export const process = [
  { k: 'Discover', t: '30-min call. We map your funnel, bottlenecks and the one system that pays for itself first.' },
  { k: 'Design', t: 'Flows, UI and architecture in Figma / Stitch. You see it before a line of code is written.' },
  { k: 'Build', t: 'Weekly sprints with live preview links. Agents tested on real conversations.' },
  { k: 'Launch', t: 'Deploy, connect your tools, train your team. Measured against agreed KPIs.' },
  { k: 'Scale', t: 'Care plan: monitoring, iterations, new automations as you grow.' },
];

export const stackMarquee = [
  'Claude', 'OpenAI', 'n8n', 'Make', 'WhatsApp API', 'Shopify', 'WordPress', 'Next.js', 'Three.js',
  'React Native', 'Flutter', 'Supabase', 'Firebase', 'AWS', 'Docker', 'Vercel', 'Stripe', 'Razorpay',
  'HubSpot', 'Figma', 'Higgsfield', 'Google Flow', 'Stitch', 'ElevenLabs',
];
