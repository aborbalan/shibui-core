/* ============================================================
   kura · sobre de salida y códigos de salida

   El contrato de E/S es el producto, no los comandos. Este
   fichero lo define entero:

   - Toda respuesta viaja en un sobre uniforme, incluidos los
     errores. Un agente nunca tiene que adivinar leyendo prosa.
   - Cada clase de error tiene su código de salida. La decisión
     de qué hacer a continuación se toma con `$?`, no parseando
     el mensaje.

   Nada aquí toca `process` ni imprime: eso es trabajo de cli.ts.
   ============================================================ */

export const EXIT = {
  ok: 0,
  unexpected: 1,
  usage: 2,
  notFound: 3,
  auth: 4,
  precondition: 5,
  verification: 6,
} as const;

export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

export type ErrorCode =
  | 'UNEXPECTED'
  | 'USAGE'
  | 'NOT_FOUND'
  | 'AUTH'
  | 'PRECONDITION'
  | 'VERIFICATION';

const EXIT_BY_CODE: Record<ErrorCode, ExitCode> = {
  UNEXPECTED: EXIT.unexpected,
  USAGE: EXIT.usage,
  NOT_FOUND: EXIT.notFound,
  AUTH: EXIT.auth,
  PRECONDITION: EXIT.precondition,
  VERIFICATION: EXIT.verification,
};

export interface EnvelopeOk<T> {
  ok: true;
  data: T;
}

export interface EnvelopeError {
  ok: false;
  error: { code: ErrorCode; message: string; hint?: string };
}

export type Envelope<T> = EnvelopeOk<T> | EnvelopeError;

/** Error con clase semántica. Todo lo demás se degrada a UNEXPECTED. */
export class KuraError extends Error {
  readonly code: ErrorCode;
  readonly hint: string | undefined;

  constructor(code: ErrorCode, message: string, hint?: string) {
    super(message);
    this.name = 'KuraError';
    this.code = code;
    this.hint = hint;
  }
}

export function ok<T>(data: T): EnvelopeOk<T> {
  return { ok: true, data };
}

/**
 * Envuelve cualquier cosa lanzada. Un error ajeno (una excepción de
 * firebase-tools, un fallo de red) no revienta el contrato: se degrada
 * a UNEXPECTED conservando su mensaje.
 */
export function fail(err: unknown): EnvelopeError {
  if (err instanceof KuraError) {
    return {
      ok: false,
      error:
        err.hint === undefined
          ? { code: err.code, message: err.message }
          : { code: err.code, message: err.message, hint: err.hint },
    };
  }
  return {
    ok: false,
    error: { code: 'UNEXPECTED', message: err instanceof Error ? err.message : String(err) },
  };
}

export function exitCodeFor(envelope: Envelope<unknown>): ExitCode {
  return envelope.ok ? EXIT.ok : EXIT_BY_CODE[envelope.error.code];
}
