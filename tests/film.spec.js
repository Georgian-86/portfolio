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
  const fs = await page.locator(`${HERO} .film__label`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fs).toBeGreaterThanOrEqual(12);
});

test('resizing 390 -> 1440 switches frame set without a blank canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  expect(await frameSet(page)).toBe('mobile');
  for (const [w, h] of [[600, 844], [767, 900], [768, 900], [1024, 900], [1440, 900]]) {
    await page.setViewportSize({ width: w, height: h });
    // Sample immediately after each resize and again a frame later: never blank.
    expect(await canvasHasPixels(page), `blank right after resize to ${w}`).toBe(true);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    expect(await canvasHasPixels(page), `blank one frame after resize to ${w}`).toBe(true);
  }
  await expect.poll(() => frameSet(page)).toBe('desktop');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  const src = await page.locator(`${HERO} img.film__poster`).getAttribute('src');
  expect(src).toContain('/film/hero/desktop/');
});

test('reduced motion: last frame, stage not sticky, only the last frame is fetched', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const frames = [];
  page.on('request', (r) => { const m = r.url().match(/film\/hero\/\w+\/(frame_\d+)\.webp/); if (m) frames.push(m[1]); });
  await page.goto('/');
  await expect.poll(() => page.locator(HERO).getAttribute('data-frame')).toBe('190');
  await expect.poll(() => canvasHasPixels(page)).toBe(true);
  const pos = await page.locator('[data-sec="01"] .hero__stage').evaluate((el) => getComputedStyle(el).position);
  expect(['sticky', 'fixed']).not.toContain(pos);
  expect(await page.evaluate(() => document.querySelectorAll('.pin-spacer').length)).toBe(0);
  await page.waitForTimeout(800);
  expect([...new Set(frames)]).toEqual(['frame_0190']);
  await expect(page.locator('h1')).toBeVisible();
  await context.close();
});

test('reduced motion toggled at runtime switches the film to the last frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect.poll(() => page.locator(HERO).getAttribute('data-frame')).toBe('1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator(HERO).getAttribute('data-frame')).toBe('190');
});

test('decoded frames are kept in a sliding window, not all held', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const f of [0.2, 0.5, 0.8, 1]) {
    await page.evaluate((f) => {
      const s = document.querySelector('[data-sec="01"]');
      scrollTo(0, (s.offsetHeight - innerHeight) * f);
    }, f);
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1500);
  const decoded = Number(await page.locator(HERO).getAttribute('data-decoded'));
  expect(decoded).toBeGreaterThan(0);
  expect(decoded).toBeLessThanOrEqual(48);
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

test('films only fetch and decode near the viewport (hero vs night)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const night = [];
  page.on('request', (r) => { if (/\/film\/night\//.test(r.url())) night.push(r.url()); });
  await page.goto('/');
  const heroFilm = page.locator('[data-sec="01"] .film');
  const nightFilm = page.locator('[data-sec="02"] .film');
  await expect.poll(async () => Number(await heroFilm.getAttribute('data-decoded'))).toBeGreaterThan(0);
  await page.waitForTimeout(1000);
  expect(Number((await nightFilm.getAttribute('data-decoded')) || 0)).toBe(0);
  expect(night).toEqual([]);
  await page.evaluate(() => {
    const t = document.querySelector('[data-sec="02"] .tangle__film-track');
    scrollTo(0, t.getBoundingClientRect().top + scrollY + t.offsetHeight / 2); // mid-film, > 1 viewport past the hero
  });
  await expect.poll(async () => Number(await nightFilm.getAttribute('data-decoded'))).toBeGreaterThan(0);
  expect(night.length).toBeGreaterThan(0);
  await expect.poll(async () => Number(await heroFilm.getAttribute('data-decoded'))).toBe(0);
});

for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`at ${vp.width}: sheet film frames are not requested at load`, async ({ page }) => {
    await page.setViewportSize(vp);
    const sheet = [];
    page.on('request', (r) => { if (/\/film\/sheet\//.test(r.url())) sheet.push(r.url()); });
    await page.goto('/');
    await page.waitForTimeout(1500);
    expect(sheet).toEqual([]);
  });
}

test('far-away films drop their compressed frames too', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hero = page.locator('[data-sec="01"] .film');
  await expect.poll(async () => Number(await hero.getAttribute('data-blobs'))).toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, document.querySelector('[data-sec="03"]').offsetTop));
  await expect.poll(async () => Number(await hero.getAttribute('data-blobs'))).toBe(0);
});

// ── Hero intro autoplay + cover fit (live-site feedback) ──────────
test('at 1920x880 the hero film plays forward on its own, without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 880 });
  await page.goto('/');
  const hero = page.locator('[data-sec="01"] .film');
  await expect.poll(async () => Number(await hero.getAttribute('data-frame')), { timeout: 8000 }).toBeGreaterThanOrEqual(60);
  await expect(hero).toHaveAttribute('data-intro', 'done', { timeout: 8000 });
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('at 1920x880 scrolling 300px after the intro advances the frame (no jump back)', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 880 });
  await page.goto('/');
  const hero = page.locator('[data-sec="01"] .film');
  await expect(hero).toHaveAttribute('data-intro', 'done', { timeout: 8000 });
  const f0 = Number(await hero.getAttribute('data-frame'));
  await page.mouse.move(960, 500);
  await page.mouse.wheel(0, 300);
  await expect.poll(async () => Number(await hero.getAttribute('data-frame'))).toBeGreaterThan(f0 + 5);
});

