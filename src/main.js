import './tokens.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { brand, sections, nav, waLink } from './content.js';
import { mountFilm } from './film.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tbc = (v) => (v === 'TBC' ? '<span class="tbc">TBC</span>' : esc(v));

// Inline icons (stand-ins: the Figma asset host is not reachable from the build environment).
const icon = {
  whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  send: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
  calendar: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></g></svg>',
  missed: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/><path d="m15 4 5 5M20 4l-5 5"/></g></svg>',
  mark: '<svg class="mark" width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><text x="0" y="10" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="currentColor">G</text><text x="8" y="21" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="currentColor">K</text></svg>',
};

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
    <ul role="list">${nav.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
    <a class="btn btn--primary" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>`;
}

function wireMenu() {
  const btn = $('.hdr__menu');
  const menu = $('#menu');
  const set = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('menu-open', open);
  };
  btn.addEventListener('click', () => set(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); }
  });
  matchMedia('(min-width: 1100px)').addEventListener('change', () => set(false));
}

function renderBar() {
  const bar = $('[data-bar]');
  bar.innerHTML = `
    <label class="bar__field">
      <span class="bar__icon">${icon.whatsapp}</span>
      <span class="sr-only">Your message</span>
      <input name="msg" type="text" autocomplete="off" enterkeyhint="send" placeholder="${esc(brand.barPlaceholder)}" />
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
      </div>
    </div>`;
  mountFilm($('[data-film]', el), h.film);
  if (!reduced) {
    // Live props fade out by the first snap keyframe (38.2%) while the film tidies the desk.
    gsap.to($('.hero__props', el), {
      autoAlpha: 0,
      y: -24,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: '38.2% top', scrub: 0.4 },
    });
  }
}

function renderCta() {
  const c = sections.cta;
  $('[data-sec="09"]').innerHTML = `
    <div class="cta-sec__inner">
      <h2 id="cta-h2" class="cta-sec__h2">${esc(c.h2)}</h2>
      <p class="cta-sec__body">${esc(c.body)}</p>
      <a class="btn btn--primary cta" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
    </div>`;
}

function smoothScroll() {
  if (reduced) return;
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

renderHeader();
wireMenu();
renderBar();
renderHero();
renderCta();
smoothScroll();
