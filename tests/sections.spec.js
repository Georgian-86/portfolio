// v3.1 sections 02–08, the Node cursor, the work List/Stage toggle and the day/night theme engine.
import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/loader.js';
import { expectClearsBar, scrollToSectionEnd } from './helpers/bar.js';

const scrollToSec = (page, sec, f = 0) => page.evaluate(([sec, f]) => {
  const el = document.querySelector(`[data-sec="${sec}"]`);
  scrollTo(0, el.offsetTop + Math.max(0, el.offsetHeight - innerHeight) * f);
}, [sec, f]);

test('sections 01–08 exist in order with their themes', async ({ page }) => {
  await page.goto('/');
  const secs = await page.locator('main > section').evaluateAll((els) => els.map((e) => [e.dataset.sec, e.dataset.theme]));
  expect(secs).toEqual([['01', 'paper'], ['02', 'night'], ['03', 'night'], ['04', 'paper'], ['05', 'paper'], ['06', 'paper'], ['07', 'night'], ['08', 'paper']]);
});

test('the night layer fades in for night sections and out for paper ones (opacity only)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const o = () => page.locator('.nightfall').evaluate((e) => Number(getComputedStyle(e).opacity));
  expect(await o()).toBeLessThan(0.05);
  await scrollToSec(page, '02', 0.5);
  await expect.poll(o).toBeGreaterThan(0.95);
  await scrollToSec(page, '05', 0.3);
  await expect.poll(o).toBeLessThan(0.05);
  await expect(page.locator('header.hdr')).toHaveAttribute('data-theme', 'paper');
  await scrollToSec(page, '07', 0);
  await page.waitForTimeout(400);
  await expect(page.locator('header.hdr')).toHaveAttribute('data-theme', 'night');
});

test('02 services: the particle field mounts and the active group follows the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const sec = page.locator('[data-sec="02"]');
  await scrollToSec(page, '02', 0.15);
  await expect(sec).toHaveAttribute('data-renderer', /webgl|2d/, { timeout: 10000 });
  await expect(sec.locator('.svc.is-on h3')).toHaveText('Grow');
  await scrollToSec(page, '02', 0.5);
  await expect(sec.locator('.svc.is-on h3')).toHaveText('Automate');
  await scrollToSec(page, '02', 0.9);
  await expect(sec.locator('.svc.is-on h3')).toHaveText('Ship');
  for (const s of ['Websites', 'Shopify', 'WordPress', 'SEO & AI search', 'AI agents', 'WhatsApp agents', 'Automations', 'App development', 'DevOps support']) {
    await expect(sec).toContainText(s);
  }
});

test('03 WhatsApp: the pills change the sample conversation on the 3D phone', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const sec = page.locator('[data-sec="03"]');
  await expect(sec).toContainText('Sample conversation');
  await expect(sec).toHaveAttribute('data-demo', 'salon');
  await scrollToSec(page, '03', 0.3);
  const clinic = sec.locator('.pill', { hasText: 'Clinic' });
  await clinic.click();
  await expect(clinic).toHaveAttribute('aria-pressed', 'true');
  await expect(sec).toHaveAttribute('data-demo', 'clinic');
  await expect(sec.locator('.demo__transcript')).toContainText('City Dental');
  await expect(sec.locator('.demo__transcript')).toContainText('Booked');
});

test('04 automations: the wire draws and every step lights by the end of the pin', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const sec = page.locator('[data-sec="04"]');
  await expect(sec).toContainText('Sample flow with illustrative steps');
  await scrollToSec(page, '04', 0.05);
  await page.waitForTimeout(800);
  expect(await sec.locator('.flow__step.is-on').count()).toBeLessThan(4);
  await scrollToSec(page, '04', 0.95);
  await expect.poll(() => sec.locator('.flow__step.is-on').count()).toBe(4);
});

test('05 work: Stage by default; List toggles, is remembered, and rows expand', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const sec = page.locator('[data-sec="05"]');
  await expect(sec).toHaveAttribute('data-mode', 'stage');
  await expect(sec.locator('.panel')).toHaveCount(4);
  await expect(sec.locator('.list')).toBeHidden();
  await sec.locator('.toggle button', { hasText: 'List' }).click();
  await expect(sec).toHaveAttribute('data-mode', 'list');
  await expect(sec.locator('.stage')).toBeHidden();
  const row = sec.locator('.row').first();
  await row.locator('.row__btn').click();
  await expect(row.locator('.row__btn')).toHaveAttribute('aria-expanded', 'true');
  await expect(row).toContainText('Client project · Website + iOS + Android');
  await page.reload();
  await expect(page.locator('[data-sec="05"]')).toHaveAttribute('data-mode', 'list');
});

