import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ruta absoluta al CSS de tokens compilado de @shibui-ui/ui.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
const tokensAbsPath = path.resolve(__dirname, '../../../shibui-ui/dist/tokens.css');

export default defineConfig({
  plugins: [
    svelte(),
    // Inyecta los tokens CSS de Shibui como <style> inline en el <head>
    // antes de que arranque cualquier script.
    //
    // Por qué se necesita esto (y por qué `import '@shibui-ui/ui/tokens'` en
    // main.ts no es suficiente):
    //   - En el dev server de Vite, un CSS importado desde JS se inyecta vía
    //     una <style> generada por módulos HMR, que llega DESPUÉS del primer
    //     render del árbol de componentes.
    //   - Los tests de Playwright consultan getComputedStyle justo después de
    //     que el custom element se define (waitForFunction). Si los tokens aún
    //     no están en el CSSOM en ese momento, --katachi-id devuelve "".
    //   - La inyección en transformIndexHtml coloca el <style> en el HTML
    //     inicial, así que el navegador lo procesa antes de ejecutar ningún JS.
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
    // Excluirlo del pre-bundling garantiza que los side-effects (define) se ejecuten.
    exclude: ['@shibui-ui/ui'],
  },
  server: {
    // Permite servir archivos desde fuera del root del fixture
    // (necesario para resolver @shibui-ui/ui → packages/shibui-ui/dist/).
    fs: { strict: false },
  },
});
