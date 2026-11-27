import { test, expect } from '@playwright/test';

const HERO = '[data-sec="01"] .film';

async function canvasHasPixels(page) {
  return page.evaluate((sel) => {
    const c = document.querySelector(`${sel} canvas`);
    if (!c || !c.width || !c.height) return false;
    const ctx = c.getContext('2d');
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 3; i < data.length; i += 4 * 97) if (data[i] > 0) return true;
    return false;
  }, HERO);
}

async function frameSet(page) {
  return page.locator(`${HERO}`).getAttribute('data-set');
}

test('hero film creates canvas, poster and "Illustrative footage" label', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator(`${HERO} canvas`)).toHaveCount(1);
  await expect(page.locator(`${HERO} img.film__poster`)).toHaveCount(1);
  await expect(page.locator(HERO)).toContainText('Illustrative footage');
});

test('resizing 390 -> 1440 switches frame set without a blank canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  expect(await frameSet(page)).toBe('mobile');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(() => frameSet(page)).toBe('desktop');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  const src = await page.locator(`${HERO} img.film__poster`).getAttribute('src');
  expect(src).toContain('/film/hero/desktop/');
});

test('reduced motion: canvas shows the last frame, no pin', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect.poll(() => page.locator(HERO).getAttribute('data-frame')).toBe('190');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  const pinned = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length);
  expect(pinned).toBe(0);
  await expect(page.locator('h1')).toBeVisible();
  await context.close();
});

test('slow network: poster image is visible before frames load', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/film/hero/**/frame_*.webp', async (route) => {
    const url = route.request().url();
    if (/frame_0001\.webp/.test(url)) return route.continue();
    await new Promise((r) => setTimeout(r, 5000));
    return route.continue().catch(() => {});
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const poster = page.locator(`${HERO} img.film__poster`);
  await expect(poster).toBeVisible();
  await expect.poll(() => poster.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
});
