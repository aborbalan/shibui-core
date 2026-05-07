import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: { path: './openapi.yaml' },
  output: { path: './src/gen', clean: true },
  plugins: [
    pluginOas(),
    pluginTs({ output: { path: 'models' } }),
    pluginZod({ output: { path: 'zod' } }),
    
    // Generación para REACT
    pluginReactQuery({
      output: { path: 'react' },
      framework: 'react',
    }),
    
    // Generación para SVELTE
    pluginReactQuery({
      output: { path: 'svelte' },
      framework: 'svelte',
    }),

    // Generación para ANGULAR (Vía Vanilla JS/TS para máxima compatibilidad)
    pluginReactQuery({
      output: { path: 'angular' },
      framework: 'react', // Usamos el core y luego Angular lo envuelve en Signals
      output: {
        path: 'angular',
        exportType: 'common',
      }
    }),
  ],
});