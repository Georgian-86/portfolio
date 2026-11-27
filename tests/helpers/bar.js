// Reusable bar-clearance check for mobile (Review Focus 2).
import { expect } from '@playwright/test';

export const HDR_H = 60;
export const BAR_H = 76;

/** Asserts the element's rect sits between the pinned header and the pinned bar. */
export async function expectClearsBar(page, locator) {
  await expect(locator).toBeVisible();
  const r = await locator.boundingBox();
  const ih = await page.evaluate(() => innerHeight);
  expect(r.y, 'top clears header').toBeGreaterThanOrEqual(HDR_H);
  expect(r.y + r.height, 'bottom clears bar').toBeLessThanOrEqual(ih - BAR_H);
}

/** Scrolls so the end of `sectionSel` meets the bottom of the viewport (its end state). */
export async function scrollToSectionEnd(page, sectionSel) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const bottom = el.getBoundingClientRect().bottom + scrollY;
    scrollTo(0, Math.min(bottom - innerHeight, document.documentElement.scrollHeight - innerHeight));
  }, sectionSel);
  await page.waitForTimeout(400);
}

export async function scrollToEnd(page) {
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
}
