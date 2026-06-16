import { defineConfig } from 'vitest/config';

/* ============================================================
   hanko · configuración de test — nivel UNIT (Node)

   Lógica pura: core/ + ingest/ + checks/ (motores) + harness puro.
   El nivel BROWSER (checks de runtime sobre el DOM vivo) vive en
   `vitest.browser.config.ts` y corre los `*.browser.test.ts`.
   Aquí se EXCLUYEN para que `pnpm test` no necesite el navegador.
     docs/decisions/adr-002-estrategia-testing.md
   ============================================================ */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.browser.test.ts'],
  },
});
