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
    film: { name: 'hero', desktop: 188, mobile: 190 },
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
  cta: {
    id: '09',
    h2: 'Ready to untangle?',
    body: 'Tell me what’s messy. I reply on WhatsApp.',
  },
};

export const services = [];

export const work = [
  {
    id: 'stepq', name: 'StepQ', credit: 'Client project · Website + iOS + Android',
    blurb: 'A walking-rewards app for India.',
    blurbDesktop: 'A walking-rewards app for India, fronted by a mascot called Piko.',
  },
  {
    id: 'teachgenie', name: 'TeachGenie.ai', credit: 'Founding team · role', role: 'TBC',
    blurb: 'AI lesson plans, slides and quizzes in minutes.',
    blurbDesktop: 'An AI teaching assistant: lesson plans, slides and quizzes in 1–2 minutes.',
  },
  {
    id: 'brivia', name: 'Brivia Club', credit: 'Founding team · role', role: 'TBC',
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
