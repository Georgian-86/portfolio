import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { brand, works, services, process, flow } from './config.js';
import { mockup } from './mockups.js';
import { FrameSequence } from './sequence.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isMobile = () => matchMedia('(max-width: 820px)').matches;
const pad = (n) => String(n).padStart(2, '0');

/* ───────────── Static content ───────────── */
const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hello ${brand.name}, I'd like to discuss a project.`)}`;
$$('[data-whatsapp]').forEach((a) => (a.href = wa));
$$('[data-calendly]').forEach((a) => (a.href = brand.calendly));
$$('[data-email]').forEach((a) => { a.href = `mailto:${brand.email}`; a.textContent = brand.email; });
$$('[data-brand]').forEach((el) => (el.textContent = brand.name));
$$('[data-volume]').forEach((el) => (el.textContent = brand.volume));
$$('[data-location]').forEach((el) => (el.textContent = brand.location));
const years = works.map((w) => +w.year).filter(Boolean);
$$('[data-years]').forEach((el) => (el.textContent = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : ''));
$('#year').textContent = new Date().getFullYear();
$('#socials').innerHTML = Object.entries(brand.socials).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join('');

$('#servicesList').innerHTML = services.map((s) => `
  <li class="reveal"><div class="index__row">
    <h3>${s.title}</h3>
    <span class="index__tags">${s.tags.map((t) => `<span>${t}</span>`).join('')}</span>
    <p>${s.line}</p>
  </div></li>`).join('');

$('#steps').innerHTML = process.map((p, i) => `
  <li class="reveal"><span class="n">${pad(i + 1)}</span><h3>${p.k}</h3><p>${p.t}</p></li>`).join('');

/* ───────────── The book ───────────── */
const N = works.length;
const pageNo = { story: (k) => 4 + 2 * k, visual: (k) => 5 + 2 * k };

const head = (l, r) => `<div class="page__head rv"><span class="lbl">${l}</span><span class="lbl">${r}</span></div>`;
const foot = (n, extra = '') => `<div class="page__foot">${extra || '<span></span>'}<span class="page__num">${n}</span></div>`;

const cover = () => `
  <div class="face face--front cover">
    <div class="cover__frame"></div>
    <div class="cover__inner">
      <div class="cover__mono">${brand.monogram}</div>
      <div class="cover__name">${brand.name}</div>
      <div class="cover__sub">Selected Works</div>
      <div class="cover__vol">${brand.volume} · ${new Date().getFullYear()}</div>
    </div>
  </div>`;

const foreword = () => `
  <div class="face face--back page page--left">
    ${head('Foreword', brand.name)}
    <h3 class="rv">A studio for the <em>quiet machinery</em> of business.</h3>
    <p class="prose rv">${brand.foreword}</p>
    <p class="sig rv">— ${brand.signature}</p>
    ${foot(2)}
  </div>`;

const contents = () => `
  <div class="face face--front page page--right">
    ${head('Contents', `${N} works`)}
    <h3 class="rv">Contents</h3>
    <ol class="toc">
      ${works.map((w, k) => `<li class="rv"><a href="#" data-spread="${k + 1}">
        <span class="n">${pad(pageNo.story(k))}</span><span class="t">${w.title}</span><span class="c">${w.category}</span></a></li>`).join('')}
      <li class="rv"><a href="#" data-spread="${N + 1}"><span class="n">${pad(pageNo.story(N))}</span><span class="t">Colophon</span><span class="c">Contact</span></a></li>
    </ol>
    ${foot(3)}
  </div>`;

const story = (w, k) => `
  <div class="face face--back page page--left story">
    ${head(`No. ${pad(k + 1)} — ${w.category}`, w.sample ? '<span class="sample">Sample</span>' : w.year)}
    <div class="story__num rv">${pad(k + 1)}</div>
    <h3 class="rv">${w.title}</h3>
    <p class="story__client rv">${w.client}</p>
    <p class="story__summary rv">${w.summary}</p>
    <dl class="story__meta rv">
      <div><dt>Role</dt><dd>${w.role}</dd></div><div><dt>Stack</dt><dd>${w.stack}</dd></div>
      <div><dt>Year</dt><dd>${w.year}</dd></div><div><dt>Outcome</dt><dd>${w.outcome}</dd></div>
    </dl>
    ${foot(pageNo.story(k), w.link ? `<a class="story__link" href="${w.link}" target="_blank" rel="noopener">View project ↗</a>` : '')}
  </div>`;

