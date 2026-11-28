// All site copy lives here. Unknown facts are the string 'TBC' and render as a visible TBC chip.
// Honesty rules (docs/REDESIGN.md §3.4): no invented metrics, demos are labelled "Sample".

export const brand = {
  name: 'Golu',
  fullName: 'Golu Kumar',
  role: 'AI agents, automations, websites and apps',
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
  barLabel: 'Message Golu, opens WhatsApp',
  defaultMessage: 'Hi Golu, I found your website.',
};

export const hero = {
  kicker: 'Golu Kumar, independent developer',
  // One line on screen at a time, revealed in sequence across the pinned scroll.
  // {word} marks the interactive / highlighted word of the line.
  lines: [
    'Every business runs on a little {chaos}.',
    'I build the systems that {untangle} it.',
    'AI agents, automations, websites and apps.',
  ],
  secondaryCta: 'Book a call',
  film: { name: 'hero', desktop: 188, mobile: 190, intro: 0.382 }, // autoplays to 38.2% after the loader
  scrollCue: 'Scroll',
};

export const services = {
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
  h2: 'The 11:42 PM call gets answered.',
  body: 'At 11:42 pm a customer calls and nobody picks up. My agent replies in seconds, in your tone, and books the slot.',
  pick: 'Pick a business',
  tag: 'Sample conversation',
  // Owner to confirm the three industries (docs/research/…brand-strategy.md §6).
  demos: [
    {
      id: 'salon', label: 'Salon', name: 'Glow Salon',
      ask: 'Hi, I just tried calling. Any slot tomorrow evening?',
      reply: 'Sorry we missed you! 6:30 or 7:15 pm tomorrow are free. Which one?',
      follow: '6:30 please', booked: 'Booked for Wed, 6:30 pm',
    },
    {
      id: 'clinic', label: 'Clinic', name: 'City Dental',
      ask: 'Tooth pain since this evening. Can I see a doctor tomorrow?',
      reply: 'Sorry to hear that. Dr Rao has 9:15 am free tomorrow. Shall I book it?',
      follow: 'Yes please', booked: 'Booked for Wed, 9:15 am',
    },
    {
      id: 'store', label: 'Store', name: 'Kiran Store',
      ask: 'Is the blue kurta in size M back in stock?',
      reply: 'It is, 3 left. Want me to hold one and send a payment link?',
      follow: 'Yes, hold it', booked: 'Held: blue kurta, size M',
    },
  ],
  cta: 'Get an agent like this',
  ctaMessage: 'Hi Golu, I’d like a WhatsApp agent for my business.',
};

export const automations = {
  h2: 'The messy sheet runs itself.',
  body: 'By morning the messy sheets are a dashboard that updates itself. One order comes in; everything after it happens on its own.',
  flow: [
    { k: 'IN', title: 'New order', text: 'Store or form' },
    { k: 'DOC', title: 'Invoice sent', text: 'PDF on WhatsApp' },
    { k: 'CRM', title: 'CRM updated', text: 'No copy-paste' },
    { k: 'YOU', title: 'You’re told', text: 'One-line summary' },
  ],
  tag: 'Sample flow with illustrative steps',
};

export const work = {
  h2: 'Things I’ve built.',
  modes: [['stage', 'Stage'], ['list', 'List']],
  projects: [
    {
      id: 'stepq', ch: '01', name: 'StepQ', credit: 'Client project · Website + iOS + Android',
      year: 'TBC', kind: 'Website, iOS and Android', tone: 'note',
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
  h2: 'Four steps. No surprises.',
  steps: [
    { n: '01', title: 'Listen', text: 'A call about what’s tangled. You talk, I take notes.' },
    { n: '02', title: 'Map', text: 'A written plan: scope, price and timeline, before I start.' },
    { n: '03', title: 'Build', text: 'Weekly plain-English updates and something you can click.' },
    { n: '04', title: 'Hand over', text: 'You own everything. I show your team how it runs.' },
  ],
};

export const about = {
  h2: 'Hi, I’m Golu.',
  body: 'I’m an independent developer. I build AI agents, automations, websites and apps for businesses that want more leads and less manual work, and I’ve been on the founding team of two products.',
  links: [['CV', 'cv'], ['LinkedIn', 'linkedin'], ['GitHub', 'github']],
  built: {
    title: 'How this site is built',
    rows: [
      ['Stack', 'Vite, vanilla JS, GSAP, Lenis and three.js'],
      ['Films', 'AI-generated, scrubbed frame by frame on a canvas'],
      ['Budget', 'First screen under 2 MB on mobile, 60 fps target'],
      ['Tests', 'Playwright: no jumps, no stalls, reduced motion, 320–1920 px'],
      ['Honesty', 'Demos say “Sample”. Unknowns say TBC.'],
    ],
  },
};

export const contact = {
  h2: 'Let’s build yours.',
  body: 'Tell me what’s tangled. I’ll reply with a plan, in plain English.',
  book: 'Book a call',
  email: 'Email',
  foot: '© 2026 Golu Kumar, independent developer',
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
