import { publish } from '@open-cells/core';
import { CH_TRUST_REPORT } from '../../channels';
import { fetchJson } from '../http';
import type { TrustReport } from '../trust-report';
import fixture from '../trust-report.fixture.json';

/** Lo publica hanko con `Access-Control-Allow-Origin: *`, así que se lee entero. */
const LIVE_URL = 'https://hanko-report.web.app/trust-report.json';

const CACHE_KEY = 'app-torii:trust-report';

/**
 * Carga el Trust Report y lo publica en `ch-trust-report`.
 *
 * En dev se usa el fixture: no tiene sentido depender de la red para levantar
 * la app. En prod se pide el real y, si falla, se cae al fixture — un dato
 * viejo y etiquetado como tal es más útil que una página a medio pintar.
 *
 * No hay carrera con las páginas: los channels de Open Cells reproducen su
 * último valor, así que una página montada después de esto lo recibe igual.
 */
export async function loadTrustReport(): Promise<void> {
  if (import.meta.env.DEV) {
    publish(CH_TRUST_REPORT, fixture as unknown as TrustReport);
    return;
  }

  const live = await fetchJson<TrustReport>(LIVE_URL, {
    timeoutMs: 8000,
    cacheKey: CACHE_KEY,
  });

  publish(CH_TRUST_REPORT, live ?? (fixture as unknown as TrustReport));
}
