// 06 How I work (the Wire draws with scroll), 07 About + "How this site is built", 08 Contact
// (giant letters that lean toward the Node).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand, process as pr, about as ab, contact as ct, waLink, bookLink } from './content.js';
import { esc, tbc, icon, easeOut, reducedQuery, fineQuery, magnetic } from './ui.js';

gsap.registerPlugin(ScrollTrigger);
const narrow = matchMedia('(max-width: 767px)');

// Scrubbed rise-in for a block of children.
function rise(trigger, targets) {
  if (reducedQuery.matches) return;
  gsap.fromTo(targets, { autoAlpha: 0, y: 48 }, {
    autoAlpha: 1, y: 0, ease: easeOut, stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 85%', end: 'top 35%', scrub: 0.8 },
  });
}

export function renderProcess() {
  const el = document.querySelector('[data-sec="06"]');
  el.innerHTML = `
    <div class="wrap">
      <div class="sec-head">
        ${pr.kicker ? `<p class="label">${esc(pr.kicker)}</p>` : ''}
        <h2 id="process-h2" class="h2">${esc(pr.h2)}</h2>
      </div>
      <ol class="steps" role="list">
        <span class="steps__wire" aria-hidden="true"><i></i></span>
        ${pr.steps.map((s) => `
          <li class="step">
            <span class="step__node" aria-hidden="true"></span>
            <span class="label">${s.n}</span>
            <h3 class="step__title">${esc(s.title)}</h3>
            <p class="step__text">${esc(s.text)}</p>
          </li>`).join('')}
      </ol>
    </div>`;
  rise(el, el.querySelectorAll('.sec-head > *'));
  const wire = el.querySelector('.steps__wire i');
  const steps = [...el.querySelectorAll('.step')];
  let tw = null;
  const build = () => {
    tw?.scrollTrigger?.kill();
    tw?.kill();
    gsap.set(wire, { clearProps: 'transform' });
    if (reducedQuery.matches) { steps.forEach((s) => s.classList.add('is-on')); return; }
    const prop = narrow.matches ? 'scaleY' : 'scaleX';
    const o = { p: 0 };
    tw = gsap.to(o, {
      p: 1, ease: 'none',
      scrollTrigger: { trigger: el.querySelector('.steps'), start: narrow.matches ? 'top 75%' : 'top 80%', end: narrow.matches ? 'bottom 45%' : 'top 30%', scrub: 0.8 },
      onUpdate: () => {
        gsap.set(wire, { [prop]: o.p });
        steps.forEach((s, i) => s.classList.toggle('is-on', o.p >= i / (steps.length - 1) - 0.02));
      },
    });
  };
  build();
  narrow.addEventListener('change', build);
  reducedQuery.addEventListener('change', build);
}

export function renderAbout() {
  const el = document.querySelector('[data-sec="07"]');
  el.innerHTML = `
    <div class="wrap about__grid">
      <div class="about__text">
        ${ab.kicker ? `<p class="label">${esc(ab.kicker)}</p>` : ''}
        <h2 id="about-h2" class="h2">${esc(ab.h2)}</h2>
        <p class="lead">${esc(ab.body)}</p>
        <ul class="about__links" role="list">
          ${ab.links.map(([label, key]) => `<li>${brand[key] === 'TBC'
            ? `<span class="chip">${esc(label)} ${tbc('TBC')}</span>`
            : `<a class="btn btn--ghost" href="${esc(brand[key])}" target="_blank" rel="noopener">${esc(label)}</a>`}</li>`).join('')}
        </ul>
      </div>
      <aside class="readout" aria-labelledby="built-h3">
        <div class="readout__top"><span class="status__dot" aria-hidden="true"></span><h3 id="built-h3" class="label">${esc(ab.built.title)}</h3></div>
        <dl>${ab.built.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </aside>
    </div>`;
  rise(el, el.querySelectorAll('.about__text > *, .readout'));
}

export function renderContact() {
  const el = document.querySelector('[data-sec="08"]');
  const words = ct.h2.split(' ');
  el.innerHTML = `
    <div class="wrap">
      ${ct.kicker ? `<p class="label">${esc(ct.kicker)}</p>` : ''}
      <h2 id="contact-h2" class="contact__big" aria-label="${esc(ct.h2)}">${words.map((wd, i) => `<span style="display:inline-block;white-space:nowrap" aria-hidden="true">${[...wd].map((c) => `<span class="contact__char">${esc(c)}</span>`).join('')}</span>${i < words.length - 1 ? ' ' : ''}`).join('')}</h2>
    </div>
    <div class="wrap contact__row">
      <p class="lead">${esc(ct.body)}</p>
      <div class="contact__ctas">
        <a class="btn btn--primary" href="${waLink()}" target="_blank" rel="noopener" data-node="Chat">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
        <a class="btn btn--ink" href="${bookLink()}" target="_blank" rel="noopener" data-node="Book">${icon.calendar}<span>${esc(ct.book)}</span></a>
        ${brand.email === 'TBC'
          ? `<span class="chip" style="align-self:center">${esc(ct.email)} ${tbc('TBC')}</span>`
          : `<a class="btn btn--ghost" href="mailto:${esc(brand.email)}">${esc(ct.email)}</a>`}
      </div>
    </div>
    <footer class="wrap"><div class="contact__foot"><span class="label">${esc(ct.foot)}</span><a class="label" href="#main" data-node="Top">Back to top ↑</a></div></footer>`;

  const chars = [...el.querySelectorAll('.contact__char')];
  if (!reducedQuery.matches) {
    gsap.fromTo(chars, { yPercent: 100, autoAlpha: 0 }, {
      yPercent: 0, autoAlpha: 1, ease: easeOut, stagger: 0.02,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: 0.8 },
    });
  }
  // Letters lean toward the Node (small rotation + lift), and settle when it leaves.
  const lean = chars.map((c) => ({ c, r: gsap.quickTo(c, 'rotation', { duration: 0.6, ease: 'power3' }), y: gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3' }) }));
  el.addEventListener('pointermove', (e) => {
    if (!fineQuery.matches || reducedQuery.matches) return;
    for (const l of lean) {
      const r = l.c.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const f = Math.max(0, 1 - Math.hypot(dx, dy) / 320);
      l.r(Math.max(-14, Math.min(14, dx * 0.05)) * f);
      l.y(-f * 22);
    }
  }, { passive: true });
  el.addEventListener('pointerleave', () => lean.forEach((l) => { l.r(0); l.y(0); }));
  el.querySelectorAll('.contact__ctas .btn').forEach((b) => magnetic(b, gsap));
}
