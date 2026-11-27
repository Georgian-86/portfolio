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
  await expect(sec.locator('.film')).toContainText('Illustrative footage');
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
