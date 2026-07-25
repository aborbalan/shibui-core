#!/usr/bin/env node
// Lanzadera del servidor MCP oficial del Angular CLI para el monorepo.
//
// Hace dos cosas que la invocación directa no puede:
//   1. Arranca el CLI dentro de apps/app-angular. Los servidores MCP stdio se
//      arrancan con cwd = raíz del proyecto, y ahí no hay angular.json, así que
//      `list_projects` no encontraría el workspace.
//   2. Sanea stdout. El transporte stdio es JSON-RPC delimitado por saltos de
//      línea: cualquier otra línea rompe el framing. La extensión Console Ninja
//      parchea `ng.js` e imprime un banner antes del handshake, así que todo lo
//      que no sea JSON se desvía a stderr en vez de contaminar el canal.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const appDir = join(repoRoot, 'apps', 'app-angular');
const ngBin = join(appDir, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

if (!existsSync(ngBin)) {
  process.stderr.write(
    `[angular-mcp] no encuentro el Angular CLI en ${ngBin}.\n` +
      `[angular-mcp] ejecuta pnpm install desde la raíz del repo principal (los worktrees no tienen node_modules).\n`
  );
  process.exit(1);
}

const child = spawn(process.execPath, [ngBin, 'mcp', ...process.argv.slice(2)], {
  cwd: appDir,
  stdio: ['pipe', 'pipe', 'inherit'],
});

child.on('error', (error) => {
  process.stderr.write(`[angular-mcp] no se pudo arrancar el CLI: ${error.message}\n`);
  process.exit(1);
});

process.stdin.pipe(child.stdin);

createInterface({ input: child.stdout, crlfDelay: Infinity }).on('line', (line) => {
  if (line.trimStart().startsWith('{')) {
    process.stdout.write(`${line}\n`);
  } else if (line.trim()) {
    process.stderr.write(`[angular-mcp] descartado de stdout: ${line}\n`);
  }
});

child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
