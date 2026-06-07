/* ============================================================
   LIB-RADAR-CHART — Tipos e interfaces
   Reutiliza los tipos compartidos de models/ui/charts.
   ============================================================ */

import type { ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

export type { ChartSeries } from '../../../../models/ui/charts';

export interface RadarChartTemplateProps {
  /** Etiquetas de los ejes (radios). Los valores de cada serie se alinean por índice. */
  axes:          string[];
  series:        ChartSeries[];
  colors:        readonly string[];
  /** Máximo del dominio radial (0 → max). */
  max:           number;
  /** Nº de anillos concéntricos de la rejilla. */
  levels:        number;
  showLegend:    boolean;
  showDots:      boolean;
  /** Opacidad del relleno de cada polígono (0 = sin relleno). */
  fillOpacity:   number;
  height:        number;
  svgWidth:      number;
  tooltip:       ChartTooltip | null;
  onVertexEnter: (x: number, y: number, content: string, color: string) => void;
  onVertexLeave: () => void;
}
