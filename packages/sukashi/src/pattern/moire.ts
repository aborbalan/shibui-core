// モアレ moiré — interferencia de dos retículas finas de frecuencia/ángulo próximos.

import { clamp01, halftone, type PatternGenerator } from './field';

// Dos rejillas sinusoidales casi iguales se baten y producen las bandas de moiré.
// `scale` fija el periodo base; `seed` desafina el ángulo de la segunda rejilla.
export const moire: PatternGenerator = ({ width, height, scale = 6, seed = 0 }) => {
  const period = Math.max(3, scale);
  const k = (2 * Math.PI) / period;
  const angle = 0.18 + (seed % 7) * 0.04; // pequeño desvío angular → batido visible
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  return halftone(
    (x, y) => {
      const g1 = Math.cos(k * x);
      const g2 = Math.cos(k * (x * ca + y * sa));
      return clamp01(0.5 + 0.5 * g1 * g2);
    },
    width,
    height,
  );
};
