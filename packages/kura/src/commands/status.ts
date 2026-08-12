/* ============================================================
   kura status · qué hay publicado en cada sitio

   Cruza tres cosas: lo que declara la configuración, lo que hay
   construido en disco y lo que sirve Firebase ahora mismo.

   Sobre `drift` y su honestidad: la comparación es entre la FECHA
   del index.html local y la FECHA de la release publicada. Es una
   señal, no una identidad de contenido — reconstruir sin cambiar
   nada bastaría para marcar `local-newer`. Sirve para responder
   «¿me falta desplegar?», no para afirmar que el contenido difiere.
   ============================================================ */
import type { HostingAdapter, LiveRelease } from '../adapter';
import type { HostingConfig } from '../config';
import type { BuildState, TargetReport } from './targets';
import { KuraError } from '../envelope';

export type Drift =
  /** El sitio declarado en .firebaserc no existe en el proyecto. */
  | 'no-site'
  /** El sitio existe pero nunca se ha publicado nada en su canal live. */
  | 'never-deployed'
  /** Hay algo publicado, pero no hay build local con el que comparar. */
  | 'no-build'
  /** Falta alguna fecha para poder comparar. */
  | 'unknown'
  /** El build local es más nuevo que lo publicado: falta desplegar. */
  | 'local-newer'
  /** Lo publicado es igual o más nuevo que el build local. */
  | 'in-sync';

export interface StatusReport {
  target: string;
  site: string;
  url: string | null;
  live: string | null;
  files: number | null;
  build: BuildState;
  drift: Drift;
}

export async function reportStatus(
  config: HostingConfig,
  local: readonly TargetReport[],
  adapter: HostingAdapter,
  onlyTarget?: string,
): Promise<StatusReport[]> {
  const selected = select(local, onlyTarget);
  const known = new Set((await adapter.listSites(config.project)).map((entry) => entry.site));

  return mapWithLimit(selected, CONSULTAS_EN_PARALELO, async (target): Promise<StatusReport> => {
      const site = target.sites[0] ?? '';

      if (site === '' || !known.has(site)) {
        return { target: target.target, site, url: null, live: null, files: null, build: target.build, drift: 'no-site' };
      }

      const release = await adapter.liveRelease(config.project, site);
      return {
        target: target.target,
        site,
        url: release?.url ?? null,
        live: release?.releasedAt ?? null,
        files: release?.files ?? null,
        build: target.build,
        drift: driftOf(target, release),
      };
  });
}

/**
 * Cada consulta a Firebase es un proceso node aparte que tarda ~2,7-4 s
 * (ver adapter.ts). Nueve a la vez son nueve procesos cargando
 * firebase-tools en paralelo; con cuatro se gana casi todo el tiempo sin
 * castigar la máquina.
 */
const CONSULTAS_EN_PARALELO = 4;

async function mapWithLimit<T, R>(
  items: readonly T[],
  limit: number,
  run: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array<R>(items.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    for (;;) {
      const index = next++;
      if (index >= items.length) return;
      const item = items[index];
      if (item === undefined) continue;
      results[index] = await run(item);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function driftOf(target: TargetReport, release: LiveRelease | null): Drift {
  if (release === null) return 'never-deployed';
  if (target.build !== 'ready') return 'no-build';
  if (release.releasedAt === null || target.modified === null) return 'unknown';
  return Date.parse(target.modified) > Date.parse(release.releasedAt) ? 'local-newer' : 'in-sync';
}

function select(local: readonly TargetReport[], onlyTarget?: string): readonly TargetReport[] {
  if (onlyTarget === undefined) return local;

  const found = local.filter((target) => target.target === onlyTarget);
  if (found.length === 0) {
    throw new KuraError(
      'NOT_FOUND',
      `No hay ningún target llamado '${onlyTarget}'`,
      `Disponibles: ${local.map((target) => target.target).join(' · ')}`,
    );
  }
  return found;
}
