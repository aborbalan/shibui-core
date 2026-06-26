import { systemSeed, type SeedSource } from './seed';

export interface Rng {
  /** Entero uniforme en [0, max). */
  nextInt(max: number): number;
}

// RNG respaldado por una SeedSource (sistema por defecto). Rechazo de módulo → sin sesgo.
export function rngFrom(source: SeedSource = systemSeed): Rng {
  return {
    nextInt(max: number): number {
      if (max <= 0) throw new Error('rng: max debe ser > 0');
      if (max > 256) throw new Error('rng: max > 256 no soportado');
      const limit = Math.floor(256 / max) * max;
      for (;;) {
        const byte = source.bytes(1)[0] ?? 0;
        if (byte < limit) return byte % max;
      }
    },
  };
}

// RNG determinista (mulberry32). Solo para tests reproducibles, nunca en producción.
export function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return {
    nextInt(max: number): number {
      if (max <= 0) throw new Error('rng: max debe ser > 0');
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      return Math.floor(r * max);
    },
  };
}
