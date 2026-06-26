// Fuente de entropía para el motor de patrones.
// Seam para adaptadores opcionales (p. ej. kumo): el núcleo solo conoce esta interfaz.

export interface SeedSource {
  /** Devuelve n bytes de buena aleatoriedad. */
  bytes(n: number): Uint8Array;
}

// Default: aleatoriedad del sistema.
export const systemSeed: SeedSource = {
  bytes(n: number): Uint8Array {
    const out = new Uint8Array(n);
    globalThis.crypto.getRandomValues(out);
    return out;
  },
};
