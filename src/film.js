// Scroll-scrubbed frame-sequence film (FrameSequence v2).
// Picks the 16:9 desktop or 9:16 mobile frame set by viewport, shows a poster
// <img> until frames arrive, and never blanks the canvas when the set switches.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px), (max-aspect-ratio: 1/1)';
const PRELOAD = 20;

const frameUrl = (name, set, i) => `/film/${name}/${set}/frame_${String(i).padStart(4, '0')}.webp`;

export function mountFilm(el, { name, desktop, mobile, start = 'top top', end = 'bottom bottom' }) {
  const mq = matchMedia(MOBILE_QUERY);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  el.classList.add('film');
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

  let set, count, images, progress = reduced.matches ? 1 : 0, shown = null, token = 0;

  const targetIndex = () => Math.round(progress * (count - 1));

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

  function paint(img) {
    const cs = getComputedStyle(el);
    const ax = parseFloat(cs.getPropertyValue('--film-x')) || 0.5;
    const ay = parseFloat(cs.getPropertyValue('--film-y')) || 0;
    const W = canvas.width, H = canvas.height;
    // Contain-fit so the Flow watermark corner is never cropped.
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, (W - dw) * ax, (H - dh) * ay, dw, dh);
  }

  function nearestLoaded(i) {
    for (let d = 0; d < count; d++) {
      const a = images[i - d], b = images[i + d];
      if (a?.complete && a.naturalWidth) return [a, i - d];
      if (b?.complete && b.naturalWidth) return [b, i + d];
    }
    return [null, -1];
  }

  function render() {
    const resized = size();
    const [img, i] = nearestLoaded(targetIndex());
    if (img) {
      if (img !== shown || resized) paint(img);
      shown = img;
      el.dataset.frame = String(i + 1);
      el.classList.add('is-ready');
    } else if (resized && shown) {
      paint(shown); // keep the previous set's frame instead of a blank canvas
    }
  }

  function load(i, t) {
    if (t !== token || images[i]) return Promise.resolve();
    return new Promise((res) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { if (t === token) render(); res(); };
      img.onerror = () => res();
      img.src = frameUrl(name, set, i + 1);
      images[i] = img;
    });
  }

  async function loadAll(t) {
    const first = targetIndex();
    await load(first, t);
    const order = [];
    for (let i = 0; i < count; i++) if (i !== first) order.push(i);
    await Promise.all(order.slice(0, PRELOAD).map((i) => load(i, t)));
    // The rest in the background, a few at a time.
    const rest = order.slice(PRELOAD);
    const worker = async () => { while (rest.length && t === token) await load(rest.shift(), t); };
    await Promise.all([worker(), worker(), worker(), worker()]);
  }

  function pickSet() {
    const next = mq.matches ? 'mobile' : 'desktop';
    if (next === set) return;
    set = next;
    count = set === 'mobile' ? mobile : desktop;
    images = [];
    token++;
    el.dataset.set = set;
    el.dataset.count = String(count);
    poster.src = frameUrl(name, set, reduced.matches ? count : 1);
    loadAll(token);
  }

  pickSet();

  let tween = null;
  const state = { p: progress };
  if (!reduced.matches) {
    tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start, end, scrub: 0.4 },
      onUpdate: () => { progress = state.p; render(); },
    });
  }

  const onResize = () => { pickSet(); render(); };
  const ro = new ResizeObserver(onResize);
  ro.observe(el);
  mq.addEventListener('change', onResize);

  return {
    destroy() {
      token++;
      ro.disconnect();
      mq.removeEventListener('change', onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      el.replaceChildren();
    },
  };
}
