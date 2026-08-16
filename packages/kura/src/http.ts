/* ============================================================
   kura · cliente HTTP mínimo

   Sobre `fetch` global de Node. Existe como interfaz propia por
   una razón: los comandos que comprueban lo publicado reciben un
   HttpClient, y en los tests se les pasa uno falso. Así toda la
   lógica de verificación se prueba en CI sin salir a internet.

   Un fallo de red NO lanza: devuelve `status: 0` con el motivo en
   `failure`. Verificar es producir un informe, y un sitio caído es
   justamente uno de los resultados que el informe debe contar, no
   una excepción que lo aborte.
   ============================================================ */

export interface HttpResponse {
  status: number;
  contentType: string;
  body: string;
  /** Motivo cuando no hubo respuesta siquiera: DNS, timeout, TLS. */
  failure: string | null;
}

export interface HttpClient {
  get(url: string): Promise<HttpResponse>;
}

const TIEMPO_LIMITE_MS = 15_000;

export function createHttpClient(timeoutMs: number = TIEMPO_LIMITE_MS): HttpClient {
  return {
    async get(url) {
      try {
        const response = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
          headers: { 'user-agent': 'kura/0.0.0 (+shibui-ecosystem)' },
        });
        return {
          status: response.status,
          contentType: response.headers.get('content-type') ?? '',
          body: await response.text(),
          failure: null,
        };
      } catch (err) {
        return {
          status: 0,
          contentType: '',
          body: '',
          failure: err instanceof Error ? err.message : String(err),
        };
      }
    },
  };
}
