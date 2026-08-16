import { publish } from '@open-cells/core';
import { CH_DEPLOYS } from '../../channels';
import { ECOSYSTEM, type EcosystemEntry, type ProbeMode } from '../ecosystem';

/**
 * Qué se llegó a averiguar de un sitio. No es un health check y no pretende
 * serlo: los nombres dicen exactamente hasta dónde llega cada comprobación.
 */
export type ProbeVerdict =
  /** Respondió con un status correcto. Solo posible cuando hay CORS. */
  | 'ok'
  /** El host contestó, pero la respuesta es opaca: no sabemos con qué status. */
  | 'reachable'
  /** Contestó con un status de error. Solo posible cuando hay CORS. */
  | 'error'
  /** Ni contestó, ni dentro del plazo. */
  | 'unreachable'
  /** No hay nada que sondear. */
  | 'not-applicable';

export interface ProbeResult {
  id: string;
  verdict: ProbeVerdict;
  mode: ProbeMode;
  /** Milisegundos hasta la respuesta. Solo se mide cuando la lectura es real. */
  ms: number | null;
  /** Status HTTP, solo cuando hay CORS para leerlo. */
  status: number | null;
}

/** Firebase responde rápido o no responde. */
const FIREBASE_TIMEOUT = 5000;

/** Render duerme los servicios gratuitos: el primer golpe puede tardar. */
const API_TIMEOUT = 15000;

/**
 * Sondea cada propiedad y publica los resultados en `ch-deploys`.
 *
 * Se lanzan en paralelo: son independientes y el sitio más lento no tiene por
 * qué retrasar a los demás.
 */
export async function loadDeploys(): Promise<void> {
  const results = await Promise.all(ECOSYSTEM.map(probe));
  publish(CH_DEPLOYS, results);
}

async function probe(entry: EcosystemEntry): Promise<ProbeResult> {
  const base: Omit<ProbeResult, 'verdict'> = {
    id: entry.id,
    mode: entry.probe,
    ms: null,
    status: null,
  };

  if (entry.probe === 'none' || !entry.url) {
    return { ...base, verdict: 'not-applicable' };
  }

  const started = performance.now();
  const timeoutMs = entry.probe === 'cors' ? API_TIMEOUT : FIREBASE_TIMEOUT;

  try {
    const response = await fetch(entry.url, {
      // 'no-cors' devuelve una respuesta opaca: no se puede leer ni el status.
      // Que la promesa resuelva ya dice que el host contestó algo, y eso es
      // todo lo que se puede afirmar de un sitio de Firebase desde otro origen.
      mode: entry.probe === 'cors' ? 'cors' : 'no-cors',
      // El objetivo es saber si contesta, no traerse la página entera.
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });

    const ms = Math.round(performance.now() - started);

    if (entry.probe === 'opaque') {
      return { ...base, verdict: 'reachable', ms };
    }

    return {
      ...base,
      verdict: response.ok ? 'ok' : 'error',
      ms,
      status: response.status,
    };
  } catch {
    return { ...base, verdict: 'unreachable', ms: Math.round(performance.now() - started) };
  }
}

/** Qué se puede decir de cada veredicto, sin adornarlo. */
export const VERDICT_LABEL: Record<ProbeVerdict, string> = {
  ok: 'Responde',
  reachable: 'Alcanzable',
  error: 'Responde con error',
  unreachable: 'No responde',
  'not-applicable': 'Sin sitio web',
};

/** Estado de `lib-status-dot` para cada veredicto. */
export const VERDICT_DOT: Record<ProbeVerdict, string> = {
  ok: 'online',
  reachable: 'online',
  error: 'busy',
  unreachable: 'busy',
  'not-applicable': 'offline',
};
