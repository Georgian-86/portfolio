import { test, expect } from '@playwright/test';
import { expectClearsBar, scrollToSectionEnd } from './helpers/bar.js';

const SECS = ['01b', '02', '02b', '03'];

test('sections 01b, 02, 02b and 03 exist in order after the hero', async ({ page }) => {
  await page.goto('/');
  const order = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.dataset.sec));
  expect(order.slice(0, 5)).toEqual(['01', ...SECS]);
});

test('02 tags its times as "Sample · illustrative times" and carries the night film', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="02"]');
  await expect(sec).toContainText('Sample · illustrative times');
  await expect(sec.locator('.film')).toHaveAttribute('data-count', /^(190|188)$/);
  await expect(sec.locator('.film')).toContainText('AI-generated footage');
  // The poster is only requested once the film is near the viewport.
  await sec.locator('.tangle__film-track').scrollIntoViewIfNeeded();
  await expect(sec.locator('.film__poster')).toHaveAttribute('src', /\/film\/night\//);
});

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`02b at ${vp.width}: end of scroll hides typing, shows reply and booking card`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    const sec = page.locator('[data-sec="02b"]');
    await expect(sec).toContainText('Sample · demo conversation');
    await scrollToSectionEnd(page, '[data-sec="02b"]');
    await expect(sec.locator('.agent__typing')).toBeHidden();
    await expect(sec.locator('.agent__reply')).toBeVisible();
    const card = sec.locator('.agent__booking');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Sample booking');
  });
}

test('02b at the start shows the customer message but not the reply yet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => {
    const s = document.querySelector('[data-sec="02b"]');
    scrollTo(0, s.getBoundingClientRect().top + scrollY + 10);
  });
  await page.waitForTimeout(600);
  const sec = page.locator('[data-sec="02b"]');
  await expect(sec.locator('.agent__customer')).toBeVisible();
  await expect(sec.locator('.agent__reply')).toBeHidden();
  await expect(sec.locator('.agent__booking')).toBeHidden();
});

test('02b under reduced motion shows the end state without scrolling', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const sec = page.locator('[data-sec="02b"]');
  await expect(sec.locator('.agent__typing')).toBeHidden();
  await sec.locator('.agent__booking').scrollIntoViewIfNeeded();
  await expect(sec.locator('.agent__reply')).toBeVisible();
  await expect(sec.locator('.agent__booking')).toBeVisible();
  expect(await sec.locator('.agent__reply').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await sec.locator('.agent__booking').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await context.close();
});

for (const id of SECS) {
  test(`mobile: end of ${id} clears the pinned bar`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await scrollToSectionEnd(page, `[data-sec="${id}"]`);
    await expectClearsBar(page, page.locator(`[data-sec="${id}"] [data-end]`));
  });
}

const redItems = (page) =>
  page.evaluate(() => {
    const items = [...document.querySelectorAll('[data-sec] .is-alert')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight && getComputedStyle(el).visibility !== 'hidden' && el.closest('[data-sec]').dataset.sec !== '01';
    });
    // One alert item (a card) may carry both a red icon and red text, so count items, not elements.
    return [...new Set(items.map((el) => el.closest('.mess-call, .prop') || el))].map((el) => el.closest('[data-sec]').dataset.sec);
  });

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: at most one red alert per screen, exactly one in 02`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    for (const id of SECS) {
      await page.evaluate((id) => document.querySelector(`[data-sec="${id}"]`).scrollIntoView(), id);
      await page.waitForTimeout(300);
      const reds = await redItems(page);
      expect(reds.length, `screen at ${id}`).toBeLessThanOrEqual(1);
      if (id === '02') expect(reds).toEqual(['02']);
    }
  });
}

test('02b mid-scroll: typing visible, reply not yet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => {
    const t = document.querySelector('[data-sec="02b"] .agent__track');
    const top = t.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + (t.offsetHeight - innerHeight) * 0.27);
  });
  const sec = page.locator('[data-sec="02b"]');
  await expect(sec.locator('.agent__typing')).toBeVisible();
  await expect(sec.locator('.agent__reply')).toBeHidden();
});

for (const w of [320, 390]) {
  test(`02b booking tag has no one-word orphan line at ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 844 });
    await page.goto('/');
    const lines = await page.locator('[data-sec="02b"] .booking .note').evaluate((el) => {
      const node = el.firstChild;
      const text = node.textContent;
      const tops = new Map();
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text))) {
        const r = document.createRange();
        r.setStart(node, m.index);
        r.setEnd(node, m.index + m[0].length);
        const top = Math.round(r.getBoundingClientRect().top);
        tops.set(top, (tops.get(top) || 0) + 1);
      }
      return [...tops.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
    });
    expect(lines.at(-1), `words per line: ${lines}`).toBeGreaterThan(1);
  });
}

// ── Task 3: sections 04–09 and menu ─────────────────────────────
const SECS3 = ['04', '05', '06', '07', '08', '09'];

test('sections 04–09 exist in order after 03', async ({ page }) => {
  await page.goto('/');
  const order = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.dataset.sec));
  expect(order).toEqual(['01', '01b', '02', '02b', '03', ...SECS3]);
});

