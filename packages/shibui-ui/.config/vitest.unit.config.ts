// vitest.unit.config.ts
// Configuración de Vitest exclusiva para tests unitarios de scripts/.
//
// Separada de vite.config.ts porque esa config usa browser mode (Chromium)
// para los tests de Storybook. Los tests de scripts son Node puro —
// no necesitan DOM ni browser, y corren en < 1s.
//
// Uso:
//   pnpm test:unit          → pasa una vez y termina
//   pnpm test:unit -- --watch  → modo watch para TDD

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'unit',

    // Node environment: los scripts usan fs, path, process — no DOM
    environment: 'node',

    // Incluye solo los tests de scripts/
    include: ['../scripts/**/*.test.ts'],

    // Excluye los tests de Storybook que van en src/
    exclude: ['../src/**/*.stories.ts', 'node_modules', 'dist'],

    // Cobertura opcional: actívala con --coverage
    coverage: {
      provider: 'v8',
      include: ['../scripts/**/*.ts'],
      exclude: ['../scripts/**/*.test.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        lines:      80,
        functions:  80,
        branches:   75,
        statements: 80,
      },
    },

    // Reporte limpio en CI, verbose en local
    reporters: process.env['CI'] ? ['dot'] : ['verbose'],
  },
});
