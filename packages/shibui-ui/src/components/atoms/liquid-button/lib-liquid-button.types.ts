/** Tratamiento visual (subconjunto canónico de `LibVariant`). */
export type LiquidVariant = 'solid' | 'outlined' | 'ghost';
/** Tinte semántico (subconjunto canónico de `LibTone`). */
export type LiquidTone    = 'default' | 'accent' | 'info' | 'error';
export type LiquidSize    = 'sm' | 'md' | 'lg';

/** Parámetros RGB de la física del agua */
export interface LiquidPalette {
  /** Color del cuerpo de agua (fill) */
  water: [number, number, number];
  /** Color de los anillos de impacto (ripple) */
  ripple: [number, number, number];
}

const VARIANT_PALETTES: Record<LiquidVariant, LiquidPalette> = {
  solid:    { water: [184, 90,  30],  ripple: [255, 180, 100] },  // era 'filled'
  outlined: { water: [34,  28,  22],  ripple: [90,  72,  56]  },
  ghost:    { water: [184, 165, 146], ripple: [140, 120, 100] },
};

const TONE_PALETTES: Record<Exclude<LiquidTone, 'default'>, LiquidPalette> = {
  accent: { water: [140, 65, 21], ripple: [255, 220, 180] },
  info:   { water: [36,  82, 73], ripple: [160, 220, 200] },
  error:  { water: [140, 42, 26], ripple: [220, 100, 80]  },
};

/** El tono semántico (si !== default) gana a la paleta del variant. */
export function resolveLiquidPalette(variant: LiquidVariant, tone: LiquidTone): LiquidPalette {
  return tone !== 'default' ? TONE_PALETTES[tone] : VARIANT_PALETTES[variant];
}