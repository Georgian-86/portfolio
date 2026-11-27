// Sections 04–09: Sheet-Dashboard (sheet film), StepQ with the work filter, Founding team,
// Services, About and the clean-desk CTA.
import { sections, work, brand, waLink, bookLink } from './content.js';
import { mountFilm } from './film.js';
import { esc, tbc, icon } from './ui.js';
import { tag, respText, stickyNote, mintCta, cue } from './sections.js';

const $ = (s, el = document) => el.querySelector(s);
const all = (s, el = document) => [...el.querySelectorAll(s)];

const sheetMess = (sh) => `
  <div class="mess-sheet" style="--rot:6deg">
    <p class="mess-sheet__hd label"><span>${esc(sh.title)}</span><span class="is-alert">#REF!</span></p>
    <table>${sh.rows.map((r, ri) => `<tr>${r.map((c, ci) => `<td class="${cellTone(ri, ci)}">${esc(c)}</td>`).join('')}</tr>`).join('')}</table>
  </div>`;
// Highlighter cells from Figma: yellow on the Mehta row and "yes?", grey on the duplicate Riya row.
const cellTone = (r, c) => (r === 2 && (c === 1 || c === 2)) || (r === 3 && c === 3) ? 'is-hl' : r === 3 && (c === 0 || c === 2) ? 'is-dup' : '';

const placeholder = (text, tone = 'light') =>
  `<div class="media media--${tone}" aria-hidden="true"><span class="label">${esc(text)}</span></div>`;

function renderDashboard() {
  const d = sections.dashboard;
  const el = $('[data-sec="04"]');
  el.dataset.untangled = d.untangled;
  el.innerHTML = `
    <div class="tangle__mess">
      <p class="label">${esc(d.kicker)}</p>
      <h2 id="dashboard-h2" class="h-section">${esc(d.h2)}</h2>
      <p class="tangle__body">${esc(d.body)}</p>
      <div class="mess mess--sheet" aria-hidden="true">${sheetMess(d.sheet)}</div>
      ${cue(d.cue)}
    </div>
    <div class="tangle__sheet">
      <div class="tangle__film-track"><div class="tangle__film-stage"><div class="tangle__film" data-film></div></div></div>
      <div class="sheet">
        <p class="label label--on-navy">${esc(d.sysKicker)}</p>
        <p class="sheet__lead">${esc(d.lead)}</p>
        <div class="board" role="group" aria-label="Illustrative dashboard">
          <div class="board__head"><b>${esc(d.boardTitle)}</b><span class="tbc">${esc(d.boardTag)}</span></div>
          <dl class="kpis">${d.kpis.map(([k, v]) => `<div class="kpi"><dt class="label">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <div class="bars" aria-hidden="true">${d.bars.map(([day, h, hi]) => `<span class="bar-col"><i style="--h:${h}"${hi ? ' class="is-hi"' : ''}></i><span class="label">${esc(day)}</span></span>`).join('')}</div>
        </div>
        <span class="note note--navy label" data-end>${esc(d.tag)}</span>
      </div>
    </div>`;
  mountFilm($('[data-film]', el), { ...d.film, trigger: $('.tangle__film-track', el) });
}

function renderStepQ() {
  const s = sections.stepq;
  const w = work.find((x) => x.id === 'stepq');
  const el = $('[data-sec="05"]');
  el.dataset.untangled = s.untangled;
  el.innerHTML = `
    <div class="tangle__mess">
      <div class="filter" role="group" aria-labelledby="filter-label">
        <p id="filter-label" class="filter__label">${esc(s.filterLabel)}</p>
        <div class="filter__chips">${s.filters.map(([id, label]) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="false">${esc(label)}</button>`).join('')}</div>
        <p class="filter__status label" aria-live="polite">Filter · none selected · all work</p>
      </div>
      <p class="label">${esc(s.kicker)}</p>
      <h2 id="work-h2" class="h-section">${esc(s.h2)}</h2>
      <p class="tangle__body">${esc(s.body)}</p>
      <div class="mess mess--scribble" aria-hidden="true">${stickyNote({ text: s.note, rot: 5 })}</div>
      ${cue(s.cue)}
    </div>
    <div class="tangle__sheet">
      <article class="sheet story-wrap" data-work="stepq" data-tags="${w.tags.join(' ')}">
        <p class="label label--on-navy">${esc(w.credit)}</p>
        <h3 class="sheet__lead">${esc(s.lead)}</h3>
        <div class="story">
          ${placeholder(s.media, 'dark')}
          <p class="story__desc">${esc(s.desc)}</p>
          <ul class="tags" role="list">${s.chips.map((c) => `<li class="tag-pill">${esc(c)}</li>`).join('')}</ul>
          <figure class="quote">
            <blockquote>${esc(s.quote)}</blockquote>
            <figcaption class="label">${esc(s.quoteBy)} ${tbc('TBC')}</figcaption>
          </figure>
        </div>
        ${mintCta(s.cta, s.ctaMessage, icon.send, true)}
      </article>
    </div>`;
  wireFilter(el, s.filters);
}

// Chip filter: single choice, none selected by default; non-matching work cards dim (.is-out).
function wireFilter(el, filters) {
  const status = $('.filter__status', el);
  const label = Object.fromEntries(filters);
  el.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const on = chip.getAttribute('aria-pressed') !== 'true';
    all('.chip', el).forEach((c) => c.setAttribute('aria-pressed', String(on && c === chip)));
    const f = on ? chip.dataset.filter : null;
    let n = 0;
    all('[data-work]').forEach((card) => {
      const match = !f || card.dataset.tags.split(' ').includes(f);
      card.classList.toggle('is-out', !match);
      if (match) n++;
    });
    status.textContent = f
      ? `Filter · ${label[f]} · ${n ? `${n} match${n > 1 ? 'es' : ''}` : 'nothing yet, ask me'}`
      : 'Filter · none selected · all work';
  });
}

