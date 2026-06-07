import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ruta absoluta al CSS de tokens compilado de @shibui-ui/ui.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
const tokensAbsPath = path.resolve(__dirname, '../../../shibui-ui/dist/tokens.css');

// En modo build (vite build) Rollup resuelve y bundlea @shibui-ui/ui + lit
// en un único chunk. No hay problema de pre-bundling ni de symlinks.
// Los tests se sirven con `vite preview` sobre la salida estática del build.
export default defineConfig({
  plugins: [
    svelte(),

    // Inyecta los tokens CSS de Shibui como <style> inline en el <head>
    // antes de que arranque cualquier script.
    //
    // Por qué se necesita esto (y por qué `import '@shibui-ui/ui/tokens'` en
    // main.ts no es suficiente): en la build de producción, los imports CSS de
    // JS se extraen como assets enlazados con <link rel="stylesheet">. Aunque el
    // <link> es render-blocking para el paint, hay una ventana donde Playwright
    // detecta customElements.get('lib-button') !== undefined (JS ejecutado) pero
    // el sheet del <link> aún no ha sido aplicado al CSSOM. Los tests de katachi
    // llaman getComputedStyle en ese instante y leen --katachi-id vacío.
    // Con este plugin los tokens se escriben en el HTML generado (head-prepend)
    // → síncronamente disponibles desde que el parser lee el <head>.
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
});
