import { describe, it, expect } from 'vitest';
import { warp, warpAll, unwarpAll, spiral } from './uzumaki';
import { makeBitmap, getPixel, setPixel, type Bitmap } from '../core/bitmap';
import { kasaneWeave } from '../core/weave';
import { compose } from '../core/compose';
import { reconstructError } from '../core/reconstruct';
import { seeded } from '../core/rng';

// Forma suave y asimétrica (cuadrado centrado): interior estable bajo giro → poco error de
// redondeo en ida/vuelta, pero las esquinas rompen la simetría → el warp sí la mueve.
function solidSquare(w: number, h: number): Bitmap {
  const b = makeBitmap(w, h);
  const x0 = Math.floor(w / 4);
  const x1 = Math.floor((3 * w) / 4);
  const y0 = Math.floor(h / 4);
  const y1 = Math.floor((3 * h) / 4);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) setPixel(b, x, y, 1);
  return b;
}

function fraction(a: Bitmap, b: Bitmap): number {
  let diff = 0;
  for (let i = 0; i < a.data.length; i++) if ((a.data[i] ?? 0) !== (b.data[i] ?? 0)) diff++;
  return diff / a.data.length;
}

function equalBitmaps(a: Bitmap, b: Bitmap): boolean {
  if (a.width !== b.width || a.height !== b.height) return false;
  for (let i = 0; i < a.data.length; i++) if (a.data[i] !== b.data[i]) return false;
  return true;
}

function woven(motif: Bitmap): readonly [Bitmap, Bitmap] {
  return kasaneWeave(motif, { rng: seeded(0xc0ffee) });
}

describe('warp (uzumaki)', () => {
  it('Ω=0 es la identidad exacta', () => {
    const src = solidSquare(48, 48);
    expect(equalBitmaps(warp(src, 0), src)).toBe(true);
  });

  it('mueve píxeles de verdad (no es un no-op disfrazado)', () => {
    const src = solidSquare(48, 48);
    expect(fraction(warp(src, 1.2), src)).toBeGreaterThan(0.02);
  });

  it('ida y vuelta (Ω luego −Ω) ≈ identidad dentro de tolerancia', () => {
    const src = solidSquare(48, 48);
    const back = warp(warp(src, 1.2), -1.2);
    expect(fraction(back, src)).toBeLessThan(0.05);
  });

  it('fuera del radio no toca nada', () => {
    const src = solidSquare(64, 64);
    const out = warp(src, 2.0, { center: { x: 32, y: 32 }, radius: 8 });
    // Esquina lejana al centro: intacta.
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 6; x++) expect(getPixel(out, x, y)).toBe(getPixel(src, x, y));
  });

  it('compose conmuta con el warp: compose(warpAll(L,Ω)) === warp(compose(L),Ω)', () => {
    const motif = solidSquare(13, 13);
    const layers = woven(motif);
    const lhs = compose(warpAll([...layers], 0.9));
    const rhs = warp(compose([...layers]), 0.9);
    expect(equalBitmaps(lhs, rhs)).toBe(true); // EXACTO, sin tolerancia
  });

  it('deformar y des-deformar las capas conserva el motivo revelado', () => {
    const motif = solidSquare(13, 13);
    const layers = woven(motif);
    expect(reconstructError(compose([...layers]), motif)).toBe(0); // sanity del weave
    const restored = unwarpAll(warpAll([...layers], 1.0), 1.0);
    expect(reconstructError(compose(restored), motif)).toBeLessThan(0.12);
  });
});

describe('spiral (cover en remolino)', () => {
  it('produce un bitmap del tamaño pedido con estructura (ni todo tinta ni todo fondo)', () => {
    const b = spiral({ width: 48, height: 48, scale: 10 });
    expect(b.width).toBe(48);
    expect(b.height).toBe(48);
    let ink = 0;
    for (const v of b.data) ink += v;
    expect(ink).toBeGreaterThan(0);
    expect(ink).toBeLessThan(b.data.length);
  });

  it('es determinista a partir de la semilla', () => {
    const a = spiral({ width: 40, height: 40, scale: 8, seed: 2 });
    const b = spiral({ width: 40, height: 40, scale: 8, seed: 2 });
    expect(equalBitmaps(a, b)).toBe(true);
  });

  it('el número de brazos cambia el patrón', () => {
    const a = spiral({ width: 40, height: 40, scale: 8, arms: 2 });
    const b = spiral({ width: 40, height: 40, scale: 8, arms: 5 });
    expect(equalBitmaps(a, b)).toBe(false);
  });
});
