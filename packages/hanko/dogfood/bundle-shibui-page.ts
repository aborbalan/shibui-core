/* ============================================================
   hanko · genera los assets de la PÁGINA del Trust Report

   El HTML del report (src/report/render.ts) usa web components de shibui
   pero NO los importa: referencia, por `<script src>` y `<link href>`, dos
   assets que deja este script junto al index.html:

     · shibui-ui.js  — bundle IIFE autocontenido (shibui + lit incluido) que
                       registra todos los custom elements. Lo produce esbuild
                       desde `shibui-page-glue.ts` (mismo truco de registro que
                       el dogfood: sin tree-shaking + ignoreAnnotations, si no
                       esbuild poda los @customElement y no se registra nada).
     · tokens.css    — tokens semánticos de shibui a nivel documento (paleta,
                       escala, katachi), copiado tal cual del dist de shibui.

   Vive FUERA de `src/` (carga shibui por código, igual que probe-shibui.ts):
   el core sigue sin importar shibui (lo guarda src/genericity.test.ts). No se
   publica (no entra en `files`).

   Uso:
     pnpm --filter @shibui-ui/hanko assets:page                 # rutas por defecto
     pnpm --filter @shibui-ui/hanko assets:page <out-dir> [shibui-dist-dir]

   Spec: docs/specs/trust-report.md
   ============================================================ */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const HERE = dirname(fileURLToPath(import.meta.url)); // packages/hanko/dogfood
const PKG = resolve(HERE, '..'); //                     packages/hanko

const outDir = process.argv[2] ?? resolve(PKG, 'hanko-report');
const shibuiDist = process.argv[3] ?? resolve(PKG, '../shibui-ui/dist');

async function main(): Promise<void> {
  mkdirSync(outDir, { recursive: true });

  // 1 · Bundle del glue de registro → IIFE autocontenido (lit incluido).
  await build({
    entryPoints: [resolve(HERE, 'shibui-page-glue.ts')],
    outfile: join(outDir, 'shibui-ui.js'),
    bundle: true,
    format: 'iife',
    platform: 'browser',
    minify: true,
    // Sin tree-shaking + ignoreAnnotations: el import de shibui es side-effect
    // puro (registra los custom elements vía @customElement). Si se poda, nada
    // queda registrado y la página renderiza custom elements sin definir.
    treeShaking: false,
    ignoreAnnotations: true,
    logLevel: 'info',
  });

  // 2 · Tokens semánticos a nivel documento (paleta + escala + katachi).
  const tokensSrc = join(shibuiDist, 'tokens.css');
  if (existsSync(tokensSrc)) {
    copyFileSync(tokensSrc, join(outDir, 'tokens.css'));
  } else {
    // No es fatal: la página degrada a sus colores de fallback (el `<style>`
    // del report usa `var(--token, #fallback)` precisamente para esto).
    console.warn(`hanko assets:page · no encontré tokens.css en "${shibuiDist}", la página usará fallbacks.`);
  }

  console.log(`hanko assets:page · shibui-ui.js${existsSync(tokensSrc) ? ' + tokens.css' : ''} → ${outDir}/`);
}

main().catch((err) => {
  console.error('hanko assets:page · fallo generando los assets de la página:');
  console.error(err);
  process.exit(1);
});
