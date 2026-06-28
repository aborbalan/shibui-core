import { describe, it, expect } from 'vitest';
import { concatFrames, condense, expandPool } from './condense';

describe('condense (SHA-256 fold)', () => {
  it('produce 32 bytes', async () => {
    const pool = await condense(new Uint8Array([1, 2, 3, 4]));
    expect(pool.length).toBe(32);
  });

  it('es determinista: mismo input → mismo pool', async () => {
    const a = await condense(new Uint8Array([9, 8, 7]));
    const b = await condense(new Uint8Array([9, 8, 7]));
    expect([...a]).toEqual([...b]);
  });

  it('inputs distintos → pools distintos', async () => {
    const a = await condense(new Uint8Array([1, 2, 3]));
    const b = await condense(new Uint8Array([1, 2, 4]));
    expect([...a]).not.toEqual([...b]);
  });
});

describe('concatFrames', () => {
  it('une fotogramas en orden', () => {
    const out = concatFrames([new Uint8Array([1, 2]), new Uint8Array([3]), new Uint8Array([4, 5])]);
    expect([...out]).toEqual([1, 2, 3, 4, 5]);
  });

  it('lista vacía → buffer vacío', () => {
    expect(concatFrames([]).length).toBe(0);
  });
});

describe('expandPool', () => {
  it('entrega exactamente n bytes (n > 32)', async () => {
    const out = await expandPool(new Uint8Array([1, 2, 3]), 100);
    expect(out.length).toBe(100);
  });

  it('es determinista', async () => {
    const a = await expandPool(new Uint8Array([5, 6]), 80);
    const b = await expandPool(new Uint8Array([5, 6]), 80);
    expect([...a]).toEqual([...b]);
  });

  it('n <= 32 devuelve los primeros n bytes del digest', async () => {
    const out = await expandPool(new Uint8Array([7]), 16);
    expect(out.length).toBe(16);
  });
});
