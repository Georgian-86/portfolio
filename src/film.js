// Scroll-scrubbed frame-sequence film (FrameSequence v2).
// - Picks the 16:9 desktop or 9:16 mobile frame set by viewport.
// - Shows a poster <img> until frames arrive; never blanks the canvas on a set switch.
// - Keeps compressed frames (Blobs) and only a sliding window of decoded ImageBitmaps,
//   so ~190 full-size frames are never decoded at once (iOS memory).
// - Under reduced motion it fetches and shows only the last frame, with no scrub.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px), (max-aspect-ratio: 1/1)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const PRELOAD = 20; // frames fetched first; the rest stream in the background
const WINDOW = 12; // decoded frames kept on each side of the current one
const BASE = import.meta.env.BASE_URL;

const frameUrl = (name, set, i) => `${BASE}film/${name}/${set}/frame_${String(i).padStart(4, '0')}.webp`;

// `trigger` (optional) is the element whose scroll drives the scrub; it defaults to the enclosing section.
export function mountFilm(el, { name, desktop, mobile, start = 'top top', end = 'bottom bottom', trigger }) {
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
    const W = canvas.width, H = canvas.height;
    // Contain-fit so the Flow watermark corner is never cropped.
    const s = Math.min(W / bmp.width, H / bmp.height);
    const dw = bmp.width * s, dh = bmp.height * s;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bmp, (W - dw) * (isNaN(ax) ? 0.5 : ax), (H - dh) * (isNaN(ay) ? 0 : ay), dw, dh);
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
    const rest = order.slice(PRELOAD);
    const worker = async () => {
      while (rest.length && !signal.aborted) await fetchFrame(rest.shift(), signal);
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  }

  function restart() {
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

  function scrub() {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    if (reduced) return;
    const state = { p: progress };
    tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: trigger || el.closest('section') || el, start, end, scrub: 0.4 },
      onUpdate: () => {
        progress = state.p;
        ensureWindow();
        render();
      },
    });
  }

  const onResize = () => {
    pickSet();
    render();
  };
  const onReduced = () => {
    reduced = rq.matches;
    scrub();
    if (reduced) progress = 1;
    else progress = tween?.scrollTrigger?.progress ?? 0;
    restart();
    render();
  };

  pickSet();
  scrub();

  const ro = new ResizeObserver(onResize);
  ro.observe(el);
  mq.addEventListener('change', onResize);
  rq.addEventListener('change', onReduced);

  return {
    destroy() {
      abort?.abort();
      ro.disconnect();
      mq.removeEventListener('change', onResize);
      rq.removeEventListener('change', onReduced);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      for (const bmp of bitmaps.values()) bmp.close();
      shown?.close();
      bitmaps.clear();
      el.replaceChildren();
    },
  };
}
