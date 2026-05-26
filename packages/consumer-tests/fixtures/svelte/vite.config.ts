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
    // Sirve los tokens CSS de Shibui en /shibui-tokens.css vía middleware.
    //
    // Por qué configureServer y no transformIndexHtml:
    //   - @sveltejs/vite-plugin-svelte + transformIndexHtml desactiva la caché
    //     de pre-bundling de Vite (warning: "caching has been disabled").
    //   - Sin pre-bundling, @shibui-ui/ui (preserveModules:true) genera más de
    //     100 peticiones HTTP individuales → timeout en CI.
    //   - configureServer añade un middleware HTTP plano que no interfiere con
    //     el sistema de optimización de Vite ni desactiva la caché.
    //   - El index.html referencia /shibui-tokens.css con <link rel="stylesheet">
    //     para que los tokens estén disponibles antes de que ejecute ningún JS.
    {
      name: 'serve-shibui-tokens',
      configureServer(server) {
        server.middlewares.use('/shibui-tokens.css', (_req, res) => {
          try {
            const css = readFileSync(tokensAbsPath, 'utf-8');
            res.setHeader('Content-Type', 'text/css');
            res.end(css);
          } catch {
            res.statusCode = 404;
            res.end('/* tokens.css not found */');
          }
        });
      },
    },
  ],
  // NOTA: NO se excluye @shibui-ui/ui de optimizeDeps.
  // @shibui-ui/ui usa preserveModules:true → muchos archivos pequeños.
  // Excluirlo del pre-bundling haría que el navegador emitiera cientos de
  // peticiones individuales, lo que provoca timeouts en CI.
  // El pre-bundling por defecto agrupa todo en un solo archivo con los
  // side-effects (customElements.define) correctamente incluidos.
});
