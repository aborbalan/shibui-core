// 麻の葉 asanoha — «hoja de cáñamo»: retícula isométrica de tres familias de líneas a 60°.

import { halftone, type PatternGenerator } from './field';

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)],
  [Math.cos((2 * Math.PI) / 3), Math.sin((2 * Math.PI) / 3)],
];

// Tres juegos de líneas paralelas a 0°/60°/120° tejen la retícula triangular del asanoha.
// Tinta cerca de cualquiera de las líneas (unión de las tres familias).
export const asanoha: PatternGenerator = ({ width, height, scale = 12, seed = 0 }) => {
  const m = Math.max(4, scale);
  const phase = (seed % 5) / 5;
  return halftone(
    (x, y) => {
      let g = 0;
      for (const [dx, dy] of DIRS) {
        // Coordenada perpendicular a la familia de líneas.
        const t = (x * -dy + y * dx) / m + phase;
        const d = Math.abs(t - Math.round(t)); // distancia a la línea más cercana, en [0,0.5]
        g = Math.max(g, 1 - d * 4); // cresta estrecha en la línea
      }
      return g;
    },
    width,
    height,
  );
};
