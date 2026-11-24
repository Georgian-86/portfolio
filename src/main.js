import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Scene } from './scene.js';
import { brand, services, addons, blueprints, process, stackMarquee } from './config.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none)').matches;

/* ───────────── 1. Populate content from config ───────────── */
const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}! I'd like to discuss a project.`)}`;
$$('[data-whatsapp]').forEach((a) => (a.href = wa));
$$('[data-calendly]').forEach((a) => (a.href = brand.calendly));
$$('[data-email]').forEach((a) => { a.href = `mailto:${brand.email}`; a.textContent = brand.email; });
$$('[data-brand]').forEach((el) => (el.textContent = brand.name));
$$('[data-brand-short]').forEach((el) => (el.textContent = `${brand.name} ${brand.suffix}`));
$$('[data-brand-logo]').forEach((el) => (el.innerHTML = `<b>${brand.name}</b><span>${brand.suffix}</span>`));
$$('[data-tagline]').forEach((el) => (el.textContent = brand.tagline));
$$('[data-location]').forEach((el) => (el.textContent = brand.location));
$('#year').textContent = new Date().getFullYear();
$('#socials').innerHTML = Object.entries(brand.socials).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join('');

$('#servicesTrack').innerHTML = services.map((s) => `
  <article class="card" data-hue="${s.hue}">
    <div class="card__glow"></div>
    <header><span class="card__id">${s.id}</span><span class="card__chip">${s.stack[0]}</span></header>
    <h3>${s.title}</h3>
    <p>${s.line}</p>
    <ul>${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
    <footer>${s.stack.map((t) => `<span>${t}</span>`).join('')}</footer>
  </article>`).join('') + `
  <article class="card card--end">
    <h3>Need it all<br/><em>connected?</em></h3>
    <p>That's the point. Every service plugs into the others — site → agent → CRM → automations → reports.</p>
    <a class="btn btn--primary magnetic" href="${wa}" target="_blank" rel="noopener"><span>Start a project</span></a>
  </article>`;

$('#bpGrid').innerHTML = blueprints.map((b) => `
  <article class="bp tilt">
    <span class="bp__tag">${b.tag}</span>
    <h3>${b.title}</h3>
    <p>${b.text}</p>
    <div class="bp__kpi"><b>${b.kpi[0]}</b><span>${b.kpi[1]}</span></div>
  </article>`).join('');

$('#steps').innerHTML = process.map((p, i) => `
  <li class="step"><span class="step__n">0${i + 1}</span><h3>${p.k}</h3><p>${p.t}</p></li>`).join('');

const marqueeHTML = stackMarquee.map((t) => `<span>${t}</span><i>✦</i>`).join('');
$('#marquee').innerHTML = marqueeHTML + marqueeHTML;
$('#marquee2').innerHTML = marqueeHTML + marqueeHTML;
$('#addons').innerHTML = addons.map((a) => `<span class="pill">${a}</span>`).join('');

const chatScript = [
  ['in', 'Hi! Do you build online stores? I sell handmade candles 🕯️'],
  ['out', 'Hey! Yes — Shopify stores with WhatsApp checkout & abandoned-cart recovery. Roughly how many products?'],
  ['in', 'About 40. Budget is flexible if it brings sales.'],
  ['out', 'Perfect fit for our <b>Store Growth Engine</b>: premium theme + automated cart recovery + weekly revenue report.'],
  ['out', 'Want a 20-min call? I have <b>Tue 4pm</b> or <b>Wed 11am</b>.'],
  ['in', 'Wed 11 works!'],
  ['out', '✅ Booked for Wed 11:00. Invite sent to your email. Talk soon!'],
];
$('#chat').innerHTML = chatScript.map(([d, t]) => `<div class="msg msg--${d}"><p>${t}</p><time>now</time></div>`).join('') +
  `<div class="msg msg--typing"><p><i></i><i></i><i></i></p></div>`;

/* Split text into words for scrubbed reveals */
$$('.split').forEach((el) => {
  el.innerHTML = el.innerHTML.trim().split(/(\s+|<em>.*?<\/em>)/).filter((w) => w.trim()).map((w) =>
    w.startsWith('<em>') ? w.replace(/<em>(.*?)<\/em>/, (_, x) => x.split(' ').map((y) => `<span class="w"><em>${y}</em></span>`).join(' ')) : `<span class="w">${w}</span>`
  ).join(' ');
});

/* ───────────── 2. WebGL scene ───────────── */
let scene = null;
try {
  scene = new Scene($('#webgl'));
} catch (e) {
  console.warn('WebGL unavailable, falling back to static background', e);
  document.body.classList.add('no-webgl');
}

const scrim = $('#scrim');
const mobileDim = matchMedia('(max-width: 820px)').matches ? 0.3 : 0;

