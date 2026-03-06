/// <reference types="vitest/config" />
/// <reference types="vitest" />
import { defineConfig, TerserOptions, type UserConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
/**
 * Vite configuration for UI library
 * 
 * Goals:
 * - Real tree-shaking (Zero-Bloat)
 * - Optimized build for distribution
 * - Support for modern native CSS
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { InlineConfig } from 'vitest/node';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const config: UserConfig & { test?: InlineConfig } = {
  plugins:[
    dts({ insertTypesEntry: true,tsconfigPath: './tsconfig.json',rollupTypes: false }),
  ],
  server: {
    // Suppress Vite banner/logo in terminal
    open: true,
    host: true
  },
  logLevel: 'warn',
  // Reduce console output
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ShibuiUI',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // Externalize Lit as peer dependency
      external: ['lit', 'lit/decorators.js', 'lit/directive.js', 'lit/directives/*'],
      output: {
        // Preserve export names for tree-shaking
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    },
    // Size optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }as TerserOptions,
    },
    // Aggressive tree-shaking
    cssCodeSplit: false,
    sourcemap: true
  },
  css: {
    // Modern native CSS - no heavy preprocessors
    devSourcemap: true
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(config);