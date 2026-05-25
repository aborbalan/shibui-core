/**
 * Shared helpers for Katachi visual regression specs.
 *
 * - `buildGuard`       — throws in beforeAll if dist artifacts are missing
 * - `noAnimations`     — beforeEach hook that disables all CSS transitions/animations
 * - `waitForComponents`— waits for one or more custom elements to be defined
 * - `parseAlpha`       — extracts alpha from a *computed* CSS color string (rgb/rgba)
 * - `extractTokenAlpha`— extracts alpha from a raw CSS *token value* string (oklch/rgba/rgb)
 */

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

export const DIST_TOKENS = resolve(ROOT, 'dist/tokens.css');
export const DIST_JS     = resolve(ROOT, 'dist/index.js');

/** Throws if the compiled dist artifacts are absent. */
export function buildGuard(): void {
  const missing: string[] = [];
  if (!existsSync(DIST_TOKENS)) missing.push('dist/tokens.css');
  if (!existsSync(DIST_JS))     missing.push('dist/index.js');
  if (missing.length) {
    throw new Error(
      `Required build artifacts missing: ${missing.join(', ')}\n` +
      `Run \`pnpm build:shibui\` before \`pnpm test:visual\`.`
    );
  }
}

/** Injects a style tag that disables all transitions and animations. */
export async function noAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }`,
  });
}

/** Waits for custom element(s) to be defined (i.e. upgraded). */
export async function waitForComponents(page: Page, ...tags: string[]): Promise<void> {
  await page.evaluate((tagList) =>
    Promise.all(tagList.map((tag) => customElements.whenDefined(tag))),
    tags
  );
}

/** Parses the alpha channel from a *computed* CSS color string.
 *  Handles `rgba(r,g,b,a)` and opaque `rgb(r,g,b)` (returns 1).
 *  Use for: `getComputedStyle(el).color` return values.
 */
export function parseAlpha(color: string): number {
  const m = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
  if (m) return parseFloat(m[1]);
  if (/^rgb\(/.test(color)) return 1;
  return 1;
}

/**
 * Extracts the alpha channel from a raw CSS *token value* string.
 *
 * Unlike `parseAlpha` (which handles browser-serialized computed colors),
 * this function handles CSS source values as defined in `_katachi.css`:
 *
 *   oklch(97.77% 0.003 68.35deg / 0.55)   → 0.55
 *   oklch(45% 0.05 45deg / 25%)            → 0.25  (percentage alpha)
 *   rgba(250, 247, 244, 0.55)              → 0.55
 *   var(--color-washi-50)                  → 1     (solid ref, opaque)
 *   rgb(100, 100, 100)                     → 1     (no alpha component)
 *
 * Use for: `getComputedStyle(el).getPropertyValue('--token-name')` values.
 */
export function extractTokenAlpha(tokenValue: string): number {
  const s = tokenValue.trim();

  // Slash-separated alpha as percentage: / 25%
  const pct = s.match(/\/\s*([\d.]+)%\s*\)/);
  if (pct) return parseFloat(pct[1]) / 100;

  // Slash-separated alpha as decimal: / 0.55
  const dec = s.match(/\/\s*([\d.]+)\s*\)/);
  if (dec) return parseFloat(dec[1]);

  // Legacy rgba(r, g, b, a)
  const rgba = s.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
  if (rgba) return parseFloat(rgba[1]);

  // No alpha component (solid color, var() reference, etc.) → fully opaque
  return 1;
}
