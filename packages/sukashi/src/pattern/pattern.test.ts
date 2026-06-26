import { describe, it, expect } from 'vitest';
import { PATTERNS_BY_NAME, type PatternName, type PatternGenerator } from './index';
import type { Bitmap } from '../core/bitmap';

const NAMES: readonly PatternName[] = ['seigaiha', 'asanoha', 'sashiko', 'mon', 'moire'];

function density(b: Bitmap): number {
  let on = 0;
  for (const v of b.data) on += v;
  return on / b.data.length;
}

function identical(a: Bitmap, b: Bitmap): boolean {
  if (a.width !== b.width || a.height !== b.height) return false;
  for (let i = 0; i < a.data.length; i++) if (a.data[i] !== b.data[i]) return false;
  return true;
}

describe('generadores de patrón', () => {
  const size = { width: 64, height: 64 };

  it.each(NAMES)('%s respeta el tamaño pedido', (name: PatternName) => {
    const gen: PatternGenerator = PATTERNS_BY_NAME[name];
    const b = gen({ ...size });
    expect(b.width).toBe(64);
    expect(b.height).toBe(64);
  });

  it.each(NAMES)('%s es determinista para las mismas opciones', (name: PatternName) => {
    const gen = PATTERNS_BY_NAME[name];
    expect(identical(gen({ ...size, seed: 3 }), gen({ ...size, seed: 3 }))).toBe(true);
  });

  it.each(NAMES)('%s produce textura real (ni lienzo en blanco ni mancha)', (name: PatternName) => {
    const d = density(PATTERNS_BY_NAME[name]({ ...size }));
    expect(d).toBeGreaterThan(0.1);
    expect(d).toBeLessThan(0.9);
  });

  it.each(NAMES)('%s varía con la semilla', (name: PatternName) => {
    const gen = PATTERNS_BY_NAME[name];
    expect(identical(gen({ ...size, seed: 0 }), gen({ ...size, seed: 4 }))).toBe(false);
  });
});
