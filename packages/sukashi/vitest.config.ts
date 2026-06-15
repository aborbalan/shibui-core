import { defineConfig } from 'vitest/config';

/* ============================================================
   sukashi · configuración de test (F0 — nivel unit)

   Solo nivel UNIT (Node, lógica pura de composición de capas).
   El nivel browser se añadirá en F3, con el web component.
   ============================================================ */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
