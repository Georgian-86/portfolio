// The desk world behind sections 03 (WhatsApp, night) and 04 (Automations, morning).
// One fixed canvas, one camera flight: the phone wakes at night, then the morning laptop opens.
// three.js loads only when the services section is near; nothing renders while the world is off screen.
// No WebGL: the canvas stays hidden and the sections fall back to the plain night/paper page.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedQuery, clamp } from '../ui.js';

gsap.registerPlugin(ScrollTrigger);

const narrow = matchMedia('(max-width: 767px), (max-aspect-ratio: 1/1)');

// Camera keyframes (cm): position + look-at target. Same desk as /lab/scenes.html.
const CAM = {
  dusk:    { cx: 34, cy: 17, cz: 30,  tx: 16, ty: 1,    tz: 2 },
  chat:    { cx: 2,  cy: 15, cz: 19,  tx: 16, ty: 0.5,  tz: 1 },
  closeup: { cx: 20, cy: 31, cz: 13,  tx: 16, ty: 0,    tz: 1.5 },
  dawn:    { cx: -8, cy: 62, cz: -18, tx: 0,  ty: 0,    tz: -70 },
  laptop:  { cx: 16, cy: 34, cz: -28, tx: 0,  ty: 6,    tz: -80 },
  screen:  { cx: 4,  cy: 33, cz: -33, tx: 0,  ty: 10,   tz: -88.5 },
};
const START = { ...CAM.dusk, untangle: 1, headSwap: 1, dusk: 1, screen: 0, chat: 0, dawn: 0, sheets: 0, lid: 0, dash: 0 };
// Reduced motion: two stills, one per section.
const STILL = {
  night: { ...START, ...CAM.closeup, screen: 1, chat: 4.3 },
  morning: { ...START, ...CAM.screen, dusk: 0, dawn: 1, sheets: 1, lid: 1, dash: 1 },
};

function webglOk() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

/** Mounts the world behind `night` and `morning`. Returns { setConvo(demo) } for the WhatsApp pills. */
export function mountWorld(night, morning, { convo, before }) {
  const canvas = Object.assign(document.createElement('canvas'), { className: 'world-bg' });
  canvas.setAttribute('aria-hidden', 'true');
  document.querySelector('.nightfall').after(canvas);
  const S = { ...START, shift: 0, lift: 0 };
  const view = {};
  let desk = null, loading = null, replay = -1, visible = false, still = null;

  const framing = () => {
    S.shift = narrow.matches ? 0 : 0.2;  // subject right of centre, copy on the left
    S.lift = narrow.matches ? 0.16 : 0;  // phones: subject below the top copy band
  };
  framing();
  narrow.addEventListener('change', framing);

  const draw = () => {
    if (!desk) return;
    Object.assign(view, still || S);
    view.shift = S.shift; view.lift = S.lift;
    if (replay >= 0 && !still) view.chat = replay;
    desk.render(view, 1 / 60);
  };

  const load = () => {
    if (loading || !webglOk()) return loading;
    loading = import('./desk.js').then(async ({ createDesk }) => {
      desk = await createDesk(canvas, { hero: false, convo, maxDpr: 1.5 });
      addEventListener('resize', () => desk.resize());
      document.documentElement.dataset.world = 'ready';
      draw();
      fade();
    }).catch(() => { document.documentElement.dataset.world = 'off'; });
    return loading;
  };
  // Start loading while the visitor is still in the services section.
  // (Also when a visitor lands mid-page or jumps here from the menu.)
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) load(); }, { rootMargin: '150% 0px' });
  [before, night, morning].forEach((el) => io.observe(el));

  // ── Choreography across both sections ──
  let tl = null;
  const build = () => {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
    Object.assign(S, START);
    if (reducedQuery.matches) return;
    tl = gsap.timeline({
      defaults: { ease: 'sine.inOut' },
      scrollTrigger: { trigger: night, start: 'top bottom', endTrigger: morning, end: 'bottom bottom', scrub: 1 },
    })
      // Night (section 03): the phone wakes, the chat types itself, the camera circles in.
      .to(S, { screen: 1, duration: 0.6, ease: 'power2.out' }, 1.2)
      .to(S, { chat: 4.3, duration: 3.2, ease: 'none' }, 1.6)
      .to(S, { ...CAM.chat, duration: 2 }, 1.4)
      .to(S, { ...CAM.closeup, duration: 1.6 }, 3.6)
      // Dawn: daylight returns as section 04 arrives.
      .to(S, { dusk: 0, dawn: 1, screen: 0, duration: 1.6, ease: 'none' }, 5.6)
      .to(S, { ...CAM.dawn, duration: 2 }, 5.6)
      // Morning (section 04): the sheets tidy away, the laptop opens, the dashboard fills in.
      .to(S, { sheets: 1, duration: 1.8 }, 7.4)
      .to(S, { ...CAM.laptop, duration: 1.6 }, 7.6)
      .to(S, { lid: 1, duration: 1.4 }, 8.0)
      .to(S, { dash: 1, duration: 1.4, ease: 'none' }, 9.2)
      .to(S, { ...CAM.screen, duration: 1.6 }, 9.4)
      .to({}, { duration: 0.8 }, 11);
  };
  build();
  reducedQuery.addEventListener('change', build);
  if (reducedQuery.matches) {
    ScrollTrigger.create({ trigger: night, start: 'top center', end: 'bottom center', onToggle: (s) => { if (s.isActive) { still = STILL.night; draw(); } } });
    ScrollTrigger.create({ trigger: morning, start: 'top center', end: 'bottom center', onToggle: (s) => { if (s.isActive) { still = STILL.morning; draw(); } } });
  }

  // ── Visibility: fade the world in as 03 arrives and out as 04 leaves (opacity only) ──
  const setOpacity = gsap.quickSetter(canvas, 'opacity');
  const fade = () => {
    const vh = innerHeight;
    const a = night.getBoundingClientRect().top, b = morning.getBoundingClientRect().bottom;
    // Fully gone before the next section's heading reaches mid-screen.
    const o = clamp((vh - a) / (vh * 0.6)) * clamp((b - vh * 0.55) / (vh * 0.45));
    setOpacity(desk ? o : 0);
    visible = o > 0.001;
    canvas.style.visibility = visible ? 'visible' : 'hidden';
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: fade });
  addEventListener('resize', fade);
  fade();

  const loop = () => {
    if (visible && !reducedQuery.matches) {
      if (S.chat < 1) replay = -1; // scrolled back before the chat: the scroll owns it again
      draw();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return {
    /** Shows another sample conversation and replays it on the phone. */
    setConvo(demo) {
      desk?.setConvo(demo);
      if (reducedQuery.matches) { draw(); return; }
      const o = { v: 1 };
      gsap.to(o, { v: 4.3, duration: 2.6, ease: 'none', onUpdate: () => { replay = o.v; if (!visible) draw(); } });
    },
    ready: () => loading || load(),
  };
}
