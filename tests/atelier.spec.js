// The "Atelier" look: Swiss-poster colour fields alternating with calm reading sections.
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';
import { LOOK, RETIRED, rgb } from './helpers/look.js';

const bg = (loc) => loc.evaluate((e) => getComputedStyle(e).backgroundColor);
const fg = (loc) => loc.evaluate((e) => getComputedStyle(e).color);
const family = (loc) => loc.evaluate((e) => getComputedStyle(e).fontFamily);

const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test(`${LOOK.name}: palette pairs meet contrast (body 4.5, display 3)`, () => {
  expect(ratio(LOOK.onField, LOOK.field)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(LOOK.key, LOOK.field)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(LOOK.display, LOOK.field)).toBeGreaterThanOrEqual(3);
  expect(ratio(LOOK.onPaper, LOOK.paper)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(LOOK.onBtn, LOOK.btn)).toBeGreaterThanOrEqual(4.5);
});

test('fonts: Bricolage Grotesque headlines, Geist body, Geist Mono labels (display=swap)', async ({ page }) => {
  await gotoReady(page);
  const href = await page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]').getAttribute('href');
  for (const f of ['Bricolage+Grotesque', 'Geist:', 'Geist+Mono', 'display=swap']) expect(href).toContain(f);
  expect(href).not.toMatch(/Inter|JetBrains/);
  expect(await family(page.locator('h1'))).toMatch(/^"?Bricolage Grotesque/);
  expect(await family(page.locator('.h-section').first())).toMatch(/^"?Bricolage Grotesque/);
  expect(await family(page.locator('body'))).toMatch(/^"?Geist"?,/);
  expect(await family(page.locator('.label').first())).toMatch(/^"?Geist Mono/);
  const track = await page.locator('h1').evaluate((e) => parseFloat(getComputedStyle(e).letterSpacing) / parseFloat(getComputedStyle(e).fontSize));
  expect(track).toBeCloseTo(-0.03, 2);
});

test('loader: G·K mark in Bricolage on the field, Geist Mono counter', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(await bg(page.locator('.loader'))).toBe(rgb(LOOK.field));
  await expect(page.locator('.loader__mark')).toContainText('G');
  await expect(page.locator('.loader__mark')).toContainText('K');
  expect(await family(page.locator('.loader__mark'))).toMatch(/^"?Bricolage Grotesque/);
  expect(await family(page.locator('.loader__count'))).toMatch(/^"?Geist Mono/);
});

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: hero copy sits on a solid field panel; the film is unfiltered, no overlay`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoReady(page);
    expect(await bg(page.locator('.hero__copy'))).toBe(rgb(LOOK.field));
    await expect(page.locator('.hero__focus, .hero__scrim')).toHaveCount(0);
    expect(await page.locator('[data-sec="01"] .film__canvas').evaluate((e) => getComputedStyle(e).filter)).toBe('none');
    expect(await fg(page.locator('.hero__line').first())).toBe(rgb(LOOK.display));
    expect(await fg(page.locator('.hero__kicker'))).toBe(rgb(LOOK.onField));
    const key = page.locator('.hero__line').first().locator('.is-key');
    await expect(key).toHaveCount(1);
    expect(await fg(key)).toBe(rgb(LOOK.key));
    // The "AI-generated footage" label stays on top.
    const onTop = await page.locator('[data-sec="01"] .film__label').evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    });
    expect(onTop).toBe(true);
  });
}

test('primary buttons take the look fill and text', async ({ page }) => {
  await gotoReady(page);
  const btn = page.locator('.hero .btn--primary');
  expect(await bg(btn)).toBe(rgb(LOOK.btn));
  expect(await fg(btn)).toBe(rgb(LOOK.onBtn));
});

test('colour fields alternate with calm reading sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  expect(await bg(page.locator('.hdr'))).toBe(rgb(LOOK.field));
  expect(await bg(page.locator('body'))).toBe(rgb(LOOK.paper));
  for (const id of ['live-agent', 'services', 'contact']) expect(await bg(page.locator(`#${id}`)), id).toBe(rgb(LOOK.field));
  for (const id of ['proof', 'founding-team', 'about']) {
    expect(['rgba(0, 0, 0, 0)', rgb(LOOK.paper)], id).toContain(await bg(page.locator(`#${id}`)));
  }
});

test('no retired navy/mint colour renders anywhere', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page);
  const hits = await page.evaluate((bad) => {
    const out = new Set();
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      for (const p of ['color', 'backgroundColor', 'borderTopColor', 'fill', 'stroke']) {
        if (bad.includes(s[p])) out.add(`${el.tagName.toLowerCase()}.${el.className} ${p}=${s[p]}`);
      }
    }
    return [...out].slice(0, 20);
  }, RETIRED.map(rgb));
  expect(hits).toEqual([]);
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe(LOOK.field);
});

test('favicon is the G·K mark on the field colour', async ({ page, request }) => {
  await page.goto('/');
  const svg = await (await request.get(await page.locator('link[rel="icon"]').getAttribute('href'))).text();
  expect(svg.toUpperCase()).toContain(LOOK.field.toUpperCase());
  expect(svg).toContain('G');
  expect(svg).toContain('K');
});
