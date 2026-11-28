// v3 loader: the G·K mark draws in while a 0–100 counter tracks real progress
// (DOMContentLoaded 20, fonts 20, the first hero frames 60), then a curtain lifts.
// Capped at 6 s; under reduced motion a static mark shows for at most 300 ms.
import gsap from 'gsap';
import { easeOut } from './ui.js';

const FIRST_FRAMES = 8; // hero frames that must be in before the reveal
const MIN_MS = 900; // let the mark finish drawing on fast connections
const CAP_MS = 6000;

/** `film` is the hero film element (its data-blobs counts fetched frames). Calls `onReveal` as the
 *  curtain starts to lift; resolves once the loader is gone (html[data-loader="done"]). */
export function runLoader(film, onReveal = () => {}) {
  const root = document.documentElement;
  const el = document.querySelector('.loader');
  return new Promise((resolve) => {
    const finish = () => {
      if (el) el.hidden = true;
      root.dataset.loader = 'done';
      resolve();
    };
    if (!el) { onReveal(); return finish(); }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onReveal();
      return setTimeout(finish, 250);
    }
    root.dataset.loader = 'loading';
    const parts = { dom: document.readyState === 'loading' ? 0 : 1, fonts: 0, frames: 0 };
    if (!parts.dom) addEventListener('DOMContentLoaded', () => { parts.dom = 1; }, { once: true });
    if (document.fonts?.ready) document.fonts.ready.then(() => { parts.fonts = 1; });
    else parts.fonts = 1;
    const readFrames = () => {
      const need = Math.min(FIRST_FRAMES, Number(film?.dataset.count) || FIRST_FRAMES);
      parts.frames = film ? Math.min(1, Number(film.dataset.blobs || 0) / need) : 1;
    };
    const count = el.querySelector('.loader__count');
    const t0 = performance.now();
    let shown = 0;
    const tick = (now) => {
      readFrames();
      const target = now - t0 > CAP_MS ? 100 : parts.dom * 20 + parts.fonts * 20 + parts.frames * 60;
      // Ease toward the real progress; never step back.
      shown = Math.max(shown, Math.min(target, shown + Math.max(0.8, (target - shown) * 0.12)));
      const n = shown > 99.5 ? 100 : Math.floor(shown);
      if (count.textContent !== String(n)) count.textContent = String(n);
      if (n === 100 && now - t0 >= MIN_MS) return reveal();
      requestAnimationFrame(tick);
    };
    const reveal = () => {
      el.classList.add('is-leaving');
      onReveal();
      gsap.to(el, { yPercent: -100, duration: 0.8, ease: easeOut, onComplete: finish });
    };
    requestAnimationFrame(tick);
  });
}
