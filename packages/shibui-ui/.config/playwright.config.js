// Wrapper CJS-compatible loader for Playwright's config.
// Workaround for an ESM resolution issue between Playwright's internal
// esmLoader and the `@playwright/test` package exports map when the
// config is authored as `.ts` and the workspace is `"type": "module"`.
//
// Once Playwright supports loading `.ts` configs in this setup, the
// `.ts` source can be re-used directly and this file removed.

import test from '@playwright/test';
const { defineConfig, devices } = test;

export default defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:6006',
  },

  // Los specs de atoms/, molecules/ y organisms/ instancian los componentes
  // desde Storybook (`/iframe.html?id=…`), así que necesitan el server vivo.
  // Sin esta entrada fallaban todos por ECONNREFUSED — y como encima no los
  // ejecutaba ningún workflow, nadie se enteró. El suite de visual/ no lo
  // necesita: carga un fixture por file://.
  webServer: {
    command: 'pnpm storybook --ci --quiet',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
