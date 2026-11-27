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
  cta: {
    id: '09',
    h2: 'Ready to untangle?',
    body: 'Tell me what’s messy. I reply on WhatsApp.',
  },
};

export const services = [];

export const work = [
  { name: 'StepQ', credit: 'Client project · Website + iOS + Android' },
  { name: 'TeachGenie', credit: 'Founding team · [role TBC]', role: 'TBC' },
  { name: 'Brivia', credit: 'Founding team · [role TBC]', role: 'TBC' },
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
