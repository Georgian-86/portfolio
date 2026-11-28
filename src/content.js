// All site copy lives here. Unknown facts are the string 'TBC' and render as a visible TBC chip.
// Honesty rules (docs/REDESIGN.md §3.4): no invented metrics, demos are labelled "Sample".

export const brand = {
  name: 'Golu',
  fullName: 'Golu Kumar',
  role: 'AI agents · automations · websites · apps',
  replyTime: 'TBC',
  // Placeholder contact details: replace before launch.
  whatsapp: '910000000000', // digits only, international format
  email: 'TBC',
  calendly: 'TBC',
  linkedin: 'TBC',
  github: 'TBC',
  cv: 'TBC',
  ctaLabel: 'WhatsApp me',
  barPlaceholder: 'Message Golu',
  barLabel: 'Message Golu · opens WhatsApp',
  defaultMessage: 'Hi Golu, I found your website.',
};

export const hero = {
  kicker: 'Golu Kumar — independent developer',
  // One line on screen at a time, revealed in sequence across the pinned scroll.
  // {word} marks the interactive / highlighted word of the line.
  lines: [
    'Every business runs on a little {chaos}.',
    'I build the systems that {untangle} it.',
    'AI agents · automations · websites · apps.',
  ],
  secondaryCta: 'Book a call',
  film: { name: 'hero', desktop: 188, mobile: 190, intro: 0.382 }, // autoplays to 38.2% after the loader
  scrollCue: 'Scroll',
};

export const services = {
  kicker: '01 — What I build',
  h2: 'Three kinds of systems.',
  groups: [
    {
      id: 'grow', n: '01', title: 'Grow', line: 'Get found. Turn visits into enquiries.',
      items: ['Websites', 'Shopify', 'WordPress', 'SEO & AI search'],
    },
    {
      id: 'automate', n: '02', title: 'Automate', line: 'Answer every message. Stop copy-pasting.',
      items: ['AI agents', 'WhatsApp agents', 'Automations'],
    },
    {
      id: 'ship', n: '03', title: 'Ship', line: 'Apps and infrastructure that stay up.',
      items: ['App development', 'DevOps support'],
    },
  ],
};

export const whatsapp = {
  kicker: '02 — WhatsApp agents',
  h2: 'The 11:42 PM call gets answered.',
  body: 'A WhatsApp agent that replies in seconds, in your tone, checks your calendar and books the slot.',
  film: { name: 'night', desktop: 190, mobile: 188 },
  pick: 'Pick a business',
  tag: 'Sample conversation',
  // Owner to confirm the three industries (docs/research/…brand-strategy.md §6).
  demos: [
    {
      id: 'salon', label: 'Salon', name: 'Glow Salon · agent',
      ask: 'Hi! Any slot for a haircut on Tuesday, after 6?',
      reply: 'Yes! 6:30 PM is free with Meera. Shall I book it?',
      booked: 'Booked · Tue · 6:30 PM', note: 'Reminder set',
    },
    {
      id: 'clinic', label: 'Clinic', name: 'City Dental · agent',
      ask: 'Tooth pain since morning. Can I see a doctor today?',
      reply: 'Sorry to hear that. Dr Rao has 7:15 PM today. Booking it now.',
      booked: 'Booked · Today · 7:15 PM', note: 'Clinic notified',
    },
    {
      id: 'store', label: 'Store', name: 'Kiran Store · agent',
      ask: 'Is the blue kurta in size M back in stock?',
      reply: 'It is! 3 left. Want me to hold one and send a payment link?',
      booked: 'Held · Kurta · M', note: 'Payment link sent',
    },
  ],
  cta: 'Get an agent like this',
  ctaMessage: 'Hi Golu, I’d like a WhatsApp agent for my business.',
};

export const automations = {
  kicker: '03 — Automations',
  h2: 'The messy sheet runs itself.',
  body: 'One order comes in. Everything after it happens on its own.',
  film: { name: 'sheet', desktop: 161, mobile: 106 },
  flow: [
    { k: 'IN', title: 'New order', text: 'Store or form' },
    { k: 'DOC', title: 'Invoice sent', text: 'PDF on WhatsApp' },
    { k: 'CRM', title: 'CRM updated', text: 'No copy-paste' },
    { k: 'YOU', title: 'You’re told', text: 'One-line summary' },
  ],
  tag: 'Sample flow · illustrative',
};

