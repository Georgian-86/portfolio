// 03 WhatsApp agents and 04 Automations. Both sit over the code-built desk world (src/world):
// at night the phone wakes and books the slot; by morning the laptop shows the dashboard.
// The copy is pinned over the world for ~220vh each; on phones the demo/flow follows the pin.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsapp as w, automations as a, waLink } from './content.js';
import { mountWorld } from './world/mount.js';
import { esc, icon, easeOut, reducedQuery } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

const narrow = matchMedia('(max-width: 767px), (max-aspect-ratio: 1/1)');

function sceneShell({ id, kicker, h2, body, extra }) {
  return `
    <div class="scene__track">
      <div class="scene__stage">
        <div class="scene__wash" aria-hidden="true"></div>
        <div class="scene__copy">
          ${kicker ? `<p class="label">${esc(kicker)}</p>` : ''}
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
const transcript = (d) => `${w.tag} with ${d.name}. Customer: ${d.ask} Agent: ${d.reply} Customer: ${d.follow} ${d.booked}.`;

export function renderWhatsapp() {
  const el = document.querySelector('[data-sec="03"]');
  const demo = `
    <div class="demo">
      <div class="demo__pick" role="group" aria-label="${esc(w.pick)}">
        <span class="label">${esc(w.pick)}</span>
        ${w.demos.map((d, i) => `<button type="button" class="pill" data-demo="${d.id}" aria-pressed="${i === 0}" data-node="Play">${esc(d.label)}</button>`).join('')}
      </div>
      <p class="demo__tag chip">${esc(w.tag)}, shown on the phone</p>
      <p class="sr-only demo__transcript" aria-live="polite">${esc(transcript(w.demos[0]))}</p>
      <a class="btn btn--primary" href="${waLink(w.ctaMessage)}" target="_blank" rel="noopener" style="justify-self:start">${icon.whatsapp}<span>${esc(w.cta)}</span></a>
    </div>`;
  el.innerHTML = sceneShell({ id: 'whatsapp', kicker: w.kicker, h2: w.h2, body: w.body, extra: demo });
  const box = placeExtra(el);
  revealCopy(el);
  return { el, box };
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

// ── The world behind both, and the pills that steer the phone ──
export function renderScenes() {
  const { el, box } = renderWhatsapp();
  renderAutomations();
  const morning = document.querySelector('[data-sec="04"]');
  const world = mountWorld(el, morning, { convo: w.demos[0], before: document.querySelector('[data-sec="02"]') });
  const pills = [...box.querySelectorAll('.pill')];
  const said = box.querySelector('.demo__transcript');
  pills.forEach((p) => p.addEventListener('click', () => {
    const d = w.demos.find((x) => x.id === p.dataset.demo);
    pills.forEach((x) => x.setAttribute('aria-pressed', String(x === p)));
    said.textContent = transcript(d);
    el.dataset.demo = d.id;
    world.setConvo(d);
  }));
  el.dataset.demo = w.demos[0].id;
}