test('04 shows "Illustrative numbers · not client data" and carries the sheet film', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="04"]');
  await expect(sec).toContainText('Illustrative numbers · not client data');
  await expect(sec.locator('.film')).toHaveAttribute('data-count', /^(161|106)$/);
  await expect(sec.locator('.film')).toContainText('AI-generated footage');
});

test('05 chip row: 4 buttons, each ≥44px tall, on one row at 390, none selected by default', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const chips = page.locator('[data-sec="05"] .filter button');
  await expect(chips).toHaveCount(4);
  const boxes = await chips.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => ({ top: r.top, h: r.height })));
  for (const b of boxes) expect(b.h).toBeGreaterThanOrEqual(44);
  expect(new Set(boxes.map((b) => Math.round(b.top))).size).toBe(1);
  for (let i = 0; i < 4; i++) await expect(chips.nth(i)).toHaveAttribute('aria-pressed', 'false');
});

test('05 chip filter filters the work cards and can be cleared', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="05"]');
  const cards = page.locator('[data-work]');
  expect(await cards.count()).toBeGreaterThanOrEqual(4);
  await expect(page.locator('[data-work].is-out')).toHaveCount(0);
  await sec.getByRole('button', { name: 'Automation' }).click();
  await expect(sec.getByRole('button', { name: 'Automation' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-work="stepq"]')).toHaveClass(/is-out/);
  // Only the 05 work list is filtered; the 06 cards far below are never dimmed.
  await expect(page.locator('[data-sec="06"] [data-work].is-out')).toHaveCount(0);
  await expect(sec.locator('.filter__status')).toContainText('Automation');
  await sec.getByRole('button', { name: 'Website' }).click();
  await expect(page.locator('[data-work="stepq"]')).not.toHaveClass(/is-out/);
  await expect(sec.getByRole('button', { name: 'Automation' })).toHaveAttribute('aria-pressed', 'false');
  await sec.getByRole('button', { name: 'Website' }).click();
  await expect(page.locator('[data-work].is-out')).toHaveCount(0);
});

test('05 chips sit on one row at 1440', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const tops = await page.locator('[data-sec="05"] .filter button').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
});

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: the 05 sticky note is at full opacity at rest`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    // Resting position: the sticky note centred in the viewport.
    await page.evaluate(() => {
      const n = document.querySelector('[data-sec="05"] .mess-sticky');
      scrollTo(0, n.getBoundingClientRect().top + scrollY - innerHeight / 2 + n.offsetHeight / 2);
    });
    await page.waitForTimeout(800);
    const op = await page.locator('[data-sec="05"] .mess-sticky').evaluate((el) => Number(getComputedStyle(el).opacity));
    expect(op).toBeGreaterThanOrEqual(0.9);
  });
}

test('StepQ credit matches the global constraint; TeachGenie and Brivia show TBC chips', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-sec="05"]')).toContainText('Client project · Website + iOS + Android');
  for (const id of ['teachgenie', 'brivia']) {
    const card = page.locator(`[data-sec="06"] [data-work="${id}"]`);
    await expect(card).toContainText('Founding team');
    await expect(card.locator('.tbc')).toHaveText('TBC');
  }
});

test('07 services cover the full list', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('[data-sec="07"]').innerText();
  for (const s of ['AI agents', 'WhatsApp agents', 'Automations', 'Websites', 'Shopify', 'WordPress', 'App development', 'DevOps', 'SEO']) {
    expect(text, s).toContain(s);
  }
});

test('09 is the clean-desk CTA, with WhatsApp and book-a-call actions', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="09"]');
  await expect(sec.locator('h2')).toHaveText('Hand me your mess.');
  await expect(sec.locator('.cta')).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+/);
  await expect(sec.getByRole('link', { name: /Book a call/ })).toHaveCount(1);
});

test('every menu link scrolls to its section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const btn = page.locator('header.hdr button[aria-controls="menu"]');
  await btn.click();
  const hrefs = await page.locator('#menu a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBe(9);
  await btn.click();
  for (const href of hrefs) {
    await btn.click();
    await page.locator(`#menu a[href="${href}"]`).click();
    await expect(page.locator('#menu')).toBeHidden();
    await expect
      .poll(() => page.evaluate((h) => {
        const r = document.querySelector(h).getBoundingClientRect();
        const atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 1;
        return Math.abs(r.top - 60) <= 4 || (atEnd && r.top < innerHeight);
      }, href), { message: href })
      .toBe(true);
  }
});

for (const id of SECS3) {
  test(`mobile: end of ${id} clears the pinned bar`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await scrollToSectionEnd(page, `[data-sec="${id}"]`);
    await expectClearsBar(page, page.locator(`[data-sec="${id}"] [data-end]`));
  });
}

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: at most one red alert per screen in 04–09`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    for (const id of SECS3) {
      await page.evaluate((id) => document.querySelector(`[data-sec="${id}"]`).scrollIntoView(), id);
      await page.waitForTimeout(300);
      expect((await redItems(page)).length, `screen at ${id}`).toBeLessThanOrEqual(1);
    }
  });
}
