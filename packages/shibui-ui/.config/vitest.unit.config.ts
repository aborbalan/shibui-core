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
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Vitest 4 resuelve los globs de `include` desde process.cwd() (el root del
// package), no desde el directorio del config. Usamos path.resolve para
// anclar la ruta al directorio de este fichero (.config/) de forma robusta.
const configDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: 'unit',

    // Node environment: los scripts usan fs, path, process — no DOM
    environment: 'node',

    // Incluye solo los tests de scripts/
    // Ruta resuelta desde el directorio de este config para ser independiente
    // del cwd desde el que se lance vitest.
    // Nota: fast-glob (usado por Vitest) requiere forward slashes en Windows.
    include: [path.resolve(configDir, '../scripts/**/*.test.ts').replace(/\\/g, '/')],

    // Excluye los tests de Storybook que van en src/
    exclude: [
      path.resolve(configDir, '../src/**/*.stories.ts').replace(/\\/g, '/'),
      'node_modules',
      'dist',
    ],

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
