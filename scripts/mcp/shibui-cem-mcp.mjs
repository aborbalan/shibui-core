#!/usr/bin/env node
// Lanzadera del servidor MCP de cem sobre el manifiesto de @shibui-ui/ui.
//
// Sirve a los agentes la API real de los componentes (validate_html sobre los
// ~1.700 puntos de API del manifiesto). Hace tres cosas que la invocacion
// directa no puede:
//   1. Arranca cem dentro de packages/shibui-ui, que es donde su package.json
//      declara `customElements` y donde el servidor descubre el manifiesto.
//   2. Invoca el entry JS del paquete en vez del binario `cem` del PATH. El
//      nombre `cem` ya lo ocupa @custom-elements-manifest/analyzer, que es otra
//      herramienta y la que usa el script `analyze`.
//   3. Falla RUIDOSAMENTE si el manifiesto no existe o esta vacio. Es build
//      output gitignorado: sin esta guarda, un clon fresco levantaria un
//      servidor que aprueba cualquier HTML en silencio, que es peor que no
//      tener servidor.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkgDir = join(repoRoot, 'packages', 'shibui-ui');
const manifest = join(pkgDir, 'dist', 'custom-elements.json');
const cemEntry = join(repoRoot, 'node_modules', '@pwrs', 'cem', 'bin', 'cem.js');

const die = (msg) => {
  process.stderr.write(`[shibui-cem] ${msg}\n`);
  process.exit(1);
};

if (!existsSync(cemEntry)) {
  die(`no encuentro @pwrs/cem en ${cemEntry}. Ejecuta pnpm install desde la raiz del repo principal.`);
}

if (!existsSync(manifest)) {
  die(
    `no existe el manifiesto ${manifest}.\n` +
      `[shibui-cem] es build output gitignorado: genera con "pnpm --filter @shibui-ui/ui analyze".`
  );
}

let elementCount = 0;
try {
  const cem = JSON.parse(readFileSync(manifest, 'utf8'));
  for (const mod of cem.modules ?? []) {
    for (const d of mod.declarations ?? []) if (d.tagName) elementCount++;
  }
} catch (error) {
  die(`el manifiesto no es JSON valido (${error.message}). Regenera con "pnpm --filter @shibui-ui/ui analyze".`);
}

if (elementCount === 0) {
  die('el manifiesto no declara ningun custom element. Regenera con "pnpm --filter @shibui-ui/ui analyze".');
}

process.stderr.write(`[shibui-cem] manifiesto OK: ${elementCount} custom elements\n`);

const child = spawn(process.execPath, [cemEntry, 'mcp', ...process.argv.slice(2)], {
  cwd: pkgDir,
  stdio: 'inherit',
});

child.on('error', (error) => die(`no se pudo arrancar cem: ${error.message}`));
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
