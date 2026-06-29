import { defineConfig } from 'vite';

// App Open Cells (Lit + web components). No necesita plugin de framework:
// Vite/esbuild compila los decoradores de Lit leyendo `tsconfig.json`
// (experimentalDecorators + useDefineForClassFields:false).
// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