test('the "Scroll" cue shows at rest and fades once scrolling starts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const cue = page.locator('[data-sec="01"] .hero__cue');
  await expect(cue).toBeVisible();
  await expect(cue).toContainText('Scroll');
  await page.evaluate(() => scrollTo(0, 200));
  await expect.poll(() => cue.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.1);
});

for (const w of [1440, 1920, 2560]) {
  test(`at ${w}px the hero film fills the stage edge to edge (no seam), watermark corner drawn`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 880 });
    await page.goto('/');
    const hero = page.locator('[data-sec="01"] .film');
    await expect(hero).toHaveAttribute('data-fit', 'cover');
    await expect.poll(() => hero.evaluate((el) => {
      const c = el.querySelector('canvas');
      const ctx = c.getContext('2d');
      const px = (x, y) => ctx.getImageData(x, y, 1, 1).data[3];
      // Left edge, middle, and the bottom-right (watermark) corner are all painted.
      return px(1, c.height >> 1) > 0 && px(c.width >> 1, c.height >> 1) > 0 && px(c.width - 2, c.height - 2) > 0;
    })).toBe(true);
    // Cover anchored bottom-right: the frame's right and bottom edges sit on the stage's edges.
    const r = await hero.evaluate((el) => JSON.parse(el.dataset.draw));
    expect(Math.abs(r.x + r.w - r.cw)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.y + r.h - r.ch)).toBeLessThanOrEqual(1);
    expect(r.x).toBeLessThanOrEqual(0);
  });
}

for (const id of ['02', '04']) {
  test(`at 1920px the ${id} film covers its stage anchored bottom-right (no seam)`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 880 });
    await page.goto('/');
    const film = page.locator(`[data-sec="${id}"] .film`);
    await page.evaluate((id) => {
      const t = document.querySelector(`[data-sec="${id}"] .tangle__film-track`);
      scrollTo(0, t.getBoundingClientRect().top + scrollY + t.offsetHeight * 0.3);
    }, id);
    await expect(film).toHaveAttribute('data-fit', 'cover', { timeout: 8000 });
    const r = await film.evaluate((el) => JSON.parse(el.dataset.draw));
    expect(Math.abs(r.x + r.w - r.cw)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.y + r.h - r.ch)).toBeLessThanOrEqual(1);
    expect(r.x).toBeLessThanOrEqual(0);
    expect(r.y).toBeLessThanOrEqual(0);
  });
}

// ── Smooth scrubbing (live-site feedback: "changing in a sec, like it is stuck") ──
// Samples the hero's displayed frame every animation frame while wheel-scrolling in small steps.
async function wheelSamples(page, { notches = 25, delta = 100, gap = 60, throttleMbps = 0 } = {}) {
  if (throttleMbps) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: (throttleMbps * 1e6) / 8, uploadThroughput: 1e6 });
  }
  await page.goto('/');
  const hero = page.locator('[data-sec="01"] .film');
  await expect(hero).toHaveAttribute('data-intro', 'done', { timeout: 15000 });
  await page.evaluate(() => {
    window.__s = [];
    const f = document.querySelector('[data-sec="01"] .film');
    const tick = () => { window.__s.push([performance.now(), Number(f.dataset.frame), scrollY]); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const vp = page.viewportSize();
  await page.mouse.move(vp.width / 2, vp.height / 2);
  for (let i = 0; i < notches; i++) { await page.mouse.wheel(0, delta); await page.waitForTimeout(gap); }
  await page.waitForTimeout(800);
  return { samples: await page.evaluate(() => window.__s), count: Number(await hero.getAttribute('data-count')) };
}

function analyse({ samples, count }) {
  let maxStep = 0, backwards = 0, plateau = 0, runStart = null;
  for (let i = 1; i < samples.length; i++) {
    const [t, f, y] = samples[i];
    const [, pf, py] = samples[i - 1];
    if (f < pf) backwards++;
    maxStep = Math.max(maxStep, Math.abs(f - pf));
    const scrolling = y !== py;
    if (f === pf && scrolling && f < count) { runStart ??= samples[i - 1][0]; plateau = Math.max(plateau, t - runStart); }
    else if (f !== pf) runStart = null;
  }
  const first = samples[0][1], last = samples.at(-1)[1];
  return { maxStep, backwards, plateau: Math.round(plateau), first, last };
}

for (const vp of [{ width: 1920, height: 880 }, { width: 390, height: 844 }]) {
  test(`at ${vp.width}x${vp.height} wheel scrolling scrubs the hero smoothly`, async ({ page }) => {
    await page.setViewportSize(vp);
    const r = analyse(await wheelSamples(page));
    console.log(`smooth scrub ${vp.width}: ${JSON.stringify(r)}`);
    expect(r.last).toBeGreaterThan(r.first); // it moved
    expect(r.backwards).toBe(0); // monotonic while scrolling down
    expect(r.maxStep).toBeLessThanOrEqual(4); // no jumps between consecutive samples
    expect(r.plateau).toBeLessThanOrEqual(250); // never stuck while the page scrolls
    // A long range: 25 wheel notches (2500px) must not run the whole film.
    expect(r.last).toBeLessThan(Number(await page.locator('[data-sec="01"] .film').getAttribute('data-count')));
  });
}

test('on a slow network (5 Mbps) the hero still advances while scrolling, never stuck on a stale frame', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1920, height: 880 });
  const r = analyse(await wheelSamples(page, { throttleMbps: 5, notches: 15 }));
  console.log(`smooth scrub 5Mbps: ${JSON.stringify(r)}`);
  expect(r.last).toBeGreaterThan(r.first + 10);
  expect(r.backwards).toBe(0);
  expect(r.maxStep).toBeLessThanOrEqual(4);
});
