// The Node cursor (docs/research/2026-11-28-reel-study-and-brand-strategy.md §3–4, P1 "Global").
// A 10px mint dot that follows the pointer with a frame-rate-independent lerp. Over anything
// interactive it grows into a ring and shows a mono verb (CHAT, OPEN, JUMP, SEND…).
//
// Guardrails (§5): transform and opacity only; desktop + fine pointer only; off under reduced motion;
// keyboard focus gets the same ring and verb, parked under the focused control.
// The ticker sleeps once the Node has caught up, so an idle page costs nothing.
import './node-cursor.css';
import gsap from 'gsap';

const FINE = matchMedia('(hover: hover) and (pointer: fine)');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
const TARGETS = 'a[href], button:not(:disabled), [role="button"], label[for], summary, [data-cursor]';
const TEXT = 'input:not([type="checkbox"], [type="radio"], [type="submit"], [type="button"]), textarea, select, [contenteditable="true"]';
const FOLLOW = 0.22; // share of the remaining distance covered per 60 fps frame
const FOCUS_GAP = 26; // px from a focused control's bottom edge to the Node's centre
const FOCUS_ROOM = 110; // keep the ring and its verb inside the viewport

/** The verb the Node shows for an interactive element. `data-cursor` wins; "" shows the ring only. */
export function verbFor(el) {
  const own = el.closest('[data-cursor]');
  if (own) return own.dataset.cursor;
  const href = el.getAttribute('href') || '';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'CHAT';
  if (href.startsWith('#')) return 'JUMP';
  if (el.matches('button[type="submit"]')) return 'SEND';
  if (el.matches('button[aria-controls]')) return el.getAttribute('aria-expanded') === 'true' ? 'CLOSE' : 'MENU';
  return 'OPEN';
}

export function mountNodeCursor() {
  let off = null;
  const sync = () => {
    const want = FINE.matches && !REDUCED.matches;
    if (want && !off) off = start();
    else if (!want && off) { off(); off = null; }
  };
  FINE.addEventListener('change', sync);
  REDUCED.addEventListener('change', sync);
  sync();
}

function start() {
  const root = document.documentElement;
  const node = document.createElement('div');
  node.className = 'node';
  node.setAttribute('aria-hidden', 'true');
  node.innerHTML = '<span class="node__ring"></span><span class="node__dot"></span><span class="node__verb"></span>';
  const verb = node.querySelector('.node__verb');
  document.body.append(node);
  root.classList.add('has-node');

  let x = 0, y = 0, tx = 0, ty = 0;
  let awake = false, placed = false;
  let target = null; // the hovered or focused interactive element
  let mode = 'pointer'; // 'pointer' | 'focus'

  const render = () => { node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`; };
  const tick = (_t, dt) => {
    const k = 1 - (1 - FOLLOW) ** (Math.min(dt, 100) / (1000 / 60));
    x += (tx - x) * k;
    y += (ty - y) * k;
    if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) { x = tx; y = ty; sleep(); }
    render();
  };
  const wake = () => { if (!awake) { awake = true; gsap.ticker.add(tick); } };
  const sleep = () => { if (awake) { awake = false; gsap.ticker.remove(tick); } };
  const moveTo = (nx, ny) => {
    tx = nx; ty = ny;
    if (!placed) { x = nx; y = ny; placed = true; render(); } // first sighting: appear in place, no fly-in
    wake();
  };

  const setTarget = (el) => {
    target = el;
    node.dataset.state = el ? 'link' : 'idle';
    const v = el ? verbFor(el) : '';
    if (verb.textContent !== v) verb.textContent = v;
    node.classList.toggle('has-verb', Boolean(v));
  };
  const show = (on) => node.classList.toggle('is-on', on);

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (mode === 'focus') { mode = 'pointer'; setTarget(null); }
    moveTo(e.clientX, e.clientY);
    show(true);
  };
  const onOver = (e) => {
    if (mode === 'focus') return;
    const text = e.target.closest?.(TEXT);
    node.classList.toggle('is-text', Boolean(text)); // the native caret takes over in text fields
    const el = text ? null : e.target.closest?.(TARGETS) || null;
    if (el !== target) setTarget(el);
  };
  const onDown = () => node.classList.add('is-down');
  const onUp = () => node.classList.remove('is-down');
  const onLeave = (e) => { if (!e.relatedTarget && mode === 'pointer') show(false); };

  // Keyboard parity: a :focus-visible control gets the same ring and verb, parked just under its
// leading edge, where it does not cover the control or its neighbours.
  const park = () => {
    if (mode !== 'focus' || !target) return;
    const r = target.getBoundingClientRect();
    const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    show(inView);
    if (inView) moveTo(Math.max(FOCUS_GAP, Math.min(r.left + 22, innerWidth - FOCUS_ROOM)), Math.min(r.bottom + FOCUS_GAP, innerHeight - FOCUS_GAP));
  };
  const onFocusIn = (e) => {
    const el = e.target.closest?.(TARGETS);
    if (!el || !e.target.matches(':focus-visible')) return;
    mode = 'focus';
    node.classList.remove('is-text');
    setTarget(el);
    park();
  };
  const onFocusOut = () => {
    if (mode !== 'focus') return;
    setTarget(null);
    show(false);
  };

  const opts = { passive: true };
  addEventListener('pointermove', onMove, opts);
  document.addEventListener('pointerover', onOver, opts);
  addEventListener('pointerdown', onDown, opts);
  addEventListener('pointerup', onUp, opts);
  document.addEventListener('pointerout', onLeave, opts);
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  addEventListener('scroll', park, opts);
  addEventListener('resize', park, opts);
  setTarget(null);

  return () => {
    sleep();
    removeEventListener('pointermove', onMove, opts);
    document.removeEventListener('pointerover', onOver, opts);
    removeEventListener('pointerdown', onDown, opts);
    removeEventListener('pointerup', onUp, opts);
    document.removeEventListener('pointerout', onLeave, opts);
    document.removeEventListener('focusin', onFocusIn);
    document.removeEventListener('focusout', onFocusOut);
    removeEventListener('scroll', park, opts);
    removeEventListener('resize', park, opts);
    node.remove();
    root.classList.remove('has-node');
  };
}
