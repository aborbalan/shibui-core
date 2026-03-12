export type LiquidVariant = 'ink' | 'washi' | 'kaki' | 'celadon' | 'ghost' | 'danger';
export type LiquidSize    = 'sm' | 'md' | 'lg';

/** Parámetros RGB de la física del agua — uno por variante */
export interface LiquidPalette {
  /** Color del cuerpo de agua (fill) */
  water: [number, number, number];
  /** Color de los anillos de impacto (ripple) */
  ripple: [number, number, number];
}

export const LIQUID_PALETTES: Record<LiquidVariant, LiquidPalette> = {
  ink:     { water: [184, 90,  30],  ripple: [255, 180, 100] },
  washi:   { water: [34,  28,  22],  ripple: [90,  72,  56]  },
  kaki:    { water: [140, 65,  21],  ripple: [255, 220, 180] },
  celadon: { water: [36,  82,  73],  ripple: [160, 220, 200] },
  ghost:   { water: [184, 165, 146], ripple: [140, 120, 100] },
  danger:  { water: [140, 42,  26],  ripple: [220, 100, 80]  },
};