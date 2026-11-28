// v3 loader + cinematic hero (Task 1 of docs/superpowers/plans/2026-11-28-redesign-v3.md).
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';

const HERO = '[data-sec="01"]';
const FILM = `${HERO} .film`;
const VPS = [{ width: 390, height: 844 }, { width: 1920, height: 1080 }];

// Scroll so the hero pin is at progress p (0–1) and let the scrub settle.
async function toPin(page, p, settle = 1200) {
  await page.evaluate((p) => {
    const h = document.querySelector('[data-sec="01"]');
    scrollTo(0, Math.round(p * (h.offsetHeight - innerHeight)));
  }, p);
  await page.waitForTimeout(settle);
}

// Waits until the displayed frame stops changing (the eased lerp has caught up).
async function frameSettled(page) {
  let last = null;
  await expect.poll(async () => {
    const f = await page.locator(FILM).getAttribute('data-frame');
    const same = f === last;
    last = f;
    return same;
  }, { intervals: [250, 250, 250, 400, 400, 600], timeout: 10000 }).toBe(true);
}

// The watermark zone in viewport px: bottom-right of the drawn frame (desktop 6%×8%, mobile 24%×14%).
async function watermarkZone(page) {
  return page.locator(FILM).evaluate((el) => {
    const d = JSON.parse(el.dataset.draw);
    const c = el.querySelector('canvas').getBoundingClientRect();
    const mobile = el.dataset.set === 'mobile';
    const [fw, fh] = mobile ? [0.24, 0.14] : [0.06, 0.08];
    const sx = c.width / d.cw, sy = c.height / d.ch; // canvas px → CSS px (1 at DPR 1)
    const right = c.left + (d.x + d.w) * sx, bottom = c.top + (d.y + d.h) * sy;
    const w = d.w * sx * fw, h = d.h * sy * fh;
    return { x: Math.floor(right - w), y: Math.floor(bottom - h), width: Math.floor(w), height: Math.floor(h), sx, sy, cx: c.left, cy: c.top };
  });
}

// Elements painted above the film canvas anywhere in the zone, with effective opacity > 0.1.
async function coveringElements(page, z) {
  return page.evaluate((z) => {
    const style = document.createElement('style');
    style.textContent = '* { pointer-events: auto !important; }'; // so decorative overlays are hit-tested too
    document.head.append(style);
    const canvas = document.querySelector('[data-sec="01"] .film__canvas');
    const opacity = (el) => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return o; };
    const hits = new Set();
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
      const x = z.x + (z.width - 1) * (i / 6), y = z.y + (z.height - 1) * (j / 6);
      const stack = document.elementsFromPoint(x, y);
      const ci = stack.indexOf(canvas);
      if (ci < 0) { hits.add('film canvas not under the zone'); continue; }
      for (const el of stack.slice(0, ci)) {
        if (getComputedStyle(el).visibility === 'hidden' || opacity(el) <= 0.1) continue;
        hits.add(`${el.tagName.toLowerCase()}.${el.className}`);
      }
    }
    style.remove();
    return [...hits];
  }, z);
}

