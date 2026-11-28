// 01 Hero: full-bleed film on paper, focus pull, three headline lines across the pin.
// Interactive but quiet: the letters of "chaos" sit jumbled and scatter away from the Node,
// then straighten as you scroll ("untangling"); a sticky-note highlighter sweeps under "untangle";
// the CTAs are magnetic. No props, no collage.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand, hero as h, waLink, bookLink } from './content.js';
import { mountFilm } from './film.js';
import { esc, tbc, icon, easeOut, reducedQuery, fineQuery, magnetic } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

// "Every business runs on a little {chaos}." → masked words; the {word} becomes the accent.
function lineHtml(text, i) {
  return text.split(' ').map((w) => {
    const m = w.match(/^\{(.+)\}(.*)$/);
    if (!m) {
      const inner = i === 2 && w === '·' ? `<span class="hero__sep">·</span>` : esc(w);
      return `<span class="hero__mask"><span class="hero__word">${inner}</span></span>`;
    }
    const [, word, tail] = m;
    // "chaos" is split into letters that scatter from the cursor; the word keeps the headline's own face.
    const body = i === 0 ? [...word].map((c) => `<span class="hero__char">${esc(c)}</span>`).join('') : esc(word);
    return `<span class="hero__mask"><span class="hero__word hero__accent">${body}</span>${esc(tail)}</span>`;
  }).join(' ');
}

const status = (text) =>
  `<span class="status"><span class="status__dot" aria-hidden="true"></span><span class="label">${esc(text)}</span> ${tbc(brand.replyTime)}</span>`;

export function renderHero() {
  const el = document.querySelector('[data-sec="01"]');
  el.innerHTML = `
    <div class="hero__stage" data-node="Scroll">
      <div class="hero__film" data-film></div>
      <div class="hero__copy">
        <p class="hero__kicker label"><span class="status__dot" aria-hidden="true"></span>${esc(h.kicker)}</p>
        <h1 id="hero-h1" class="hero__h1" data-node="">${h.lines.map((l, i) => `<span class="hero__line">${lineHtml(l, i)}</span>`).join(' ')}</h1>
        <div class="hero__ctas">
          <a class="btn btn--primary" href="${waLink()}" target="_blank" rel="noopener" data-node="Chat">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
          <a class="btn btn--ghost" href="${bookLink()}" target="_blank" rel="noopener" data-node="Book">${icon.calendar}<span>${esc(h.secondaryCta)}</span></a>
          <p class="hero__status">${status('Online, usually replies within')}</p>
        </div>
      </div>
      <div class="hero__cue" aria-hidden="true"><span class="label">${esc(h.scrollCue)}</span><span class="hero__cue-line"></span></div>
    </div>`;

  let reveal;
  const revealed = new Promise((ok) => { reveal = ok; });
  const film = el.querySelector('[data-film]');
  mountFilm(film, { ...h.film, start: 'top top', end: 'bottom bottom', introGate: revealed });
  // Over the frames, under the "AI-generated footage" label: focus-pull blur and the paper wash.
  // Both stay out of the watermark corner (.hero__focus mask, .hero__scrim width/height).
  const focus = Object.assign(document.createElement('div'), { className: 'hero__focus' });
  const scrim = Object.assign(document.createElement('div'), { className: 'hero__scrim' });
  film.querySelector('.film__label').before(focus, scrim);

  const cue = el.querySelector('.hero__cue');
  const syncCue = () => cue.classList.toggle('is-gone', scrollY > 8);
  addEventListener('scroll', syncCue, { passive: true });
  syncCue();

  const lines = [...el.querySelectorAll('.hero__line')];
  const words = lines.map((l) => [...l.querySelectorAll('.hero__word')]);
  const chars = [...el.querySelectorAll('.hero__char')];
  const ctas = el.querySelector('.hero__ctas');

  // The jumbled rest pose of "chaos": fixed, so it reads the same on every visit.
  const jumble = [[-9, -14], [7, 10], [-4, -6], [12, 16], [-7, -10]];
  let tl = null;
  const build = () => {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
    gsap.set([...lines, ...words.flat(), ctas, focus, ...chars], { clearProps: 'transform,opacity,visibility' });
    if (reducedQuery.matches) return;
    chars.forEach((c, i) => gsap.set(c, { rotation: jumble[i % 5][0], yPercent: jumble[i % 5][1] }));
    gsap.set([lines[1], lines[2], ctas], { autoAlpha: 0 });
    gsap.set(ctas, { y: 16 });
    gsap.set([...words[1], ...words[2]], { yPercent: 110 });
    tl = gsap.timeline({
      defaults: { ease: easeOut },
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
    });
    tl.to(focus, { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0)
      .to(chars, { rotation: 0, yPercent: 0, duration: 0.16, stagger: 0.01 }, 0.02) // chaos → order
      .to(lines[0], { autoAlpha: 0, y: -24, duration: 0.08 }, 0.22)
      .to(lines[1], { autoAlpha: 1, duration: 0.03 }, 0.33)
      .to(words[1], { yPercent: 0, duration: 0.1, stagger: 0.012 }, 0.33)
      .to(lines[1], { autoAlpha: 0, y: -24, duration: 0.07 }, 0.57)
      .to(lines[2], { autoAlpha: 1, duration: 0.03 }, 0.66)
      .to(words[2], { yPercent: 0, duration: 0.1, stagger: 0.012 }, 0.66)
      .to(ctas, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.76)
      .to({}, { duration: 0.0001 }, 1); // the timeline spans the whole pin
  };
  build();
  reducedQuery.addEventListener('change', build);

  // Pointer: each letter of "chaos" is pushed away from the Node (x/y only; the scroll owns
  // rotation/yPercent, so the two never fight).
  const pushers = chars.map((c) => ({ c, x: gsap.quickTo(c, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' }), y: gsap.quickTo(c, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' }) }));
  const RADIUS = 180, PUSH = 34;
  el.addEventListener('pointermove', (e) => {
    if (!fineQuery.matches || reducedQuery.matches) return;
    for (const p of pushers) {
      const r = p.c.getBoundingClientRect();
      const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY;
      const d = Math.hypot(dx, dy) || 1;
      const f = Math.max(0, 1 - d / RADIUS) ** 2;
      p.x((dx / d) * PUSH * f);
      p.y((dy / d) * PUSH * f);
    }
  }, { passive: true });
  el.addEventListener('pointerleave', () => pushers.forEach((p) => { p.x(0); p.y(0); }));
  ctas.querySelectorAll('.btn').forEach((b) => magnetic(b, gsap));

  // Line 1 rises into its mask as the loader's curtain lifts.
  revealed.then(() => {
    const free = () => lines[0].classList.add('is-free'); // "chaos" may now scatter past its mask
    if (reducedQuery.matches || scrollY > 8) return free();
    gsap.from(words[0], { yPercent: 110, duration: 1.1, ease: easeOut, stagger: 0.06, delay: 0.15, onComplete: free });
    gsap.from(el.querySelector('.hero__kicker'), { autoAlpha: 0, y: 10, duration: 0.9, ease: easeOut, delay: 0.1 });
  });
  return { film, reveal: () => reveal() };
}
