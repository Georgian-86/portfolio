// The Node cursor (strategy §4 "Global", P1): follow without jumps or stalls, verbs over links,
// keyboard focus parity, and off on touch and under reduced motion.
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';

const NODE = '.node';
const pos = (page) => page.locator(NODE).evaluate((el) => {
  const m = new DOMMatrix(getComputedStyle(el).transform);
  return { x: m.m41, y: m.m42 };
});

test.describe('desktop, fine pointer', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('appears where the pointer is and hides the native cursor', async ({ page }) => {
    await gotoReady(page);
    await expect(page.locator(NODE)).toHaveCount(1);
    await expect(page.locator(NODE)).toHaveAttribute('aria-hidden', 'true');
    await page.mouse.move(700, 600);
    await expect(page.locator(NODE)).toHaveCSS('opacity', '1');
    const p = await pos(page);
    expect(Math.abs(p.x - 700)).toBeLessThan(1);
    expect(Math.abs(p.y - 600)).toBeLessThan(1);
    expect(await page.evaluate(() => getComputedStyle(document.body).cursor)).toBe('none');
  });

  test('follows smoothly: no jumps, no stalls, and it catches up', async ({ page }) => {
    await gotoReady(page);
    await page.mouse.move(200, 600);
    await page.waitForTimeout(300);
    // Record the Node every frame while the pointer travels 800px in 20 steps.
    await page.evaluate(() => {
      const node = document.querySelector('.node');
      window.__trail = [];
      const rec = () => {
        window.__trail.push(new DOMMatrix(getComputedStyle(node).transform).m41);
        if (window.__trail.length < 90) requestAnimationFrame(rec);
      };
      requestAnimationFrame(rec);
    });
    await page.mouse.move(1000, 600, { steps: 20 });
    await page.waitForFunction(() => window.__trail.length >= 90);
    const trail = await page.evaluate(() => window.__trail);
    const steps = trail.slice(1).map((v, i) => v - trail[i]);
    expect(Math.min(...steps)).toBeGreaterThanOrEqual(-0.5); // never runs backwards
    expect(Math.max(...steps)).toBeLessThan(120); // no teleport
    const moving = trail.findIndex((v) => v > 210);
    const arrived = trail.findIndex((v) => v > 999);
    expect(moving).toBeGreaterThanOrEqual(0);
    expect(arrived).toBeGreaterThan(moving);
    // While travelling, it never sits still for more than 3 frames (a stall).
    let still = 0, worst = 0;
    for (const s of steps.slice(moving, arrived)) { still = Math.abs(s) < 0.05 ? still + 1 : 0; worst = Math.max(worst, still); }
    expect(worst).toBeLessThanOrEqual(3);
  });

  test('over links it opens the ring and shows the verb', async ({ page }) => {
    await gotoReady(page);
    const cta = page.locator('.hdr__cta');
    await cta.hover();
    await expect(page.locator(NODE)).toHaveAttribute('data-state', 'link');
    await expect(page.locator('.node__verb')).toHaveText('CHAT');
    await expect(page.locator('.node__ring')).toHaveCSS('opacity', '1');
    await page.locator('.hdr__links a').first().hover();
    await expect(page.locator('.node__verb')).toHaveText('JUMP');
    await page.mouse.move(700, 450); // empty film area
    await expect(page.locator(NODE)).toHaveAttribute('data-state', 'idle');
  });

  test('keyboard focus gets the same ring and verb under the control', async ({ page }) => {
    await gotoReady(page);
    const cta = page.locator('.hdr__cta');
    await page.locator('.hdr__links a').last().focus();
    await page.keyboard.press('Tab');
    await expect(cta).toBeFocused();
    await expect(page.locator(NODE)).toHaveAttribute('data-state', 'link');
    await expect(page.locator('.node__verb')).toHaveText('CHAT');
    await expect(page.locator(NODE)).toHaveCSS('opacity', '1');
    await expect.poll(async () => {
      const box = await cta.boundingBox();
      const p = await pos(page);
      return p.y > box.y + box.height && p.y < box.y + box.height + 40 && p.x >= box.x && p.x < box.x + box.width;
    }).toBe(true);
  });
});

test.describe('touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('no Node on a coarse pointer', async ({ page }) => {
    await gotoReady(page);
    await expect(page.locator(NODE)).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/has-node/);
  });
});

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  test('no Node and the native cursor stays', async ({ page }) => {
    await gotoReady(page);
    await page.mouse.move(700, 600);
    await expect(page.locator(NODE)).toHaveCount(0);
    expect(await page.evaluate(() => getComputedStyle(document.body).cursor)).not.toBe('none');
  });

  test('turning reduced motion on removes a live Node', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await gotoReady(page);
    await expect(page.locator(NODE)).toHaveCount(1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator(NODE)).toHaveCount(0);
  });
});
