import { test, expect } from '@playwright/test';

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
    for (const sel of ['.hero__sub', '[data-sec="02"] .tangle__body', '.agent__body', '.story__desc', '.team-card__blurb', '.rail__body', '.about__body', '.cta-sec__body']) {
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
