// Scroll choreography for the desk world. One pinned section; a single GSAP timeline scrubs a plain
// state object, and the render loop reads it. Lenis makes the wheel continuous.
import './lab.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createDesk } from '../world/desk.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);

// Camera keyframes: position (cx,cy,cz) and look-at target (tx,ty,tz), in cm.
const CAM = {
  hero:     { cx: 0,   cy: 95, cz: 0.01, tx: 0,  ty: 0,   tz: 0 },
  untangle: { cx: 4,   cy: 58, cz: 44,   tx: 9,  ty: 0,   tz: 1 },
  dusk:     { cx: 34,  cy: 17, cz: 30,   tx: 16, ty: 1,   tz: 2 },
  chat:     { cx: 2,   cy: 15, cz: 19,   tx: 16, ty: 0.5, tz: 1 },
  closeup:  { cx: 18,  cy: 22, cz: 9,    tx: 16, ty: 0,   tz: 1.5 },
  dawn:     { cx: -8,  cy: 62, cz: -18,  tx: 0,  ty: 0,   tz: -70 },
  laptop:   { cx: 16,  cy: 34, cz: -28,  tx: 0,  ty: 6,   tz: -80 },
  screen:   { cx: 3,   cy: 28, cz: -42,  tx: 0,  ty: 11.6, tz: -88.5 },
};

const S = {
  ...CAM.hero,
  untangle: 0, headSwap: 0, dusk: 0, screen: 0, chat: 0, dawn: 0, sheets: 0, lid: 0, dash: 0,
  noteNight: 0, noteSheet: 0,
};

const stage = $('.world');
const canvas = $('.world__canvas');
const loading = $('.world__loading');

const desk = await createDesk(canvas, { onProgress: (p) => { loading.textContent = p < 1 ? 'Setting the desk…' : ''; } });
loading.hidden = true;
addEventListener('resize', desk.resize);

if (reduced) {
  // A single still: the tidy desk, mid-evening, chat answered.
  Object.assign(S, CAM.untangle, { untangle: 1, headSwap: 1 });
  desk.render(S, 0);
} else {
  // ?capture: no scroll; the timeline is seeked frame by frame (used to record the preview video).
  const capture = new URLSearchParams(location.search).has('capture');
  if (!capture) {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const notes = { night: $('[data-chapter="night"]'), sheet: $('[data-chapter="sheet"]') };
  const tl = gsap.timeline({
    defaults: { ease: 'sine.inOut' },
    scrollTrigger: capture ? undefined : { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 1 },
    paused: capture,
    onUpdate: () => {
      notes.night.style.opacity = S.noteNight;
      notes.sheet.style.opacity = S.noteSheet;
      stage.dataset.progress = tl.progress().toFixed(3);
    },
  });
  // Act 1 — untangle (0 → 3)
  tl.to(S, { untangle: 1, duration: 3 }, 0.4)
    .to(S, { headSwap: 1, duration: 0.8, ease: 'none' }, 1.2)
    .to(S, { ...CAM.untangle, duration: 3 }, 0.4)
  // Act 2 — night (3 → 7)
    .to(S, { ...CAM.dusk, duration: 1.6 }, 3.4)
    .to(S, { dusk: 1, duration: 1.4, ease: 'none' }, 3.4)
    .to(S, { screen: 1, duration: 0.4, ease: 'power2.out' }, 4.6)
    .to(S, { chat: 4.3, duration: 2.4, ease: 'none' }, 4.9)
    .to(S, { ...CAM.chat, duration: 1.4 }, 5.0)
    .to(S, { ...CAM.closeup, duration: 1.2 }, 6.4)
    .to(S, { noteNight: 1, duration: 0.3, ease: 'none' }, 5.0)
    .to(S, { noteNight: 0, duration: 0.3, ease: 'none' }, 7.2)
  // Act 3 — morning: the sheets tidy away, the laptop opens (7.6 → 12)
    .to(S, { dusk: 0, dawn: 1, screen: 0, duration: 1.4, ease: 'none' }, 7.6)
    .to(S, { ...CAM.dawn, duration: 1.8 }, 7.6)
    .to(S, { sheets: 1, duration: 1.8 }, 9.2)
    .to(S, { ...CAM.laptop, duration: 1.6 }, 9.4)
    .to(S, { lid: 1, duration: 1.4 }, 9.8)
    .to(S, { dash: 1, duration: 1.4, ease: 'none' }, 11.0)
    .to(S, { noteSheet: 1, duration: 0.3, ease: 'none' }, 10.4)
    .to(S, { ...CAM.screen, duration: 1.4 }, 11.2)
    .to(S, { noteSheet: 0, duration: 0.3, ease: 'none' }, 12.2)
    .to({}, { duration: 0.4 }, 12.6);

  if (capture) {
    window.__seek = (p) => { tl.progress(p); notes.night.style.opacity = S.noteNight; notes.sheet.style.opacity = S.noteSheet; desk.render(S, 1 / 30); };
    window.__ready = true;
  }
  // Render only while the world is on screen.
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible && !capture) desk.render(S, dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
