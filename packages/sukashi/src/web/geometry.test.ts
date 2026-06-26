import { describe, it, expect } from 'vitest';
import { isAligned, offsetInCells } from './geometry';

describe('isAligned', () => {
  it('alineado cuando el desfase está dentro de media celda', () => {
    expect(isAligned(0, 0, 8)).toBe(true);
    expect(isAligned(3, -3, 8)).toBe(true);
    expect(isAligned(5, 0, 8)).toBe(false);
    expect(isAligned(0, 9, 8)).toBe(false);
  });

  it('respeta la tolerancia', () => {
    expect(isAligned(7, 0, 8, 1)).toBe(true);
    expect(isAligned(7, 0, 8, 0.5)).toBe(false);
  });
});

describe('offsetInCells', () => {
  it('redondea el desfase a celdas', () => {
    expect(offsetInCells(16, -24, 8)).toEqual([2, -3]);
    expect(offsetInCells(3, 5, 8)).toEqual([0, 1]);
  });

  it('rechaza cell no positivo', () => {
    expect(() => offsetInCells(1, 1, 0)).toThrow();
  });
});
