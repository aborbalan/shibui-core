/* ============================================================
   kura · descripción maquinable de su propia superficie (F5)

   Un agente que se encuentra este CLI necesita responder tres
   preguntas ANTES de invocar nada: qué comandos hay, cuáles tocan
   la red o piden credenciales, y cuáles cambian algo. Eso no se
   deduce de un texto de ayuda en prosa.

   Este fichero es la fuente de verdad. Los flags que acepta
   `parseArgs` se DERIVAN de aquí, así que es imposible añadir una
   opción sin describirla: no hay dos listas que puedan divergir.

   Las banderas `network`, `credentials` y `mutates` están para que
   quien lea esto pueda decidir solo qué es seguro ejecutar sin
   preguntar. `targets` no toca nada y se puede lanzar a ciegas;
   `deploy --execute` publica en internet y no.
   ============================================================ */
import { EXIT } from './envelope';

export interface CommandSpec {
  name: string;
  summary: string;
  /** Sale a la red. */
  network: boolean;
  /** Exige sesión de firebase (`firebase login`). */
  credentials: boolean;
  /** Cambia algo fuera del proceso. Los que mutan simulan por defecto. */
  mutates: boolean;
}

export interface FlagSpec {
  flag: string;
  type: 'string' | 'boolean';
  short?: string;
  description: string;
  /** Comandos en los que tiene efecto; vacío = global. */
  commands: string[];
}

export const COMMANDS: readonly CommandSpec[] = [
  {
    name: 'targets',
    summary: 'Lista los targets de Hosting y el estado de su build local',
    network: false,
    credentials: false,
    mutates: false,
  },
  {
    name: 'status',
    summary: 'Añade qué hay publicado en cada sitio y si falta desplegar',
    network: true,
    credentials: true,
    mutates: false,
  },
  {
    name: 'verify',
    summary: 'Comprueba por HTTP lo que se está sirviendo',
    network: true,
    credentials: false,
    mutates: false,
  },
  {
    name: 'sites',
    summary: 'Inventario de sitios: declarados sin crear y huérfanos',
    network: true,
    credentials: true,
    mutates: false,
  },
  {
    name: 'sites create',
    summary: 'Aprovisiona los sitios que faltan. Simula sin --execute',
    network: true,
    credentials: true,
    mutates: true,
  },
  {
    name: 'deploy',
    summary: 'Publica un target. Simula sin --execute; preview salvo --live',
    network: true,
    credentials: true,
    mutates: true,
  },
];

export const FLAGS: readonly FlagSpec[] = [
  { flag: 'format', type: 'string', description: 'table | json | ndjson', commands: [] },
  { flag: 'root', type: 'string', description: 'Raíz del repo; por defecto se busca hacia arriba', commands: [] },
  { flag: 'help', type: 'boolean', short: 'h', description: 'Ayuda; en json/ndjson devuelve este spec', commands: [] },
  {
    flag: 'target',
    type: 'string',
    description: 'Restringe a un target; obligatorio en deploy',
    commands: ['targets', 'status', 'verify', 'deploy'],
  },
  {
    flag: 'expect-origin',
    type: 'string',
    description: 'Exige que el bundle servido contenga esa cadena',
    commands: ['verify', 'deploy'],
  },
  { flag: 'site', type: 'string', description: 'Identificador de sitio a crear', commands: ['sites create'] },
  {
    flag: 'missing',
    type: 'boolean',
    description: 'Actúa sobre todo lo declarado que no existe',
    commands: ['sites create'],
  },
  {
    flag: 'execute',
    type: 'boolean',
    description: 'Ejecuta de verdad; sin esto solo simula',
    commands: ['sites create', 'deploy'],
  },
  { flag: 'channel', type: 'string', description: 'Canal de preview; por defecto preview', commands: ['deploy'] },
  { flag: 'live', type: 'boolean', description: 'Destino producción; exige --confirm', commands: ['deploy'] },
  {
    flag: 'confirm',
    type: 'string',
    description: 'Repite el nombre del target para autorizar el deploy a live',
    commands: ['deploy'],
  },
];

export const EXIT_CODES: ReadonlyArray<{ code: number; name: string; meaning: string }> = [
  { code: EXIT.ok, name: 'ok', meaning: 'Todo bien' },
  { code: EXIT.unexpected, name: 'unexpected', meaning: 'Error no clasificado' },
  { code: EXIT.usage, name: 'usage', meaning: 'Comando o flags mal usados' },
  { code: EXIT.notFound, name: 'not-found', meaning: 'El target, sitio o repo no existe' },
  { code: EXIT.auth, name: 'auth', meaning: 'Falta sesión de firebase o permisos' },
  { code: EXIT.precondition, name: 'precondition', meaning: 'Falta el build o una confirmación' },
  { code: EXIT.verification, name: 'verification', meaning: 'El informe salió con comprobaciones en rojo' },
];

/** Opciones de `parseArgs`, derivadas del spec para que no puedan divergir. */
export const PARSE_OPTIONS: Record<string, { type: 'string' | 'boolean'; short?: string }> = Object.fromEntries(
  FLAGS.map((flag) => [flag.flag, flag.short === undefined ? { type: flag.type } : { type: flag.type, short: flag.short }]),
);

export function helpSpec(): {
  tool: string;
  commands: readonly CommandSpec[];
  flags: readonly FlagSpec[];
  exitCodes: ReadonlyArray<{ code: number; name: string; meaning: string }>;
  notes: string[];
} {
  return {
    tool: 'kura',
    commands: COMMANDS,
    flags: FLAGS,
    exitCodes: EXIT_CODES,
    notes: [
      'stdout es datos y stderr es narración; nunca se mezclan.',
      'El formato por defecto es ndjson sin TTY y tabla con TTY.',
      'En ndjson va un sobre por fila, para que un listado que falla a la mitad siga siendo parseable.',
      'Los comandos con mutates:true simulan por defecto; hace falta --execute.',
      'Desde la raíz del monorepo usa `pnpm --silent kura`: sin --silent, pnpm mete su banner en stdout.',
    ],
  };
}
