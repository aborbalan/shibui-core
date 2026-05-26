import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ruta absoluta al CSS de tokens compilado de @shibui-ui/ui.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
const tokensAbsPath = path.resolve(__dirname, '../../../shibui-ui/dist/tokens.css');

// Vite toma este directorio como root cuando se llama con:
//   vite fixtures/react --port 5174
// Los módulos de node_modules/ se resuelven desde packages/consumer-tests/.
//
// Se usa el transform JSX nativo de esbuild (vite.esbuild.jsx) en lugar de
// @vitejs/plugin-react. El plugin React, aunque restringido a src/, genera
// wrappers HMR sobre los módulos que interfieren con el sistema de módulos de
// Vite y bloquean la carga de @shibui-ui/ui (preserveModules, muchos chunks).
// Para un fixture de tests sin HMR ni Fast Refresh, el transform esbuild es
// equivalente y no tiene ese efecto secundario.
export default defineConfig({
  esbuild: {
    // JSX automático de React 19: importa react/jsx-runtime automáticamente,
    // igual que hace @vitejs/plugin-react pero sin el overhead de HMR.
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  plugins: [
    // Inyecta los tokens CSS de Shibui como <style> inline en el <head>
    // antes de que arranque cualquier script.
    //
    // Por qué se necesita esto (y por qué `import '@shibui-ui/ui/tokens'` en
    // main.tsx no es suficiente): ver comentario equivalente en svelte/vite.config.ts.
    {
      name: 'inject-shibui-tokens',
      transformIndexHtml: () => {
        const css = readFileSync(tokensAbsPath, 'utf-8');
        return [
          {
            tag: 'style',
            attrs: { 'data-shibui-tokens': '' },
            children: css,
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  ],
  optimizeDeps: {
    // @shibui-ui/ui usa preserveModules → muchos archivos pequeños.
    // Excluirlo del pre-bundling evita que esbuild lo trate como un paquete
    // monolítico y garantiza que los side-effects (define) se ejecuten.
    exclude: ['@shibui-ui/ui'],
  },
  server: {
    // Permite servir archivos desde fuera del root del fixture
    // (necesario para resolver @shibui-ui/ui → packages/shibui-ui/dist/).
    fs: { strict: false },
  },
});