function renderTeam() {
  const t = sections.team;
  const el = $('[data-sec="06"]');
  el.dataset.untangled = 5;
  const cards = work.filter((w) => w.id !== 'stepq');
  el.innerHTML = `
    <div class="rail">
      <p class="label label--mint">${esc(t.kicker)}</p>
      <h2 id="team-h2" class="h-section">${esc(t.h2)}</h2>
      <p class="rail__body">${esc(t.body)}</p>
    </div>
    <div class="rail-content">
      ${cards.map((w) => `
        <article class="team-card" data-work="${w.id}" data-tags="${w.tags.join(' ')}">
          ${placeholder(w.name)}
          <h3 class="team-card__name">${esc(w.name)}</h3>
          <p class="card__credit label label--mint">${esc(w.credit)} ${tbc(w.role)}</p>
          <p class="team-card__blurb">${respText(w.blurbDesktop || w.blurb)}</p>
          <a class="card__more" href="${waLink(`Hi Golu, tell me more about ${w.name}.`)}" target="_blank" rel="noopener">${esc(t.more)}</a>
        </article>`).join('')}
      <article class="team-card team-card--auto" data-work="automations" data-tags="automation">
        <p class="label label--mint">${esc(t.automations.title)} ${tbc('TBC')}</p>
        <ul class="before-after" role="list">
          ${t.automations.rows.map(([b, a], i, rows) => `<li${i === rows.length - 1 ? ' data-end' : ''}><span class="ba__before">${esc(b)}</span><span class="ba__arrow" aria-hidden="true">→</span><b class="ba__after">${esc(a)}</b></li>`).join('')}
        </ul>
      </article>
    </div>`;
}

function renderServices() {
  const s = sections.services;
  const el = $('[data-sec="07"]');
  el.dataset.theme = 'navy';
  el.innerHTML = `
    <div class="rail">
      <p class="label label--on-navy">${esc(s.kicker)}</p>
      <h2 id="services-h2" class="h-section">${esc(s.h2)}</h2>
      <p class="rail__body d-only">${esc(s.body)}</p>
    </div>
    <div class="rail-content">
      ${s.outcomes.map((o, oi) => `
        <article class="outcome">
          <div class="outcome__head"><h3>${esc(o.title)}</h3><span class="label label--on-navy">${esc(o.n)}</span></div>
          <ul class="outcome__list" role="list">
            ${o.items.map(([name, d], i) => `<li${oi === s.outcomes.length - 1 && i === o.items.length - 1 ? ' data-end' : ''}><b>${esc(name)}</b><span>${esc(d)}</span></li>`).join('')}
          </ul>
        </article>`).join('')}
    </div>`;
}

function renderAbout() {
  const a = sections.about;
  $('[data-sec="08"]').innerHTML = `
    <div class="about__photo">${placeholder(a.photo)}<span class="about__tbc">${tbc('TBC')}</span></div>
    <div class="about__text">
      <p class="label label--mint">${esc(a.kicker)}</p>
      <h2 id="about-h2" class="h-section">${esc(a.h2)}</h2>
      <p class="about__body">${esc(a.body)}</p>
      <ol class="promises" role="list">${a.promises.map((p, i) => `<li><span class="label">0${i + 1}</span><b>${esc(p)}</b></li>`).join('')}</ol>
      <p class="label" data-end>${esc(a.foot)}</p>
    </div>`;
}

function renderCta() {
  const c = sections.cta;
  $('[data-sec="09"]').innerHTML = `
    <div class="desk" aria-hidden="true">
      <div class="desk__sticky"><span class="prop__tape"></span><p>${esc(c.sticky)}</p>${icon.tick}</div>
      <div class="desk__running">
        <p class="label label--mint">${esc(c.running.title)}</p>
        ${c.running.lines.map((l) => `<b>${esc(l)}</b>`).join('')}
        ${tag(c.running.tag, 'paper')}
      </div>
      <div class="desk__list">
        <p class="label label--mint">${esc(c.checklist.title)}</p>
        <ul role="list">${c.checklist.items.map((i) => `<li>${icon.tick}<span>${esc(i)}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="cta-sec__inner">
      <p class="label label--mint d-only">${esc(c.kicker)}</p>
      <h2 id="cta-h2" class="cta-sec__h2">${esc(c.h2)}</h2>
      <p class="cta-sec__body">${esc(c.body)}</p>
      <div class="cta-sec__actions">
        <a class="btn btn--primary cta" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>${esc(brand.ctaLabel)}</span></a>
        <a class="btn btn--ghost cta-sec__book" href="${bookLink()}" target="_blank" rel="noopener">${icon.calendar}<span>${esc(c.book)}</span></a>
      </div>
      <p class="cta-sec__status"><span class="status"><span class="status__dot" aria-hidden="true"></span><span class="label">Online · usually replies within</span> ${tbc(brand.replyTime)}</span></p>
      <p class="label cta-sec__foot" data-end>${esc(c.foot)}</p>
    </div>`;
}

export function renderLateSections() {
  renderDashboard();
  renderStepQ();
  renderTeam();
  renderServices();
  renderAbout();
  renderCta();
}
