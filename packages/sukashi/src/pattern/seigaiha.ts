// 青海波 seigaiha — «olas del mar azul»: escamas de arcos concéntricos escalonados.

import { halftone, type PatternGenerator } from './field';

// Para cada celda, distancia al centro de escama más cercano (rejilla escalonada),
// y bandas concéntricas en función de esa distancia → arcos anidados.
export const seigaiha: PatternGenerator = ({ width, height, scale = 12, seed = 0 }) => {
  const m = Math.max(4, scale);
  const half = m * 0.5;
  const ring = m / 3; // tres arcos por escama
  const phase = (seed % 3) * (ring / 3);
  return halftone(
    (x, y) => {
      let best = Infinity;
      for (let dj = -1; dj <= 1; dj++) {
        const row = Math.round(y / half) + dj;
        const cy = row * half;
        const offset = row & 1 ? half : 0;
        for (let di = -1; di <= 1; di++) {
          const col = Math.round((x - offset) / m) + di;
          const cx = col * m + offset;
          const r = Math.hypot(x - cx, y - cy);
          if (r < best) best = r;
        }
      }
      // Bandas: el borde de cada arco se entinta, el interior aclara.
      const band = ((best + phase) % ring) / ring;
      return 0.5 + 0.5 * Math.cos(band * Math.PI * 2);
    },
    width,
    height,
  );
};
