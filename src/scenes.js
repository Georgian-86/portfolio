// 03 WhatsApp agents (night film + a demo you can steer) and 04 Automations (sheet film + the Wire).
// Each film is full-bleed and pinned for ~220vh of scroll; copy enters with a scrubbed reveal.
// On phones the demo/flow sits after the pinned film, so nothing covers the film or its watermark.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsapp as w, automations as a, waLink } from './content.js';
import { mountFilm } from './film.js';
import { esc, icon, easeOut, reducedQuery } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

const narrow = matchMedia('(max-width: 767px), (max-aspect-ratio: 1/1)');

function sceneShell({ id, kicker, h2, body, extra }) {
  return `
    <div class="scene__track">
      <div class="scene__stage">
        <div class="scene__film" data-film></div>
        <div class="scene__wash" aria-hidden="true"></div>
        <div class="scene__copy">
          <p class="label">${esc(kicker)}</p>
          <h2 id="${id}-h2" class="h2">${esc(h2)}</h2>
          <p class="lead">${esc(body)}</p>
          <div class="scene__slot"></div>
        </div>
      </div>
    </div>
    <div class="scene__after wrap"></div>
    <template>${extra}</template>`;
}

// The extra block (demo / flow) lives in the pinned copy on wide screens and after the film on phones.
function placeExtra(el) {
  const node = el.querySelector('template').content.firstElementChild;
  const put = () => (narrow.matches ? el.querySelector('.scene__after') : el.querySelector('.scene__slot')).append(node);
  put();
  narrow.addEventListener('change', () => { put(); ScrollTrigger.refresh(); });
  return node;
}

function revealCopy(el) {
  const copy = el.querySelector('.scene__copy');
  const parts = [...copy.children].filter((c) => !c.classList.contains('scene__slot') || c.children.length);
  const build = () => {
    gsap.set(parts, { clearProps: 'transform,opacity,visibility' });
    if (reducedQuery.matches) return;
    gsap.fromTo(parts, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, ease: easeOut, stagger: 0.06,
      scrollTrigger: { trigger: el.querySelector('.scene__track'), start: 'top 70%', end: 'top top', scrub: 0.8 },
    });
  };
  build();
}

// ── 03 WhatsApp ─────────────────────────────────────────────
function chatHtml(d) {
  return `
    <div class="chat__top">
      <span class="chat__avatar">${icon.whatsapp}</span>
      <span class="chat__name">${esc(d.name)}</span>
      <span class="chip">${esc(w.tag)}</span>
    </div>
    <p class="msg msg--in" data-step="ask">${esc(d.ask)}</p>
    <p class="msg msg--out msg--typing" data-step="typing" aria-hidden="true"><i></i><i></i><i></i></p>
    <p class="msg msg--out" data-step="reply">${esc(d.reply)}</p>
    <p class="booked" data-step="booked">${icon.tick}<b>${esc(d.booked)}</b><span>${esc(d.note)}</span></p>`;
}

