import { describe, it, expect } from 'vitest';
import { PATTERNS, complement, patternIndex } from './patterns';

describe('patterns', () => {
  it('hay 6 patrones, cada uno con 2 celdas de tinta', () => {
    expect(PATTERNS).toHaveLength(6);
    for (const p of PATTERNS) {
      expect(p[0] + p[1] + p[2] + p[3]).toBe(2);
    }
  });

  it('complement mantiene 2 celdas de tinta y es involutivo', () => {
    for (const p of PATTERNS) {
      const c = complement(p);
      expect(c[0] + c[1] + c[2] + c[3]).toBe(2);
      expect(complement(c)).toEqual(p);
    }
  });

  it('el conjunto es cerrado bajo complemento', () => {
    for (const p of PATTERNS) {
      expect(patternIndex(complement(p))).toBeGreaterThanOrEqual(0);
    }
  });

  it('patternIndex devuelve -1 para un bloque ajeno a la tabla', () => {
    expect(patternIndex([1, 1, 1, 1])).toBe(-1);
  });
});
