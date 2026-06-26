// 家紋 mon — emblema heráldico: motivo radialmente simétrico repetido en rejilla.

import { halftone, type PatternGenerator } from './field';

// Cada módulo de la rejilla contiene un emblema circular con k pétalos, un anillo y un
// punto central. La simetría radial lo hace leer como un escudo (ka-mon) repetido.
export const mon: PatternGenerator = ({ width, height, scale = 16, seed = 0 }) => {
  const m = Math.max(8, scale);
  const k = 4 + (seed % 4); // 4..7 pétalos
  const R = m * 0.42;
  const phase = (seed % 6) * (Math.PI / 6);
  return halftone(
    (x, y) => {
      const cx = (Math.floor(x / m) + 0.5) * m;
      const cy = (Math.floor(y / m) + 0.5) * m;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      if (r > R) return 0;
      const theta = Math.atan2(dy, dx) + phase;
      const petal = 0.6 + 0.4 * Math.cos(k * theta); // borde ondulado de los pétalos
      const dot = r < R * 0.18 ? 1 : 0; // punto central
      const rim = Math.abs(r - R * 0.9) < 0.9 ? 1 : 0; // anillo exterior
      const body = r < R * petal ? 1 : 0; // cuerpo de los pétalos
      return Math.max(dot, rim, body);
    },
    width,
    height,
  );
};
