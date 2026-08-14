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
import { PARSE_OPTIONS, helpSpec } from './spec';

const USAGE = `kura — CLI de Firebase Hosting del ecosistema shibui

Uso:
  kura <comando> [opciones]

Comandos:
  targets            Lista los targets de Hosting y el estado de su build local
  status             Añade qué hay publicado en cada sitio y si falta desplegar
  verify             Comprueba por HTTP lo que se está sirviendo (sin credenciales)
  sites              Inventario de sitios: declarados sin crear y huérfanos
  sites create       Aprovisiona los sitios que faltan. Simula sin --execute
  deploy             Publica un target. Simula por defecto; preview salvo --live

Opciones:
  --format <f>       table | json | ndjson  (por defecto: table con TTY, ndjson sin él)
  --target <t>       Restringe la salida a un target (obligatorio en deploy)
  --expect-origin <s>  Exige que el bundle servido contenga esa cadena
  --root <ruta>      Raíz del repo (por defecto: se busca hacia arriba desde el cwd)
  -h, --help         Esta ayuda. Con --format json|ndjson devuelve el spec maquinable

Opciones de sites create:
  --site <id>        Sitio concreto a crear
  --missing          Crea todo lo que .firebaserc declara y no existe
  --execute          Crea de verdad. Sin esto solo simula

Opciones de deploy:
  --execute          Sube de verdad. Sin esto solo simula y cuenta qué haría
  --channel <c>      Canal de preview (por defecto: preview)
  --live             Destino producción. Exige además --confirm <target>
  --confirm <t>      Repite el nombre del target para autorizar el deploy a live

  Publicar en estos sitios es publicar en internet. La forma corta del
  comando es la inofensiva, y llegar a producción cuesta dos flags.

Códigos de salida:
  0 ok · 1 inesperado · 2 uso incorrecto · 3 no encontrado
  4 credenciales · 5 precondición · 6 verificación fallida

Desde la raíz del monorepo, usa --silent:
  pnpm --silent kura targets
Sin él, pnpm escribe su banner en stdout y rompe el NDJSON.`;

type Values = {
  format?: string | undefined;
  target?: string | undefined;
  'expect-origin'?: string | undefined;
  site?: string | undefined;
  missing?: boolean | undefined;
  channel?: string | undefined;
  live?: boolean | undefined;
  confirm?: string | undefined;
  execute?: boolean | undefined;
  root?: string | undefined;
  help?: boolean | undefined;
};

function parse(args: string[]): { values: Values; positionals: string[] } {
  try {
    // Las opciones salen del spec (F5), no de una lista paralela que pueda divergir.
    const parsed = parseArgs({ args, options: PARSE_OPTIONS, allowPositionals: true, strict: true });
    return { values: parsed.values as Values, positionals: parsed.positionals };
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

interface CommandResult {
  data: unknown;
  /** El comando produjo un informe con comprobaciones fallidas: exit 6. */
  failed?: boolean;
}

async function dispatch(positionals: readonly string[], values: Values): Promise<CommandResult> {
  const command = positionals[0] === 'sites' ? `sites ${positionals[1] ?? ''}`.trim() : positionals[0];
  switch (command) {
    case 'targets': {
      const root = values.root ?? findRepoRoot(process.cwd());
      return { data: reportTargets(readHostingConfig(root)) };
    }
    case 'status': {
      const root = values.root ?? findRepoRoot(process.cwd());
      const config = readHostingConfig(root);
      const local = reportTargets(config);
      // Import diferido: adapter.ts arrastra node:child_process y la resolución
      // de firebase-tools, y ningún comando sin red debe pagar eso.
      const [{ createFirebaseAdapter }, { reportStatus }] = await Promise.all([
        import('./adapter'),
        import('./commands/status'),
      ]);
      return { data: await reportStatus(config, local, createFirebaseAdapter(), values.target) };
    }
    case 'verify': {
      const root = values.root ?? findRepoRoot(process.cwd());
      const config = readHostingConfig(root);
      const [{ createHttpClient }, { reportVerify }] = await Promise.all([
        import('./http'),
        import('./commands/verify'),
      ]);
      const rows = await reportVerify(config, createHttpClient(), {
        onlyTarget: values.target,
        expectOrigin: values['expect-origin'],
      });
      return { data: rows, failed: rows.some((row) => !row.ok) };
    }
    case 'sites': {
      const config = readHostingConfig(values.root ?? findRepoRoot(process.cwd()));
      const [{ createFirebaseAdapter }, { reportSites }] = await Promise.all([
        import('./adapter'),
        import('./commands/sites'),
      ]);
      return { data: await reportSites(config, createFirebaseAdapter()) };
    }
    case 'sites create': {
      const config = readHostingConfig(values.root ?? findRepoRoot(process.cwd()));
      const [{ createFirebaseAdapter }, { createSites }] = await Promise.all([
        import('./adapter'),
        import('./commands/sites'),
      ]);
      const { rows, failed } = await createSites(config, createFirebaseAdapter(), {
        site: values.site,
        missing: values.missing,
        execute: values.execute,
      });
      return { data: rows, failed };
    }
    case 'deploy': {
      const root = values.root ?? findRepoRoot(process.cwd());
      const config = readHostingConfig(root);
      const local = reportTargets(config);
      const [{ createFirebaseAdapter }, { createHttpClient }, { runDeploy }] = await Promise.all([
        import('./adapter'),
        import('./http'),
        import('./commands/deploy'),
      ]);
      const { rows, failed } = await runDeploy(config, local, createFirebaseAdapter(), createHttpClient(), {
        target: values.target,
        channel: values.channel,
        live: values.live,
        confirm: values.confirm,
        execute: values.execute,
        expectOrigin: values['expect-origin'],
      });
      return { data: rows, failed };
    }
    default:
      throw new KuraError(
        'USAGE',
        `Comando desconocido: ${command ?? '(ninguno)'}`,
        'Comandos disponibles: targets · status · verify · sites · sites create · deploy',
      );
  }
}

async function main(): Promise<void> {
  let format: Format = defaultFormat(process.stdout.isTTY === true);
  let envelope: Envelope<unknown>;
  let verificationFailed = false;

  try {
    const { values, positionals } = parse(process.argv.slice(2));
    format = resolveFormat(values.format);

    if (values.help === true) {
      // Con TTY delante hay un humano y se imprime la prosa; en json/ndjson va el
      // spec maquinable, para que un agente descubra la superficie sin parsear texto.
      if (format === 'table') {
        process.stdout.write(`${USAGE}\n`);
        process.exitCode = EXIT.ok;
        return;
      }
      envelope = ok(helpSpec());
    } else if (positionals.length === 0) {
      process.stderr.write(`${USAGE}\n`);
      process.exitCode = EXIT.usage;
      return;
    } else {
      const result = await dispatch(positionals, values);
      envelope = ok(result.data);
      verificationFailed = result.failed === true;
    }
  } catch (err) {
    envelope = fail(err);
  }

  const output = render(envelope, format);
  if (output !== '') process.stdout.write(`${output}\n`);
  // Un informe de verificación con filas en rojo es un ÉXITO del comando (el
  // sobre va con ok:true y los datos completos) pero un FALLO del sistema
  // verificado, y eso se comunica por el código de salida.
  // exitCode en vez de process.exit(): evita truncar stdout en tuberías de Windows.
  process.exitCode = verificationFailed ? EXIT.verification : exitCodeFor(envelope);
}

await main();
