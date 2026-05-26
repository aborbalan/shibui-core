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
    // Se usa vite build + vite preview en lugar del dev server.
    //
    // Por qué no funciona el dev server:
    //   @sveltejs/vite-plugin-svelte v6 usa el nuevo Environment API de Vite 6
    //   y deshabilita el optimizador legacy. Sin pre-bundling, @shibui-ui/ui
    //   (preserveModules:true) + lit generan 500+ peticiones HTTP individuales.
    //   Ninguna configuración de optimizeDeps desde el user-config puede
    //   contrarrestar esto porque el plugin opera a nivel de Environment.
    //
    // Con build + preview:
    //   Rollup bundlea @shibui-ui/ui + lit + svelte en un único chunk JS.
    //   Una sola petición HTTP → customElements.define se llama inmediatamente.
    //   La CSS de tokens se extrae a un <link> en el HTML antes que el JS.
    {
      command: 'pnpm exec vite build fixtures/svelte && pnpm exec vite preview fixtures/svelte --port 5175 --strictPort',
      port: 5175,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
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
