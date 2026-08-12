/* ============================================================
   kura · única frontera con firebase-tools

   Ningún otro fichero sabe que firebase-tools existe. Aquí se
   traduce su respuesta al modelo de kura y sus fallos a KuraError.

   POR QUÉ SUBPROCESO Y NO EL MÓDULO
   F0 eligió el import programático. F2 lo tumbó con una medición:
   la API programática registra sus comandos de forma perezosa en
   un programa de `commander` COMPARTIDO, y a la tercera invocación
   en el mismo proceso el registro revienta con
   `Cannot read properties of undefined (reading 'indexOf')` desde
   commander@5.1.0. Dos llamadas por proceso, no más. Para un CLI
   que consulta nueve sitios, es inservible.

   El subproceso no tiene ese problema porque cada invocación es un
   proceso limpio, y de paso nunca cargamos firebase-tools en el
   nuestro. Se paga ~2,7-4 s por llamada, y por eso status limita la
   concurrencia en vez de lanzar las nueve de golpe.

   Se invoca el entry JS con `process.execPath` en vez del shim
   `firebase.CMD`: sin shell, sin comillas que escapar, sin depender
   de que node_modules/.bin exista.

   Los parseadores son puros y viven aquí para poder probarlos en CI
   con respuestas reales capturadas, sin red ni credenciales. La
   regla es asimétrica a propósito: un cambio ESTRUCTURAL revienta
   ruidosamente, porque significa que la herramienta se movió bajo
   nuestros pies; un campo OPCIONAL ausente degrada a null, porque
   un sitio recién creado legítimamente no tiene release.
   ============================================================ */
import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { KuraError } from './envelope';

export interface HostingSite {
  /** Identificador corto del sitio, p.ej. `shibui-cv`. */
  site: string;
  /** URL pública por defecto, p.ej. `https://shibui-cv.web.app`. */
  url: string;
}

export interface LiveRelease {
  url: string;
  /** Momento de la publicación en ISO, o null si la release no lo declara. */
  releasedAt: string | null;
  /** Ficheros servidos por la versión publicada. */
  files: number | null;
  releasedBy: string | null;
  /** Etiqueta `deployment-tool` de la versión, p.ej. `cli-firebase`. */
  tool: string | null;
}

export interface DeployResult {
  url: string;
  /** Caducidad del canal de preview en ISO; los canales live no caducan. */
  expiresAt: string | null;
  version: string | null;
}

export interface HostingAdapter {
  listSites(project: string): Promise<HostingSite[]>;
  liveRelease(project: string, site: string): Promise<LiveRelease | null>;
  /** Aprovisiona un sitio nuevo en el proyecto. Aditivo y reversible con hosting:sites:delete. */
  createSite(project: string, site: string): Promise<HostingSite>;
  /** Publica en un canal de preview. `cwd` debe ser la raíz: firebase lee firebase.json de ahí. */
  deployChannel(project: string, target: string, channel: string, cwd: string): Promise<DeployResult>;
  deployLive(project: string, target: string, site: string, cwd: string): Promise<DeployResult>;
}

/* ---------- parseadores puros ---------- */

/**
 * Desenvuelve el sobre `{ status, result }` de `firebase --json`.
 * El error también viaja ahí: `{ status: 'error', error: '<mensaje>' }`.
 */
export function unwrap(payload: unknown, what: string): unknown {
  if (!isRecord(payload)) {
    throw shapeChanged(what, 'la salida de --json no era un objeto');
  }
  if (payload['status'] === 'error') {
    throw classify(asString(payload['error']) ?? 'sin detalle', what);
  }
  if (!('result' in payload)) {
    throw shapeChanged(what, 'falta la clave `result` en la salida de --json');
  }
  return payload['result'];
}

export function parseSites(payload: unknown): HostingSite[] {
  const sites = isRecord(payload) ? payload['sites'] : undefined;
  if (!Array.isArray(sites)) {
    throw shapeChanged('hosting:sites:list', 'se esperaba un objeto con la clave `sites`');
  }

  return (sites as unknown[]).map((entry) => parseSiteEntry(entry, 'hosting:sites:list'));
}

/** `hosting:sites:create` devuelve el recurso Site suelto, con la misma forma. */
export function parseSite(payload: unknown): HostingSite {
  return parseSiteEntry(payload, 'hosting:sites:create');
}

function parseSiteEntry(entry: unknown, api: string): HostingSite {
  if (!isRecord(entry)) throw shapeChanged(api, 'la entrada de sitio no es un objeto');
  const name = entry['name'];
  if (typeof name !== 'string') throw shapeChanged(api, 'falta `name` en la entrada de sitio');
  return { site: lastSegment(name), url: asString(entry['defaultUrl']) ?? '' };
}

export function parseLiveRelease(payload: unknown): LiveRelease | null {
  const channels = isRecord(payload) ? payload['channels'] : undefined;
  if (!Array.isArray(channels)) {
    throw shapeChanged('hosting:channel:list', 'se esperaba un objeto con la clave `channels`');
  }

  const live = (channels as unknown[]).find(
    (channel) => isRecord(channel) && typeof channel['name'] === 'string' && lastSegment(channel['name']) === 'live',
  );
  if (!isRecord(live)) return null;

  const release = isRecord(live['release']) ? live['release'] : undefined;
  const version = release !== undefined && isRecord(release['version']) ? release['version'] : undefined;
  const labels = version !== undefined && isRecord(version['labels']) ? version['labels'] : undefined;
  const releaseUser = release !== undefined && isRecord(release['releaseUser']) ? release['releaseUser'] : undefined;

  return {
    url: asString(live['url']) ?? '',
    releasedAt: asString(release?.['releaseTime']),
    // La API devuelve fileCount como cadena; se normaliza a número.
    files: asCount(version?.['fileCount']),
    releasedBy: asString(releaseUser?.['email']),
    tool: asString(labels?.['deployment-tool']),
  };
}

