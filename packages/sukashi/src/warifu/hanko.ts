// warifu/hanko.ts — adaptador: un Trust Report de hanko → SealManifest.
//
// Lee la FORMA del report por tipado estructural (no importa el paquete hanko): el motivo
// decorativo reacciona al manifiesto de confianza del proyecto. Cada componente sellado
// (`trusted`) es una entrada sellada del manifiesto; la política `allSealed` se cumple cuando
// el proyecto entero está sellado (`untrusted === 0`).

import type { SealManifest } from './manifest';

/** Forma mínima del Trust Report que leemos (estructural; sin acoplar al paquete hanko). */
export interface TrustReportLike {
  readonly components: ReadonlyArray<{ readonly tagName: string; readonly trusted: boolean }>;
}

/** Mapea un Trust Report a un manifiesto: tagName → name, trusted → sealed. */
export function manifestFromTrustReport(report: TrustReportLike): SealManifest {
  return {
    entries: report.components.map((c) => ({ name: c.tagName, sealed: c.trusted })),
  };
}