const media = (w) => w.video
  ? `<video src="${w.video}" muted loop playsinline autoplay preload="metadata"></video>`
  : w.image ? `<img src="${w.image}" alt="${w.title}" loading="lazy" />` : mockup(w);

const visual = (w, k) => `
  <div class="face face--front page page--right visual">
    <div class="plate" style="--tone:${w.tone}"><div class="plate__inner">${media(w)}</div></div>
    <div class="plate__cap rv"><span class="t">${w.title}</span><span class="page__num">${pageNo.visual(k)}</span></div>
  </div>`;

const colophon = () => `
  <div class="face face--back page page--left">
    ${head('Colophon', 'Fin.')}
    <h3 class="rv">That's the story <em>so far.</em></h3>
    <p class="prose rv">Every project here started as a conversation. Websites, stores, AI agents, automations, apps and the infrastructure underneath — designed to work as one system.</p>
    <p class="sig rv">Set in Cormorant Garamond &amp; Inter.</p>
    ${foot(pageNo.story(N))}
  </div>`;

const finale = () => `
  <div class="book__base page page--right finale">
    ${head('The next chapter', '')}
    <h3>Yours, <em>perhaps?</em></h3>
    <p class="prose">Tell me what you want to build. I reply within a day.</p>
    <div class="acts"><a href="${wa}" target="_blank" rel="noopener">WhatsApp</a><a href="${brand.calendly}" target="_blank" rel="noopener">Book a call</a></div>
    ${foot(pageNo.visual(N))}
  </div>`;

const leavesHTML = [
  cover() + foreword(),
  contents() + (N ? story(works[0], 0) : colophon()),
  ...works.map((w, k) => visual(w, k) + (k < N - 1 ? story(works[k + 1], k + 1) : colophon())),
];
const book = $('#book');
book.innerHTML = finale() + leavesHTML.map((h, i) => `<div class="leaf" style="z-index:${leavesHTML.length - i + 2}">${h}</div>`).join('');
const leaves = $$('.leaf', book);
const spreadNames = ['Foreword · Contents', ...works.map((w) => w.title), 'Colophon'];

/* ───────────── Smooth scroll ───────────── */
const lenis = new Lenis({ duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]:not([data-spread])').forEach((a) => a.addEventListener('click', (e) => {
  const t = $(a.getAttribute('href'));
  if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 }); }
}));

/* ───────────── Optional Google Flow intro ───────────── */
let seq = null;
if (flow.frames > 0) {
  seq = new FrameSequence($('#flowCanvas'), flow);
  document.body.classList.add('has-flow');
}

