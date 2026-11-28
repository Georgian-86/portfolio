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
// The copy follows the figure, not a separate clock: a group is active while its shape is the nearest
// one (the cloud counts as Grow), and its text is fully in only when its shape has formed.
export const groupOf = (m) => clamp(Math.round(m) - 1, 0, 2);
export const copyWeight = (m, g) => clamp(1 - Math.abs(m - (g + 1)) * 2.2);

/** WebGL probe that frees its context at once, so it never counts against the browser's live-context cap. */
function webglOk() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch { return false; }
}

export function renderServices() {
  const el = document.querySelector('[data-sec="02"]');
  el.innerHTML = `
    <div class="services__stage">
      <canvas class="services__canvas" aria-hidden="true"></canvas>
      <div class="services__copy">
        <div class="services__head">
          ${s.kicker ? `<p class="label">${esc(s.kicker)}</p>` : ''}
          <h2 id="services-h2" class="h2">${esc(s.h2)}</h2>
          <ol class="services__index label" role="list" aria-hidden="true">
          ${s.groups.map((g, i) => `<li${i === 0 ? ' class="is-on"' : ''}>${esc(g.title)}</li>`).join('')}
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

  let canvas = el.querySelector('.services__canvas');
  const stage = el.querySelector('.services__stage');
  const groups = [...el.querySelectorAll('.svc')];
  const ticks = [...el.querySelectorAll('.services__index li')];
  let field = null, loading = null, progress = 0, visible = false, active = 0, losses = 0;

  const setGroup = (i) => {
    if (i === active) return;
    active = i;
    groups.forEach((g, k) => g.classList.toggle('is-on', k === i));
    ticks.forEach((t, k) => t.classList.toggle('is-on', k === i));
  };
  // Scrubs each group's copy with the morph (opacity + translate only). Reduced motion: the CSS end state.
  const syncCopy = () => {
    const m = morphAt(progress);
    setGroup(groupOf(m));
    const on = !reducedQuery.matches;
    stage.classList.toggle('is-scrubbed', on);
    groups.forEach((g, k) => {
      if (!on) { g.style.opacity = ''; g.style.translate = ''; return; }
      const w = copyWeight(m, k);
      g.style.opacity = w.toFixed(3);
      g.style.translate = `0 ${((1 - w) * (m < k + 1 ? 24 : -24)).toFixed(1)}px`;
    });
  };

  const ro = new ResizeObserver(() => field?.resize());
  ro.observe(canvas);
  // A canvas that has held a WebGL context can't be reused for 2D or a second WebGL context: swap in a new one.
  const freshCanvas = () => {
    const c = canvas.cloneNode(false);
    ro.unobserve(canvas);
    canvas.replaceWith(c);
    canvas = c;
    ro.observe(c);
  };
  const count = innerWidth < 768 ? 1100 : 2200;
  const build = (THREE) => {
    const reduced = reducedQuery.matches;
    try {
      field = createField(canvas, { count, THREE, reduced });
    } catch {
      THREE = null; // WebGL context failed: draw in 2D on a clean canvas
      freshCanvas();
      field = createField(canvas, { count, THREE: null, reduced });
    }
    el.dataset.renderer = THREE ? 'webgl' : '2d';
    field.setMorph(reduced ? 3 : morphAt(progress), true);
    if (visible) field.start();
    if (THREE) {
      // The GPU can drop the context (GPU switch, driver reset, too many contexts). Rebuild on a new
      // canvas instead of leaving an empty stage; after repeated losses, settle on 2D.
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        field?.destroy();
        field = null;
        el.dataset.renderer = 'lost';
        losses += 1;
        setTimeout(() => { freshCanvas(); build(losses > 2 ? null : THREE); }, 200);
      }, { once: true });
    }
  };
  let createField = null;
  // Build the field when the main thread is free, so it never delays the loader or first paint.
  const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60));
  const ensureField = () => {
    if (field || loading) return loading;
    loading = (webglOk() ? import('./three-lite.js').catch(() => null) : Promise.resolve(null)).then(async (THREE) => {
      ({ createField } = await import('./particles.js'));
      build(THREE);
    });
    return loading;
  };

  ScrollTrigger.create({
    trigger: el, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      progress = st.progress;
      field?.setMorph(morphAt(progress));
      syncCopy();
      el.dataset.progress = progress.toFixed(3);
    },
  });
  syncCopy();

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { idle(ensureField); field?.start(); } else field?.stop();
  }, { rootMargin: '100% 0px' }).observe(el);

  el.addEventListener('pointermove', (e) => field?.pointer(e.clientX, e.clientY), { passive: true });
  el.addEventListener('pointerleave', () => field?.release());
  reducedQuery.addEventListener('change', () => {
    syncCopy();
    if (reducedQuery.matches) { field?.stop(); field?.setMorph(3, true); }
    else { field?.setMorph(morphAt(progress), true); if (visible) field?.start(); }
  });
}