export function renderWhatsapp() {
  const el = document.querySelector('[data-sec="03"]');
  const demo = `
    <div class="demo">
      <div class="demo__pick" role="group" aria-label="${esc(w.pick)}">
        <span class="label">${esc(w.pick)}</span>
        ${w.demos.map((d, i) => `<button type="button" class="pill" data-demo="${d.id}" aria-pressed="${i === 0}" data-node="Play">${esc(d.label)}</button>`).join('')}
      </div>
      <div class="chat" aria-live="polite"></div>
      <a class="btn btn--primary" href="${waLink(w.ctaMessage)}" target="_blank" rel="noopener" style="justify-self:start">${icon.whatsapp}<span>${esc(w.cta)}</span></a>
    </div>`;
  el.innerHTML = sceneShell({ id: 'whatsapp', kicker: w.kicker, h2: w.h2, body: w.body, extra: demo });
  mountFilm(el.querySelector('[data-film]'), { ...w.film, trigger: el.querySelector('.scene__track') });
  const box = placeExtra(el);
  revealCopy(el);

  const chat = box.querySelector('.chat');
  const pills = [...box.querySelectorAll('.pill')];
  let tl = null, current = null;
  const play = (id, { animate = true } = {}) => {
    const d = w.demos.find((x) => x.id === id);
    current = id;
    pills.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.demo === id)));
    tl?.kill();
    chat.innerHTML = chatHtml(d);
    const q = (s) => chat.querySelector(`[data-step="${s}"]`);
    const typing = q('typing');
    if (!animate || reducedQuery.matches) {
      typing.hidden = true;
      el.dataset.demo = 'end';
      return;
    }
    el.dataset.demo = 'play';
    gsap.set([q('ask'), q('reply'), q('booked'), typing], { autoAlpha: 0, y: 12 });
    tl = gsap.timeline({ defaults: { ease: easeOut, duration: 0.5 }, onComplete: () => { el.dataset.demo = 'end'; } })
      .to(q('ask'), { autoAlpha: 1, y: 0 }, 0.1)
      .to(typing, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.6)
      .set(typing, { display: 'none' }, 1.7)
      .to(q('reply'), { autoAlpha: 1, y: 0 }, 1.7)
      .to(q('booked'), { autoAlpha: 1, y: 0 }, 2.4);
  };
  pills.forEach((p) => p.addEventListener('click', () => play(p.dataset.demo)));
  play(w.demos[0].id, { animate: false });
  // First play when the demo comes into view.
  ScrollTrigger.create({ trigger: box, start: 'top 85%', once: true, onEnter: () => play(current) });
}

// ── 04 Automations ──────────────────────────────────────────
export function renderAutomations() {
  const el = document.querySelector('[data-sec="04"]');
  const flow = `
    <div class="flow-wrap" style="display:grid;gap:var(--s-3)">
      <ol class="flow" role="list">
        <span class="flow__wire" aria-hidden="true"><i></i></span>
        ${a.flow.map((f) => `
          <li class="flow__step">
            <span class="flow__node" aria-hidden="true">${esc(f.k)}</span>
            <span class="flow__title">${esc(f.title)}</span>
            <span class="flow__text">${esc(f.text)}</span>
          </li>`).join('')}
      </ol>
      <span class="chip" style="justify-self:start">${esc(a.tag)}</span>
    </div>`;
  el.innerHTML = sceneShell({ id: 'automations', kicker: a.kicker, h2: a.h2, body: a.body, extra: flow });
  mountFilm(el.querySelector('[data-film]'), { ...a.film, trigger: el.querySelector('.scene__track') });
  const box = placeExtra(el);
  revealCopy(el);

  const wire = box.querySelector('.flow__wire i');
  const steps = [...box.querySelectorAll('.flow__step')];
  let st = null;
  const build = () => {
    st?.kill();
    const vertical = narrow.matches;
    gsap.set(wire, { clearProps: 'transform' });
    if (reducedQuery.matches) { steps.forEach((s) => s.classList.add('is-on')); return; }
    const prop = vertical ? 'scaleY' : 'scaleX';
    // Wide: the wire runs while the film is pinned. Phone: while the flow itself scrolls past.
    const trig = vertical
      ? { trigger: box, start: 'top 80%', end: 'bottom 45%' }
      : { trigger: el.querySelector('.scene__track'), start: 'top top', end: 'bottom bottom' };
    const range = vertical ? [0, 1] : [0.15, 0.8];
    const o = { p: 0 };
    const tw = gsap.to(o, {
      p: 1, ease: 'none',
      scrollTrigger: { ...trig, scrub: 0.8 },
      onUpdate: () => {
        const p = Math.min(1, Math.max(0, (o.p - range[0]) / (range[1] - range[0])));
        gsap.set(wire, { [prop]: p });
        steps.forEach((x, i) => x.classList.toggle('is-on', p >= i / (steps.length - 1) - 0.001));
      },
    });
    st = { kill: () => { tw.scrollTrigger?.kill(); tw.kill(); } };
  };
  build();
  narrow.addEventListener('change', build);
  reducedQuery.addEventListener('change', build);
}
