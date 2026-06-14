import { defineConfig } from 'vitest/config';

/* ============================================================
   hanko · configuración de test (F0 — nivel unit)

   Solo nivel UNIT (Node, lógica pura: core/ + ingest/).
   El nivel browser (@vitest/browser) se añadirá en F3, cuando
   los checks de runtime lo necesiten. Ver:
     docs/decisions/adr-002-estrategia-testing.md
   ============================================================ */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
