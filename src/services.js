// 02 What I build: one pinned stage. As you scroll, the particle field morphs
// cloud → browser (Grow) → chat bubble (Automate) → phone (Ship) and the matching group lights up.
// three.js is imported only when the section is within a viewport; canvas 2D if WebGL is missing.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services as s } from './content.js';
import { esc, reducedQuery, clamp } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

// Scroll progress → morph (0 cloud … 3 ship) and the active group.
const KEYS = [[0, 0], [0.1, 1], [0.3, 1], [0.4, 2], [0.6, 2], [0.7, 3], [1, 3]];
export function morphAt(p) {
  for (let i = 1; i < KEYS.length; i++) {
    const [p0, m0] = KEYS[i - 1], [p1, m1] = KEYS[i];
    if (p <= p1) return m0 + (m1 - m0) * clamp((p - p0) / (p1 - p0));
  }
  return 3;
}
const groupAt = (p) => (p < 0.35 ? 0 : p < 0.65 ? 1 : 2);

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

export function renderServices() {
  const el = document.querySelector('[data-sec="02"]');
  el.innerHTML = `
    <div class="services__stage">
      <canvas class="services__canvas" aria-hidden="true"></canvas>
      <div class="services__copy">
        <div class="services__head">
          <p class="label">${esc(s.kicker)}</p>
          <h2 id="services-h2" class="h2">${esc(s.h2)}</h2>
          <ol class="services__index label" role="list" aria-hidden="true">
          ${s.groups.map((g, i) => `<li${i === 0 ? ' class="is-on"' : ''}>${g.n} ${esc(g.title)}</li>`).join('')}
        </ol>
        </div>
        <ol class="services__groups" role="list">
          ${s.groups.map((g, i) => `
            <li class="svc${i === 0 ? ' is-on' : ''}" data-group="${g.id}">
              <span class="svc__n label">${g.n}</span>
              <h3 class="svc__title">${esc(g.title)}</h3>
              <p class="svc__line">${esc(g.line)}</p>
              <ul class="svc__items" role="list">${g.items.map((it) => `<li class="chip">${esc(it)}</li>`).join('')}</ul>
            </li>`).join('')}
        </ol>
      </div>
    </div>`;

  const canvas = el.querySelector('.services__canvas');
  const groups = [...el.querySelectorAll('.svc')];
  const ticks = [...el.querySelectorAll('.services__index li')];
  let field = null, loading = null, progress = 0, visible = false, active = 0;

  const setGroup = (i) => {
    if (i === active) return;
    active = i;
    groups.forEach((g, k) => g.classList.toggle('is-on', k === i));
    ticks.forEach((t, k) => t.classList.toggle('is-on', k === i));
  };

  const ensureField = () => {
    if (field || loading) return loading;
    const count = innerWidth < 768 ? 1100 : 2200;
    const reduced = reducedQuery.matches;
    loading = (webglOk() ? import('./three-lite.js').catch(() => null) : Promise.resolve(null)).then(async (THREE) => {
      const { createField } = await import('./particles.js');
      try {
        field = createField(canvas, { count, THREE, reduced });
      } catch {
        field = createField(canvas, { count, THREE: null, reduced }); // WebGL context failed: 2D
      }
      el.dataset.renderer = THREE ? 'webgl' : '2d';
      field.setMorph(reduced ? 3 : morphAt(progress), true);
      if (visible) field.start();
    });
    return loading;
  };

  ScrollTrigger.create({
    trigger: el, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      progress = st.progress;
      field?.setMorph(morphAt(progress));
      setGroup(groupAt(progress));
      el.dataset.progress = progress.toFixed(3);
    },
  });

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { ensureField(); field?.start(); } else field?.stop();
  }, { rootMargin: '100% 0px' }).observe(el);

  el.addEventListener('pointermove', (e) => field?.pointer(e.clientX, e.clientY), { passive: true });
  el.addEventListener('pointerleave', () => field?.release());
  new ResizeObserver(() => field?.resize()).observe(canvas);
  reducedQuery.addEventListener('change', () => {
    if (reducedQuery.matches) { field?.stop(); field?.setMorph(3, true); }
    else { field?.setMorph(morphAt(progress), true); if (visible) field?.start(); }
  });
}