export const work = {
  kicker: '04 — Selected work',
  h2: 'Things I’ve built.',
  modes: [['stage', 'Stage'], ['list', 'List']],
  projects: [
    {
      id: 'stepq', ch: '01', name: 'StepQ', credit: 'Client project · Website + iOS + Android',
      year: 'TBC', kind: 'Website · iOS · Android', tone: 'note',
      blurb: 'A walking-rewards app for India, fronted by a mascot called Piko. I built the website and both mobile apps.',
    },
    {
      id: 'teachgenie', ch: '02', name: 'TeachGenie.ai', credit: 'Founding team', role: 'TBC',
      year: 'TBC', kind: 'AI product', tone: 'signal',
      blurb: 'An AI teaching assistant: lesson plans, slides and quizzes in a couple of minutes.',
    },
    {
      id: 'brivia', ch: '03', name: 'Brivia Club', credit: 'Founding team', role: 'TBC',
      year: 'TBC', kind: 'Networking platform', tone: 'night',
      blurb: 'A networking platform for builders. Swipe. Match. Build.',
    },
    {
      id: 'automations', ch: '04', name: 'Business automations', credit: 'Client work · examples TBC',
      year: 'TBC', kind: 'Automations', tone: 'paper',
      blurb: 'DMs logged to a CRM, invoices sent the moment an order is paid, follow-ups booked automatically.',
    },
  ],
  shot: 'Screenshot TBC',
  ask: 'Ask about it',
};

export const process = {
  kicker: '05 — How I work',
  h2: 'Four steps. No surprises.',
  steps: [
    { n: '01', title: 'Listen', text: 'A call about what’s tangled. You talk, I take notes.' },
    { n: '02', title: 'Map', text: 'A written plan: scope, price and timeline, before I start.' },
    { n: '03', title: 'Build', text: 'Weekly plain-English updates and something you can click.' },
    { n: '04', title: 'Hand over', text: 'You own everything. I show your team how it runs.' },
  ],
};

export const about = {
  kicker: '06 — About',
  h2: 'Hi, I’m Golu.',
  body: 'I’m an independent developer. I build AI agents, automations, websites and apps for businesses that want more leads and less manual work, and I’ve been on the founding team of two products.',
  links: [['CV', 'cv'], ['LinkedIn', 'linkedin'], ['GitHub', 'github']],
  built: {
    title: 'How this site is built',
    rows: [
      ['Stack', 'Vite · vanilla JS · GSAP · Lenis · three.js'],
      ['Films', 'AI-generated, scrubbed frame by frame on a canvas'],
      ['Budget', 'First screen under 2 MB on mobile, 60 fps target'],
      ['Tests', 'Playwright: no jumps, no stalls, reduced motion, 320–1920 px'],
      ['Honesty', 'Demos say “Sample”. Unknowns say TBC.'],
    ],
  },
};

export const contact = {
  kicker: '07 — Contact',
  h2: 'Let’s build yours.',
  body: 'Tell me what’s tangled. I’ll reply with a plan, in plain English.',
  book: 'Book a call',
  email: 'Email',
  foot: '© 2026 Golu Kumar · Independent developer',
};

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const menu = [
  { n: '01', label: 'What I build', href: '#services' },
  { n: '02', label: 'WhatsApp agents', href: '#whatsapp' },
  { n: '03', label: 'Automations', href: '#automations' },
  { n: '04', label: 'Selected work', href: '#work' },
  { n: '05', label: 'How I work', href: '#process' },
  { n: '06', label: 'About', href: '#about' },
  { n: '07', label: 'Contact', href: '#contact' },
];

export const waLink = (text = brand.defaultMessage) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

// Calendly is TBC: until it is set, "Book a call" opens WhatsApp asking for a call.
export const bookLink = () =>
  brand.calendly === 'TBC' ? waLink('Hi Golu, I’d like to book a call.') : brand.calendly;
