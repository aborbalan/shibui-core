import pw from '@playwright/test';
const { test, expect } = pw;
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIXTURE_PATH = resolve(__dirname, 'katachi.html');
const TOKENS_PATH  = resolve(__dirname, '../../dist/tokens.css');
const FIXTURE_URL  = `file://${FIXTURE_PATH.replace(/\\/g, '/')}`;

const KATACHI = ['wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'] as const;

test.describe('Katachi · visual regression', () => {

  test.beforeAll(() => {
    if (!existsSync(TOKENS_PATH)) {
      throw new Error(
        `dist/tokens.css missing at ${TOKENS_PATH}\n` +
        `Run \`pnpm build:shibui\` before \`pnpm test:visual\`. The visual ` +
        `fixture imports compiled tokens to assert real consumer output, ` +
        `not source-tree state.`
      );
    }
  });

  test.beforeEach(async ({ page }) => {
    // Disable animations to avoid flaky shadows/transitions.
    await page.addStyleTag({
      content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
    });
  });

  for (const id of KATACHI) {
    test(`tile · ${id}`, async ({ page }) => {
      await page.goto(FIXTURE_URL);

      const tile = page.locator(`[data-tile="${id}"]`);
      await expect(tile).toBeVisible();

      // Sanity: --katachi-id should be readable from a descendant.
      const computedId = await tile.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--katachi-id').trim()
      );
      expect(computedId).toBe(id);

      // Visual snapshot (per-browser baseline lives next to the spec).
      await expect(tile).toHaveScreenshot(`katachi-${id}.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    });
  }

  test('full grid · all 6 katachi side-by-side', async ({ page }) => {
    await page.goto(FIXTURE_URL);
    await page.setViewportSize({ width: 1280, height: 920 });

    await expect(page.locator('.grid')).toBeVisible();
    await expect(page).toHaveScreenshot('katachi-grid.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    });
  });
});
