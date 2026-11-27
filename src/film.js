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
const WINDOW = 12; // decoded frames kept on each side of the current one
const BASE = import.meta.env.BASE_URL;

const frameUrl = (name, set, i) => `${BASE}film/${name}/${set}/frame_${String(i).padStart(4, '0')}.webp`;

// `trigger` (optional) is the element whose scroll drives the scrub; it defaults to the enclosing section.
// `intro` (optional, 0–1) autoplays the film to that point after load; scroll continues from there.
export function mountFilm(el, { name, desktop, mobile, start = 'top top', end = 'bottom bottom', trigger, intro = 0, introDuration = 2.5 }) {
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
  label.textContent = 'Illustrative footage';
  el.append(poster, canvas, label);
  const ctx = canvas.getContext('2d');

  let set = null;
  let count = 0;
  let blobs = []; // compressed frames, index -> Blob
  let bitmaps = new Map(); // decoded window, index -> ImageBitmap
  let decoding = new Set();
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
      return true;
    }
    return false;
  }

  function paint(bmp) {
    const cs = getComputedStyle(el);
    const ax = parseFloat(cs.getPropertyValue('--film-x'));
    const ay = parseFloat(cs.getPropertyValue('--film-y'));
    // --film-fit: "contain" (default) or "cover". Cover must be anchored at the watermark
    // corner (--film-x/--film-y = 1) so the Flow watermark is never cropped.
    const fit = cs.getPropertyValue('--film-fit').trim() === 'cover' ? 'cover' : 'contain';
    const W = canvas.width, H = canvas.height;
    const s = (fit === 'cover' ? Math.max : Math.min)(W / bmp.width, H / bmp.height);
    const dw = bmp.width * s, dh = bmp.height * s;
    const x = (W - dw) * (isNaN(ax) ? 0.5 : ax), y = (H - dh) * (isNaN(ay) ? 0 : ay);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bmp, x, y, dw, dh);
    el.dataset.fit = fit;
    el.dataset.draw = JSON.stringify({ x: Math.round(x), y: Math.round(y), w: Math.round(dw), h: Math.round(dh), cw: W, ch: H });
  }

  function nearestDecoded(i) {
    for (let d = 0; d < count; d++) {
      if (bitmaps.has(i - d)) return i - d;
      if (bitmaps.has(i + d)) return i + d;
    }
    return -1;
  }

  function render() {
    const resized = size();
    const i = nearestDecoded(current());
    if (i >= 0) {
      const bmp = bitmaps.get(i);
      if (bmp !== shown || resized) paint(bmp);
      if (shown && shown !== bmp && ![...bitmaps.values()].includes(shown)) shown.close();
      shown = bmp;
      el.dataset.frame = String(i + 1);
      el.classList.add('is-ready');
    } else if (resized && shown) {
      paint(shown); // keep the previous set's frame instead of a blank canvas
    }
  }

  function trimWindow() {
    const c = current();
    for (const [i, bmp] of bitmaps) {
      if (Math.abs(i - c) > WINDOW) {
        bitmaps.delete(i);
        if (bmp !== shown) bmp.close();
      }
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
        if (signal.aborted || Math.abs(i - current()) > WINDOW) return bmp.close();
        bitmaps.set(i, bmp);
        el.dataset.decoded = String(bitmaps.size);
        render();
      })
      .catch(() => decoding.delete(i));
  }

  function ensureWindow() {
    if (!abort) return;
    trimWindow();
    const c = current();
    for (let d = 0; d <= WINDOW; d++) {
      if (c - d >= 0) decode(c - d, abort.signal);
      if (c + d < count) decode(c + d, abort.signal);
    }
  }

  async function fetchFrame(i, signal) {
    if (blobs[i] || signal.aborted) return;
    try {
      const res = await fetch(frameUrl(name, set, i + 1), { signal });
      if (!res.ok) return;
      const blob = await res.blob();
      if (signal.aborted) return;
      blobs[i] = blob;
      el.dataset.blobs = String(blobs.filter(Boolean).length);
      if (Math.abs(i - current()) <= WINDOW) decode(i, signal);
    } catch {
      /* aborted or offline: the poster stays */
    }
  }

  async function load(signal) {
    const first = current();
    await fetchFrame(first, signal);
    ensureWindow(); // frames already fetched (e.g. after a reduced-motion toggle) need decoding again
    if (reduced || signal.aborted) return; // reduced motion: the last frame only
    const order = [];
    for (let i = 0; i < count; i++) if (i !== first) order.push(i);
    order.sort((a, b) => Math.abs(a - first) - Math.abs(b - first));
    await Promise.all(order.slice(0, PRELOAD).map((i) => fetchFrame(i, signal)));
    // The rest stream in only after the page has loaded, to keep the first screen light.
    if (document.readyState !== 'complete') await new Promise((ok) => addEventListener('load', ok, { once: true }));
    const rest = order.slice(PRELOAD);
    const worker = async () => {
      while (rest.length && !signal.aborted) await fetchFrame(rest.shift(), signal);
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  }

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
    el.dataset.set = set;
    el.dataset.count = String(count);
    restart();
    return true;
  }

  // Film progress = intro offset + scroll progress over the rest. The intro offset only grows,
  // so handing over from the autoplay intro to the scroll scrub never jumps back.
  function update() {
    progress = reduced ? 1 : introA + scrollP * (1 - introA);
    ensureWindow();
    render();
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
      scrollTrigger: { trigger: trigger || el.closest('section') || el, start, end, scrub: 0.4 },
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
    if (document.readyState === 'complete') go();
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
        render();
      } else sleep();
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
      for (const bmp of bitmaps.values()) bmp.close();
      shown?.close();
      bitmaps.clear();
      el.replaceChildren();
    },
  };
}