/* ───────────── Book choreography ───────────── */
function buildBook() {
  const mobile = isMobile();
  const allRv = $$('.rv', book);
  gsap.set(allRv, { opacity: 0, y: 14 });
  // closed: cover (the right half) centred — at scale s the shift is −25% × s
  gsap.set(book, { rotateX: 22, scale: 0.6, yPercent: 14, xPercent: -15 });
  gsap.set(leaves, { rotateY: 0, '--shade': 0 });
  leaves.forEach((l, i) => gsap.set(l, { zIndex: leaves.length - i + 2 }));

  const hold = mobile ? 0.7 : 1;
  const units = (flow.frames ? 3 : 0) + 2 + leaves.length * (1.6 + hold) * (mobile ? 1.6 : 1);
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: '#stage', start: 'top top', end: () => `+=${innerHeight * units * 0.55}`,
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: () => updateFolio(tl),
    },
  });

  if (seq) {
    tl.to(seq, { frame: flow.frames - 1, duration: 3, ease: 'none', onUpdate: () => seq.draw() })
      .to('#flowCanvas', { opacity: 0, duration: 0.6 });
  }

  // 1 — the book rises from the desk
  tl.to('.stage__intro', { opacity: 0, yPercent: -30, duration: 0.8 }, seq ? '<' : 0)
    .to('#hint', { opacity: 0, duration: 0.4 }, '<')
    .to(book, { rotateX: 0, scale: 1, yPercent: 0, xPercent: -25, duration: 1.2, ease: 'power3.inOut' }, '<0.1')
    .addLabel('spread0');

  // 2 — every leaf turns; the spread it reveals then fills in
  leaves.forEach((leaf, i) => {
    const at = `turn${i}`;
    tl.addLabel(at);
    tl.to(leaf, { rotateY: -180, duration: 1.6 }, at)
      .to(leaf, { skewY: -1.5, '--shade': 0.55, duration: 0.8, ease: 'power1.in' }, at)
      .to(leaf, { skewY: 0, '--shade': 0, duration: 0.8, ease: 'power1.out' }, `${at}+=0.8`)
      .set(leaf, { zIndex: i + 3 }, `${at}+=0.8`);

    if (i === 0 && !mobile) tl.to(book, { xPercent: 0, duration: 1.6 }, at);
    if (mobile) tl.to(book, { xPercent: 25, duration: 1 }, `${at}+=0.6`);

    const next = leaves[i + 1];
    const landed = [...$$('.face--back .rv', leaf), ...(next ? $$('.face--front .rv', next) : [])];
    tl.to(landed, { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out' }, `${at}+=1.1`);
    const plate = next && $('.plate__inner', next);
    if (plate) tl.fromTo(plate, { scale: 1.12 }, { scale: 1, duration: 1.6 + hold * 2, ease: 'none' }, `${at}+=0.4`);
    tl.addLabel(`spread${i + 1}`, `${at}+=1.4`);

    if (mobile) {
      tl.to({}, { duration: hold });
      tl.to(book, { xPercent: -25, duration: 1 });
    }
    tl.to({}, { duration: hold });
  });

  // Contents links jump to their spread
  $$('[data-spread]', book).forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const st = tl.scrollTrigger;
    const t = tl.labels[`spread${a.dataset.spread}`] + 0.6;
    lenis.scrollTo(st.start + (t / tl.duration()) * (st.end - st.start), { duration: 2 });
  }));
  return tl;
}

function updateFolio(tl) {
  const t = tl.time();
  let idx = -1;
  for (let i = 0; i <= leaves.length; i++) if (tl.labels[`turn${i}`] !== undefined && t >= tl.labels[`turn${i}`] + 0.8) idx = i;
  const chapter = idx < 0 ? 'Cover' : spreadNames[idx];
  const left = idx < 0 ? null : 2 + idx * 2;
  const num = idx < 0 ? '00' : `${pad(left)}—${pad(left + 1)}`;
  if ($('#chapter').textContent !== chapter) $('#chapter').textContent = chapter;
  $('#folioNum').textContent = num;
}

/* ───────────── Sections ───────────── */
function buildSections() {
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out', overwrite: true }),
  });
  $$('.h2, .contact__title').forEach((el) => gsap.from(el, {
    yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' },
  }));
}

/* Warm light follows the cursor over the stage */
const light = $('.stage__light');
const L = { x: 50, y: 46, tx: 50, ty: 46 };
addEventListener('pointermove', (e) => { L.tx = (e.clientX / innerWidth) * 100; L.ty = (e.clientY / innerHeight) * 100; });
gsap.ticker.add(() => {
  L.x += (L.tx - L.x) * 0.05; L.y += (L.ty - L.y) * 0.05;
  light.style.setProperty('--lx', `${L.x}%`); light.style.setProperty('--ly', `${L.y}%`);
});

/* ───────────── Boot ───────────── */
(async () => {
  await Promise.all([document.fonts?.ready, seq?.load()]);
  seq?.draw();
  const mm = gsap.matchMedia();
  mm.add({ mobile: '(max-width: 820px)', desktop: '(min-width: 821px)' }, () => { buildBook(); });
  buildSections();
  ScrollTrigger.refresh();
  gsap.from('.masthead > *', { y: -20, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out' });
  gsap.from('.stage__intro > *', { y: 30, opacity: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out' });
  gsap.from('.book-wrap', { y: 80, opacity: 0, duration: 1.8, ease: 'expo.out', delay: 0.15 });
})();
