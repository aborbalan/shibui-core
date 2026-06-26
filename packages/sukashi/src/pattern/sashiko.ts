// 刺し子 sashiko — «puntadas»: rejilla de pespuntes discontinuos (hitomezashi).

import { halftone, type PatternGenerator } from './field';

// Líneas de puntada horizontales y verticales sobre una rejilla; cada línea es discontinua
// (dash) y las fases se entrelazan → el característico tejido de pespuntes. `seed` traslada
// la rejilla de forma determinista.
export const sashiko: PatternGenerator = ({ width, height, scale = 10, seed = 0 }) => {
  const m = Math.max(4, scale);
  const dash = m * 0.5; // longitud de puntada y de hueco
  const ox = seed % m;
  const oy = (seed * 3) % m;

  const onDash = (along: number, gap: number): number => {
    // Entinta si está sobre una línea de la rejilla y dentro del tramo de puntada.
    const nearLine = Math.abs(gap / m - Math.round(gap / m)) * m < 1;
    if (!nearLine) return 0;
    const phase = Math.floor(gap / m) & 1 ? dash : 0;
    return Math.floor((along + phase) / dash) % 2 === 0 ? 1 : 0;
  };

  return halftone(
    (x, y) => Math.max(onDash(x + ox, y + oy), onDash(y + oy, x + ox)),
    width,
    height,
  );
};
