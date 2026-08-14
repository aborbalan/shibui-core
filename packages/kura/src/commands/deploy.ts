/* ============================================================
   kura deploy · la única operación con efectos hacia fuera

   Desplegar a estos sitios es publicar en internet, así que los
   frenos son estructurales y no dependen de que quien invoque se
   acuerde de nada:

   1. SIMULACIÓN POR DEFECTO. Sin `--execute` no se sube nada. La
      forma corta del comando es la inofensiva.
   2. DESTINO PREVIEW POR DEFECTO. Llegar a producción exige `--live`
      Y ADEMÁS `--confirm <target>` repitiendo el nombre: un flag que
      no se teclea por inercia.
   3. PRECONDICIÓN DE BUILD, comprobada en disco ANTES de tocar la
      red. Publicar un directorio vacío o a medio construir deja el
      sitio roto y el deploy sale verde; es el fallo más caro que
      puede cometer esta herramienta y por eso se ataja el primero.
   4. VERIFICACIÓN ENCADENADA. Tras subir, se comprueba la URL
      resultante con las mismas reglas de `kura verify`. Un deploy
      que responde 404 o que lleva un origen de desarrollo dentro no
      cuenta como éxito: sale con código 6.

   Ningún freno pregunta nada por consola. Cuando falta algo, se sale
   con código y se dice exactamente qué flag añadir.
   ============================================================ */
import type { HostingAdapter } from '../adapter';
import type { HostingConfig } from '../config';
import type { HttpClient } from '../http';
import type { TargetReport } from './targets';
import { verifyUrl, type CheckRow } from './verify';
import { KuraError } from '../envelope';

export interface DeployOptions {
  target?: string | undefined;
  channel?: string | undefined;
  live?: boolean | undefined;
  confirm?: string | undefined;
  execute?: boolean | undefined;
  expectOrigin?: string | undefined;
}

export interface DeployPlan {
  target: TargetReport;
  destination: 'preview' | 'live';
  /** Canal de preview; cadena vacía cuando el destino es live. */
  channel: string;
}

const CANAL_POR_DEFECTO = 'preview';

/** Restricción de Firebase para el identificador de canal. */
const CANAL_VALIDO = /^[a-z0-9][a-z0-9-]{0,62}$/;

/**
 * Todos los frenos, resueltos sin red y sin efectos. Separado de la ejecución
 * para poder probar cada negativa sin desplegar nada.
 */
export function planDeploy(local: readonly TargetReport[], options: DeployOptions): DeployPlan {
  const disponibles = local.map((entry) => entry.target).join(' · ');

  if (options.target === undefined) {
    throw new KuraError('USAGE', 'deploy exige --target: no despliega todo de golpe', `Disponibles: ${disponibles}`);
  }

  const target = local.find((entry) => entry.target === options.target);
  if (target === undefined) {
    throw new KuraError('NOT_FOUND', `No hay ningún target llamado '${options.target}'`, `Disponibles: ${disponibles}`);
  }

  if (target.build !== 'ready') {
    throw new KuraError(
      'PRECONDITION',
      `El build de '${target.target}' no está listo (${target.build}): ${target.publicDir}`,
      'Constrúyelo antes. Publicar un directorio vacío deja el sitio roto sin que nada falle.',
    );
  }

  const destination = options.live === true ? 'live' : 'preview';

  if (destination === 'live' && options.confirm !== target.target) {
    throw new KuraError(
      'PRECONDITION',
      `Desplegar '${target.target}' a producción exige repetir su nombre`,
      `Añade: --confirm ${target.target}`,
    );
  }

  const channel = destination === 'live' ? '' : (options.channel ?? CANAL_POR_DEFECTO);
  if (destination === 'preview' && !CANAL_VALIDO.test(channel)) {
    throw new KuraError(
      'USAGE',
      `Nombre de canal inválido: '${channel}'`,
      'Minúsculas, dígitos y guiones, empezando por letra o dígito; hasta 63 caracteres.',
    );
  }

  return { target, destination, channel };
}

export async function runDeploy(
  config: HostingConfig,
  local: readonly TargetReport[],
  adapter: HostingAdapter,
  http: HttpClient,
  options: DeployOptions,
): Promise<{ rows: CheckRow[]; failed: boolean }> {
  const plan = planDeploy(local, options);
  const site = plan.target.sites[0];
  if (site === undefined) {
    throw new KuraError('PRECONDITION', `El target '${plan.target.target}' no declara ningún sitio en .firebaserc`);
  }

  const destino = plan.destination === 'live' ? `canal live de ${site}` : `canal '${plan.channel}' de ${site}`;

  if (options.execute !== true) {
    return {
      rows: [
        {
          target: plan.target.target,
          url: '',
          check: 'dry-run',
          ok: true,
          detail:
            `simulación: se subiría ${plan.target.publicDir} (${plan.target.entries} entradas) al ${destino}. ` +
            'Añade --execute para hacerlo de verdad.',
        },
      ],
      failed: false,
    };
  }

  const result =
    plan.destination === 'live'
      ? await adapter.deployLive(config.project, plan.target.target, site, config.root)
      : await adapter.deployChannel(config.project, plan.target.target, plan.channel, config.root);

  const rows: CheckRow[] = [
    {
      target: plan.target.target,
      url: result.url,
      check: 'deploy',
      ok: true,
      detail: `publicado en el ${destino}${result.expiresAt === null ? '' : ` · caduca ${result.expiresAt}`}`,
    },
  ];

  // Un deploy no es un éxito por haber terminado, sino por servir algo sano.
  const checks = await verifyUrl(http, {
    label: plan.target.target,
    url: result.url.replace(/\/$/, ''),
    spa: config.targets.find((entry) => entry.target === plan.target.target)?.spa ?? false,
    expectOrigin: options.expectOrigin,
  });

  rows.push(...checks);
  return { rows, failed: checks.some((row) => !row.ok) };
}
