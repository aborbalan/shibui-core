import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/*
 * E2E: levanta la app entera con `Test.createTestingModule` y la ataca con
 * supertest. Va en su propia config porque comparte transformador pero no
 * el patrón de ficheros ni la cobertura.
 *
 * `fileParallelism: false` porque cada fichero arranca una instancia de Nest:
 * en paralelo se pelean por el puerto.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    fileParallelism: false,
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
