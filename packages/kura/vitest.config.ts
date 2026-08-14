import { defineConfig } from 'vitest/config';

/* ============================================================
   kura · configuración de test — nivel UNIT (Node)

   Todo el árbol de comandos son funciones puras que reciben sus
   dependencias, así que los tests no necesitan red, credenciales
   ni navegador. Es lo que permite correrlos en CI sin secretos.
   ============================================================ */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
