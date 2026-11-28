import './tokens.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { brand, sections, nav, menu, waLink, bookLink } from './content.js';
import { renderLateSections } from './sections-late.js';
import { mountFilm } from './film.js';
import { esc, tbc, icon, easeOut } from './ui.js';
import { runLoader } from './loader.js';
import { mountSections } from './sections.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, el = document) => el.querySelector(s);
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const status = (text = 'Online · replies within') =>
  `<span class="status"><span class="status__dot" aria-hidden="true"></span><span class="label">${esc(text)}</span> ${tbc(brand.replyTime)}</span>`;

function renderHeader() {
  $('[data-hdr]').innerHTML = `
    <a class="hdr__brand" href="#main" aria-label="${esc(brand.fullName)}, back to top">${icon.mark}</a>
    <div class="hdr__id">
      <span class="hdr__name"><span class="m-only">${esc(brand.name)}</span><span class="d-only">${esc(brand.fullName)}</span></span>
      ${status()}
    </div>
    <ul class="hdr__links" role="list">
      ${nav.slice(0, 3).map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
    </ul>
    <a class="btn btn--primary hdr__cta" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
    <button class="hdr__menu" type="button" aria-controls="menu" aria-expanded="false" aria-label="Open menu"><i></i><i></i><i></i></button>`;
  $('#menu').innerHTML = `
    <p class="label menu__kicker">Menu · jump to a section</p>
    <ul role="list">${menu.map((l) => `<li><a href="${l.href}"><span class="label">${esc(l.n)}</span>${esc(l.label)}</a></li>`).join('')}</ul>
    <a class="btn menu__book" href="${bookLink()}" target="_blank" rel="noopener">Book a call</a>`;
}

function wireMenu() {
  const btn = $('.hdr__menu');
  const menu = $('#menu');
  const behind = [$('main'), $('[data-bar]')];
  const set = (open, { restoreFocus = true } = {}) => {
    if (menu.hidden === !open) return;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('menu-open', open);
    behind.forEach((el) => { el.inert = open; });
    if (open) $('a', menu)?.focus();
    else if (restoreFocus) btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => set(menu.hidden));
  menu.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    set(false);
    // Jumping to a #section resets focus after this handler; hand it back to the menu button.
    setTimeout(() => btn.focus({ preventScroll: true }));
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width: 1100px)').addEventListener('change', (e) => { if (e.matches) set(false, { restoreFocus: false }); });
}

function renderBar() {
  const bar = $('[data-bar]');
  bar.innerHTML = `
    <label class="bar__field">
      <span class="bar__icon">${icon.whatsapp}</span>
      <input name="msg" type="text" autocomplete="off" enterkeyhint="send" placeholder="${esc(brand.barPlaceholder)}" aria-label="${esc(brand.barLabel)}" />
      <button class="bar__send" type="submit" aria-label="Send on WhatsApp">${icon.send}</button>
    </label>`;
  bar.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = bar.msg.value.trim() || brand.defaultMessage;
    window.open(waLink(text), '_blank', 'noopener');
    bar.reset();
  });
}

// ── 01 Hero: full-bleed film, focus pull, three headline lines across the pin ──
let revealHero = () => {};
function renderHero() {
  const h = sections.hero;
  const el = $('[data-sec="01"]');
  el.innerHTML = `
    <div class="hero__stage">
      <div class="hero__film" data-film></div>
      <div class="hero__copy">
        <p class="hero__kicker label">${esc(h.kicker)}</p>
        <h1 id="hero-h1" class="hero__h1">${h.lines.map((l) => `<span class="hero__line">${esc(l)}</span>`).join(' ')}</h1>
        <div class="hero__ctas">
          <a class="btn btn--primary" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
          <a class="btn btn--ghost" href="#contact">${icon.calendar}<span>${esc(h.secondaryCta)}</span></a>
          <p class="hero__status">${status('Online · usually replies within')}</p>
        </div>
      </div>
      <p class="hero__cue label" aria-hidden="true">${esc(h.scrollCue)} <span class="hero__cue-arrow">↓</span></p>
    </div>`;
  const revealed = new Promise((ok) => { revealHero = ok; });
  const film = $('[data-film]', el);
  mountFilm(film, { ...h.film, start: 'top top', end: 'bottom bottom', introGate: revealed });
  // Over the frames, under the "AI-generated footage" label: the focus-pull blur and the navy scrim.
  // Both are kept out of the watermark corner (see .hero__focus / .hero__scrim in style.css).
  const focus = Object.assign(document.createElement('div'), { className: 'hero__focus' });
  const scrim = Object.assign(document.createElement('div'), { className: 'hero__scrim' });
  $('.film__label', el).before(focus, scrim);

  const cue = $('.hero__cue', el);
  const syncCue = () => cue.classList.toggle('is-gone', scrollY > 8);
  addEventListener('scroll', syncCue, { passive: true });
  syncCue();

  const lines = [...el.querySelectorAll('.hero__line')];
  const splits = lines.map((l) => SplitText.create(l, { type: 'words', mask: 'words', wordsClass: 'hero__word' }));
  const words = splits.map((s) => s.words);
  const ctas = $('.hero__ctas', el);
  let tl = null;
  const build = () => {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
    gsap.set([...lines, ...words.flat(), ctas, focus], { clearProps: 'all' });
    if (reducedQuery.matches) return;
    gsap.set([lines[1], lines[2], ctas], { autoAlpha: 0 });
    gsap.set(ctas, { y: 16 });
    gsap.set([...words[1], ...words[2]], { yPercent: 110 });
    tl = gsap.timeline({
      defaults: { ease: easeOut },
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
    });
    tl.to(focus, { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0)
      .to(lines[0], { autoAlpha: 0, y: -24, duration: 0.08 }, 0.22)
      .to(lines[1], { autoAlpha: 1, duration: 0.03 }, 0.33)
      .to(words[1], { yPercent: 0, duration: 0.1, stagger: 0.012 }, 0.33)
      .to(lines[1], { autoAlpha: 0, y: -24, duration: 0.07 }, 0.55)
      .to(lines[2], { autoAlpha: 1, duration: 0.03 }, 0.66)
      .to(words[2], { yPercent: 0, duration: 0.1, stagger: 0.012 }, 0.66)
      .to(ctas, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.76)
      .to({}, { duration: 0.0001 }, 1); // the timeline spans the whole pin
  };
  build();
  reducedQuery.addEventListener('change', build);
  // Line 1 rises into its mask as the loader's curtain lifts.
  revealed.then(() => {
    if (reducedQuery.matches || scrollY > 8) return;
    gsap.from(words[0], { yPercent: 110, duration: 1.1, ease: easeOut, stagger: 0.06, delay: 0.15 });
  });
  return film;
}

function smoothScroll() {
  let lenis = null;
  const tick = (t) => lenis?.raf(t * 1000);
  const sync = () => {
    if (reducedQuery.matches) {
      lenis?.destroy();
      lenis = null;
    } else if (!lenis) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
    }
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  sync();
  reducedQuery.addEventListener('change', sync);
}

renderHeader();
wireMenu();
renderBar();
const heroFilm = renderHero();
mountSections(renderLateSections);
smoothScroll();
runLoader(heroFilm, () => revealHero());
