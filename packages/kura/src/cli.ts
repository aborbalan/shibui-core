#!/usr/bin/env node
/* ============================================================
   kura · punto de entrada

   El ÚNICO fichero que toca `process`, imprime o decide códigos
   de salida. Todo lo demás son funciones puras que devuelven
   datos, que es lo que permite testearlas sin red ni credenciales.

   Dos reglas que no se negocian:

   1. `stdout` es datos, `stderr` es narración. Cargar
      firebase-tools ya escupe un DeprecationWarning de punycode
      por stderr (medido en F0): el ruido ajeno es inevitable y
      tiene que caer donde no estorbe.
   2. Cero interactividad. Nunca hay un prompt: si falta algo, se
      sale con código 2 o 5 diciendo qué flag falta.

   El adaptador de firebase-tools se importará de forma diferida
   (`await import`) en F2: cuesta ~750-950 ms cargarlo y `targets`
   no lo necesita.
   ============================================================ */
import { parseArgs } from 'node:util';
import { exitCodeFor, fail, ok, EXIT, KuraError, type Envelope } from './envelope';
import { defaultFormat, isFormat, render, FORMATS, type Format } from './format';
import { findRepoRoot, readHostingConfig } from './config';
import { reportTargets } from './commands/targets';

const USAGE = `kura — CLI de Firebase Hosting del ecosistema shibui

Uso:
  kura <comando> [opciones]

Comandos:
  targets            Lista los targets de Hosting y el estado de su build local

Opciones:
  --format <f>       table | json | ndjson  (por defecto: table con TTY, ndjson sin él)
  --root <ruta>      Raíz del repo (por defecto: se busca hacia arriba desde el cwd)
  -h, --help         Esta ayuda

Códigos de salida:
  0 ok · 1 inesperado · 2 uso incorrecto · 3 no encontrado
  4 credenciales · 5 precondición · 6 verificación fallida

Desde la raíz del monorepo, usa --silent:
  pnpm --silent kura targets
Sin él, pnpm escribe su banner en stdout y rompe el NDJSON.`;

const OPTIONS = {
  format: { type: 'string' },
  root: { type: 'string' },
  help: { type: 'boolean', short: 'h' },
} as const;

type Values = { format?: string | undefined; root?: string | undefined; help?: boolean | undefined };

function parse(args: string[]): { values: Values; positionals: string[] } {
  try {
    return parseArgs({ args, options: OPTIONS, allowPositionals: true, strict: true });
  } catch (err) {
    throw new KuraError('USAGE', err instanceof Error ? err.message : String(err), 'Prueba: kura --help');
  }
}

function resolveFormat(requested: string | undefined): Format {
  if (requested === undefined) return defaultFormat(process.stdout.isTTY === true);
  if (!isFormat(requested)) {
    throw new KuraError('USAGE', `Formato desconocido: ${requested}`, `Válidos: ${FORMATS.join(' · ')}`);
  }
  return requested;
}

async function dispatch(command: string, values: Values): Promise<unknown> {
  switch (command) {
    case 'targets': {
      const root = values.root ?? findRepoRoot(process.cwd());
      return reportTargets(readHostingConfig(root));
    }
    default:
      throw new KuraError('USAGE', `Comando desconocido: ${command}`, 'Comandos disponibles: targets');
  }
}

async function main(): Promise<void> {
  let format: Format = defaultFormat(process.stdout.isTTY === true);
  let envelope: Envelope<unknown>;

  try {
    const { values, positionals } = parse(process.argv.slice(2));
    format = resolveFormat(values.format);

    if (values.help === true) {
      process.stdout.write(`${USAGE}\n`);
      process.exitCode = EXIT.ok;
      return;
    }

    const command = positionals[0];
    if (command === undefined) {
      process.stderr.write(`${USAGE}\n`);
      process.exitCode = EXIT.usage;
      return;
    }

    envelope = ok(await dispatch(command, values));
  } catch (err) {
    envelope = fail(err);
  }

  const output = render(envelope, format);
  if (output !== '') process.stdout.write(`${output}\n`);
  // exitCode en vez de process.exit(): evita truncar stdout en tuberías de Windows.
  process.exitCode = exitCodeFor(envelope);
}

await main();
