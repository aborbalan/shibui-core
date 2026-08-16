#!/usr/bin/env node
// Lanzadera del servidor MCP de kura (packages/kura).
//
// Hace tres cosas que la invocación directa no puede:
//   1. Fija el cwd a la raíz del repo. kura busca la pareja firebase.json +
//      .firebaserc hacia arriba desde el cwd, y un servidor stdio se arranca
//      con el cwd que le dé el cliente.
//   2. Resuelve tsx por ruta absoluta. El servidor vive en TypeScript sin
//      build (el paquete es privado y se ejecuta con tsx), y `--import tsx`
//      dependería de que el specifier resuelva desde el cwd.
//   3. Falla RUIDOSAMENTE si faltan las dependencias, en vez de colgarse
//      durante el handshake. Es el caso de un worktree sin node_modules.
//
// A diferencia de la lanzadera de Angular, aquí NO hace falta sanear stdout:
// el servidor es nuestro y solo escribe JSON-RPC. Los subprocesos de firebase
// se lanzan con execFile y su salida se captura, nunca se hereda.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const entry = join(repoRoot, 'packages', 'kura', 'src', 'mcp-run.ts');

function abortar(mensaje) {
  process.stderr.write(`[kura-mcp] ${mensaje}\n`);
  process.stderr.write(
    '[kura-mcp] ejecuta pnpm install desde la raíz del repo principal (los worktrees no tienen node_modules).\n',
  );
  process.exit(1);
}

if (!existsSync(entry)) abortar(`no encuentro el servidor en ${entry}.`);

let tsxCli;
try {
  const require = createRequire(import.meta.url);
  tsxCli = join(dirname(require.resolve('tsx/package.json')), 'dist', 'cli.mjs');
} catch {
  abortar('no encuentro tsx.');
}

if (!existsSync(tsxCli)) abortar(`tsx está instalado pero no expone ${tsxCli}.`);

const child = spawn(process.execPath, [tsxCli, entry, ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit',
});

child.on('error', (error) => abortar(`no se pudo arrancar el servidor: ${error.message}`));
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
