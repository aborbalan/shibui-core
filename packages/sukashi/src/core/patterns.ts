// Tabla de patrones base 2×2. Cada píxel del motivo se expande a un bloque [TL,TR,BL,BR].

export type Block = readonly [number, number, number, number];

// Los 6 bloques con exactamente 2 celdas de tinta. El conjunto es cerrado bajo complemento.
export const PATTERNS: readonly Block[] = [
  [1, 1, 0, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 1],
  [0, 1, 1, 0],
  [0, 1, 0, 1],
  [0, 0, 1, 1],
];

export function complement(p: Block): Block {
  return [1 - p[0], 1 - p[1], 1 - p[2], 1 - p[3]];
}

// Índice de un bloque en PATTERNS, o -1 si no es uno de los 6 base.
export function patternIndex(block: Block): number {
  for (let i = 0; i < PATTERNS.length; i++) {
    const p = PATTERNS[i];
    if (p && p[0] === block[0] && p[1] === block[1] && p[2] === block[2] && p[3] === block[3]) {
      return i;
    }
  }
  return -1;
}
