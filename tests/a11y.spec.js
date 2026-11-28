import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';

const OG_TITLE = 'Golu Kumar — AI agents, automations & websites';

test('exactly one h1 and a lang attribute', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
});

test('every img has an alt attribute', async ({ page }) => {
  await page.goto('/');
  // Lazy film posters get their src late; check after the page settles.
  await page.waitForTimeout(500);
  const missing = await page.evaluate(() => [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.outerHTML.slice(0, 80)));
  expect(missing).toEqual([]);
});

test('decorative mess props are aria-hidden', async ({ page }) => {
  await page.goto('/');
  const exposed = await page.evaluate(() =>
    [...document.querySelectorAll('.prop, .mess-call, .mess-sticky, .mess-sheet, .desk__sticky, .film')]
      .filter((el) => !el.closest('[aria-hidden="true"]'))
      .map((el) => el.className)
  );
  expect(exposed).toEqual([]);
});

test('meta description, Open Graph and Twitter card tags', async ({ page, request }) => {
  await page.goto('/');
  const meta = (sel) => page.locator(sel).getAttribute('content');
  expect((await meta('meta[name="description"]'))?.length).toBeGreaterThan(50);
  expect(await meta('meta[property="og:title"]')).toBe(OG_TITLE);
  expect((await meta('meta[property="og:description"]'))?.length).toBeGreaterThan(50);
  expect(await meta('meta[property="og:type"]')).toBe('website');
  const ogImage = await meta('meta[property="og:image"]');
  expect(ogImage).toMatch(/og\.jpg$/);
  expect(await meta('meta[property="og:image:width"]')).toBe('1200');
  expect(await meta('meta[property="og:image:height"]')).toBe('630');
  expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  expect(await meta('meta[name="twitter:title"]')).toBe(OG_TITLE);
  expect((await meta('meta[name="twitter:description"]'))?.length).toBeGreaterThan(50);
  expect(await meta('meta[name="twitter:image"]')).toMatch(/og\.jpg$/);
  const res = await request.get('/og.jpg');
  expect(res.ok()).toBe(true);
  expect(res.headers()['content-type']).toContain('image/jpeg');
  const size = await page.evaluate(() => new Promise((ok) => { const i = new Image(); i.onload = () => ok([i.naturalWidth, i.naturalHeight]); i.src = '/og.jpg'; }));
  expect(size).toEqual([1200, 630]);
});

test('fonts use preconnect and display=swap', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="preconnect"][href="https://fonts.googleapis.com"]')).toHaveCount(1);
  await expect(page.locator('link[rel="preconnect"][href="https://fonts.gstatic.com"]')).toHaveCount(1);
  await expect(page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]')).toHaveAttribute('href', /display=swap/);
});

test('favicon matches the brand (G·K mark on Navy)', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  const svg = await (await request.get(href)).text();
  expect(svg).toMatch(/#0F1E3D/i);
  expect(svg).toContain('G');
  expect(svg).toContain('K');
});

