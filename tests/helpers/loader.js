// The v3 loader covers the first screen until the hero is ready; tests that read pixels wait for it.
import { expect } from '@playwright/test';

export async function waitForLoader(page, timeout = 8000) {
  await expect(page.locator('html')).toHaveAttribute('data-loader', 'done', { timeout });
}

export async function gotoReady(page, url = '/') {
  await page.goto(url);
  await waitForLoader(page);
}
