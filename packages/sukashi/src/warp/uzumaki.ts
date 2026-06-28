// warp/uzumaki.ts — Deformación en remolino (渦, uzumaki).
//
// Un campo de deflexión angular dependiente del radio: cada anillo concéntrico gira un
// ángulo Ω·falloff(r/R). En el continuo es una rotación pura por anillo, así que es
// EXACTAMENTE invertible — `warp(_, −Ω)` deshace `warp(_, Ω)` (en discreto, dentro de
// tolerancia por el muestreo al vecino más próximo).
//
// ⚠️ Ω es ESTÉTICA + ofuscación, NO la clave. No añade ninguna garantía: la secrecía sigue
// siendo la del weave (una capa aislada es ruido). El warp solo redistribuye píxeles de
// forma determinista y reversible — útil para covers en espiral y para barajar/desbarajar
// capas con el mismo Ω.

import { makeBitmap, getPixel, setPixel, type Bitmap } from '../core/bitmap';
import { halftone, type PatternField, type PatternOptions } from '../pattern/field';

export interface UzumakiOptions {
  /** Centro del vórtice, en celdas. Default: centro geométrico. */
  readonly center?: { readonly x: number; readonly y: number };
  /** Radio de influencia, en celdas. Fuera de él no hay giro. Default: media diagonal. */
  readonly radius?: number;
}

// Perfil de giro: 1 en el centro, 0 (con derivada nula) en el borde del radio. Continuo,
// así el remolino se funde con la zona quieta sin costura.
function falloff(rho: number): number {
  if (rho >= 1) return 0;
  const t = 1 - rho;
  return t * t;
}

/**
 * Deforma un bitmap girando cada anillo concéntrico un ángulo `omega·falloff(r/R)`.
 * Muestreo *backward* (sin huecos): cada celda destino toma su origen rotando hacia atrás.
 * Por ser una rotación por anillo, `warp(warp(b, Ω), −Ω)` ≈ identidad (exacta en el continuo;
 * el error en discreto es solo el redondeo al vecino más próximo, concentrado cerca del eje).
 */
export function warp(src: Bitmap, omega: number, options: UzumakiOptions = {}): Bitmap {
  const { width, height } = src;
  const cx = options.center?.x ?? width / 2;
  const cy = options.center?.y ?? height / 2;
  const radius = options.radius ?? Math.hypot(width, height) / 2;
  const out = makeBitmap(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const r = Math.hypot(dx, dy);
      // Giro inverso: para muestrear backward giramos el destino hacia su origen.
      const theta = -omega * falloff(radius > 0 ? r / radius : Infinity);
      if (theta === 0) {
        setPixel(out, x, y, getPixel(src, x, y));
        continue;
      }
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const sx = cx + dx * cos - dy * sin;
      const sy = cy + dx * sin + dy * cos;
      const ix = Math.floor(sx);
      const iy = Math.floor(sy);
      const inside = ix >= 0 && ix < width && iy >= 0 && iy < height;
      setPixel(out, x, y, inside ? getPixel(src, ix, iy) : 0);
    }
  }
  return out;
}

/**
 * Deforma todas las capas con el mismo Ω. Como `compose` conmuta con un remap idéntico de
 * píxeles, `compose(warpAll(layers, Ω))` equivale a `warp(compose(layers), Ω)`: el motivo
 * sigue revelándose (girado), y `unwarpAll(_, Ω)` lo devuelve a su sitio.
 */
export function warpAll(layers: readonly Bitmap[], omega: number, options?: UzumakiOptions): Bitmap[] {
  return layers.map((l) => warp(l, omega, options));
}

/** Inverso de `warpAll`: des-deforma con −Ω. */
export function unwarpAll(layers: readonly Bitmap[], omega: number, options?: UzumakiOptions): Bitmap[] {
  return warpAll(layers, -omega, options);
}

export interface SpiralOptions extends PatternOptions {
  /** Número de brazos de la espiral. Default 3. */
  readonly arms?: number;
}

/**
 * Cover en espiral — hermana de seigaiha/moiré. Campo de molinete (brazos por ángulo) que
 * se enrosca radialmente: cada capa vista sola es un remolino decorativo, no ruido.
 * Determinista a partir de `seed`; teje igual que cualquier otro cover de `pattern`.
 */
export function spiral(options: SpiralOptions): Bitmap {
  const { width, height, scale = 12, seed = 0, arms = 3 } = options;
  const cx = width / 2;
  const cy = height / 2;
  const phase0 = (seed % 8) / 8;
  const field: PatternField = (x, y) => {
    const dx = x + 0.5 - cx;
    const dy = y + 0.5 - cy;
    const r = Math.hypot(dx, dy);
    const theta = Math.atan2(dy, dx);
    // Espiral de Arquímedes: fase = brazos·θ + 2π·r/scale; bandas de período radial `scale`.
    const turns = (arms * theta) / (2 * Math.PI) + r / scale + phase0;
    return 0.5 + 0.5 * Math.cos(2 * Math.PI * turns);
  };
  return halftone(field, width, height);
}
