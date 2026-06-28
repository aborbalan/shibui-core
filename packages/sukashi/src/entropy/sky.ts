// kumo (雲) — semilla del cielo.
// Un SeedSource alternativo que toma una foto del cielo, la condensa y la MEZCLA
// con la semilla del sistema (nunca la reemplaza), con health-test y fallback.
//
// Principio de seguridad: la mezcla es XOR sobre la salida de `systemSeed`. Como
// `systemSeed` ya es CSPRNG (uniforme), XOR con cualquier pool independiente conserva
// la entropía completa → el resultado NUNCA degrada por debajo de la semilla del sistema.
// El cielo solo suma imprevisibilidad física (estilo LavaRand); no es la seguridad.

import { systemSeed, type SeedSource } from '../core/seed';
import { concatFrames, condense } from './condense';
import { healthCheck, type HealthOptions } from './health';

// Fuente de fotogramas del cielo. El adaptador de cámara (DOM) la implementa;
// el núcleo solo conoce esta interfaz y permanece testeable en node.
export interface SkyCapture {
  /** Captura `count` fotogramas del cielo como bytes crudos (p. ej. RGBA). */
  frames(count: number): Promise<readonly Uint8Array[]>;
}

// Construye un SeedSource que XOR-mezcla `pool` sobre la salida de `system`.
// `pool` vacío → devuelve `system` intacto (mezcla, nunca degrada).
export function mixSeed(system: SeedSource, pool: Uint8Array): SeedSource {
  if (pool.length === 0) return system;
  let cursor = 0;
  return {
    bytes(n: number): Uint8Array {
      const base = system.bytes(n);
      for (let i = 0; i < n; i++) {
        base[i] = (base[i] ?? 0) ^ (pool[cursor] ?? 0);
        cursor = (cursor + 1) % pool.length;
      }
      return base;
    },
  };
}

export interface SkySeedOptions extends HealthOptions {
  /** Semilla base a mezclar (default `systemSeed`). Inyectable para tests. */
  system?: SeedSource;
  /** Número de fotogramas a capturar (default 3 → permite detectar congelado). */
  frameCount?: number;
}

export interface SkySeedResult {
  /** SeedSource lista para usar: cielo mezclado, o `system` puro si hubo fallback. */
  source: SeedSource;
  /** ¿Se usó realmente entropía del cielo? `false` = fallback a `system`. */
  usedSky: boolean;
  /** Motivo del fallback, si lo hubo. */
  reason?: string;
  /** Entropía medida del cielo (bits/byte), si se capturó. */
  entropy?: number;
}

// Captura el cielo, lo valida y devuelve una SeedSource mezclada. Ante cualquier
// fallo (cámara, captura vacía, congelada o pobre) cae a la semilla del sistema.
export async function openSky(
  capture: SkyCapture,
  options: SkySeedOptions = {},
): Promise<SkySeedResult> {
  const system = options.system ?? systemSeed;
  const frameCount = options.frameCount ?? 3;

  let frames: readonly Uint8Array[];
  try {
    frames = await capture.frames(frameCount);
  } catch (err) {
    const reason = err instanceof Error ? `captura falló: ${err.message}` : 'captura falló';
    return { source: system, usedSky: false, reason };
  }

  const health = healthCheck(frames, options);
  if (!health.ok) {
    return {
      source: system,
      usedSky: false,
      reason: health.reason ?? 'health-test falló',
      entropy: health.entropy,
    };
  }

  const pool = await condense(concatFrames(frames));
  return { source: mixSeed(system, pool), usedSky: true, entropy: health.entropy };
}
