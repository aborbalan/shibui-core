#!/usr/bin/env node
/**
 * Chequeo de frescura de los `pnpm.overrides` de seguridad.
 *
 * El problema que resuelve
 * ------------------------
 * Un override de seguridad se escribe como suelo: `"undici": ">=7.28.0 <8"`.
 * pnpm lo satisface UNA vez, el lockfile congela esa versión, y a partir de ahí
 * nadie la mueve: Dependabot no sabe editar `pnpm.overrides`, así que no abre PR,
 * y `pnpm install` no sube nada porque el rango ya se cumple. El override deja de
 * ser una mitigación y pasa a ser un pin que BLOQUEA el parche, en silencio.
 *
 * Pasó dos veces en este repo. En la auditoría de agosto de 2026, seis overrides
 * habían resuelto exactamente a su propio suelo (`fast-uri` con `>=3.1.2` estaba
 * en 3.1.2, `undici` con `>=7.28.0` estaba en 7.28.0...) y entre los seis
 * explicaban 16 de las 34 alertas abiertas.
 *
 * Qué hace
 * --------
 * Cruza la salida de `pnpm audit --json` con las claves de `pnpm.overrides`:
 *
 *   - Vulnerabilidad EN un paquete que ya tiene override  → suelo caducado.
 *     Es el caso grave: había una mitigación y se ha quedado corta.
 *   - Vulnerabilidad en un paquete SIN override           → hallazgo normal.
 *     Dependabot ya lo ve; se reporta para no perderlo de vista.
 *
 * Sale con código 1 si hay algún suelo caducado, que es lo que debe romper el CI.
 * Los hallazgos sin override se informan pero no rompen: de esos ya avisa GitHub.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Separa la clave de un override en nombre de paquete y selector de major.
 * Las claves admiten `pkg`, `pkg@3` y `@scope/pkg@1`, así que no vale con
 * partir por el primer `@`: en los scoped, el primero es parte del nombre.
 */
function parseOverrideKey(key) {
  const at = key.lastIndexOf('@');
  if (at > 0) {
    return { name: key.slice(0, at), selector: key.slice(at + 1) };
  }
  return { name: key, selector: null };
}

function readOverrides() {
  const pkg = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
  const overrides = pkg.pnpm?.overrides ?? {};
  const byName = new Map();
  for (const [key, range] of Object.entries(overrides)) {
    const { name, selector } = parseOverrideKey(key);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push({ key, selector, range });
  }
  return byName;
}

/**
 * Lee la auditoría. Con `--input <fichero>` la toma de un JSON ya guardado en
 * vez de llamar a la red. Sirve para dos cosas: ejercitar este chequeo contra
 * un caso conocido (un guard que nadie ha visto saltar no es un guard), y poder
 * correrlo sin salir a internet.
 */
function runAudit() {
  const flag = process.argv.indexOf('--input');
  if (flag !== -1) {
    const file = process.argv[flag + 1];
    if (!file) {
      console.error('--input necesita la ruta de un fichero JSON.');
      process.exit(2);
    }
    return JSON.parse(readFileSync(resolve(file), 'utf8'));
  }

  let raw;
  try {
    raw = execFileSync('pnpm', ['audit', '--json'], {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      shell: process.platform === 'win32',
    });
  } catch (err) {
    // `pnpm audit` sale con código != 0 justo cuando encuentra algo, que es el
    // caso que nos interesa. El JSON viene igualmente por stdout.
    raw = err.stdout;
    if (!raw) {
      console.error('No se pudo ejecutar `pnpm audit`:', err.message);
      process.exit(2);
    }
  }

  const start = raw.indexOf('{');
  if (start === -1) {
    console.error('`pnpm audit` no devolvió JSON:\n' + raw.slice(0, 400));
    process.exit(2);
  }

  try {
    return JSON.parse(raw.slice(start));
  } catch (err) {
    console.error('JSON de `pnpm audit` ilegible:', err.message);
    process.exit(2);
  }
}

const overridesByName = readOverrides();
const audit = runAudit();
const advisories = Object.values(audit.advisories ?? {});

const stale = [];
const uncovered = [];

for (const adv of advisories) {
  const name = adv.module_name;
  const entry = {
    name,
    severity: adv.severity,
    title: adv.title,
    vulnerable: adv.vulnerable_versions,
    patched: adv.patched_versions,
    url: adv.url,
  };
  if (overridesByName.has(name)) {
    entry.overrides = overridesByName.get(name);
    stale.push(entry);
  } else {
    uncovered.push(entry);
  }
}

const total = advisories.length;
const deps = audit.metadata?.totalDependencies ?? '?';

if (total === 0) {
  console.log(`✔ Sin vulnerabilidades. ${deps} dependencias auditadas, ` +
    `${overridesByName.size} paquetes con override.`);
  process.exit(0);
}

if (stale.length > 0) {
  console.log('');
  console.log('✘ SUELOS DE OVERRIDE CADUCADOS');
  console.log('  Estos paquetes YA tenían un override de seguridad y se ha quedado');
  console.log('  corto. Dependabot no los va a arreglar: hay que subir el suelo a mano.');
  console.log('');
  for (const s of stale) {
    for (const o of s.overrides) {
      console.log(`  ${s.name}  [${s.severity}]`);
      console.log(`    override actual : "${o.key}": "${o.range}"`);
      console.log(`    parcheado en    : ${s.patched}`);
      console.log(`    aviso           : ${s.title}`);
      if (s.url) console.log(`    detalle         : ${s.url}`);
      console.log('');
    }
  }
}

if (uncovered.length > 0) {
  console.log('· Vulnerabilidades sin override (Dependabot ya las ve):');
  for (const u of uncovered) {
    console.log(`    ${u.name} [${u.severity}] → parcheado en ${u.patched}`);
  }
  console.log('');
}

console.log(`Resumen: ${total} avisos · ${stale.length} por suelo caducado · ` +
  `${uncovered.length} sin override.`);

process.exit(stale.length > 0 ? 1 : 0);
