/**
 * lib-input · Katachi visual regression
 * ──────────────────────────────────────
 * One screenshot per katachi context + one full-grid screenshot.
 * Baselines live in katachi.spec.ts-snapshots/ next to this file.
 *
 * Run:   pnpm test:visual
 * Update baselines: pnpm test:visual:update
 */

import pw from '@playwright/test';
const { test, expect } = pw;
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGuard, noAnimations, waitForComponents } from '../_helpers.js';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const FIXTURE_URL = `file://${resolve(__dirname, 'fixture.html').replace(/\\/g, '/')}`;

const KATACHI = ['wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'] as const;

// ─────────────────────────────────────────────────────────────────────────────

test.describe('lib-input · katachi visual', () => {

  test.beforeAll(buildGuard);

  test.beforeEach(async ({ page }) => {
    await noAnimations(page);
  });

  // One screenshot per katachi slice ────────────────────────────────────────
  for (const id of KATACHI) {
    test(`slice · ${id}`, async ({ page }) => {
      await page.goto(FIXTURE_URL);
      await waitForComponents(page, 'lib-input');

      const slice = page.locator(`[data-slice="${id}"]`);
      await expect(slice).toBeVisible();

      await expect(slice).toHaveScreenshot(`lib-input-${id}.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    });
  }

  // Full grid ───────────────────────────────────────────────────────────────
  test('grid · all 6 katachi', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    await waitForComponents(page, 'lib-input');
    await page.setViewportSize({ width: 960, height: 500 });

    await expect(page.locator('.grid')).toBeVisible();
    await expect(page).toHaveScreenshot('lib-input-grid.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    });
  });

});
