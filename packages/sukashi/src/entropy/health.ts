// Health-test de la fuente del cielo (kumo).
// Una cámara congelada o un cielo plano dan poca entropía: hay que detectarlo
// y caer a la semilla del sistema antes de mezclar nada.

// ¿Dos fotogramas son idénticos byte a byte? (cámara congelada / imagen estática)
function framesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ¿Algún par consecutivo de fotogramas es idéntico? Con < 2 fotogramas no hay
// movimiento que comprobar → se considera congelado (no aporta entropía temporal).
export function framesFrozen(frames: readonly Uint8Array[]): boolean {
  if (frames.length < 2) return true;
  for (let i = 1; i < frames.length; i++) {
    const prev = frames[i - 1];
    const cur = frames[i];
    if (prev && cur && framesEqual(prev, cur)) return true;
  }
  return false;
}

// Entropía de Shannon sobre el histograma de bytes, en bits/byte (0..8).
// Un cielo uniforme tiende a 0; ruido de sensor real tiende a 8.
export function entropyEstimate(bytes: Uint8Array): number {
  if (bytes.length === 0) return 0;
  const hist = new Array<number>(256).fill(0);
  for (const b of bytes) hist[b] = (hist[b] ?? 0) + 1;
  let h = 0;
  for (const count of hist) {
    if (count === 0) continue;
    const p = count / bytes.length;
    h -= p * Math.log2(p);
  }
  return h;
}

export interface HealthOptions {
  /** Entropía mínima aceptable, en bits/byte (default 4). */
  minEntropyBitsPerByte?: number;
}

export interface HealthResult {
  ok: boolean;
  reason?: string;
  /** Entropía medida sobre los fotogramas concatenados (bits/byte). */
  entropy: number;
}

// Comprueba que la captura es viva (no congelada) y tiene suficiente entropía.
export function healthCheck(
  frames: readonly Uint8Array[],
  options: HealthOptions = {},
): HealthResult {
  const minEntropy = options.minEntropyBitsPerByte ?? 4;
  if (frames.length === 0) return { ok: false, reason: 'sin fotogramas', entropy: 0 };
  if (framesFrozen(frames)) return { ok: false, reason: 'imagen congelada', entropy: 0 };

  let total = 0;
  for (const f of frames) total += f.length;
  const all = new Uint8Array(total);
  let off = 0;
  for (const f of frames) {
    all.set(f, off);
    off += f.length;
  }
  const entropy = entropyEstimate(all);
  if (entropy < minEntropy) {
    return { ok: false, reason: `entropía baja (${entropy.toFixed(2)} bits/byte)`, entropy };
  }
  return { ok: true, entropy };
}
