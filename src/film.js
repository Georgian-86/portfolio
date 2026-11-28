// Scroll-scrubbed frame-sequence film (FrameSequence v2).
// - Picks the 16:9 desktop or 9:16 mobile frame set by viewport.
// - Shows a poster <img> until frames arrive; never blanks the canvas on a set switch.
// - Keeps compressed frames (Blobs) and only a sliding window of decoded ImageBitmaps,
//   so ~190 full-size frames are never decoded at once (iOS memory).
// - Under reduced motion it fetches and shows only the last frame, with no scrub.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { easeOut } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px), (max-aspect-ratio: 1/1)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const PRELOAD = 20; // frames fetched first; the rest stream in the background
// Decoded frames kept around the displayed one, biased toward the direction of travel.
const WINDOW_DESKTOP = { ahead: 30, behind: 10 };
const WINDOW_MOBILE = { ahead: 18, behind: 6 };
const LERP = 0.2; // share of the remaining distance the shown frame moves per 60 Hz frame
const MAX_STEP = 3; // most frames the display may advance in one animation frame
const BASE = import.meta.env.BASE_URL;

const frameUrl = (name, set, i) => `${BASE}film/${name}/${set}/frame_${String(i).padStart(4, '0')}.webp`;

// `trigger` (optional) is the element whose scroll drives the scrub; it defaults to the enclosing section.
// `intro` (optional, 0–1) autoplays the film to that point after load; scroll continues from there.
// `introGate` (optional promise) delays the intro, e.g. until the loader's curtain lifts (default: window load).
export function mountFilm(el, { name, desktop, mobile, start = 'top top', end = 'bottom bottom', trigger, intro = 0, introDuration = 2.5, introGate }) {
  const mq = matchMedia(MOBILE_QUERY);
  const rq = matchMedia(REDUCED_QUERY);

  el.classList.add('film', `film--${name}`);
  el.setAttribute('aria-hidden', 'true');
  const poster = document.createElement('img');
  poster.className = 'film__poster';
  poster.alt = '';
  poster.decoding = 'async';
  poster.fetchPriority = 'high';
  const canvas = document.createElement('canvas');
  canvas.className = 'film__canvas';
  const label = document.createElement('span');
  label.className = 'film__label';
  label.textContent = 'AI-generated footage';
  el.append(poster, canvas, label);
  const ctx = canvas.getContext('2d');

  let set = null;
  let count = 0;
  let blobs = []; // compressed frames, index -> Blob
  let bitmaps = new Map(); // decoded window, index -> ImageBitmap
  let decoding = new Set();
  const fetching = new Set();
  let abort = null;
  let shown = null; // bitmap currently painted (may belong to the previous set)
  let reduced = rq.matches;
  let progress = reduced ? 1 : 0;
  let tween = null;
  let near = false; // within ~1 viewport of the screen (IntersectionObserver)
  let scrollP = 0; // scrub progress from ScrollTrigger
  let introA = 0; // autoplay intro offset (0 → intro)
  let introTween = null;

  const current = () => Math.round(progress * (count - 1));

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr);
    if (w && h && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
      knobs = null; // breakpoints may have changed the CSS knobs too
      return true;
    }
    return false;
  }

  // The film's CSS knobs, read once per canvas size instead of on every painted frame
  // (getComputedStyle per frame forced a style recalc in the middle of scrolling).
  let knobs = null;
  function readKnobs() {
    const cs = getComputedStyle(el);
    knobs = {
      ax: parseFloat(cs.getPropertyValue('--film-x')),
      ay: parseFloat(cs.getPropertyValue('--film-y')),
      // --film-fit: "contain" (default) or "cover". Cover must be anchored at the watermark
      // corner (--film-x/--film-y = 1) so the Flow watermark is never cropped.
      fit: cs.getPropertyValue('--film-fit').trim() === 'cover' ? 'cover' : 'contain',
      // --film-inset-b: CSS px kept clear at the bottom (e.g. the mobile bar), so the frame's
      // bottom edge, and the watermark with it, is drawn above it rather than under it.
      insetCss: parseFloat(cs.getPropertyValue('--film-inset-b')) || 0,
      clientW: el.clientWidth,
    };
  }
  function paint(bmp) {
    if (!knobs) readKnobs();
    const { ax, ay, fit, insetCss, clientW } = knobs;
    const inset = insetCss * (canvas.width / (clientW || canvas.width));
    const W = canvas.width, H = Math.max(1, canvas.height - Math.round(inset));
    const s = (fit === 'cover' ? Math.max : Math.min)(W / bmp.width, H / bmp.height);
    const dw = bmp.width * s, dh = bmp.height * s;
    const x = (W - dw) * (isNaN(ax) ? 0.5 : ax), y = (H - dh) * (isNaN(ay) ? 0 : ay);
    ctx.clearRect(0, 0, W, canvas.height);
    ctx.drawImage(bmp, x, y, dw, dh);
    // Attribute writes invalidate style, so only write when the values change (not on every frame).
    const draw = JSON.stringify({ x: Math.round(x), y: Math.round(y), w: Math.round(dw), h: Math.round(dh), cw: W, ch: canvas.height });
    if (el.dataset.fit !== fit) el.dataset.fit = fit;
    if (el.dataset.draw !== draw) el.dataset.draw = draw;
  }

  // ── Display: a rAF loop eases the shown frame (`disp`) toward the target, but only across
  // frames that are already decoded, so it never holds a stale frame and then jumps. ──
  const win = () => (set === 'mobile' ? WINDOW_MOBILE : WINDOW_DESKTOP);

  // Furthest index reachable from `from` toward `to` through consecutively decoded frames.
  function reachable(from, to) {
    const dir = to > from ? 1 : -1;
    let i = from;
    while (i !== to && bitmaps.has(i + dir)) i += dir;
    return i;
  }

  function show(i, resized) {
    const bmp = bitmaps.get(i);
    if (!bmp) return false;
    if (bmp !== shown || resized) paint(bmp);
    if (shown && shown !== bmp && ![...bitmaps.values()].includes(shown)) shown.close();
    shown = bmp;
    el.dataset.frame = String(i + 1);
    el.classList.add('is-ready');
    return true;
  }

  let disp = -1; // displayed frame index (float); -1 until the first frame is shown
  let lastT = 0;
  function render(now = performance.now()) {
    const resized = size();
    const target = current();
    if (disp < 0 || reduced) {
      // First frame (or reduced motion): show the target, or the nearest decoded frame.
      for (let d = 0; d < count; d++) {
        const i = [target - d, target + d].find((k) => bitmaps.has(k));
        if (i !== undefined) { disp = i; show(i, resized); return; }
      }
      if (resized && shown) paint(shown); // keep the previous frame instead of a blank canvas
      return;
    }
    const at = Math.round(disp);
    if (!bitmaps.has(at)) { // window moved away (e.g. set switch): resync to what exists
      disp = -1;
      return render(now);
    }
    const goal = reachable(at, target);
    const dt = Math.min(64, now - (lastT || now));
    lastT = now;
    const k = 1 - Math.pow(1 - LERP, dt / 16.7); // frame-rate independent easing
    let step = (goal - disp) * k;
    step = Math.max(-MAX_STEP, Math.min(MAX_STEP, step));
    disp = Math.abs(goal - disp) < 0.02 ? goal : disp + step;
    show(Math.round(disp), resized) || (resized && shown && paint(shown));
  }

  // Ahead-biased decode window around the displayed frame (and the direction of travel).
  function ensureWindow() {
    if (!abort) return;
    const c = disp < 0 ? current() : Math.round(disp);
    const ahead = current() >= c;
    const [back, fwd] = ahead ? [win().behind, win().ahead] : [win().ahead, win().behind];
    for (const [i, bmp] of bitmaps) {
      if (i < c - back || i > c + fwd) {
        bitmaps.delete(i);
        if (bmp !== shown) bmp.close();
      }
    }
    for (let d = 0; d <= Math.max(back, fwd); d++) {
      if (d <= fwd && c + d < count) decode(c + d, abort.signal);
      if (d <= back && c - d >= 0) decode(c - d, abort.signal);
    }
    el.dataset.decoded = String(bitmaps.size);
  }

  function decode(i, signal) {
    const blob = blobs[i];
    if (!blob || bitmaps.has(i) || decoding.has(i)) return;
    decoding.add(i);
    createImageBitmap(blob)
      .then((bmp) => {
        decoding.delete(i);
        const c = disp < 0 ? current() : Math.round(disp);
        if (signal.aborted || i < c - win().ahead || i > c + win().ahead) return bmp.close();
        bitmaps.set(i, bmp);
        el.dataset.decoded = String(bitmaps.size);
      })
      .catch(() => decoding.delete(i));
  }

  async function fetchFrame(i, signal) {
    if (blobs[i] || fetching.has(i) || signal.aborted) return;
    fetching.add(i);
    try {
      const res = await fetch(frameUrl(name, set, i + 1), { signal });
      if (!res.ok) return;
      const blob = await res.blob();
      if (signal.aborted) return;
      blobs[i] = blob;
      el.dataset.blobs = String(blobs.filter(Boolean).length);
      ensureWindow();
    } catch {
      /* aborted or offline: the poster stays */
    } finally {
      fetching.delete(i);
    }
  }

  // Next frame to fetch: the first missing one ahead of the displayed frame (toward the target),
  // then the rest of the film ahead, then anything behind.
  function nextMissing() {
    const c = disp < 0 ? current() : Math.round(disp);
    const dir = current() >= c ? 1 : -1;
    for (let i = c; i >= 0 && i < count; i += dir) if (!blobs[i] && !fetching.has(i)) return i;
    for (let i = c; i >= 0 && i < count; i -= dir) if (!blobs[i] && !fetching.has(i)) return i;
    return -1;
  }

  async function load(signal) {
    await fetchFrame(current(), signal);
    ensureWindow(); // frames already fetched (e.g. after a reduced-motion toggle) need decoding again
    if (reduced || signal.aborted) return; // reduced motion: the last frame only
    const worker = async (limit) => {
      for (let n = 0; n < limit && !signal.aborted; n++) {
        const i = nextMissing();
        if (i < 0) return;
        await fetchFrame(i, signal);
      }
    };
    // The first frames ahead now; the rest of the film only after the page has loaded,
    // to keep the first screen light.
    await Promise.all([worker(PRELOAD / 4), worker(PRELOAD / 4), worker(PRELOAD / 4), worker(PRELOAD / 4)]);
    if (document.readyState !== 'complete') await new Promise((ok) => addEventListener('load', ok, { once: true }));
    await Promise.all([worker(Infinity), worker(Infinity), worker(Infinity), worker(Infinity)]);
  }

  // The display loop runs while the film is near the screen.
  let raf = 0;
  const loop = (now) => {
    render(now);
    raf = requestAnimationFrame(loop);
  };
  const startLoop = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const stopLoop = () => { cancelAnimationFrame(raf); raf = 0; lastT = 0; };

  // Off-screen films hold nothing: in-flight fetches are aborted and every decoded bitmap is
  // released (the canvas keeps its last pixels; the poster sits underneath).
  function sleep() {
    abort?.abort();
    abort = null;
    decoding = new Set();
    for (const bmp of bitmaps.values()) if (bmp !== shown) bmp.close();
    bitmaps = new Map();
    shown?.close();
    shown = null;
    // Compressed frames go too; on return they come back from the HTTP cache.
    blobs = [];
    el.dataset.decoded = '0';
    el.dataset.blobs = '0';
  }

  function restart() {
    if (!near) return sleep();
    abort?.abort();
    abort = new AbortController();
    decoding = new Set();
    for (const bmp of bitmaps.values()) if (bmp !== shown) bmp.close();
    bitmaps = new Map();
    el.dataset.decoded = '0';
    poster.src = frameUrl(name, set, reduced ? count : 1);
    load(abort.signal);
  }

  function pickSet() {
    const next = mq.matches ? 'mobile' : 'desktop';
    if (next === set) return false;
    set = next;
    count = set === 'mobile' ? mobile : desktop;
    blobs = [];
    disp = -1;
    el.dataset.set = set;
    el.dataset.count = String(count);
    restart();
    return true;
  }

  // Film progress = intro offset + scroll progress over the rest. The intro offset only grows,
  // so handing over from the autoplay intro to the scroll scrub never jumps back.
  function update() {
    progress = reduced ? 1 : introA + scrollP * (1 - introA);
    ensureWindow(); // the rAF loop draws
  }

  function scrub() {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    if (reduced) return;
    const state = { p: scrollP };
    tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: trigger || el.closest('section') || el, start, end, scrub: 0.8 },
      onUpdate: () => {
        scrollP = state.p;
        update();
      },
    });
  }

  // Optional autoplay intro: after the page loads, play forward to `intro` (0–1) on its own,
  // so the film visibly moves before the visitor scrolls.
  function playIntro() {
    if (!intro || reduced) return;
    if (scrollY > innerHeight) { // arrived mid-page: no intro, just start from its end state
      introA = intro;
      el.dataset.intro = 'done';
      return update();
    }
    const go = () => {
      if (reduced) return;
      el.dataset.intro = 'playing';
      const o = { a: introA };
      introTween = gsap.to(o, {
        a: intro, duration: introDuration, ease: easeOut, delay: 0.15,
        onUpdate: () => { introA = o.a; update(); },
        onComplete: () => { el.dataset.intro = 'done'; },
      });
    };
    if (introGate) introGate.then(go);
    else if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  }

  const onResize = () => {
    pickSet();
    render();
  };
  const onReduced = () => {
    reduced = rq.matches;
    introTween?.kill();
    if (intro) { introA = intro; el.dataset.intro = 'done'; }
    scrub();
    scrollP = tween?.scrollTrigger?.progress ?? 0;
    progress = reduced ? 1 : introA + scrollP * (1 - introA);
    disp = -1; // jump straight to the new target (the decode window follows it)
    restart();
    render();
  };

  pickSet();
  scrub();
  playIntro();

  // Only fetch and decode while the film is within about one viewport of the screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting === near) return;
      near = entry.isIntersecting;
      if (near) {
        restart();
        startLoop();
      } else {
        stopLoop();
        sleep();
      }
    },
    { rootMargin: '100% 0px' },
  );
  io.observe(el);

  const ro = new ResizeObserver(onResize);
  ro.observe(el);
  mq.addEventListener('change', onResize);
  rq.addEventListener('change', onReduced);

  return {
    destroy() {
      abort?.abort();
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener('change', onResize);
      rq.removeEventListener('change', onReduced);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      introTween?.kill();
      stopLoop();
      for (const bmp of bitmaps.values()) bmp.close();
      shown?.close();
      bitmaps.clear();
      el.replaceChildren();
    },
  };
}