// Mean absolute difference between what is on screen in the zone and the canvas's own pixels there.
// A blur, scrim or overlay over the corner makes these differ; an untouched corner matches.
async function zoneDiff(page, z) {
  const shot = (await page.screenshot({ clip: { x: z.x, y: z.y, width: z.width, height: z.height } })).toString('base64');
  return page.evaluate(async ({ shot, z }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${shot}`;
    await img.decode();
    const oc = new OffscreenCanvas(img.width, img.height);
    const octx = oc.getContext('2d');
    octx.drawImage(img, 0, 0);
    const a = octx.getImageData(0, 0, img.width, img.height).data;
    const canvas = document.querySelector('[data-sec="01"] .film__canvas');
    const b = canvas.getContext('2d').getImageData(Math.round((z.x - z.cx) / z.sx), Math.round((z.y - z.cy) / z.sy), img.width, img.height).data;
    let sum = 0, n = 0;
    for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { sum += Math.abs(a[i + k] - b[i + k]); n++; }
    return sum / n;
  }, { shot, z });
}

// ── Loader ─────────────────────────────────────────────────────
test('loader: the counter only counts up, reaches 100, and the loader dismisses', async ({ page }) => {
  await page.addInitScript(() => {
    window.__counts = [];
    const watch = () => {
      const c = document.querySelector('.loader__count');
      if (!c) return;
      const read = () => window.__counts.push(Number(c.textContent));
      read();
      new MutationObserver(read).observe(c, { childList: true, characterData: true, subtree: true });
    };
    document.addEventListener('DOMContentLoaded', watch);
  });
  await page.setViewportSize({ width: 1280, height: 720 });
  const t0 = Date.now();
  await gotoReady(page);
  expect(Date.now() - t0, 'capped at 6 s').toBeLessThan(7500);
  await expect(page.locator('.loader')).toBeHidden();
  const counts = await page.evaluate(() => window.__counts);
  expect(counts.length).toBeGreaterThan(2);
  for (let i = 1; i < counts.length; i++) expect(counts[i], `count ${i}: ${counts.join(',')}`).toBeGreaterThanOrEqual(counts[i - 1]);
  expect(counts.at(-1)).toBe(100);
  await expect(page.locator('.loader__mark')).toHaveCount(1);
});

test('loader: under reduced motion it shows a static mark and leaves within 300 ms', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const t0 = Date.now();
  await expect(page.locator('html')).toHaveAttribute('data-loader', 'done', { timeout: 2000 });
  expect(Date.now() - t0).toBeLessThan(1000); // 300 ms in the page, plus test-runner slack
  await expect(page.locator('.loader')).toBeHidden();
  await context.close();
});

// ── Hero ───────────────────────────────────────────────────────
for (const vp of VPS) {
  test(`at ${vp.width}x${vp.height} the hero canvas covers the viewport while pinned`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoReady(page);
    for (const p of [0, 0.5, 0.98]) {
      await toPin(page, p, 300);
      const r = await page.locator(`${FILM} canvas`).boundingBox();
      for (const [k, v] of [['x', 0], ['y', 0], ['width', vp.width], ['height', vp.height]]) {
        expect(Math.abs(r[k] - v), `${k} at p=${p}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test(`at ${vp.width}x${vp.height} the watermark corner is never covered or blurred`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize(vp);
    await gotoReady(page);
    await expect(page.locator(FILM)).toHaveAttribute('data-intro', 'done', { timeout: 10000 });
    await expect(page.locator(FILM)).toHaveAttribute('data-fit', 'cover');
    for (const p of [0, 0.12, 0.25, 0.5, 0.75, 0.98]) {
      await toPin(page, p, 900);
      await frameSettled(page);
      const z = await watermarkZone(page);
      expect(z.x + z.width, 'zone inside the viewport (x)').toBeLessThanOrEqual(vp.width + 1);
      expect(z.y + z.height, 'zone inside the viewport (y)').toBeLessThanOrEqual(vp.height + 1);
      expect(await coveringElements(page, z), `covering at p=${p}`).toEqual([]);
      const diff = await zoneDiff(page, z);
      expect(diff, `corner pixels differ from the frame at p=${p} (blur/overlay)`).toBeLessThan(2.5);
    }
  });

  test(`at ${vp.width}x${vp.height} headline lines reveal in sequence across the pin`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoReady(page);
    const lines = page.locator(`${HERO} .hero__line`);
    await expect(lines).toHaveCount(3);
    const op = () => lines.evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));
    for (const [p, on] of [[0.04, 0], [0.47, 1], [0.9, 2]]) {
      await toPin(page, p);
      const o = await op();
      o.forEach((v, i) => {
        if (i === on) expect(v, `line ${i + 1} at p=${p}: ${o}`).toBeGreaterThan(0.9);
        else expect(v, `line ${i + 1} at p=${p}: ${o}`).toBeLessThan(0.1);
      });
    }
    // The CTA arrives with the last line.
    await expect(page.locator(`${HERO} .hero__ctas`)).toBeVisible();
    expect(await page.locator(`${HERO} .hero__ctas`).evaluate((e) => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
  });
  // The Atelier look drops the focus-pull blur: the film is unfiltered (atelier.spec.js).
}

test('hero copy: the v3 headline, no clutter props, no Untangled counter', async ({ page }) => {
  await gotoReady(page);
  await expect(page.locator('h1')).toContainText('Every business runs on a little chaos.');
  await expect(page.locator('h1')).toContainText('I build the systems that untangle it.');
  await expect(page.locator('h1')).toContainText('AI agents · automations · websites · apps.');
  await expect(page.locator('.prop, .hero__props')).toHaveCount(0);
  await expect(page.locator('.untangled, .hdr__progress')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Less chaos');
  await expect(page.locator(FILM)).toContainText('AI-generated footage');
});

test('reduced motion: hero shows every line and the CTA statically, no pin', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await gotoReady(page);
  const o = await page.locator(`${HERO} .hero__line`).evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));
  expect(o).toEqual([1, 1, 1]);
  await expect(page.locator(`${HERO} .hero__ctas`)).toBeVisible();
  expect(await page.locator(`${HERO} .hero__stage`).evaluate((e) => getComputedStyle(e).position)).not.toBe('sticky');
  await context.close();
});