// WCAG relative-luminance contrast between an element's text colour and its effective background.
const contrastOf = (page, sel) =>
  page.locator(sel).first().evaluate((el) => {
    const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    let bg = null;
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.length === 3 || (c.length === 4 && c[3] > 0.5)) { bg = c.slice(0, 3); break; }
    }
    bg ||= [255, 255, 255];
    const fg = parse(getComputedStyle(el).color).slice(0, 3);
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  });

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: sampled body text contrast is ≥ 4.5`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    for (const sel of ['[data-sec="02"] .tangle__body', '.agent__body', '.story__desc', '.team-card__blurb', '.rail__body', '.about__body', '.cta-sec__body']) {
      const visible = await page.locator(sel).first().isVisible();
      if (!visible) continue;
      expect(await contrastOf(page, sel), sel).toBeGreaterThanOrEqual(4.5);
    }
  });
}

test('first screen on mobile transfers under 3 MB', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pending = [];
  let loaded = false;
  page.on('response', (r) => { if (!loaded) pending.push(r.body().then((b) => b.length).catch(() => 0)); });
  await page.goto('/', { waitUntil: 'load' });
  loaded = true;
  const bytes = (await Promise.all(pending)).reduce((a, b) => a + b, 0);
  console.log(`first-screen transfer (mobile, until load): ${(bytes / 1024).toFixed(0)} KB over ${pending.length} responses`);
  expect(bytes).toBeLessThan(3 * 1024 * 1024);
});

// Contrast of text against the composited background (film + scrim), measured from pixels:
// hide the text, screenshot its box, and compare the text colour with each background pixel.
async function compositedContrast(page, sel) {
  // The visible element matching `sel`, its text colour, and the boxes of its text lines.
  const info = await page.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.getClientRects().length);
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 2 && r.height > 2)
      .map((r) => ({ x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(r.width, innerWidth - r.x), height: r.height }));
    el.dataset.contrastProbe = '1';
    return { color: getComputedStyle(el).color, rects };
  }, sel);
  const probe = page.locator('[data-contrast-probe="1"]');
  await probe.evaluate((el) => { el.style.color = 'transparent'; el.style.textShadow = 'none'; el.querySelectorAll('*').forEach((c) => { c.style.color = 'transparent'; c.style.textShadow = 'none'; }); });
  const shots = [];
  for (const clip of info.rects) shots.push((await page.screenshot({ clip })).toString('base64'));
  await probe.evaluate((el) => { el.style.color = ''; el.style.textShadow = ''; el.querySelectorAll('*').forEach((c) => { c.style.color = ''; c.style.textShadow = ''; }); delete el.dataset.contrastProbe; });
  return page.evaluate(async ({ shots, color }) => {
    const lum = (r, g, b) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const [tr, tg, tb] = color.match(/[\d.]+/g).map(Number);
    const lt = lum(tr, tg, tb);
    const ratios = [];
    for (const b64 of shots) {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = new OffscreenCanvas(img.width, img.height);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      for (let i = 0; i < data.length; i += 4 * 5) {
        const lb = lum(data[i], data[i + 1], data[i + 2]);
        ratios.push((Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05));
      }
    }
    ratios.sort((a, b) => a - b);
    return ratios[Math.floor(ratios.length * 0.05)]; // 5th percentile: the worst 5% behind the text
  }, { shots, color: info.color });
}

for (const vp of [{ width: 1440, height: 900 }, { width: 1920, height: 880 }, { width: 390, height: 844 }]) {
  test(`at ${vp.width}: each hero line stays legible over the film when it is on screen`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize(vp);
    await gotoReady(page);
    const hero = page.locator('[data-sec="01"] .film');
    await expect(hero).toHaveAttribute('data-intro', 'done', { timeout: 10000 });
    for (const [p, n] of [[0, 1], [0.47, 2], [0.9, 3]]) {
      await page.evaluate((p) => {
        const h = document.querySelector('[data-sec="01"]');
        scrollTo(0, Math.round(p * (h.offsetHeight - innerHeight)));
      }, p);
      await page.waitForTimeout(1400);
      const c = await compositedContrast(page, `.hero__line:nth-child(${n})`);
      console.log(`hero contrast ${vp.width} line ${n} (frame ${await hero.getAttribute('data-frame')}): ${c.toFixed(2)}`);
      expect(c, `line ${n}`).toBeGreaterThanOrEqual(4.5);
    }
  });
}

test('the scrim never covers the hero "AI-generated footage" label (desktop)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const onTop = await page.locator('[data-sec="01"] .film__label').evaluate((el) => {
    // Both are absolutely positioned siblings with z-index auto, so paint order is DOM order:
    // the label must come after the scrim (painted above it).
    const scrim = el.parentElement.querySelector('.hero__scrim');
    const z = (n) => getComputedStyle(n).zIndex;
    return !!scrim && getComputedStyle(scrim).display !== 'none'
      && !!(scrim.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
      && z(scrim) === 'auto' && z(el) === 'auto';
  });
  expect(onTop).toBe(true);
});