/* ───────────── 3. Smooth scroll (Lenis ↔ GSAP) ───────────── */
const lenis = reduced ? null : new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, wheelMultiplier: 0.9 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  lenis.stop();
}
gsap.ticker.add((time) => {
  lenis?.raf(time * 1000);
  if (scene) {
    scene.render();
    scrim.style.opacity = Math.max(scene.state.dim, mobileDim);
  }
});
gsap.ticker.lagSmoothing(0);

$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const target = $(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.8 }) : target.scrollIntoView({ behavior: 'smooth' });
}));

/* ───────────── 4. Scroll-driven 3D choreography ───────────── */
// Each section has a target pose for the camera & the liquid-glass core.
const poses = {
  manifesto: { camX: 0, camY: 0.3, camZ: 8.5, lookX: 0, coreX: -3.1, coreY: 0, coreScale: 0.7, amp: 0.4, freq: 1.7, spin: 1.5, hue: 0.62, ringTilt: 1.2, ringSpread: 1.2, particles: 1, exposure: 0.95, dim: 0.35 },
  services: { camX: 0, camY: -0.2, camZ: 10.5, lookX: 0, coreX: 3.2, coreY: 1.3, coreScale: 0.6, amp: 0.22, freq: 1.2, spin: 3, hue: 0.72, ringTilt: 0.2, ringSpread: 1.5, particles: 0.8, exposure: 0.85, dim: 0.45 },
  demo: { camX: -0.6, camY: 0.4, camZ: 8.5, lookX: 0, coreX: 2.3, coreY: -0.2, coreScale: 0.85, amp: 0.32, freq: 1.5, spin: 4.5, hue: 0.38, ringTilt: 0.9, ringSpread: 1.1, particles: 1, exposure: 0.95, dim: 0.3 },
  blueprints: { camX: 0.6, camY: -0.3, camZ: 11, lookX: 0, coreX: 2.6, coreY: 1.7, coreScale: 0.55, amp: 0.45, freq: 2, spin: 6, hue: 0.08, ringTilt: 1.5, ringSpread: 1.3, particles: 0.9, exposure: 0.85, dim: 0.55 },
  process: { camX: 0, camY: 0.8, camZ: 11, lookX: 0, coreX: 0, coreY: -1.9, coreScale: 0.65, amp: 0.25, freq: 1.4, spin: 7.5, hue: 0.55, ringTilt: 0.1, ringSpread: 1.8, particles: 1, exposure: 0.9, dim: 0.4 },
  stack: { camX: 0, camY: 0, camZ: 8.5, lookX: 0, coreX: 0, coreY: 0, coreScale: 0.9, amp: 0.5, freq: 2.3, spin: 9, hue: 0.82, ringTilt: 0.6, ringSpread: 1.2, particles: 1.2, exposure: 0.95, dim: 0.2 },
  contact: { camX: 0, camY: 0, camZ: 9, lookX: 0, coreX: 0, coreY: 0.2, coreScale: 0.75, amp: 0.3, freq: 1.3, spin: 11, hue: 0.72, ringTilt: 0.35, ringSpread: 1, particles: 1.4, exposure: 0.85, dim: 0.4 },
};

function buildChoreography() {
  if (!scene) return;
  $$('[data-scene]').forEach((sec) => {
    const pose = poses[sec.dataset.scene];
    if (!pose) return;
    gsap.to(scene.state, {
      ...pose,
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 15%', scrub: 1.6 },
    });
  });
}

