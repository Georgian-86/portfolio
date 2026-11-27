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
  await expect(sec.locator('.agent__reply')).toBeAttached();
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

test('at most one alert-red element is visible per screen in 01b–03 (desktop)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const id of SECS) {
    await page.evaluate((id) => document.querySelector(`[data-sec="${id}"]`).scrollIntoView(), id);
    await page.waitForTimeout(300);
    // One alert item (a card) may carry both a red icon and red text, so count items, not elements.
    const reds = await page.evaluate(() =>
      new Set([...document.querySelectorAll('[data-sec] .is-alert')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && getComputedStyle(el).visibility !== 'hidden' && el.closest('[data-sec]').dataset.sec !== '01';
      }).map((el) => el.closest('.mess-call, .prop') || el)).size
    );
    expect(reds, `section ${id}`).toBeLessThanOrEqual(1);
  }
});
