/* ============================================================
   CHARTS — Tipos compartidos del módulo de visualización
   Única fuente de verdad para bar / scatter / line / area…
   ============================================================ */

/** Punto cartesiano para gráficas con eje X numérico (scatter, line lineal). */
export interface ChartPoint {
  x:      number;
  y:      number;
  label?: string;
}

/** Serie basada en categorías de banda (bar, line categórico). */
export interface ChartSeries {
  name:   string;
  values: number[];
}

/** Serie basada en puntos cartesianos (scatter, line lineal). */
export interface ChartPointSeries {
  name:   string;
  points: ChartPoint[];
}

/** Tooltip flotante posicionado en coordenadas relativas al wrapper. */
export interface ChartTooltip {
  x:       number;
  y:       number;
  content: string;
  color:   string;
}

/** Márgenes internos del lienzo SVG (área de dibujo = svg − márgenes). */
export interface ChartMargin {
  top:    number;
  right:  number;
  bottom: number;
  left:   number;
}

/** Dominio + ticks "redondos" calculados para un eje. */
export interface AxisInfo {
  domain: [number, number];
  ticks:  number[];
}

/** Forma del marcador en la leyenda. `dot` para puntos/líneas, `square` para barras. */
export type LegendShape = 'dot' | 'square';

/** Porción de una gráfica circular (pie / donut). */
export interface PieSlice {
  label:  string;
  value:  number;
  /** Color opcional; si se omite, se asigna desde la paleta de series. */
  color?: string;
}
