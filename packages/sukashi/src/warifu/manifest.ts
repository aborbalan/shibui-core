// warifu/manifest.ts — el manifiesto que completa la tablilla (割符).
//
// Un 割符 (warifu) es una tablilla partida en dos mitades que solo encajan entre sí. La mitad
// que falta no se guarda: se DERIVA de un manifiesto externo, y solo cuando ese manifiesto
// cumple su condición. El manifiesto canónico → un `match` (la pieza que hace encajar). Si la
// condición no se cumple, no hay `match` (null) y la tablilla queda incompleta.

import { condense } from '../entropy/condense';

/** Una entrada del manifiesto: un patrón con nombre y si está sellado. */
export interface ManifestEntry {
  readonly name: string;
  readonly sealed: boolean;
}

/** Conjunto de patrones registrados con su estado de sellado. */
export interface SealManifest {
  readonly entries: readonly ManifestEntry[];
}

/** Predicado: ¿cumple el manifiesto la condición para completar la tablilla? */
export type SealPolicy = (manifest: SealManifest) => boolean;

/** Política por defecto: TODOS sellados (y al menos uno). */
export const allSealed: SealPolicy = (m) =>
  m.entries.length > 0 && m.entries.every((e) => e.sealed);

// Forma canónica del manifiesto: nombres sellados, ordenados, estables. El `match` queda así
// ligado al conjunto verificado exacto — cambia si cambia el roster sellado.
function canonical(manifest: SealManifest): Uint8Array {
  const names = manifest.entries
    .filter((e) => e.sealed)
    .map((e) => e.name)
    .sort();
  return new TextEncoder().encode(names.join('\n'));
}

/**
 * La pieza que hace encajar la tablilla, SI el manifiesto cumple la política — si no, `null`.
 * Determinista: el mismo roster sellado produce siempre el mismo `match`.
 */
export async function manifestMatch(
  manifest: SealManifest,
  policy: SealPolicy = allSealed,
): Promise<Uint8Array | null> {
  if (!policy(manifest)) return null;
  return condense(canonical(manifest));
}
