import './tokens.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { brand, sections, nav, menu, waLink, bookLink } from './content.js';
import { renderLateSections } from './sections-late.js';
import { mountFilm } from './film.js';
import { esc, tbc, icon } from './ui.js';
import { mountSections } from './sections.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const status = (text = 'Online · replies within') =>
  `<span class="status"><span class="status__dot" aria-hidden="true"></span><span class="label">${esc(text)}</span> ${tbc(brand.replyTime)}</span>`;

const progress = () =>
  `<span class="untangled" aria-label="Untangled 0 of 4"><span class="label">Untangled 0/4</span><span class="untangled__segs" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span>`;

function renderHeader() {
  $('[data-hdr]').innerHTML = `
    <a class="hdr__brand" href="#main" aria-label="${esc(brand.fullName)}, back to top">${icon.mark}</a>
    <div class="hdr__id">
      <div class="hdr__row">
        <span class="hdr__name"><span class="m-only">${esc(brand.name)}</span><span class="d-only">${esc(brand.fullName)}</span></span>
        <span class="m-only">${progress()}</span>
      </div>
      ${status()}
    </div>
    <ul class="hdr__links" role="list">
      ${nav.slice(0, 3).map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
    </ul>
    <span class="hdr__progress label">Untangled 0/4</span>
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

function prop(p) {
  const cls = `prop prop--${p.kind} prop--${p.id}${p.where === 'desktop' ? ' d-only' : ''}`;
  if (p.kind === 'sticky') return `<div class="${cls}"><span class="prop__tape"></span><p>${esc(p.text)}</p></div>`;
  if (p.kind === 'call') {
    return `<div class="${cls}"><span class="prop__icon${p.alert ? ' is-alert' : ''}">${icon.missed}</span>
      <span class="prop__text"><b${p.alert ? ' class="is-alert"' : ''}>${esc(p.title)}</b><span>${esc(p.text)}</span></span></div>`;
  }
  if (p.kind === 'sheet') {
    return `<div class="${cls}"><p class="prop__sheet-hd label"><span>${esc(p.title)}</span><span>#REF!</span></p>
      <table>${p.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }
  const text = p.textMobile
    ? `<span class="d-only">${esc(p.text)}</span><span class="m-only">${esc(p.textMobile)}</span>`
    : esc(p.text);
  return `<div class="${cls}"><span class="prop__avatar">${esc(p.initials)}</span>
    <span class="prop__text"><b>${esc(p.title)}</b><span>${text}</span></span><span class="prop__badge label">${esc(p.badge)}</span></div>`;
}

function renderHero() {
  const h = sections.hero;
  const el = $('[data-sec="01"]');
  el.innerHTML = `
    <div class="hero__stage">
      <div class="hero__film" data-film></div>
      <div class="hero__props" aria-hidden="true">${h.props.map(prop).join('')}</div>
      <div class="hero__copy">
        <p class="hero__kicker label d-only">${esc(h.kicker)}</p>
        <h1 id="hero-h1" class="hero__h1">${h.h1.map((l) => `<span class="is-${l.tone}">${esc(l.text)}</span>`).join(' ')}</h1>
        <p class="hero__sub"><span class="m-only">${esc(h.subMobile)}</span><span class="d-only">${esc(h.subDesktop)}</span></p>
        <div class="hero__ctas">
          <a class="btn btn--primary" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
          <a class="btn btn--ghost d-only" href="#contact">${icon.calendar}<span>${esc(h.secondaryCta)}</span></a>
        </div>
        <p class="hero__status d-only">${status('Online · usually replies within')}</p>
        <p class="hero__cue label" aria-hidden="true">${esc(h.scrollCue)} <span class="hero__cue-arrow">↓</span></p>
      </div>
    </div>`;
  // The scrub starts when the hero meets the header (it sits below it at scroll 0).
  const fromHeader = () => `top ${parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 60}px`;
  mountFilm($('[data-film]', el), { ...h.film, start: fromHeader });
  // Desktop legibility scrim: inside the film, above the frames but below its "Illustrative footage" label.
  const scrim = Object.assign(document.createElement('div'), { className: 'hero__scrim' });
  $('.film__label', el).before(scrim);
  // The scroll cue fades once the visitor starts scrolling (and comes back at the very top).
  const cue = $('.hero__cue', el);
  const syncCue = () => cue.classList.toggle('is-gone', scrollY > 8);
  addEventListener('scroll', syncCue, { passive: true });
  syncCue();
  // Live props fade out by the first snap keyframe (38.2%) while the film tidies the desk.
  let fade = null;
  const syncProps = () => {
    fade?.scrollTrigger?.kill();
    fade?.kill();
    fade = null;
    const props = $('.hero__props', el);
    gsap.set(props, { clearProps: 'all' });
    if (reducedQuery.matches) return;
    fade = gsap.to(props, {
      autoAlpha: 0,
      y: -24,
      ease: 'none',
      scrollTrigger: { trigger: el, start: fromHeader, end: '38.2% top', scrub: 1 },
    });
  };
  syncProps();
  reducedQuery.addEventListener('change', syncProps);
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
renderHero();
mountSections(renderLateSections);
smoothScroll();
