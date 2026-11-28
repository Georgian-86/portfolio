import './tokens.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { brand, nav, menu, waLink, bookLink } from './content.js';
import { esc, tbc, icon, reducedQuery, clamp, magnetic } from './ui.js';
import { runLoader } from './loader.js';
import { renderHero } from './hero.js';
import { mountNode } from './cursor.js';
import { renderServices } from './services.js';
import { renderWhatsapp, renderAutomations } from './scenes.js';
import { renderWork } from './work.js';
import { renderProcess, renderAbout, renderContact } from './late.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const status = (text = 'Online · replies within') =>
  `<span class="status"><span class="status__dot" aria-hidden="true"></span><span class="label">${esc(text)}</span> ${tbc(brand.replyTime)}</span>`;

function renderHeader() {
  $('[data-hdr]').innerHTML = `
    <a class="hdr__brand" href="#main" aria-label="${esc(brand.fullName)}, back to top" data-node="Top">${icon.mark}</a>
    <div class="hdr__id">
      <span class="hdr__name">${esc(brand.fullName)}</span>
      ${status()}
    </div>
    <ul class="hdr__links" role="list">
      ${nav.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
    </ul>
    <a class="btn btn--primary hdr__cta" href="${waLink()}" target="_blank" rel="noopener" data-node="Chat">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
    <button class="hdr__menu" type="button" aria-controls="menu" aria-expanded="false" aria-label="Open menu"><i></i><i></i><i></i></button>`;
  $('#menu').innerHTML = `
    <p class="label">Menu</p>
    <ul role="list">${menu.map((l) => `<li><a href="${l.href}"><span class="label">${esc(l.n)}</span>${esc(l.label)}</a></li>`).join('')}</ul>
    <a class="btn btn--primary menu__book" href="${bookLink()}" target="_blank" rel="noopener">${icon.calendar}<span>Book a call</span></a>`;
  magnetic($('.hdr__cta'), gsap, { strength: 0.2, reach: 20 });
}

function wireMenu(lenis) {
  const btn = $('.hdr__menu');
  const sheet = $('#menu');
  const behind = [$('main'), $('[data-bar]')];
  const set = (open, { restoreFocus = true } = {}) => {
    if (sheet.hidden === !open) return;
    sheet.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('menu-open', open);
    behind.forEach((el) => { el.inert = open; });
    open ? lenis()?.stop() : lenis()?.start();
    if (open) {
      $('a', sheet)?.focus();
      if (!reducedQuery.matches) gsap.from(sheet.querySelectorAll('li'), { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' });
    } else if (restoreFocus) btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => set(sheet.hidden));
  sheet.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    set(false);
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

// Day → night → day. Runs of consecutive night sections fade the fixed night layer in as they
// arrive and out as they leave (opacity only). The header takes the theme of what is under it.
function themeEngine() {
  const secs = [...document.querySelectorAll('main > section')];
  const nightfall = $('.nightfall');
  const hdr = $('[data-hdr]');
  const setOpacity = gsap.quickSetter(nightfall, 'opacity');
  let runs = [];
  const measure = () => {
    runs = [];
    let cur = null;
    for (const s of secs) {
      const top = s.offsetTop, bottom = top + s.offsetHeight;
      if (s.dataset.theme === 'night') {
        if (cur) cur.bottom = bottom; else runs.push(cur = { top, bottom });
      } else cur = null;
    }
  };
  const update = () => {
    const y = scrollY, vh = innerHeight;
    let o = 0;
    for (const r of runs) {
      const enter = clamp((y + vh * 0.55 - r.top) / (vh * 0.5));
      const leave = clamp((y + vh * 0.75 - r.bottom) / (vh * 0.5));
      o = Math.max(o, enter * (1 - leave));
    }
    setOpacity(o);
    const probe = y + (parseFloat(getComputedStyle(hdr).height) || 64) / 2;
    const under = secs.find((s) => probe >= s.offsetTop && probe < s.offsetTop + s.offsetHeight) || secs[0];
    const theme = under.dataset.theme;
    if (hdr.dataset.theme !== theme) hdr.dataset.theme = theme;
    hdr.classList.toggle('is-solid', y > 40 && under !== secs[0]);
    document.documentElement.dataset.theme = theme;
  };
  ScrollTrigger.addEventListener('refresh', () => { measure(); update(); });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
  measure();
  update();
}

function smoothScroll() {
  let lenis = null;
  const tick = (t) => lenis?.raf(t * 1000);
  const sync = () => {
    if (reducedQuery.matches) {
      lenis?.destroy();
      lenis = null;
    } else if (!lenis) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, anchors: { offset: 0 } });
      lenis.on('scroll', ScrollTrigger.update);
    }
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  sync();
  reducedQuery.addEventListener('change', sync);
  return () => lenis;
}

renderHeader();
renderBar();
const hero = renderHero();
renderServices();
renderWhatsapp();
renderAutomations();
renderWork();
renderProcess();
renderAbout();
renderContact();
const lenis = smoothScroll();
wireMenu(lenis);
themeEngine();
mountNode();
runLoader(hero.film, () => hero.reveal());
addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
