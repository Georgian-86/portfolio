import { test, expect } from '@playwright/test';
import { expectClearsBar, scrollToEnd } from './helpers/bar.js';

const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];

test.describe('width sweep (no horizontal scroll)', () => {
  for (const w of WIDTHS) {
    test(`no horizontal scroll at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: w < 768 ? 844 : 900 });
      await page.goto('/');
      await page.waitForLoadState('load');
      const { sw, iw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: innerWidth,
      }));
      expect(sw).toBeLessThanOrEqual(iw);
    });
  }
});

test('header and bar visible on mobile (390)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hdr = page.locator('header.hdr');
  const bar = page.locator('form.bar');
  await expect(hdr).toBeVisible();
  await expect(bar).toBeVisible();
  expect((await hdr.boundingBox()).height).toBe(64);
  const bb = await bar.boundingBox();
  expect(bb.height).toBe(76);
  expect(bb.y + bb.height).toBe(844);
});

test('bar hidden on desktop (1440), header visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('header.hdr')).toBeVisible();
  await expect(page.locator('form.bar')).toBeHidden();
});

test('every a, button, input at 390 is at least 44x44', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button, input')]
      .filter((el) => {
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, text: (el.textContent || el.name || '').trim().slice(0, 30), w: r.width, h: r.height };
      })
      .filter((r) => r.w < 44 || r.h < 44)
  );
  expect(small).toEqual([]);
});

test('menu button opens and closes #menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const btn = page.locator('header.hdr button[aria-controls="menu"]');
  await expect(page.locator('#menu')).toBeHidden();
  await btn.click();
  await expect(page.locator('#menu')).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toBeHidden();
});

test('bar submit opens WhatsApp with the typed text', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await context.route('https://wa.me/**', (r) => r.fulfill({ body: 'ok' }));
  await page.fill('form.bar input', 'Hi there');
  const [popup] = await Promise.all([context.waitForEvent('page'), page.click('form.bar button[type="submit"]')]);
  const url = new URL(popup.url());
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toMatch(/^\/\d+$/);
  expect(url.searchParams.get('text')).toBe('Hi there');
});

test('final CTA (08) clears the pinned bar when scrolled to the end', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await scrollToEnd(page);
  await expectClearsBar(page, page.locator('[data-sec="08"] .contact__ctas'));
});

test('bar placeholder is short; "opens WhatsApp" is announced, font stays 16px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const input = page.locator('form.bar input');
  await expect(input).toHaveAttribute('placeholder', 'Message Golu');
  await expect(input).toHaveAccessibleName(/opens WhatsApp/);
  expect(await input.evaluate((el) => getComputedStyle(el).fontSize)).toBe('16px');
});

test('open menu makes main and bar inert, focuses first link; close restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const btn = page.locator('header.hdr button[aria-controls="menu"]');
  for (const close of ['escape', 'button', 'link']) {
    await btn.click();
    await expect(page.locator('#menu')).toBeVisible();
    expect(await page.evaluate(() => [document.querySelector('main').inert, document.querySelector('form.bar').inert])).toEqual([true, true]);
    await expect(page.locator('#menu a').first()).toBeFocused();
    if (close === 'escape') await page.keyboard.press('Escape');
    if (close === 'button') await btn.click();
    if (close === 'link') await page.locator('#menu a').first().click();
    await expect(page.locator('#menu')).toBeHidden();
    await expect(btn).toBeFocused();
    expect(await page.evaluate(() => [document.querySelector('main').inert, document.querySelector('form.bar').inert])).toEqual([false, false]);
  }
});

test('bar does not sit above the open menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('header.hdr button[aria-controls="menu"]').click();
  const top = await page.evaluate(() => document.elementFromPoint(195, 844 - 30).closest('#menu, form.bar')?.id || 'bar');
  expect(top).toBe('menu');
});
