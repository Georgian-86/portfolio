// Sections 01b–03: Proof, MissedCalls (night film), LiveAgent and Notes-Pipeline,
// plus their snap animations and the header "Untangled n/4" progress.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sections, work, waLink } from './content.js';
import { mountFilm } from './film.js';
import { mountAgentDemo } from './agent-demo.js';
import { esc, tbc, icon } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');

export const tag = (text, tone = 'navy') => `<span class="note note--${tone} label">${esc(text)}</span>`;
export const respText =(m, d) => (d ? `<span class="m-only">${esc(m)}</span><span class="d-only">${esc(d)}</span>` : esc(m));
const callCard = (c) => `
  <div class="mess-call" style="--rot:${c.rot}deg">
    <span class="prop__icon${c.alert ? ' is-alert' : ''}">${icon.missed}</span>
    <span class="prop__text"><b${c.alert ? ' class="is-alert"' : ''}>${esc(c.title)}</b><span>${esc(c.text)}</span></span>
  </div>`;
export const stickyNote = (n) => `<div class="mess-sticky" style="--rot:${n.rot}deg"><span class="prop__tape"></span><p>${esc(n.text)}</p></div>`;
const bubble = (who, text, cls = '') => `<div class="chat__row chat__row--${who} ${cls}"><p class="bubble bubble--${who}">${esc(text)}</p></div>`;
const chatHead = (name) => `
  <div class="chat__head"><span class="chat__avatar" aria-hidden="true"></span>
    <span class="chat__who"><b>${esc(name)}</b><span class="chat__online label">● online</span></span></div>`;
const bookingCard = (b, cls = '') => `
  <div class="booking ${cls}"><span class="booking__tick">${icon.tick}</span>
    <span class="booking__text"><b>${esc(b.title)}</b><span>${esc(b.text)}</span>${b.tag ? tag(b.tag, 'paper') : ''}</span></div>`;
export const mintCta = (label, msg, iconHtml = icon.whatsapp, after = false) =>
  `<a class="btn btn--mint" data-end href="${waLink(msg)}" target="_blank" rel="noopener">${after ? '' : iconHtml}<span>${esc(label)}</span>${after ? iconHtml : ''}</a>`;
export const cue = (text) =>
  `<p class="cue label" aria-hidden="true"><span class="m-only">↓ ${esc(text)}</span><span class="d-only">${esc(text)} →</span></p>`;

export function renderProof() {
  const p = sections.proof;
  $('[data-sec="01b"]').innerHTML = `
    <div class="proof__head">
      <p class="label label--mint">${esc(p.kicker)}</p>
      <h2 id="proof-h2" class="h-section">${esc(p.h2)}</h2>
      <p class="proof__body">${respText(p.body, p.bodyDesktop)}</p>
    </div>
    <ul class="proof__cards" role="list">
      ${work.map((w, i) => `
        <li class="card" style="--rot:${[1.2, -0.8, 0.6][i] ?? 0}deg">
          <span class="card__tape" aria-hidden="true"></span>
          <div class="card__media" aria-hidden="true"><span class="label">${esc(w.name)}</span></div>
          <div class="card__text">
            <h3 class="card__name">${esc(w.name)}</h3>
            <p class="card__credit label label--mint">${esc(w.credit)}${w.role ? ` ${tbc(w.role)}` : ''}</p>
            <p class="card__blurb">${respText(w.blurb, w.blurbDesktop)}</p>
            <a class="card__more" href="#work"${i === work.length - 1 ? ' data-end' : ''}>${respText(p.more, p.moreDesktop)}</a>
          </div>
        </li>`).join('')}
    </ul>`;
}

export function renderMissedCalls() {
  const m = sections.missedCalls;
  const el = $('[data-sec="02"]');
  el.dataset.untangled = m.untangled;
  const chat = m.chat.map((c) => {
    if (c.kind === 'event') return `<p class="chat__event label">${esc(c.text)}</p>`;
    if (c.kind === 'meta') return `<p class="chat__meta label">${esc(c.text)}</p>`;
    if (c.kind === 'booking') return bookingCard(c);
    return bubble(c.kind, c.text);
  }).join('');
  el.innerHTML = `
    <div class="tangle__mess">
      <p class="label">${esc(m.kicker)}</p>
      <h2 id="missed-h2" class="h-section">${esc(m.h2)}</h2>
      <p class="tangle__body">${respText(m.body, m.bodyDesktop)}</p>
      <div class="mess mess--calls" aria-hidden="true">${m.mess.map(callCard).join('')}</div>
      ${cue(m.cue)}
    </div>
    <div class="tangle__sheet">
      <div class="tangle__film-track"><div class="tangle__film-stage"><div class="tangle__film" data-film></div></div></div>
      <div class="sheet">
        <p class="label label--on-navy">${esc(m.sysKicker)}</p>
        <p class="sheet__lead">${esc(m.lead)}</p>
        <div class="chat chat--wide" role="group" aria-label="Sample WhatsApp conversation">${chatHead(m.chatName)}${chat}</div>
        <div class="sheet__foot">${mintCta(m.cta, m.ctaMessage)}${tag(m.tag)}</div>
      </div>
    </div>`;
  mountFilm($('[data-film]', el), { ...m.film, trigger: $('.tangle__film-track', el) });
}