/* ───────────── 5. DOM animations ───────────── */
function buildAnimations() {
  // Progress bar
  gsap.to('#progressBar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // Manifesto words light up as you scroll
  gsap.fromTo('.manifesto .w', { opacity: 0.12, filter: 'blur(6px)', y: 10 }, {
    opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 60%', scrub: 1 },
  });

  // Section headers
  $$('.h2, .section-head .eyebrow, .services__head .eyebrow').forEach((el) => {
    gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  const mm = gsap.matchMedia();

  // Services: horizontal pinned scroll on desktop
  mm.add('(min-width: 821px)', () => {
    const track = $('#servicesTrack');
    const cards = $$('.card', track);
    const dist = () => track.scrollWidth - innerWidth + 80;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.services', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(services.length - 1, Math.floor(self.progress * (cards.length - 0.5)));
          if (scene) scene.hueOverride = services[i]?.hue ?? null;
        },
        onLeave: () => scene && (scene.hueOverride = null),
        onLeaveBack: () => scene && (scene.hueOverride = null),
      },
    });
    // Each card gets a 3D swing as it passes through the viewport
    cards.forEach((card) => {
      gsap.fromTo(card, { rotateY: -28, z: -180, opacity: 0.35 }, {
        rotateY: 0, z: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 45%', scrub: true },
      });
    });
  });
  mm.add('(max-width: 820px)', () => {
    $$('.card').forEach((card) => gsap.from(card, { y: 60, opacity: 0, rotateX: 18, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' } }));
  });

  // WhatsApp demo: pinned, messages appear with scroll
  const msgs = $$('#chat .msg:not(.msg--typing)');
  const flowItems = $$('#flow li');
  gsap.set(msgs, { opacity: 0, y: 24, scale: 0.96 });
  const demoTl = gsap.timeline({
    scrollTrigger: { trigger: '.demo', start: 'top top', end: '+=1800', pin: true, scrub: 0.8, anticipatePin: 1 },
  });
  demoTl.from('#phone', { rotateY: -25, rotateX: 12, y: 80, duration: 1, ease: 'power2.out' });
  // which chat message lights up which pipeline step
  const stepAt = { 0: 0, 2: 1, 3: 2, 6: 3 };
  msgs.forEach((m, i) => {
    demoTl.to(m, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '+=0.25');
    if (stepAt[i] !== undefined) demoTl.to(flowItems[stepAt[i]], { '--on': 1, color: '#fff', duration: 0.3 }, '<');
  });
  demoTl.to(flowItems[4], { '--on': 1, color: '#fff', duration: 0.3 }, '+=0.2');
  demoTl.to('#phone', { rotateY: 8, duration: 1 }, '<');
  // keep the newest message in view
  demoTl.to('#chat', { scrollTop: () => $('#chat').scrollHeight, duration: 2.5, ease: 'none' }, 1.8);

  // Blueprints
  gsap.from('.bp', { y: 100, opacity: 0, rotateX: -25, stagger: 0.12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '#bpGrid', start: 'top 80%' } });

  // Process: steps rise + line draws
  $$('.step').forEach((s) => {
    gsap.from(s, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } });
  });
  gsap.fromTo('.steps', { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // Marquee speed reacts to scroll velocity
  const mq1 = gsap.to('#marquee', { xPercent: -50, repeat: -1, duration: 40, ease: 'none' });
  const mq2 = gsap.fromTo('#marquee2', { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 45, ease: 'none' });
  ScrollTrigger.create({
    trigger: '.stack', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const v = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
      gsap.to([mq1, mq2], { timeScale: v, duration: 0.2, overwrite: true });
      gsap.to([mq1, mq2], { timeScale: 1, duration: 1.2, delay: 0.2 });
    },
  });
  gsap.from('.pill', { y: 30, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '#addons', start: 'top 85%' } });

  // Contact title
  gsap.from('.contact__title .line > span', { yPercent: 110, rotate: 4, stagger: 0.1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact__title', start: 'top 80%' } });
  gsap.from('.contact__cta .btn, .contact__mail', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__cta', start: 'top 90%' } });

  // Hero parallax out
  gsap.to('.hero__inner', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ───────────── 6. Micro-interactions ───────────── */
function buildInteractions() {
  if (touch) { document.body.classList.add('is-touch'); return; }
  // Custom cursor
  const dot = $('.cursor__dot'), ring = $('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.addEventListener('pointerover', (e) => {
    document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button, .card, .bp'));
  });

  // Magnetic buttons
  $$('.magnetic').forEach((btn) => {
    const span = btn.querySelector('span');
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: 'power3.out' });
      gsap.to(span, { x: x * 0.15, y: y * 0.2, duration: 0.6, ease: 'power3.out' });
    });
    btn.addEventListener('pointerleave', () => gsap.to([btn, span], { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' }));
  });

  // 3D tilt + light follow on cards
  $$('.card, .bp').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      gsap.to(el, { rotateY: (px - 0.5) * 12, rotateX: (0.5 - py) * 10, duration: 0.6, ease: 'power2.out', transformPerspective: 900 });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }));
  });
}

/* ───────────── 7. Loader → intro ───────────── */
function intro() {
  const tl = gsap.timeline({ onComplete: () => lenis?.start() });
  tl.to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' })
    .from('.hero__title .line > span', { yPercent: 115, rotate: 3, stagger: 0.09, duration: 1.5, ease: 'expo.out' }, '-=0.5')
    .from('.reveal-up', { y: 30, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out' }, '-=1.1')
    .from('.nav > *', { y: -30, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out' }, '-=1')
    .from('.hero__meta > div', { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }, '-=0.9');
  if (scene) {
    tl.fromTo(scene.state, { camZ: 14, coreScale: 0.2, amp: 1.2, spin: -3 }, { camZ: 7.5, coreScale: 1, amp: 0.28, spin: 0, duration: 2.6, ease: 'expo.out' }, 0.2);
  }
}

const counter = { v: 0 };
gsap.to(counter, {
  v: 100, duration: 1.8, ease: 'power2.inOut',
  onUpdate: () => {
    $('#loaderCount').textContent = Math.round(counter.v);
    $('#loaderBar').style.transform = `scaleX(${counter.v / 100})`;
  },
  onComplete: async () => {
    await document.fonts?.ready;
    buildChoreography();
    buildAnimations();
    buildInteractions();
    ScrollTrigger.refresh();
    intro();
  },
});
