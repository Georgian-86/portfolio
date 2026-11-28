// 05 Selected work, two speeds.
// Stage: one full-screen panel per project; each stacks over the last (the one below sinks back).
// List: a fast index for recruiters; rows expand in place, and on fine pointers a preview card
// follows the Node. The choice is remembered.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { work as w, waLink } from './content.js';
import { esc, tbc, icon, reducedQuery, fineQuery } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

const KEY = 'work-mode';
const credit = (p) => `${esc(p.credit)}${p.role ? ` · ${tbc(p.role)}` : ''}`;
const ask = (p) => waLink(`Hi Golu, I’d like to hear about ${p.name}.`);

export function renderWork() {
  const el = document.querySelector('[data-sec="05"]');
  const saved = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  const mode = saved === 'list' ? 'list' : 'stage';
  el.dataset.mode = mode;
  el.innerHTML = `
    <div class="work__head wrap">
      <div class="sec-head">
        ${w.kicker ? `<p class="label">${esc(w.kicker)}</p>` : ''}
        <h2 id="work-h2" class="h2">${esc(w.h2)}</h2>
      </div>
      <div class="toggle" role="group" aria-label="View work as">
        <span class="toggle__thumb" aria-hidden="true"></span>
        ${w.modes.map(([id, label]) => `<button type="button" data-mode="${id}" aria-pressed="${id === mode}" data-node="${label}">${esc(label)}</button>`).join('')}
      </div>
    </div>
    <div class="stage">
      ${w.projects.map((p) => `
        <article class="panel" aria-labelledby="p-${p.id}">
          <div class="panel__card tone-${p.tone}">
            <span class="panel__dim" aria-hidden="true"></span>
            <div class="panel__media" aria-hidden="true">
              <p class="panel__poster" style="--len:${Math.max(5, ...p.name.split(' ').map((x) => x.length))}">${esc(p.name)}</p>
              <span class="panel__shot chip">${esc(w.shot)}</span>
            </div>
            <div class="panel__info">
              <p class="label">${esc(p.kind)}, year ${tbc(p.year)}</p>
              <h3 id="p-${p.id}" class="panel__name">${esc(p.name)}</h3>
              <p class="panel__credit label">${credit(p)}</p>
              <p class="panel__blurb">${esc(p.blurb)}</p>
              <a class="btn btn--ink panel__ask" href="${ask(p)}" target="_blank" rel="noopener" data-node="Ask">${icon.whatsapp}<span>${esc(w.ask)}</span></a>
            </div>
          </div>
        </article>`).join('')}
    </div>
    <div class="list wrap" role="list">
      ${w.projects.map((p) => `
        <div class="row" role="listitem" data-id="${p.id}">
          <button class="row__btn" type="button" aria-expanded="false" aria-controls="row-${p.id}" data-node="Open">
            <span class="row__name">${esc(p.name)}</span>
            <span class="row__kind label">${esc(p.kind)}</span>
            <span class="row__plus" aria-hidden="true"></span>
          </button>
          <div class="row__body" id="row-${p.id}" role="region" aria-label="${esc(p.name)}">
            <div><div class="row__inner">
              <p><span class="label">${credit(p)}</span><br>${esc(p.blurb)}</p>
              <a class="btn btn--ghost" href="${ask(p)}" target="_blank" rel="noopener" data-node="Ask">${icon.whatsapp}<span>${esc(w.ask)}</span></a>
            </div></div>
          </div>
        </div>`).join('')}
    </div>
    <div class="preview" aria-hidden="true"><p class="preview__name"></p><span class="chip">${esc(w.shot)}</span></div>`;

  // ── Toggle ──
  const btns = [...el.querySelectorAll('.toggle button')];
  const thumb = el.querySelector('.toggle__thumb');
  const placeThumb = () => {
    const on = btns.find((b) => b.getAttribute('aria-pressed') === 'true');
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.transform = `translateX(${on.offsetLeft - 4}px)`;
  };
  btns.forEach((b) => b.addEventListener('click', () => {
    const m = b.dataset.mode;
    if (el.dataset.mode === m) return;
    el.dataset.mode = m;
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    placeThumb();
    try { localStorage.setItem(KEY, m); } catch { /* private mode */ }
    ScrollTrigger.refresh();
  }));
  requestAnimationFrame(placeThumb);
  addEventListener('resize', placeThumb);
  document.fonts?.ready.then(placeThumb);

  // ── Stage: the panel below sinks back as the next one slides over it ──
  const cards = [...el.querySelectorAll('.panel__card')];
  const dims = [...el.querySelectorAll('.panel__dim')];
  const panels = [...el.querySelectorAll('.panel')];
  const posters = [...el.querySelectorAll('.panel__poster')];
  let tweens = [];
  const build = () => {
    tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    tweens = [];
    gsap.set([...cards, ...posters, ...dims], { clearProps: 'transform,opacity' });
    if (reducedQuery.matches) return;
    cards.slice(0, -1).forEach((c, i) => {
      const scrollTrigger = { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: 0.6 };
      tweens.push(gsap.to(c, { scale: 0.92, ease: 'none', scrollTrigger }));
      tweens.push(gsap.to(dims[i], { opacity: 0.55, ease: 'none', scrollTrigger: { ...scrollTrigger } }));
    });
    posters.forEach((p, i) => {
      tweens.push(gsap.fromTo(p, { yPercent: 18, scale: 0.9 }, {
        yPercent: -6, scale: 1, ease: 'none',
        scrollTrigger: { trigger: panels[i], start: 'top bottom', end: 'top top', scrub: 0.6 },
      }));
    });
  };
  build();
  reducedQuery.addEventListener('change', build);

  // ── List: expand rows; preview follows the pointer ──
  el.querySelectorAll('.row__btn').forEach((b) => b.addEventListener('click', () => {
    const row = b.closest('.row');
    const open = !row.classList.contains('is-open');
    row.classList.toggle('is-open', open);
    b.setAttribute('aria-expanded', String(open));
  }));
  const preview = el.querySelector('.preview');
  const pName = preview.querySelector('.preview__name');
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
  const list = el.querySelector('.list');
  let shown = null;
  const hide = () => { shown = null; gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.out' }); };
  list.addEventListener('pointermove', (e) => {
    if (!fineQuery.matches || reducedQuery.matches || e.pointerType !== 'mouse') return;
    const row = e.target.closest('.row');
    xTo(e.clientX + 28);
    yTo(e.clientY - preview.offsetHeight / 2);
    if (!row || row.classList.contains('is-open')) return hide();
    if (row.dataset.id !== shown) {
      const p = w.projects.find((x) => x.id === row.dataset.id);
      shown = p.id;
      preview.className = `preview tone-${p.tone}`;
      pName.textContent = p.name;
      if (!preview.style.opacity || preview.style.opacity === '0') gsap.set(preview, { x: e.clientX + 28, y: e.clientY - preview.offsetHeight / 2 });
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    }
  }, { passive: true });
  list.addEventListener('pointerleave', hide);
}
