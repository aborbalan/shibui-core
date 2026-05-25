/**
 * Shared helpers for Katachi visual regression specs.
 *
 * - `buildGuard`  — throws in beforeAll if dist artifacts are missing
 * - `noAnimations` — beforeEach hook that disables all CSS transitions/animations
 * - `waitForComponents` — waits for one or more custom elements to be defined
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

/** Parses the alpha channel from a computed CSS color string.
 *  Handles `rgba(r,g,b,a)` and opaque `rgb(r,g,b)` (returns 1).
 */
export function parseAlpha(color: string): number {
  const m = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
  if (m) return parseFloat(m[1]);
  if (/^rgb\(/.test(color)) return 1;
  return 1;
}
