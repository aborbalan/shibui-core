import { publish } from '@open-cells/core';
import { CH_CATALOG } from '../../channels';
import { fetchJson, unwrap, type ApiEnvelope } from '../http';

/**
 * La API vive en Render, que duerme los servicios gratuitos: el primer golpe
 * del día puede tardar decenas de segundos. De ahí el plazo largo, y de ahí
 * que la home no dependa de esto para pintar sus cifras.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? 'https://shibui-core.onrender.com/api/v1';

const CACHE_KEY = 'app-torii:catalog';

export interface CatalogSummary {
  /** Cuántos componentes publica la API. */
  count: number;
  /** De dónde salió la cifra, para no presentar como vivo lo que no lo es. */
  source: 'api' | 'unavailable';
}

interface ApiComponent {
  slug: string;
}

/** Pide el catálogo y publica el resumen en `ch-catalog`. */
export async function loadCatalog(): Promise<void> {
  const envelope = await fetchJson<ApiEnvelope<ApiComponent[]>>(`${API_BASE}/components`, {
    timeoutMs: 15000,
    cacheKey: CACHE_KEY,
  });

  const components = unwrap(envelope);

  publish(
    CH_CATALOG,
    components
      ? ({ count: components.length, source: 'api' } satisfies CatalogSummary)
      : ({ count: 0, source: 'unavailable' } satisfies CatalogSummary),
  );
}
