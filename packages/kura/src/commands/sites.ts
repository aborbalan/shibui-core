/* ============================================================
   kura sites · inventario y aprovisionamiento

   `status` y `verify` saben DECIR que el sitio de un target no
   existe. Eso deja el arreglo en manos de un humano con la consola
   de Firebase abierta, que es justo lo que kura viene a evitar: una
   sesión autónoma tiene que poder cerrar el hueco que detecta.

   El inventario cruza los dos sentidos de la deriva, que son fallos
   distintos y se arreglan distinto:

   - `declared-missing`  el .firebaserc lo declara y no existe.
                         Un deploy de ese target falla hoy.
   - `orphan`            existe en el proyecto y nadie lo declara.
                         Suele ser un sitio olvidado; puede estar
                         sirviendo algo viejo en una URL pública.

   Crear es aditivo y reversible (`hosting:sites:delete`), así que
   basta con la simulación por defecto: no lleva el `--confirm` que
   sí exige publicar en producción. Los frenos se dosifican según lo
   que cuesta deshacer el error, no por uniformidad.
   ============================================================ */
import type { HostingAdapter } from '../adapter';
import type { HostingConfig } from '../config';
import { KuraError } from '../envelope';

export type SiteState = 'in-use' | 'declared-missing' | 'orphan';

export interface SiteRow {
  site: string;
  url: string | null;
  /** Target que lo declara, o null si es huérfano. */
  target: string | null;
  state: SiteState;
}

export interface SiteActionRow {
  site: string;
  target: string | null;
  action: 'would-create' | 'created' | 'exists';
  url: string | null;
  ok: boolean;
  detail: string;
}

export interface CreateOptions {
  site?: string | undefined;
  missing?: boolean | undefined;
  execute?: boolean | undefined;
}

/** Restricción de Firebase para el identificador de sitio (hasta 30 caracteres). */
const SITIO_VALIDO = /^[a-z0-9]([a-z0-9-]{0,28}[a-z0-9])?$/;

export async function reportSites(config: HostingConfig, adapter: HostingAdapter): Promise<SiteRow[]> {
  const existentes = new Map((await adapter.listSites(config.project)).map((entry) => [entry.site, entry.url]));

  const rows: SiteRow[] = [];
  const declarados = new Set<string>();

  for (const target of config.targets) {
    for (const site of target.sites) {
      declarados.add(site);
      const url = existentes.get(site);
      rows.push({
        site,
        url: url ?? null,
        target: target.target,
        state: url === undefined ? 'declared-missing' : 'in-use',
      });
    }
  }

  for (const [site, url] of existentes) {
    if (declarados.has(site)) continue;
    rows.push({ site, url, target: null, state: 'orphan' });
  }

  return rows;
}

export async function createSites(
  config: HostingConfig,
  adapter: HostingAdapter,
  options: CreateOptions,
): Promise<{ rows: SiteActionRow[]; failed: boolean }> {
  if (options.site === undefined && options.missing !== true) {
    throw new KuraError(
      'USAGE',
      'sites create exige --site <id> o --missing',
      '--missing crea todos los sitios que .firebaserc declara y no existen.',
    );
  }

  const inventario = await reportSites(config, adapter);
  const objetivos = options.site === undefined ? porCrear(inventario) : [unoSolo(inventario, options.site)];

  // No devolver filas sería ambiguo: tras un comando con --execute, el silencio
  // no distingue «no había nada que hacer» de «falló sin decirlo». Se responde
  // con una fila que lo diga.
  if (objetivos.length === 0) {
    const declarados = inventario.filter((row) => row.target !== null).length;
    return {
      rows: [
        {
          site: '(ninguno)',
          target: null,
          action: 'exists',
          url: null,
          ok: true,
          detail: `nada que crear: los ${declarados} sitios declarados en .firebaserc ya existen`,
        },
      ],
      failed: false,
    };
  }

  const rows: SiteActionRow[] = [];
  for (const objetivo of objetivos) {
    if (objetivo.state !== 'declared-missing' && objetivo.url !== null) {
      rows.push({
        site: objetivo.site,
        target: objetivo.target,
        action: 'exists',
        url: objetivo.url,
        ok: true,
        detail: 'ya existe, no se toca',
      });
      continue;
    }

    if (options.execute !== true) {
      rows.push({
        site: objetivo.site,
        target: objetivo.target,
        action: 'would-create',
        url: null,
        ok: true,
        detail: `simulación: se crearía en ${config.project}. Añade --execute para hacerlo.`,
      });
      continue;
    }

    const creado = await adapter.createSite(config.project, objetivo.site);
    rows.push({
      site: creado.site,
      target: objetivo.target,
      action: 'created',
      url: creado.url,
      ok: true,
      detail: objetivo.target === null ? 'creado' : `creado y ya enlazado al target '${objetivo.target}'`,
    });
  }

  return { rows, failed: false };
}

function porCrear(inventario: readonly SiteRow[]): SiteRow[] {
  return inventario.filter((row) => row.state === 'declared-missing');
}

function unoSolo(inventario: readonly SiteRow[], site: string): SiteRow {
  if (!SITIO_VALIDO.test(site)) {
    throw new KuraError(
      'USAGE',
      `Identificador de sitio inválido: '${site}'`,
      'Minúsculas, dígitos y guiones, sin empezar ni terminar en guion; hasta 30 caracteres.',
    );
  }
  // Un sitio que nadie declara también se puede crear: es legítimo aprovisionar antes
  // de escribir el target. Entra como huérfano sin URL, es decir, por crear.
  return inventario.find((row) => row.site === site) ?? { site, url: null, target: null, state: 'orphan' };
}
