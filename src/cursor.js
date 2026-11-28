// The Node: the site's cursor. A mint dot that follows the pointer with a short lerp; over anything
// interactive it grows a ring and shows a mono verb ("OPEN", "CHAT", "DRAG"…) from data-node.
// Fine pointers only, never under reduced motion; the native cursor returns whenever it is off.
import gsap from 'gsap';
import { fineQuery, reducedQuery } from './ui.js';

const VERB = (el) => {
  if (!el) return '';
  if (el.dataset.node !== undefined) return el.dataset.node;
  if (el.matches('a[href*="wa.me"]')) return 'Chat';
  if (el.matches('a[href^="#"]')) return 'Go';
  if (el.matches('a')) return 'Open';
  return '';
};

export function mountNode() {
  const node = document.querySelector('.node');
  if (!node) return;
  const root = document.documentElement;
  const label = node.querySelector('.node__label');
  const xTo = gsap.quickTo(node, 'x', { duration: 0.22, ease: 'power3' });
  const yTo = gsap.quickTo(node, 'y', { duration: 0.22, ease: 'power3' });
  let seen = false;

  const on = () => fineQuery.matches && !reducedQuery.matches;
  const sync = () => root.classList.toggle('has-node', on() && seen);

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !on()) return;
    if (!seen) { seen = true; gsap.set(node, { x: e.clientX, y: e.clientY }); sync(); }
    xTo(e.clientX);
    yTo(e.clientY);
    const target = e.target.closest?.('a, button, [data-node], input, label');
    const interactive = !!target && !target.matches('input, label');
    const verb = VERB(target);
    node.classList.toggle('is-active', interactive);
    node.classList.toggle('has-label', !!verb);
    if (verb && label.textContent !== verb) label.textContent = verb;
    node.classList.toggle('is-hidden', !!target?.matches('input'));
  }, { passive: true });
  addEventListener('pointerdown', () => node.classList.add('is-down'));
  addEventListener('pointerup', () => node.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => node.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => node.classList.remove('is-hidden'));
  fineQuery.addEventListener('change', sync);
  reducedQuery.addEventListener('change', sync);
}
