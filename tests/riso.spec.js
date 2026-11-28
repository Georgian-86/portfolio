// "Riso Press" look: paper ground, ink text, overprinted fluoro shapes, Archivo / Instrument Sans / Space Mono.
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';

const PAPER = 'rgb(246, 242, 234)';
const INK = 'rgb(20, 20, 20)';
const YELLOW = 'rgb(255, 228, 92)';
const ACCENTS = ['rgb(255, 79, 163)', 'rgb(0, 165, 160)', YELLOW];
const OLD_DARK = ['rgb(11, 20, 38)', 'rgb(18, 32, 58)', 'rgb(30, 46, 77)', 'rgb(10, 22, 48)', 'rgb(15, 30, 61)'];
const VPS = [{ width: 390, height: 844 }, { width: 1440, height: 900 }];

test('paper ground and ink text, with a paper grain', async ({ page }) => {
  await page.goto('/');
  const s = await page.evaluate(() => {
    const b = getComputedStyle(document.body);
    return { bg: b.backgroundColor, fg: b.color, img: b.backgroundImage };
  });
  expect(s.bg).toBe(PAPER);
  expect(s.fg).toBe(INK);
  expect(s.img).toContain('svg');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', /#F6F2EA/i);
});

test('fonts: Archivo 125/800 headlines, Instrument Sans body, Space Mono labels', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]').getAttribute('href');
  expect(href).toMatch(/family=Archivo:wdth,wght@125,800/);
  expect(href).toContain('Instrument+Sans');
  expect(href).toContain('Space+Mono');
  expect(href).toContain('display=swap');
  const f = await page.evaluate(() => {
    const cs = (s) => getComputedStyle(document.querySelector(s));
    return {
      h1: cs('.hero__h1').fontFamily, h1t: cs('.hero__h1').textTransform, h1w: cs('.hero__h1').fontWeight,
      h1s: cs('.hero__h1').fontStretch, h2: cs('.h-section').fontFamily, h2t: cs('.h-section').textTransform,
      body: getComputedStyle(document.body).fontFamily, label: cs('.label').fontFamily, btn: cs('.btn').fontFamily,
    };
  });
  expect(f.h1).toMatch(/^"?Archivo/);
  expect(f.h1t).toBe('uppercase');
  expect(f.h1w).toBe('800');
  expect(f.h1s).toBe('125%');
  expect(f.h2).toMatch(/^"?Archivo/);
  expect(f.h2t).toBe('uppercase');
  expect(f.body).toMatch(/^"?Instrument Sans/);
  expect(f.label).toMatch(/^"?Space Mono/);
  expect(f.btn).toMatch(/^"?Space Mono/);
});

test('primary buttons: ink fill, yellow text, 4px radius', async ({ page }) => {
  await page.goto('/');
  const b = await page.locator('.hero .btn--primary').evaluate((el) => {
    const c = getComputedStyle(el);
    return { bg: c.backgroundColor, fg: c.color, r: c.borderTopLeftRadius };
  });
  expect(b).toEqual({ bg: INK, fg: YELLOW, r: '4px' });
});

for (const vp of VPS) {
  test(`at ${vp.width}: no dark-navy surfaces and no accent-coloured text anywhere`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoReady(page);
    const bad = await page.evaluate(({ OLD_DARK, ACCENTS, INK }) => {
      const out = [];
      // The solid ground behind an element: the nearest ancestor-or-self with an opaque background.
      const ground = (el) => {
        for (let n = el; n; n = n.parentElement) {
          const b = getComputedStyle(n).backgroundColor;
          if (b.startsWith('rgb(')) return b;
        }
        return null;
      };
      for (const el of document.querySelectorAll('body, body *')) {
        const c = getComputedStyle(el);
        if (OLD_DARK.includes(c.backgroundColor)) out.push(`bg ${el.className} ${c.backgroundColor}`);
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        // Inks never carry text on paper; the one exception is yellow on an ink button.
        if (hasText && ACCENTS.includes(c.color) && ground(el) !== INK) out.push(`text ${el.className} ${c.color}`);
      }
      return out;
    }, { OLD_DARK, ACCENTS, INK });
    expect(bad).toEqual([]);
  });

  test(`at ${vp.width}: the hero copy sits on a solid paper panel with overprinted shapes`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoReady(page);
    const p = await page.locator('.hero__scrim').evaluate((el) => {
      const c = getComputedStyle(el);
      return { bg: c.backgroundColor, img: c.backgroundImage };
    });
    expect(p.bg).toBe(PAPER);
    expect(p.img).not.toContain('linear-gradient');
    const blobs = await page.locator('.hero .riso-blob').evaluateAll((els) => els.map((e) => getComputedStyle(e).mixBlendMode));
    expect(blobs.length).toBeGreaterThanOrEqual(3);
    for (const m of blobs) expect(m).toBe('multiply');
    // The film itself is untouched: no filter or blend on the canvas.
    const canvas = await page.locator('[data-sec="01"] .film__canvas').evaluate((el) => {
      const c = getComputedStyle(el);
      return [c.filter, c.mixBlendMode];
    });
    expect(canvas).toEqual(['none', 'normal']);
  });
}

test('loader: paper ground, G·K mark printed in two offset plates that register', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const l = await page.evaluate(() => {
    const el = document.querySelector('.loader');
    const plates = [...el.querySelectorAll('.loader__plate')].map((p) => {
      const c = getComputedStyle(p);
      return { stroke: c.stroke, blend: c.mixBlendMode };
    });
    return { bg: getComputedStyle(el).backgroundColor, plates, count: getComputedStyle(el.querySelector('.loader__count')).fontFamily };
  });
  expect(l.bg).toBe(PAPER);
  expect(l.plates.length).toBe(2);
  expect(l.plates[0].stroke).not.toBe(l.plates[1].stroke);
  for (const p of l.plates) expect(p.blend).toBe('multiply');
  expect(l.count).toMatch(/^"?Space Mono/);
});

test('header and menu are paper with ink text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page);
  const hdr = await page.locator('.hdr').evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
  expect(hdr[0]).toMatch(/^rgba?\(246, 242, 234/);
  expect(hdr[1]).toBe(INK);
  await page.locator('.hdr__menu').click();
  const menu = await page.locator('#menu').evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
  expect(menu).toEqual([PAPER, INK]);
});

// Archivo at width 125 is wide: no headline, button or card name may clip or run off screen, phone to desktop.
for (const width of [320, 768, 1024, 1280]) {
  test(`at ${width}: no wide-type headline or button is clipped`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoReady(page);
    const bad = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('h1, h2, h3, .hero__word, .kpi dd, .btn, .card__name, .team-card__name')) {
        if (!el.getClientRects().length) continue;
        const b = el.getBoundingClientRect();
        if (el.scrollWidth > el.clientWidth + 1 || b.right > innerWidth + 1) out.push(`${el.className || el.tagName} "${el.textContent.trim().slice(0, 24)}"`);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });
}
