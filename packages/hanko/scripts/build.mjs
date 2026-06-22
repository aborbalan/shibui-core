/* ============================================================
   hanko · build de emisión para publicación (F7 · ADR-004)

   Emite `dist/` instalable-y-ejecutable en Node-ESM puro:

   - JS  → esbuild empaqueta `src/index.ts` en UN único fichero
           ESM autocontenido (`dist/index.js`). Al no quedar
           imports relativos, NO hay problema de extensiones
           (la causa de `ERR_MODULE_NOT_FOUND` con el `tsc`
           extensionless anterior). El harness (browser-only en
           uso) se inlinea sin arrastrar axe-core/playwright
           porque solo se importa con `import type`.
   - DTS → `tsc --emitDeclarationOnly` emite el árbol `.d.ts`;
           luego se reescriben los especificadores relativos
           añadiendo `.js` / `/index.js` (comprobando el disco)
           para que el tipado resuelva también bajo `nodenext`.

   Cero dependencias nuevas: usa el esbuild + typescript ya
   presentes como devDeps. Decisión de formato: ADR-004.
   ============================================================ */
import { build as esbuild } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  rmSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const entry = join(root, 'src', 'index.ts');

/* 1 — Partir de un dist/ limpio. */
rmSync(dist, { recursive: true, force: true });

/* 2 — JS: bundle ESM de fichero único. */
await esbuild({
  entryPoints: [entry],
  outfile: join(dist, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'neutral', // el barrel no toca builtins de Node (los runners *-run.ts quedan fuera)
  target: 'es2022',
  sourcemap: true,
  sourcesContent: true, // sourcemap autocontenido: el tarball no incluye src/ (files:[dist,README])
  treeShaking: true,
  legalComments: 'none',
});

/* 3 — DTS: árbol de declaraciones (tsc, sin maps — ver tsconfig.build.json). */
const tscBin = require.resolve('typescript/bin/tsc');
const tsc = spawnSync(
  process.execPath,
  [tscBin, '-p', join(root, 'tsconfig.build.json'), '--emitDeclarationOnly'],
  { cwd: root, stdio: 'inherit' },
);
if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

/* 4 — Fixup de extensiones en los .d.ts: añade `.js` (fichero) o
   `/index.js` (directorio) a los especificadores relativos, para
   que el tipado resuelva bajo `moduleResolution: nodenext`. La
   comprobación es contra el disco → maneja imports de directorio
   (p.ej. `./checks`) sin heurísticas frágiles. */
const REL = /(\bfrom\s*|import\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2/g;

function resolveSpecifier(fromDir, spec) {
  if (/\.(js|json)$/.test(spec)) return spec; // ya tiene extensión
  if (existsSync(join(fromDir, `${spec}.d.ts`))) return `${spec}.js`;
  if (existsSync(join(fromDir, spec, 'index.d.ts'))) return `${spec}/index.js`;
  return spec; // no resoluble como d.ts → dejar intacto
}

function fixupDts(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      fixupDts(full);
      continue;
    }
    if (!full.endsWith('.d.ts')) continue;
    const src = readFileSync(full, 'utf8');
    const out = src.replace(REL, (_m, kw, q, spec) => {
      return `${kw}${q}${resolveSpecifier(dirname(full), spec)}${q}`;
    });
    if (out !== src) writeFileSync(full, out);
  }
}

fixupDts(dist);

console.log('hanko build: dist/ emitido (JS bundle ESM + d.ts con extensiones).');