test('05 work: honesty rules (StepQ credit, founding-team roles TBC, screenshots TBC)', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="05"]');
  await expect(sec.locator('.panel', { hasText: 'StepQ' })).toContainText('Client project · Website + iOS + Android');
  for (const name of ['TeachGenie.ai', 'Brivia Club']) {
    const p = sec.locator('.panel', { hasText: name });
    await expect(p).toContainText('Founding team');
    await expect(p.locator('.panel__credit .tbc')).toHaveText('TBC');
  }
  await expect(sec.locator('.panel__shot').first()).toHaveText('Screenshot TBC');
});

test('05 list: a preview follows the pointer over a row (fine pointer)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  await page.locator('[data-sec="05"] .toggle button', { hasText: 'List' }).click();
  const row = page.locator('[data-sec="05"] .row').nth(1);
  await row.scrollIntoViewIfNeeded();
  const b = await row.boundingBox();
  await page.mouse.move(b.x + 200, b.y + 30);
  await page.mouse.move(b.x + 260, b.y + 40, { steps: 5 });
  const prev = page.locator('[data-sec="05"] .preview');
  await expect.poll(() => prev.evaluate((e) => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
  await expect(prev).toContainText('TeachGenie.ai');
});

test('the Node cursor follows a mouse, rings over links and shows a verb', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  await page.mouse.move(400, 400);
  await page.mouse.move(420, 420, { steps: 3 });
  await expect(page.locator('html')).toHaveClass(/has-node/);
  const cta = page.locator('header .hdr__cta');
  const b = await cta.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 });
  await expect(page.locator('.node')).toHaveClass(/is-active/);
  await expect(page.locator('.node__label')).toHaveText('Chat');
});

test('the Node cursor stays off under reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await gotoReady(page);
  await page.mouse.move(400, 400, { steps: 4 });
  await expect(page.locator('html')).not.toHaveClass(/has-node/);
  await context.close();
});

test('06 process: four steps; the wire lights each as you scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  const sec = page.locator('[data-sec="06"]');
  await expect(sec.locator('.step')).toHaveCount(4);
  await page.evaluate(() => scrollTo(0, document.querySelector('[data-sec="06"] .steps').getBoundingClientRect().top + scrollY - innerHeight * 0.2));
  await expect.poll(() => sec.locator('.step.is-on').count()).toBe(4);
});

test('07 about: "How this site is built" and TBC chips for missing links', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="07"]');
  await expect(sec).toContainText('How this site is built');
  await expect(sec.locator('.about__links .tbc')).toHaveCount(3);
});

test('08 contact: WhatsApp and book-a-call actions', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('[data-sec="08"]');
  await expect(sec.locator('h2')).toHaveAccessibleName('Let’s build yours.');
  await expect(sec.locator('a[href*="wa.me"]').first()).toBeVisible();
  await expect(sec.locator('a', { hasText: 'Book a call' })).toHaveCount(1);
});

test('every menu link scrolls to its section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hrefs = await page.locator('#menu a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toEqual(['#services', '#whatsapp', '#automations', '#work', '#process', '#about', '#contact']);
  for (const h of hrefs) await expect(page.locator(h)).toHaveCount(1);
});

for (const id of ['03', '04', '07', '08']) {
  test(`mobile: end of ${id} clears the pinned bar`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await scrollToSectionEnd(page, `[data-sec="${id}"]`);
    const last = page.locator(`[data-sec="${id}"] .scene__after > *, [data-sec="${id}"] .readout, [data-sec="${id}"] .contact__ctas`).last();
    await expectClearsBar(page, last);
  });
}

test('at most one red alert colour anywhere on the page', async ({ page }) => {
  await page.goto('/');
  const reds = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => {
    const cs = getComputedStyle(e);
    return [cs.color, cs.backgroundColor].some((c) => c.replace(/\s/g, '') === 'rgb(224,92,92)');
  }).length);
  expect(reds).toBeLessThanOrEqual(1);
});
