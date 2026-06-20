import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

/* ============================================================
   hanko · configuración de test — nivel BROWSER (F3/F4/F5 · incr. 2)

   Corre los `*.browser.test.ts`: el harness sobre custom elements
   vivos (Playwright vía @vitest/browser, igual provider que shibui-ui).
   Requiere instalar las deps de browser + los navegadores de Playwright:
     pnpm install
     pnpm --filter @shibui-ui/hanko exec playwright install chromium
   Uso: pnpm --filter @shibui-ui/hanko test:browser
     docs/decisions/adr-002-estrategia-testing.md · docs/specs/harness.md
   ============================================================ */
export default defineConfig({
  test: {
    include: ['src/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
