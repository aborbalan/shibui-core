/**
 * lib-progress · Katachi visual regression
 * ─────────────────────────────────────────
 * Checks the track background and fill across all 6 katachi contexts.
 * Key regression to guard: track using a bright palette color (e.g.
 * washi-200) that becomes a jarring white bar in dark katachi contexts.
 *
 * Run:   pnpm test:visual
 * Update baselines: pnpm test:visual:update
 */

import pw from '@playwright/test';
const { test, expect } = pw;
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGuard, noAnimations, waitForComponents } from '../_helpers.js';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const FIXTURE_URL = `file://${resolve(__dirname, 'fixture.html').replace(/\\/g, '/')}`;

const KATACHI = ['wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'] as const;

// ─────────────────────────────────────────────────────────────────────────────

test.describe('lib-progress · katachi visual', () => {

  test.beforeAll(buildGuard);

  test.beforeEach(async ({ page }) => {
    await noAnimations(page);
  });

  for (const id of KATACHI) {
    test(`slice · ${id}`, async ({ page }) => {
      await page.goto(FIXTURE_URL);
      await waitForComponents(page, 'lib-progress');

      const slice = page.locator(`[data-slice="${id}"]`);
      await expect(slice).toBeVisible();

      await expect(slice).toHaveScreenshot(`lib-progress-${id}.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    });
  }

  test('grid · all 6 katachi', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    await waitForComponents(page, 'lib-progress');
    await page.setViewportSize({ width: 960, height: 400 });

    await expect(page.locator('.grid')).toBeVisible();
    await expect(page).toHaveScreenshot('lib-progress-grid.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    });
  });

});
