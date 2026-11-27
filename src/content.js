// All site copy lives here. Unknown facts are the string 'TBC' and render as a visible TBC chip.

export const brand = {
  name: 'Golu',
  fullName: 'Golu Kumar',
  role: 'AI, automation & product',
  replyTime: 'TBC',
  // Placeholder contact details: replace before launch.
  whatsapp: '910000000000', // digits only, international format
  whatsappStatus: 'TBC',
  email: 'TBC',
  calendly: 'TBC',
  ctaLabel: 'Message me on WhatsApp',
  barPlaceholder: 'Message Golu',
  barLabel: 'Message Golu · opens WhatsApp',
  defaultMessage: 'Hi Golu, I found your website.',
};

export const sections = {
  hero: {
    id: '01',
    kicker: 'Golu Kumar · AI, automation & product',
    h1: [
      { text: 'Less chaos.', tone: 'ink' },
      { text: 'More clients.', tone: 'mint' },
    ],
    subMobile: 'I’m Golu. I turn the mess into simple systems that win you clients.',
    subDesktop: 'I’m Golu. I turn missed calls, sticky notes and messy sheets into calm systems that win you clients.',
    secondaryCta: 'Book a call',
    film: { name: 'hero', desktop: 188, mobile: 190, intro: 0.382 }, // autoplays to the first snap keyframe
    scrollCue: 'Scroll',
    // Decorative props that sit on the desk film and fade as it tidies.
    props: [
      { kind: 'chat', id: 'riya', initials: 'RK', title: 'Riya · WhatsApp', text: 'Still available? Price?', badge: '14', where: 'both' },
      { kind: 'call', id: 'missed1', title: 'Missed call', text: 'Unknown · 9:05 PM', where: 'desktop' },
      { kind: 'call', id: 'missed2', title: '3 missed calls', text: 'Unknown · 11:42 PM', alert: true, where: 'both' },
      { kind: 'sticky', id: 'sticky1', text: 'Send bill to Priya??', where: 'both' },
      { kind: 'sticky', id: 'sticky2', text: 'Call back Mehta!!', where: 'desktop' },
      { kind: 'sticky', id: 'sticky3', text: 'WEBSITE??? (ask Golu)', where: 'desktop' },
      { kind: 'chat', id: 'arjun', initials: 'AS', title: 'Arjun · Instagram', text: 'Do you deliver today?', textMobile: 'Deliver today?', badge: '6', where: 'both' },
      { kind: 'sheet', id: 'sheet', title: 'leads_FINAL_v7.xlsx', where: 'desktop',
        rows: [['Name', 'Phone', 'Status', 'Paid?', ''], ['Riya', '', 'call??', '#REF!', ''], ['Mehta', '', '??', '', ''], ['Riya', '', 'dup', 'yes?', ''], ['—', '', 'lost', '', '']] },
    ],
  },
  proof: {
    id: '01b',
    kicker: 'Proof · pinned to the desk',
    h2: 'Real work first.',
    body: 'Three projects I built or helped build. Tap one to jump to its story.',
    bodyDesktop: 'Three projects I built or helped build. Each card jumps to its full story further down the page.',
    more: 'See the story ↓',
    moreDesktop: 'See the full story ↓',
  },
  missedCalls: {
    id: '02',
    untangled: 1,
    kicker: 'Tangle 1 of 4 · missed calls',
    h2: 'Missed calls turn into bookings.',
    body: 'My WhatsApp agent replies in seconds, day or night. It answers questions, qualifies the lead and books the slot.',
    bodyDesktop: 'My WhatsApp agent replies in seconds, day or night. It answers questions, qualifies the lead and books the slot, then hands you a summary.',
    mess: [
      { title: 'Missed call', text: 'Unknown · 9:05 PM', rot: 3 },
      { title: 'Missed call', text: 'Unknown · 10:18 PM', rot: -2 },
      { title: '3 missed calls', text: 'Unknown · 11:42 PM', rot: 1, alert: true },
    ],
    cue: 'snaps into a system',
    film: { name: 'night', desktop: 190, mobile: 188 },
    sysKicker: 'System · WhatsApp agent',
    lead: 'Every call gets an answer, even at 11:42 PM.',
    chatName: 'Your business · agent',
    chat: [
      { kind: 'event', text: 'Missed call · 11:42 PM' },
      { kind: 'visitor', text: 'Hi, I just tried calling. Any slot tomorrow?' },
      { kind: 'agent', text: 'Sorry we missed you! 6:30 PM or 7:15 PM tomorrow are free. Which works?' },
      { kind: 'meta', text: 'Agent · 11:42 PM · 38 s later' },
      { kind: 'visitor', text: '6:30 please' },
      { kind: 'booking', title: 'Booked · Tue, 6:30 PM', text: 'Reminder set · you’re notified' },
    ],
    tag: 'Sample · illustrative times',
    cta: 'Message my WhatsApp agent',
    ctaMessage: 'Hi Golu, I’d like a WhatsApp agent for my business.',
  },
  liveAgent: {
    id: '02b',
    kicker: 'Live agent · how it talks',
    h2: 'Watch it book a slot.',
    body: 'This is the agent I build for clients. It answers in your tone, checks your calendar and books the slot.',
    tag: 'Sample · demo conversation',
    chatName: 'Glow Salon · agent',
    customer: 'Hi! Any slot for a haircut on Tuesday, after 6?',
    reply: 'Yes! 6:30 PM is free with Meera. I’ve booked it and set a reminder for you.',
    booking: { title: 'Booked · Tue · 6:30 PM', text: 'Haircut · 45 min · reminder set', tag: 'Sample booking · not a real slot' },
    points: ['Replies in seconds, in your tone.', 'Checks your real calendar before it offers a time.', 'Books, confirms and reminds. You see it in your diary.'],
    cta: 'Get an agent like this',
    ctaMessage: 'Hi Golu, I’d like an agent like the salon demo.',
  },
  pipeline: {
    id: '03',
    untangled: 2,
    kicker: 'Tangle 2 of 4 · sticky notes',
    h2: 'Sticky notes become a pipeline.',
    body: 'New order in, invoice out, CRM updated, you notified. No copy-paste, nothing forgotten.',
    mess: [
      { text: 'Order #1042 — bill??', rot: 5 },
      { text: 'Add Mehta to CRM', rot: -3 },
      { text: 'Follow up Monday!!', rot: -6 },
    ],
    cue: 'snaps into a system',
    sysKicker: 'System · automation',
    lead: 'Watch one order run itself.',
    steps: [
      { title: 'New order #1042', text: 'Shopify · online store', time: '+0.0s' },
      { title: 'Invoice sent', text: 'PDF to the customer on WhatsApp', time: '+0.6s' },
      { title: 'CRM updated', text: 'Contact + deal, no copy-paste', time: '+1.3s' },
      { title: 'You’re notified', text: 'One-line summary on your phone', time: '+2.1s' },
    ],
    tag: 'Sample · demo run',
    cta: 'Watch an automation run',
    ctaMessage: 'Hi Golu, can you show me an automation run?',
  },
  dashboard: {
    id: '04',
    untangled: 3,
    kicker: 'Tangle 3 of 4 · the spreadsheet',
    h2: 'A messy sheet becomes a live dashboard.',
    body: 'Leads, replies and bookings in one place, updated by itself. You check it; you don’t build it.',
    sheet: {
      title: 'leads_FINAL_v7.xlsx',
      rows: [['Name', 'Phone', 'Status', 'Paid?', ''], ['Riya', '', 'call??', '#REF!', ''], ['Mehta', '', '??', '', ''], ['Riya', '', 'dup', 'yes?', ''], ['—', '', 'lost', '', '']],
    },
    cue: 'snaps into a system',
    film: { name: 'sheet', desktop: 161, mobile: 106 },
    sysKicker: 'System · dashboard',
    lead: 'One screen. Updated by itself.',
    boardTitle: 'This week',
    boardTag: 'Illustrative',
    kpis: [['Leads', '48'], ['Median reply', '38s'], ['Booked', '17'], ['Follow-ups due', '0']],
    bars: [['M', 30], ['T', 46], ['W', 38], ['T', 62], ['F', 54], ['S', 72, true], ['S', 40]],
    tag: 'Illustrative numbers · not client data',
  },
  stepq: {
    id: '05',
    untangled: 4,
    filterLabel: 'What are you building?',
    filters: [['website', 'Website'], ['app', 'App'], ['automation', 'Automation'], ['store', 'Store']],
    kicker: 'Tangle 4 of 4 · “we need a website”',
    h2: 'One scribble became three products.',
    body: 'A client came with a sticky note. They left with a website and two apps.',
    note: 'We need a website… and an app??',
    cue: 'snaps into a system',
    lead: 'StepQ',
    media: 'StepQ · website and apps',
    desc: 'A walking-rewards app for India, fronted by a mascot called Piko. I built the website and both mobile apps.',
    chips: ['Website', 'iOS app', 'Android app'],
    quote: '“Client quote goes here: what changed for them after launch.”',
    quoteBy: 'StepQ team',
    cta: 'Ask me about StepQ',
    ctaMessage: 'Hi Golu, tell me more about the StepQ project.',
  },
  team: {
    id: '06',
    kicker: 'From day one',
    h2: 'Systems I helped build from day one.',
    body: 'Two products where I was on the founding team, plus the automations I set up for small businesses.',
    more: 'Ask about it →',
    automations: {
      title: 'Automations · before → after',
      rows: [
        ['DMs copied into Excel', 'Logged in the CRM, tagged'],
        ['Friday-night invoices', 'Sent the moment it’s paid'],
        ['“Did anyone call back?”', 'Follow-ups booked for you'],
      ],
    },
  },
  services: {
    id: '07',
    kicker: 'What I untangle',
    h2: 'Pick the outcome. I’ll build the system.',
    body: 'Two outcomes: more leads in, less manual work.',
    outcomes: [
      {
        title: 'More leads', n: 'Outcome 01',
        items: [
          ['Websites', 'Fast, clear sites that turn visits into enquiries.'],
          ['Shopify', 'Stores that sell without you babysitting them.'],
          ['WordPress', 'Sites your team can update without calling me.'],
          ['SEO & AI search', 'Found on Google and in AI answers.'],
          ['WhatsApp agents', 'Every message answered, day or night.'],
        ],
      },
      {
        title: 'Less manual work', n: 'Outcome 02',
        items: [
          ['AI agents', 'Assistants that handle the repetitive questions.'],
          ['Automations', 'Orders, invoices and CRM that sync themselves.'],
          ['App development', 'Web, iOS and Android apps, end to end.'],
          ['DevOps support', 'Deploys, backups and uptime, handled.'],
        ],
      },
    ],
  },
  about: {
    id: '08',
    kicker: 'About',
    photo: 'Photo of Golu',
    h2: 'Hi, I’m Golu.',
    body: 'I’m Golu Kumar, an independent developer. I build AI agents, automations, websites and apps for small businesses that want more leads and less manual work.',
    promises: ['Clear scope, in writing, before I start.', 'You own everything I build.', 'Plain-English updates, every week.'],
    foot: 'Independent studio for AI, automation & product.',
  },
  cta: {
    id: '09',
    kicker: 'All clear · 4/4',
    h2: 'Hand me your mess.',
    body: 'Tell me what’s tangled. I’ll reply with a plan, in plain English.',
    sticky: 'All sorted',
    running: { title: '3 systems · running', lines: ['0 missed calls', '0 loose notes', '1 live dashboard'], tag: 'Illustrative' },
    checklist: {
      title: 'Untangled · 4/4',
      items: ['Missed calls → WhatsApp agent', 'Sticky notes → pipeline', 'Spreadsheet → live dashboard', '“We need a website” → StepQ'],
    },
    book: 'Book a call',
    foot: '© 2026 Golu Kumar · Independent studio for AI, automation & product',
  },
};

