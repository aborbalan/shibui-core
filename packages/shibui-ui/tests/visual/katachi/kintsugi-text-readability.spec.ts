/**
 * Kintsugi · text-token readability assertions
 * ─────────────────────────────────────────────
 * TOKEN-LEVEL checks (no web components). Reads the resolved values of
 * --text-primary and --text-secondary inside a [data-katachi="kintsugi"]
 * context and asserts their alpha channels meet minimum readability
 * thresholds.
 *
 * WHY A SEPARATE SPEC FROM katachi-components.spec.ts
 * ─────────────────────────────────────────────────────
 * katachi-components.spec.ts catches the *component usage* side:
 *   "lib-input is using the wrong token (e.g. --border-default as text color)"
 *
 * This spec catches the *token definition* side:
 *   "someone edited _katachi.css and lowered --text-secondary alpha to 0.10"
 *
 * Both can independently cause invisible text. Both need independent guards.
 *
 * THRESHOLDS
 * ──────────
 * Kintsugi intentionally uses semi-transparent text over a very dark surface
 * (~oklch 11% L). The thresholds below are chosen so that:
 *
 *   --text-primary   (defined: 0.55 alpha) → threshold 0.45
 *     Effective contrast with kintsugi bg ≈ 5.5:1  (WCAG AA normal text)
 *
 *   --text-secondary (defined: 0.35 alpha) → threshold 0.28
 *     Effective contrast with kintsugi bg ≈ 3.3:1  (WCAG AA large text)
 *
 * Both thresholds sit well below the defined values, giving 10 pp of
 * intentional design headroom while still catching regressions
 * (the old broken state was --text-muted at 0.20 → contrast ≈ 1.96:1).
 *
 * --text-muted (0.20) is NOT asserted — it is intentionally below
 * readable contrast and must never be used for functional label text.
 * Its correct usage is only in decorative or hint contexts.
 */

import pw from '@playwright/test';
const { test, expect } = pw;
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIST_TOKENS, extractTokenAlpha } from './_helpers.js';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const FIXTURE_URL = `file://${resolve(__dirname, 'kintsugi-text-readability-fixture.html').replace(/\\/g, '/')}`;

// ── Thresholds ────────────────────────────────────────────────────────────────
const THRESHOLDS = {
  primary:   { token: '--text-primary',   min: 0.45 },
  secondary: { token: '--text-secondary', min: 0.28 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Kintsugi · text token readability', () => {

  test.beforeAll(() => {
    if (!existsSync(DIST_TOKENS)) {
      throw new Error(
        `dist/tokens.css missing.\nRun \`pnpm build:shibui\` before \`pnpm test:visual\`.`
      );
    }
  });

  // ── Token alpha assertions ─────────────────────────────────────────────────
  for (const [tier, { token, min }] of Object.entries(THRESHOLDS)) {

    test(`${token} · alpha ≥ ${min} in kintsugi`, async ({ page }) => {
      await page.goto(FIXTURE_URL);

      // Read the raw CSS custom-property value from the kintsugi root.
      // getPropertyValue returns the source-level string (e.g. "oklch(97.77% 0.003 68.35deg / 0.55)")
      // which extractTokenAlpha can parse reliably regardless of browser serialization.
      const rawValue = await page.evaluate((t) => {
        const root = document.getElementById('kintsugi-root');
        return root ? getComputedStyle(root).getPropertyValue(t).trim() : null;
      }, token);

      expect(
        rawValue,
        `${token} resolved to null — is [data-katachi="kintsugi"] active in the fixture?`
      ).not.toBeNull();

      expect(
        rawValue,
        `${token} resolved to empty string — check that dist/tokens.css defines this token in the kintsugi block.`
      ).not.toBe('');

      const alpha = extractTokenAlpha(rawValue!);

      expect(
        alpha,
        [
          `${token} in kintsugi has alpha ${alpha.toFixed(3)} — below minimum ${min}.`,
          `This token is used as functional text color (${tier} text tier).`,
          `Lowering it past ${min} makes text unreadable on the kintsugi dark surface (~11% L).`,
          `Current defined value: "${rawValue!.trim()}"`,
        ].join('\n')
      ).toBeGreaterThanOrEqual(min);
    });

  }

  // ── Guard: --text-muted must stay below --text-secondary ─────────────────
  // Not a readability floor (muted IS intentionally low contrast) but a
  // hierarchy sanity check: muted < secondary < primary.
  test('token alpha hierarchy: muted < secondary < primary', async ({ page }) => {
    await page.goto(FIXTURE_URL);

    const alphas = await page.evaluate(() => {
      const root = document.getElementById('kintsugi-root')!;
      const cs = getComputedStyle(root);
      return {
        primary:   cs.getPropertyValue('--text-primary').trim(),
        secondary: cs.getPropertyValue('--text-secondary').trim(),
        muted:     cs.getPropertyValue('--text-muted').trim(),
      };
    });

    // Import extractTokenAlpha logic inline (evaluate runs in browser context)
    function extractAlpha(s: string): number {
      const pct = s.match(/\/\s*([\d.]+)%\s*\)/);
      if (pct) return parseFloat(pct[1]) / 100;
      const dec = s.match(/\/\s*([\d.]+)\s*\)/);
      if (dec) return parseFloat(dec[1]);
      const rgba = s.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
      if (rgba) return parseFloat(rgba[1]);
      return 1;
    }

    const aPrimary   = extractAlpha(alphas.primary);
    const aSecondary = extractAlpha(alphas.secondary);
    const aMuted     = extractAlpha(alphas.muted);

    expect(
      aMuted,
      `--text-muted (${aMuted.toFixed(3)}) must be less than --text-secondary (${aSecondary.toFixed(3)}) — token hierarchy broken.`
    ).toBeLessThan(aSecondary);

    expect(
      aSecondary,
      `--text-secondary (${aSecondary.toFixed(3)}) must be less than --text-primary (${aPrimary.toFixed(3)}) — token hierarchy broken.`
    ).toBeLessThan(aPrimary);
  });

});
