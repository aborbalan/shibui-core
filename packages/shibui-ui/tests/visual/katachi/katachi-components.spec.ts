/**
 * Katachi · Cross-component label-visibility assertions
 * ─────────────────────────────────────────────────────
 * Programmatic (no screenshots). Pierces Shadow DOM to read the
 * computed color of functional text elements (labels, placeholders)
 * inside web components rendered in dark katachi contexts.
 *
 * WHY THIS EXISTS
 * Dark katachi contexts (kintsugi, wabi, terminal, celadon) redefine
 * semantic tokens with low-alpha values intended for borders and subtle
 * surfaces. If a component uses a border token as text color by mistake,
 * the label becomes near-invisible. This suite catches that regression
 * without relying on pixel-diff snapshots.
 *
 * ADDING A NEW COMPONENT
 * 1. Add the component to katachi-components-fixture.html (inside each
 *    `[data-katachi]` container).
 * 2. Add an entry to LABEL_CHECKS below with the component tag and the
 *    Shadow DOM selector for its functional label element.
 */

import pw from '@playwright/test';
const { test, expect } = pw;
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGuard, noAnimations, waitForComponents, parseAlpha } from './_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_URL = `file://${resolve(__dirname, 'katachi-components-fixture.html').replace(/\\/g, '/')}`;

// ── Katachi contexts that use a dark background ──────────────────────────────
const DARK_KATACHI = ['wabi', 'kintsugi', 'terminal', 'celadon'] as const;
type DarkKatachi = typeof DARK_KATACHI[number];

// ── Minimum alpha for functional text (labels, visible hints) ────────────────
// Anything below this threshold is invisible enough to fail UX.
// Chosen to sit between --text-muted (0.20 in kintsugi, the broken state)
// and --text-secondary (0.35 in kintsugi, the correct state).
const MIN_ALPHA = 0.28;

// ── Components to check ──────────────────────────────────────────────────────
// Each entry: the custom element tag + the Shadow DOM selector for the
// functional label element that must remain legible in dark contexts.
const LABEL_CHECKS = [
  { tag: 'lib-input', selector: '.input-label', label: 'lib-input › .input-label' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Katachi · label visibility (programmatic)', () => {

  test.beforeAll(buildGuard);

  test.beforeEach(async ({ page }) => {
    await noAnimations(page);
  });

  for (const katachi of DARK_KATACHI) {
    for (const { tag, selector, label } of LABEL_CHECKS) {

      test(`${label} · ${katachi} · alpha ≥ ${MIN_ALPHA}`, async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForComponents(page, tag);

        const color = await page.evaluate(
          ({ katachi, tag, selector }) => {
            const container = document.querySelector(`[data-katachi="${katachi}"]`);
            const component  = container?.querySelector(tag) as Element & { shadowRoot: ShadowRoot | null };
            const el         = component?.shadowRoot?.querySelector(selector);
            return el ? getComputedStyle(el).color : null;
          },
          { katachi, tag, selector }
        );

        expect(
          color,
          `${label} in [data-katachi="${katachi}"] returned null — ` +
          `check that the component upgraded and the selector is correct.`
        ).not.toBeNull();

        const alpha = parseAlpha(color!);
        expect(
          alpha,
          `${label} in [data-katachi="${katachi}"] has alpha ${alpha.toFixed(2)}, ` +
          `expected ≥ ${MIN_ALPHA}. A border or overly-muted token is being ` +
          `used as text color — use --lib-comp-fg-sec or higher.`
        ).toBeGreaterThanOrEqual(MIN_ALPHA);
      });

    }
  }

});
