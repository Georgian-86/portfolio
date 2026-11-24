// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to make the portfolio yours.
//  Brand, contact, works (the pages of the book), services and
//  process are all rendered from here.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'Nexora',
  monogram: 'N',
  volume: 'Vol. I',
  whatsapp: '910000000000',   // international format, digits only
  email: 'hello@example.com',
  calendly: 'https://calendly.com/your-handle/discovery',
  location: 'Remote — Worldwide',
  foreword:
    'I design and build the quiet machinery behind growing businesses — websites that feel considered, stores that sell, and AI agents and automations that answer every customer and move every order without anyone lifting a finger.',
  signature: 'The Studio',
  socials: {
    LinkedIn: 'https://www.linkedin.com/',
    GitHub: 'https://github.com/',
    Instagram: 'https://www.instagram.com/',
  },
};

// ── The book's pages ─────────────────────────────────────────
// One spread per work: left page = the story, right page = the visual.
// `image` / `video`: put files in /public/works/ and reference them as
//   '/works/my-project.jpg' or '/works/my-project.mp4'.
// Without media, a designed mock-up is drawn using `mock` + `tone`:
//   mock: 'store' | 'chat' | 'flow' | 'web' | 'app' | 'terminal'
// `sample: true` prints a small "Sample" mark on the page —
//   replace these entries with your real projects and delete the flag.
export const works = [
  {
    sample: true,
    title: 'Shopify Storefront',
    category: 'E-commerce',
    year: '2026',
    client: 'Replace with client name',
    summary: 'A premium Shopify OS 2.0 theme with a calm product story, fast collection filtering and a checkout tuned for mobile.',
    role: 'Design · Theme dev · CRO',
    stack: 'Shopify, Liquid, Klaviyo',
    outcome: 'Add your measured result',
    link: '',
    mock: 'store', tone: '#C2412B',
  },
  {
    sample: true,
    title: 'WhatsApp Concierge',
    category: 'AI Agent',
    year: '2026',
    client: 'Replace with client name',
    summary: 'An AI agent on WhatsApp that answers from the business’s own documents, qualifies every enquiry and books the appointment.',
    role: 'Agent design · Integration',
    stack: 'WhatsApp Cloud API, Claude, n8n',
    outcome: 'Add your measured result',
    link: '',
    mock: 'chat', tone: '#1F3B31',
  },
  {
    sample: true,
    title: 'Lead-to-Invoice Pipeline',
    category: 'Automation',
    year: '2025',
    client: 'Replace with client name',
    summary: 'Form, CRM, proposal, invoice and Slack alert — one workflow that replaced four hours of copy-paste a day.',
    role: 'Systems design · Build',
    stack: 'n8n, HubSpot, Stripe',
    outcome: 'Add your measured result',
    link: '',
    mock: 'flow', tone: '#B08A4E',
  },
  {
    sample: true,
    title: 'Brand Website',
    category: 'Web Design',
    year: '2025',
    client: 'Replace with client name',
    summary: 'An editorial, scroll-told website with motion that serves the content, built to score 95+ on Core Web Vitals.',
    role: 'Art direction · Development',
    stack: 'Next.js, GSAP, Vercel',
    outcome: 'Add your measured result',
    link: '',
    mock: 'web', tone: '#2E3A59',
  },
  {
    sample: true,
    title: 'Booking App',
    category: 'App Development',
    year: '2025',
    client: 'Replace with client name',
    summary: 'A cross-platform iOS and Android app for bookings, payments and reminders, shipped from MVP to store in weeks.',
    role: 'Product · Mobile dev',
    stack: 'React Native, Supabase, Razorpay',
    outcome: 'Add your measured result',
    link: '',
    mock: 'app', tone: '#6B3E5E',
  },
  {
    sample: true,
    title: 'Ship-Daily Infrastructure',
    category: 'DevOps',
    year: '2024',
    client: 'Replace with client name',
    summary: 'Preview deploys on every pull request, automated tests and one-click rollbacks — releases went from monthly to daily.',
    role: 'DevOps · Cloud',
    stack: 'GitHub Actions, Docker, AWS',
    outcome: 'Add your measured result',
    link: '',
    mock: 'terminal', tone: '#3F4A3C',
  },
];

export const services = [
  { title: 'AI Agents', line: 'Agents that research, decide and act inside your tools.', tags: ['Claude', 'OpenAI', 'MCP', 'RAG'] },
  { title: 'WhatsApp Agents', line: 'A salesperson in the app your customers already open.', tags: ['Cloud API', 'Catalogs', 'Bookings'] },
  { title: 'Automations', line: 'Workflows that move data and money on their own.', tags: ['n8n', 'Make', 'Zapier'] },
  { title: 'Websites', line: 'Considered, fast, editorial websites that convert.', tags: ['Next.js', 'Webflow', 'Framer'] },
  { title: 'Shopify', line: 'Stores that look premium and scale with you.', tags: ['Themes', 'Hydrogen', 'Apps'] },
  { title: 'WordPress', line: 'Custom WordPress and WooCommerce, without the bloat.', tags: ['Blocks', 'WooCommerce', 'Speed'] },
  { title: 'App Development', line: 'iOS, Android and web apps, from MVP to launch.', tags: ['React Native', 'Flutter'] },
  { title: 'DevOps', line: 'CI/CD, cloud and monitoring so you can ship daily.', tags: ['AWS', 'Docker', 'Actions'] },
  { title: 'SEO & AI Search', line: 'Rank on Google and get recommended by AI assistants.', tags: ['Technical', 'Schema', 'AEO'] },
];

export const process = [
  { k: 'Listen', t: 'A thirty-minute call to map your funnel and find the one system that pays for itself first.' },
  { k: 'Draft', t: 'Flows, interface and architecture you can see and comment on before code is written.' },
  { k: 'Build', t: 'Weekly sprints with live preview links. Agents tested on real conversations.' },
  { k: 'Launch', t: 'Deploy, connect your tools, train your team and measure against agreed numbers.' },
  { k: 'Tend', t: 'A care plan: monitoring, improvements and new automations as you grow.' },
];

// Optional: a Google Flow clip, exported as frames, that plays on scroll
// before the book opens. See docs/FLOW.md. Leave frames at 0 to skip.
export const flow = {
  frames: 0,                     // e.g. 120
  path: '/flow/book/frame_',     // files: /public/flow/book/frame_0001.webp …
  pad: 4,
  ext: 'webp',
};