export function renderLiveAgent() {
  const a = sections.liveAgent;
  const el = $('[data-sec="02b"]');
  el.dataset.theme = 'navy';
  // .agent__side holds copy + explainer; it is `display: contents` on mobile (flex order
  // copy → chat → explainer) and a sticky right column on desktop.
  el.innerHTML = `
    <div class="agent__side">
    <div class="agent__copy">
      <p class="label label--on-navy">${esc(a.kicker)}</p>
      <h2 id="agent-h2" class="h-section">${esc(a.h2)}</h2>
      <p class="agent__body">${esc(a.body)}</p>
      ${tag(a.tag)}
    </div>
    <div class="agent__more">
      <ol class="points" role="list">${a.points.map((t, i) => `<li><span class="label">0${i + 1}</span><span>${esc(t)}</span></li>`).join('')}</ol>
      ${mintCta(a.cta, a.ctaMessage)}
    </div>
    </div>
    <div class="agent__track">
      <div class="agent__stage">
        <div class="chat" role="group" aria-label="Sample demo conversation">
          ${chatHead(a.chatName)}
          ${bubble('visitor', a.customer, 'agent__customer')}
          <div class="agent__slot">
            <div class="chat__row chat__row--agent agent__typing" aria-hidden="true"><span class="typing"><i></i><i></i><i></i></span></div>
            ${bubble('agent', a.reply, 'agent__reply')}
          </div>
          ${bookingCard(a.booking, 'agent__booking')}
        </div>
      </div>
    </div>`;
  mountAgentDemo(el);
}

export function renderPipeline() {
  const p = sections.pipeline;
  const el = $('[data-sec="03"]');
  el.dataset.untangled = p.untangled;
  el.innerHTML = `
    <div class="tangle__mess">
      <p class="label">${esc(p.kicker)}</p>
      <h2 id="pipeline-h2" class="h-section">${esc(p.h2)}</h2>
      <p class="tangle__body">${esc(p.body)}</p>
      <div class="mess mess--notes" aria-hidden="true">${p.mess.map(stickyNote).join('')}</div>
      ${cue(p.cue)}
    </div>
    <div class="tangle__sheet">
      <div class="sheet">
        <p class="label label--on-navy">${esc(p.sysKicker)}</p>
        <p class="sheet__lead">${esc(p.lead)}</p>
        <ol class="steps" role="list">
          ${p.steps.map((st) => `
            <li class="step"><span class="step__tick">${icon.tick}</span>
              <span class="step__text"><b>${esc(st.title)}</b><span>${esc(st.text)}</span></span>
              <span class="step__time">${esc(st.time)}</span></li>`).join('')}
        </ol>
        ${tag(p.tag)}
        ${mintCta(p.cta, p.ctaMessage, icon.send, true)}
      </div>
    </div>`;
}

// Snap animations (Scroll keyframes v2): the mess tidies by 38.2 %, system rows land by 61.8 %.
const SNAP_SECS = '[data-sec="02"], [data-sec="03"], [data-sec="04"], [data-sec="05"]';
const SNAP_ROWS = '.steps > li, .chat--wide > *, .board > *, .story > *';
let snaps = [];
function wireSnaps() {
  snaps.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  snaps = [];
  gsap.set($$(`${SNAP_SECS} .mess > *, ${SNAP_ROWS}`), { clearProps: 'all' });
  if (reducedQuery.matches) return;
  $$(SNAP_SECS).forEach((sec) => {
    // The mess column is sticky on desktop, so drive it by the section's own scroll.
    snaps.push(gsap.to($$('.mess > *', sec), {
      y: (i) => -12 * i, rotate: 0, opacity: 0.35, ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: sec, start: () => `top ${hdrH()}px`, end: '61.8% bottom', scrub: 0.4 },
    }));
    snaps.push(gsap.from($$(SNAP_ROWS, sec), {
      autoAlpha: 0, y: 16, ease: 'none', stagger: 0.1, immediateRender: false,
      scrollTrigger: { trigger: $('.sheet', sec), start: 'top 85%', end: 'top 38.2%', scrub: 0.4 },
    }));
  });
}

// Header "Untangled n/4" progress and the navy header/bar over 02b.
function setUntangled(n) {
  // n = 5 means every tangle is done: the header reads "All clear · 4/4".
  const text = n > 4 ? 'All clear · 4/4' : `Untangled ${n}/4`;
  $$('.hdr .untangled .label, .hdr__progress').forEach((l) => { l.textContent = text; });
  $$('.hdr .untangled__segs i').forEach((seg, i) => seg.classList.toggle('is-on', i < n));
  $('.hdr .untangled')?.setAttribute('aria-label', n > 4 ? 'All clear, 4 of 4 untangled' : `Untangled ${n} of 4`);
}
const hdrH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 60;
function wireProgress() {
  $$('[data-untangled]').forEach((sec) => {
    const n = Number(sec.dataset.untangled);
    ScrollTrigger.create({
      trigger: sec, start: 'top center',
      onEnter: () => setUntangled(n), onLeaveBack: () => setUntangled(n - 1),
    });
  });
  // Navy header and bar while a navy section (02b, 07) sits under the header.
  $$('[data-theme="navy"]').forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: () => `top ${hdrH() + 1}px`, end: () => `bottom ${hdrH() + 1}px`,
    onToggle: (self) => document.documentElement.classList.toggle('is-navy', self.isActive),
  }));
}

// `more` renders later sections (04–09) before the shared snaps and progress are wired.
export function mountSections(more = () => {}) {
  renderProof();
  renderMissedCalls();
  renderLiveAgent();
  renderPipeline();
  more();
  wireSnaps();
  reducedQuery.addEventListener('change', wireSnaps);
  wireProgress();
}
