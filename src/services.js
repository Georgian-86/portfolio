// 02 What I build: one pinned stage. As you scroll, the particle field morphs
// cloud → browser (Grow) → chat bubble (Automate) → phone (Ship) and the matching group lights up.
// three.js is imported only when the section is within a viewport; canvas 2D if WebGL is missing.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services as s } from './content.js';
import { esc, reducedQuery, clamp, idle } from './ui.js';

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

  // Phones: the figure lives in the strip between the heading and the tallest group's copy, so
  // the big "Grow / Automate / Ship" title never sits on top of it.
  const head = el.querySelector('.services__head');
  const groupsBox = el.querySelector('.services__groups');
  const fitBand = () => {
    if (!field) return;
    if (innerWidth >= 768) { field.setBand(null); return; }
    const c = canvas.getBoundingClientRect();
    const top = head.getBoundingClientRect().bottom - c.top + 12;
    const bottom = groupsBox.getBoundingClientRect().top - c.top - 12;
    field.setBand(bottom - top > 80 ? { top, bottom } : null);
  };
  const ro = new ResizeObserver(() => { field?.resize(); fitBand(); });
  ro.observe(canvas);
  ro.observe(groupsBox);
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
    fitBand();
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
  const ensureField = () => {
    if (field || loading) return loading;
    // No separate WebGL probe: creating a probe context costs as much as the real one. build() falls back to 2D.
    loading = Promise.all([import('./three-lite.js').catch(() => null), import('./particles.js')]).then(([THREE, mod]) => {
      createField = mod.createField;
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

  // Build a viewport early; render only while the stage is actually on screen (it used to keep
  // rendering a full viewport past the section, on top of the desk world's own WebGL frames).
  new IntersectionObserver(([e]) => { if (e.isIntersecting) ensureField(); }, { rootMargin: '100% 0px' }).observe(el);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) { ensureField(); field?.start(); } else field?.stop();
  }).observe(el);

  el.addEventListener('pointermove', (e) => field?.pointer(e.clientX, e.clientY), { passive: true });
  el.addEventListener('pointerleave', () => field?.release());
  reducedQuery.addEventListener('change', () => {
    syncCopy();
    if (reducedQuery.matches) { field?.stop(); field?.setMorph(3, true); }
    else { field?.setMorph(morphAt(progress), true); if (visible) field?.start(); }
  });
  // main.js warms the field up right after the loader, so it is drawn before anyone scrolls to it.
  return { warm: () => ensureField() || Promise.resolve() };
}
