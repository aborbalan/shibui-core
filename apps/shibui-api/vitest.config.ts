import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

/*
 * Tests unitarios de la API con vitest, como el resto del monorepo.
 *
 * El transformador es SWC y no el esbuild que trae vitest de serie: NestJS
 * resuelve la inyección de dependencias leyendo `emitDecoratorMetadata`, y
 * esbuild no emite esos metadatos. Con esbuild, `Test.createTestingModule`
 * compila pero falla al inyectar en tiempo de ejecución.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
    },
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
