// Condensación de la imagen del cielo (kumo) a un pool de entropía.
// Pliega bytes crudos de fotogramas → digest de tamaño fijo vía SHA-256.
// El digest no es la seguridad (esa es la del weave): solo concentra la entropía
// física del sensor para mezclarla con la semilla del sistema.

const DIGEST_BYTES = 32; // SHA-256

// Une varios fotogramas en un único buffer (orden estable).
export function concatFrames(frames: readonly Uint8Array[]): Uint8Array {
  let total = 0;
  for (const f of frames) total += f.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const f of frames) {
    out.set(f, off);
    off += f.length;
  }
  return out;
}

// Condensa bytes arbitrarios → 32 bytes de pool. Determinista (mismo input → mismo pool).
export async function condense(frame: Uint8Array): Promise<Uint8Array> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', frame as BufferSource);
  return new Uint8Array(digest);
}

// Estira el pool a n bytes en modo contador: hash(seed ‖ counter) encadenado.
// Solo se usa cuando hace falta más material que un único digest.
export async function expandPool(seed: Uint8Array, n: number): Promise<Uint8Array> {
  if (n <= DIGEST_BYTES) return (await condense(seed)).subarray(0, n);
  const out = new Uint8Array(n);
  let off = 0;
  let counter = 0;
  while (off < n) {
    const block = new Uint8Array(seed.length + 4);
    block.set(seed, 0);
    block[seed.length] = (counter >>> 24) & 0xff;
    block[seed.length + 1] = (counter >>> 16) & 0xff;
    block[seed.length + 2] = (counter >>> 8) & 0xff;
    block[seed.length + 3] = counter & 0xff;
    const chunk = await condense(block);
    const take = Math.min(DIGEST_BYTES, n - off);
    out.set(chunk.subarray(0, take), off);
    off += take;
    counter++;
  }
  return out;
}