// Menu sheet (B2-M-00 Menu): every link jumps to its section.
export const menu = [
  { n: '02', label: 'Missed calls → bookings', href: '#missed-calls' },
  { n: '02b', label: 'Live agent demo', href: '#live-agent' },
  { n: '03', label: 'Notes → pipeline', href: '#pipeline' },
  { n: '04', label: 'Sheet → dashboard', href: '#dashboard' },
  { n: '05', label: 'Work · StepQ', href: '#work' },
  { n: '06', label: 'Founding team', href: '#founding-team' },
  { n: '07', label: 'Services', href: '#services' },
  { n: '08', label: 'About', href: '#about' },
  { n: '09', label: 'Hand me your mess', href: '#contact' },
];

export const services = [];

export const work = [
  {
    id: 'stepq', name: 'StepQ', credit: 'Client project · Website + iOS + Android', tags: ['website', 'app'],
    blurb: 'A walking-rewards app for India.',
    blurbDesktop: 'A walking-rewards app for India, fronted by a mascot called Piko.',
  },
  {
    id: 'teachgenie', name: 'TeachGenie.ai', credit: 'Founding team · role', role: 'TBC', tags: ['app'],
    blurb: 'AI lesson plans, slides and quizzes in minutes.',
    blurbDesktop: 'An AI teaching assistant: lesson plans, slides and quizzes in 1–2 minutes.',
  },
  {
    id: 'brivia', name: 'Brivia Club', credit: 'Founding team · role', role: 'TBC', tags: ['app'],
    blurb: 'Networking: Swipe. Match. Build.',
    blurbDesktop: 'A networking platform for builders. Swipe. Match. Build.',
  },
];

export const team = [];

export const faqs = [];

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const waLink = (text = brand.defaultMessage) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

// Calendly is TBC: until it is set, "Book a call" opens WhatsApp asking for a call.
export const bookLink = () =>
  brand.calendly === 'TBC' ? waLink('Hi Golu, I’d like to book a call.') : brand.calendly;
