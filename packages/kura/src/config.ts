/* ============================================================
   kura · lectura de la configuración de Hosting

   Cruza los dos ficheros que Firebase mantiene separados:

     .firebaserc    target  → sitios     (a qué se despliega)
     firebase.json  target  → directorio (qué se despliega)

   Sin red, sin credenciales y sin firebase-tools: solo disco.
   Es lo que permite que `kura targets` responda en milisegundos
   y que sus tests corran en CI sin secretos.

   El parseo es defensivo a propósito. Estos dos ficheros los
   edita gente a mano, y un target declarado en un sitio pero no
   en el otro es un error real que conviene nombrar, no tragarse.
   ============================================================ */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { KuraError } from './envelope';

export interface HostingTarget {
  /** Nombre lógico del target, p.ej. `cv`. */
  target: string;
  /** Sitios de Hosting a los que apunta, p.ej. `['shibui-cv']`. */
  sites: string[];
  /** Directorio servido, relativo a la raíz del repo. */
  publicDir: string;
  /**
   * El target reescribe cualquier ruta a /index.html, es decir, es una SPA.
   * Storybook, la API y el informe de hanko no lo hacen, y comprobarles el
   * enrutado de cliente daría un fallo que no lo es.
   */
  spa: boolean;
}

export interface HostingConfig {
  root: string;
  project: string;
  targets: HostingTarget[];
}

/** Sube desde `startDir` hasta encontrar la pareja firebase.json + .firebaserc. */
export function findRepoRoot(startDir: string): string {
  const start = resolve(startDir);
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, 'firebase.json')) && existsSync(join(dir, '.firebaserc'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) {
      throw new KuraError(
        'NOT_FOUND',
        'No se encontró un repo con firebase.json y .firebaserc',
        `Buscado hacia arriba desde ${start}. Usa --root para señalarlo a mano.`,
      );
    }
    dir = parent;
  }
}

export function readHostingConfig(root: string): HostingConfig {
  const rc = readJson(join(root, '.firebaserc'));
  const firebaseJson = readJson(join(root, 'firebase.json'));

  const project = readProject(rc);
  const sitesByTarget = readSitesByTarget(rc, project);
  const targets = readTargets(firebaseJson, sitesByTarget);

  return { root, project, targets };
}

function readProject(rc: unknown): string {
  const targets = isRecord(rc) ? rc['targets'] : undefined;
  if (!isRecord(targets)) {
    throw new KuraError('PRECONDITION', '.firebaserc no declara ningún target de hosting');
  }

  const projects = Object.keys(targets);
  const declaredDefault = isRecord(rc) && isRecord(rc['projects']) ? rc['projects']['default'] : undefined;
  if (typeof declaredDefault === 'string' && projects.includes(declaredDefault)) return declaredDefault;

  const only = projects[0];
  if (projects.length === 1 && only !== undefined) return only;

  throw new KuraError(
    'PRECONDITION',
    `.firebaserc declara ${projects.length} proyectos y ninguno por defecto`,
    'Añade "projects": { "default": "<id>" } en .firebaserc.',
  );
}

function readSitesByTarget(rc: unknown, project: string): Map<string, string[]> {
  const targets = isRecord(rc) ? rc['targets'] : undefined;
  const forProject = isRecord(targets) ? targets[project] : undefined;
  const hosting = isRecord(forProject) ? forProject['hosting'] : undefined;
  if (!isRecord(hosting)) {
    throw new KuraError('PRECONDITION', `.firebaserc no declara hosting para el proyecto ${project}`);
  }

  const map = new Map<string, string[]>();
  for (const [target, value] of Object.entries(hosting)) {
    const sites = asStringArray(value);
    if (sites === null || sites.length === 0) {
      throw new KuraError('PRECONDITION', `El target '${target}' no declara sitios en .firebaserc`);
    }
    map.set(target, sites);
  }
  return map;
}

function readTargets(firebaseJson: unknown, sitesByTarget: Map<string, string[]>): HostingTarget[] {
  const hosting = isRecord(firebaseJson) ? firebaseJson['hosting'] : undefined;
  // `hosting` admite un objeto suelto (proyecto de un solo sitio) o un array.
  const entries: unknown[] = Array.isArray(hosting) ? hosting : hosting === undefined ? [] : [hosting];

  const targets: HostingTarget[] = [];
  for (const entry of entries) {
    if (!isRecord(entry)) continue;
    const target = entry['target'];
    if (typeof target !== 'string') continue; // entradas sin target: fuera del modelo de kura

    const publicDir = entry['public'];
    if (typeof publicDir !== 'string') {
      throw new KuraError('PRECONDITION', `El target '${target}' no declara 'public' en firebase.json`);
    }

    const sites = sitesByTarget.get(target);
    if (sites === undefined) {
      throw new KuraError(
        'NOT_FOUND',
        `El target '${target}' está en firebase.json pero no en .firebaserc`,
        `Ejecuta: firebase target:apply hosting ${target} <site-id>`,
      );
    }

    targets.push({ target, sites, publicDir, spa: rewritesToIndex(entry['rewrites']) });
  }

  if (targets.length === 0) {
    throw new KuraError('PRECONDITION', 'firebase.json no declara ningún target de hosting');
  }
  return targets;
}

/**
 * ¿Hay una regla que mande todo a /index.html? En firebase.json las reglas
 * son `source`/`destination`; la API de Hosting devuelve las mismas como
 * `glob`/`path`, así que se aceptan las dos formas.
 */
function rewritesToIndex(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return (value as unknown[]).some((rule) => {
    if (!isRecord(rule)) return false;
    const source = rule['source'] ?? rule['glob'];
    const destination = rule['destination'] ?? rule['path'];
    return source === '**' && typeof destination === 'string' && destination.endsWith('/index.html');
  });
}

function readJson(path: string): unknown {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf-8');
  } catch {
    throw new KuraError('NOT_FOUND', `No se pudo leer ${path}`);
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch (err) {
    throw new KuraError('UNEXPECTED', `${path} no es JSON válido: ${(err as Error).message}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value as unknown[];
  return items.every((item): item is string => typeof item === 'string') ? [...items] as string[] : null;
}
