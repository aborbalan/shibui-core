/**
 * Fetch con plazo, sin dependencias.
 *
 * Todo lo que el hub consume es de terceros y puede estar caído, dormido o
 * detrás de un cold start. La regla de la casa: nada bloquea la página, y un
 * fallo se degrada a un valor conocido en vez de dejar la UI a medias.
 */

/** Envoltorio que pone el ResponseInterceptor de la API NestJS a toda respuesta. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; path: string };
}

export interface FetchJsonOptions {
  /** Plazo en ms. Pasado el plazo se aborta y se resuelve como fallo. */
  timeoutMs?: number;
  /**
   * Clave de caché en sessionStorage. Sin clave no se cachea.
   * Es por pestaña a propósito: al recargar se vuelve a preguntar.
   */
  cacheKey?: string;
}

/**
 * Devuelve el JSON, o `null` si algo falla — red, plazo, status o parseo.
 * No lanza: quien llama decide el valor de repuesto, que siempre lo hay.
 */
export async function fetchJson<T>(
  url: string,
  { timeoutMs = 8000, cacheKey }: FetchJsonOptions = {},
): Promise<T | null> {
  if (cacheKey) {
    const hit = readCache<T>(cacheKey);
    if (hit !== null) return hit;
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return null;

    const value = (await response.json()) as T;
    if (cacheKey) writeCache(cacheKey, value);
    return value;
  } catch {
    // Red caída, plazo agotado o JSON inválido: los tres son el mismo caso
    // para quien llama, que es "no hay dato".
    return null;
  }
}

/** Desenvuelve la respuesta de la API NestJS; `null` si no tiene la forma esperada. */
export function unwrap<T>(envelope: ApiEnvelope<T> | null): T | null {
  if (!envelope || envelope.success !== true) return null;
  return envelope.data;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Cuota llena o modo privado: la caché es un lujo, no un requisito.
  }
}
