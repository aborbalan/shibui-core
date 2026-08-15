import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

/*
 * Config plana de ESLint 9. Sustituye a `.config/eslintrc.cjs`, que era
 * eslintrc de ESLint 8.
 *
 * Vive en la raíz del paquete y no en `.config/` a propósito: en config plana
 * los patrones de `ignores` se resuelven contra el directorio del fichero de
 * config, así que desde `.config/` un `dist` apuntaría a `.config/dist`. Es el
 * mismo sitio donde la tiene `apps/app-react`.
 *
 * El linteo con tipos se limita a `src/**` —igual que hacía el `.eslintignore`
 * de antes con su `!src/**/*`— porque fuera de ahí hay ficheros que no entran
 * en el tsconfig y el parser con `project` fallaría al no encontrarlos.
 */
export default defineConfig([
  globalIgnores([
    'dist',
    'build',
    'storybook-static',
    'node_modules',
    '_katachi-legacy',
    'tests',
    'scripts',
    '.storybook',
    '**/*.d.ts',
  ]),
  {
    files: ['src/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, storybook.configs['flat/recommended']],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
