/* ============================================================
   LIB-COMBO-CHART — Tipos e interfaces
   Barras + líneas en eje de banda, con doble eje Y opcional.
   ============================================================ */

import type { ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

export type { ChartSeries } from '../../../../models/ui/charts';

export interface ComboChartTemplateProps {
  categories:   string[];
  barSeries:    ChartSeries[];
  lineSeries:   ChartSeries[];
  colors:       readonly string[];
  xLabel:       string;
  yLabel:       string;
  /** Título del eje Y derecho (solo con dualAxis). */
  yLabelRight:  string;
  showGrid:     boolean;
  showLegend:   boolean;
  /** Eje Y independiente para las líneas (derecha). */
  dualAxis:     boolean;
  smooth:       boolean;
  height:       number;
  svgWidth:     number;
  tooltip:      ChartTooltip | null;
  onPointEnter: (e: MouseEvent, content: string, color: string) => void;
  onPointLeave: () => void;
}
