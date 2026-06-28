// warifu/warifu.ts — la tablilla partida (割符): sella un motivo en una mitad guardada que,
// por sí sola, es ruido; la otra mitad se regenera del `match` del manifiesto. Solo cuando el
// manifiesto cumple (y produce el mismo `match` del sellado) ambas mitades componen el motivo.
//
// Reutiliza el weave (2,2) de F1: `kasaneWeave` produce [A, B] donde A depende SOLO del rng y B
// del motivo. Sembrando el rng desde `match`, A es regenerable del manifiesto; se guarda B (la
// tablilla), que es ruido marginal. Abrir = regenerar A y componer. `match` distinto → A distinta
// → ruido. Es la misma garantía de single-share del resto de sukashi; el «cerrojo» es que el
// `match` solo existe si el manifiesto cumple su política.

import { makeBitmap, type Bitmap } from '../core/bitmap';
import { kasaneWeave, type Layer } from '../core/weave';
import { rngFrom } from '../core/rng';
import type { SeedSource } from '../core/seed';
import { expandPool } from '../entropy/condense';
import { manifestMatch, type SealManifest, type SealPolicy } from './manifest';

/** La mitad guardada de la tablilla + las dimensiones para regenerar la otra mitad. */
export interface Warifu {
  /** Mitad publicable: ruido por sí sola. */
  readonly tally: Layer;
  readonly width: number;
  readonly height: number;
}

// SeedSource determinista a partir de `match` (stream contador SHA-256). `bytes()` es síncrono,
// así que pre-expandimos un pool generoso; el cursor envuelve de forma determinista (sellar y
// abrir consumen idéntica secuencia sobre el mismo tamaño).
async function matchSeed(match: Uint8Array, motifCells: number): Promise<SeedSource> {
  const pool = await expandPool(match, motifCells * 8 + 64);
  let cursor = 0;
  return {
    bytes(n: number): Uint8Array {
      const out = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        out[i] = pool[cursor % pool.length] ?? 0;
        cursor++;
      }
      return out;
    },
  };
}

/**
 * Sella un motivo en una tablilla cuya mitad-manifiesto se deriva de `match`. La `tally`
 * resultante es ruido por sí sola; se «abre» con el mismo `match` (ver `open`).
 */
export async function seal(motif: Bitmap, match: Uint8Array): Promise<Warifu> {
  const seed = await matchSeed(match, motif.width * motif.height);
  const [, b] = kasaneWeave(motif, { rng: rngFrom(seed) });
  return { tally: b, width: motif.width, height: motif.height };
}

/**
 * Regenera la mitad-manifiesto desde `match` y la devuelve junto a la `tally`. `compose()` de
 * las dos revela el motivo SOLO si `match` coincide con el del sellado; si no, ruido.
 */
export async function open(warifu: Warifu, match: Uint8Array): Promise<readonly [Layer, Layer]> {
  const seed = await matchSeed(match, warifu.width * warifu.height);
  // A no depende del motivo (solo del rng), así que un motivo en blanco regenera la misma mitad.
  const blank = makeBitmap(warifu.width, warifu.height);
  const [a] = kasaneWeave(blank, { rng: rngFrom(seed) });
  return [a, warifu.tally];
}

/**
 * Abre la tablilla con un manifiesto: si cumple la política, devuelve las dos mitades (compose →
 * motivo); si no cumple, `null` (la tablilla permanece incompleta).
 */
export async function openWithManifest(
  warifu: Warifu,
  manifest: SealManifest,
  policy?: SealPolicy,
): Promise<readonly [Layer, Layer] | null> {
  const match = await manifestMatch(manifest, policy);
  return match ? open(warifu, match) : null;
}

/** Sella bytes arbitrarios contra `match` (XOR con un stream derivado). Autoinverso con `openBytes`. */
export async function sealBytes(bytes: Uint8Array, match: Uint8Array): Promise<Uint8Array> {
  const stream = await expandPool(match, bytes.length);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = (bytes[i] ?? 0) ^ (stream[i] ?? 0);
  return out;
}

/** Recupera bytes sellados con el mismo `match`. `match` distinto → bytes incoherentes. */
export async function openBytes(locked: Uint8Array, match: Uint8Array): Promise<Uint8Array> {
  return sealBytes(locked, match); // XOR es su propio inverso
}