/**
 * `hosting:channel:deploy` devuelve un objeto indexado por target (o por sitio),
 * con la URL del canal recién creado dentro. Esa URL no está en ninguna
 * configuración —la inventa Firebase—, así que es el único sitio de donde
 * sacarla para poder verificar lo que se acaba de publicar.
 */
export function parseChannelDeploy(payload: unknown): DeployResult {
  if (!isRecord(payload)) {
    throw shapeChanged('hosting:channel:deploy', 'el resultado no es un objeto');
  }
  for (const entry of Object.values(payload)) {
    if (!isRecord(entry)) continue;
    const url = asString(entry['url']);
    if (url === null) continue;
    return { url, expiresAt: asString(entry['expireTime']), version: asString(entry['version']) };
  }
  throw shapeChanged('hosting:channel:deploy', 'ninguna entrada del resultado trae `url`');
}

/** Traduce el mensaje de error de firebase a una clase con código de salida propio. */
export function classify(message: string, what: string): KuraError {
  if (/authenticat|credential|not logged in|permission|Request had insufficient/i.test(message)) {
    return new KuraError('AUTH', `No se pudo ${what}: ${message}`, 'Autentícate con: pnpm exec firebase login');
  }
  if (/could not find|not found|does not exist/i.test(message)) {
    return new KuraError('NOT_FOUND', `No se pudo ${what}: ${message}`);
  }
  return new KuraError('UNEXPECTED', `No se pudo ${what}: ${message}`);
}

/* ---------- adaptador real ---------- */

export function createFirebaseAdapter(): HostingAdapter {
  return {
    async listSites(project) {
      const result = await runFirebase(['hosting:sites:list', '--project', project], 'listar los sitios');
      return parseSites(result);
    },
    async liveRelease(project, site) {
      const result = await runFirebase(
        ['hosting:channel:list', '--site', site, '--project', project],
        `leer los canales de ${site}`,
      );
      return parseLiveRelease(result);
    },
    async createSite(project, site) {
      const result = await runFirebase(['hosting:sites:create', site, '--project', project], `crear el sitio ${site}`);
      return parseSite(result);
    },
    async deployChannel(project, target, channel, cwd) {
      const result = await runFirebase(
        ['hosting:channel:deploy', channel, '--only', target, '--project', project],
        `desplegar ${target} al canal ${channel}`,
        cwd,
      );
      return parseChannelDeploy(result);
    },
    async deployLive(project, target, site, cwd) {
      await runFirebase(
        ['deploy', '--only', `hosting:${target}`, '--project', project],
        `desplegar ${target} a live`,
        cwd,
      );
      // La URL de live es determinista, así que no hay que parsearla del resultado.
      return { url: `https://${site}.web.app`, expiresAt: null, version: null };
    },
  };
}

let cachedBin: string | null = null;

/** Ruta al entry JS del CLI. Se resuelve tarde para que los comandos sin red no la necesiten. */
function firebaseBin(): string {
  if (cachedBin !== null) return cachedBin;
  try {
    const entry = createRequire(import.meta.url).resolve('firebase-tools');
    cachedBin = join(dirname(entry), 'bin', 'firebase.js');
    return cachedBin;
  } catch {
    throw new KuraError(
      'PRECONDITION',
      'firebase-tools no está instalado',
      'Instala las dependencias del monorepo: pnpm install',
    );
  }
}

function runFirebase(args: string[], what: string, cwd: string = process.cwd()): Promise<unknown> {
  const argv = [firebaseBin(), ...args, '--json', '--non-interactive'];

  return new Promise((resolve, reject) => {
    // Los despliegues tardan bastante más que las consultas: sin techo propio,
    // el timeout por defecto de execFile cortaría una subida legítima.
    execFile(process.execPath, argv, { cwd, maxBuffer: 32 * 1024 * 1024, timeout: 15 * 60 * 1000 }, (err, stdout, stderr) => {
      // firebase escribe su sobre JSON en stdout tanto en éxito como en error,
      // así que se intenta parsear ANTES de mirar el código de salida.
      let payload: unknown;
      try {
        payload = JSON.parse(stdout) as unknown;
      } catch {
        const detail = err !== null ? err.message : String(stderr).trim().slice(0, 300);
        reject(new KuraError('UNEXPECTED', `No se pudo ${what}: ${detail || 'sin salida JSON'}`));
        return;
      }
      try {
        resolve(unwrap(payload, what));
      } catch (unwrapErr) {
        reject(unwrapErr);
      }
    });
  });
}

/* ---------- utilidades ---------- */

function shapeChanged(api: string, detail: string): KuraError {
  return new KuraError(
    'UNEXPECTED',
    `La respuesta de ${api} cambió de forma: ${detail}`,
    'firebase-tools va fijado a una versión exacta a propósito. Revisa el bump.',
  );
}

/** `projects/p/sites/shibui-cv` → `shibui-cv`. */
function lastSegment(name: string): string {
  return name.slice(name.lastIndexOf('/') + 1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

function asCount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value);
  return null;
}
