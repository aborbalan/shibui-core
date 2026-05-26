/**
 * Playwright config — Consumer contract tests
 *
 * Prerrequisito: pnpm build:shibui
 * Los fixtures importan @shibui-ui/ui que resuelve desde dist/.
 * Sin el build, las páginas cargarán pero los componentes no se registrarán.
 *
 * Servidores:
 *   React  → http://localhost:5174  (Vite, levantado por este config)
 *   Svelte → http://localhost:5175  (Vite, levantado por este config)
 *   Angular → http://localhost:4201 (ng serve, levantado desde el workspace
 *                                    @shibui/consumer-tests-angular)
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Un worker: los webServers comparten la misma máquina y tener paralelismo
  // entre suites causaría ruido en los logs de arranque.
  workers: 1,
  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI ? 'dot' : 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    // ── React 19 fixture ──────────────────────────────────────────────────
    {
      command: 'pnpm exec vite fixtures/react --port 5174',
      port: 5174,
      reuseExistingServer: !process.env.CI,
    },

    // ── Svelte 5 fixture ──────────────────────────────────────────────────
    {
      command: 'pnpm exec vite fixtures/svelte --port 5175',
      port: 5175,
      reuseExistingServer: !process.env.CI,
    },

    // ── Angular 21 fixture ────────────────────────────────────────────────
    // Levantado desde el workspace @shibui/consumer-tests-angular.
    // Angular tarda ~15-20s en compilar en frío.
    {
      command: 'pnpm --filter @shibui/consumer-tests-angular run serve',
      port: 4201,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
