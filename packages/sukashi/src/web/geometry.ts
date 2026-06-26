// Lógica pura de alineación de capas (sin DOM, testeable en Node).

// ¿La capa superior está suficientemente cerca del encaje (desfase ~0)?
export function isAligned(dx: number, dy: number, cell: number, tolerance = 0.5): boolean {
  const t = cell * tolerance;
  return Math.abs(dx) <= t && Math.abs(dy) <= t;
}

// Desfase en celdas (redondeado), útil para lecturas/marcas de registro.
export function offsetInCells(dx: number, dy: number, cell: number): readonly [number, number] {
  if (cell <= 0) throw new Error('offsetInCells: cell debe ser > 0');
  return [Math.round(dx / cell), Math.round(dy / cell)];
}
