// 02 "Three kinds of systems": the particle figure survives a lost WebGL context, and the
// Grow / Automate / Ship copy is scrubbed with the morph (cloud → browser → chat bubble → phone).
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';

const SEC = '[data-sec="02"]';
const toProgress = (page, p) => page.evaluate((p) => {
  const el = document.querySelector('[data-sec="02"]');
  scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * p);
}, p);

// Bright particle pixels in the right half of the stage, read from a real screenshot.
async function litPixels(page) {
  const png = (await page.screenshot({ clip: { x: 720, y: 100, width: 720, height: 700 } })).toString('base64');
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 1] > 120) n++;
    return n;
  }, png);
}

const opacities = (page) => page.locator(`${SEC} .svc`).evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the figure is drawn, and comes back after the WebGL context is lost', async ({ page }) => {
    await gotoReady(page);
    await toProgress(page, 0.2);
    const sec = page.locator(SEC);
    await expect(sec).toHaveAttribute('data-renderer', 'webgl', { timeout: 10000 });
    await expect.poll(() => litPixels(page), { timeout: 8000 }).toBeGreaterThan(300);

    await page.evaluate(() => {
      const c = document.querySelector('.services__canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      gl.getExtension('WEBGL_lose_context').loseContext();
    });
    await expect(sec).toHaveAttribute('data-renderer', 'webgl', { timeout: 5000 });
    await expect(sec.locator('canvas')).toHaveCount(1);
    await expect.poll(() => litPixels(page), { timeout: 8000 }).toBeGreaterThan(300);
  });

  test('the copy is scrubbed with the morph: one group at a time, fully in when its shape forms', async ({ page }) => {
    await gotoReady(page);
    const sec = page.locator(SEC);
    const at = async (p) => { await toProgress(page, p); await page.waitForTimeout(1200); return opacities(page); };

    expect((await at(0))[0]).toBeLessThan(0.05); // loose cloud: no group yet
    expect(await at(0.2)).toEqual([1, 0, 0]); // browser formed: Grow
    await expect(sec.locator('.svc.is-on h3')).toHaveText('Grow');
    const mid = await at(0.35); // halfway browser → bubble: neither is legible
    expect(Math.max(...mid)).toBeLessThan(0.05);
    expect(await at(0.5)).toEqual([0, 1, 0]); // chat bubble: Automate
    await expect(sec.locator('.svc.is-on h3')).toHaveText('Automate');
    expect(await at(0.85)).toEqual([0, 0, 1]); // phone: Ship
    await expect(sec.locator('.svc.is-on h3')).toHaveText('Ship');
  });
});

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  test('every group is shown in full, with no scrubbed styles', async ({ page }) => {
    await gotoReady(page);
    await page.locator(SEC).scrollIntoViewIfNeeded();
    expect(await opacities(page)).toEqual([1, 1, 1]);
    const inline = await page.locator(`${SEC} .svc`).evaluateAll((els) => els.map((e) => e.getAttribute('style') || ''));
    expect(inline.join('')).toBe('');
  });
});
