/* ============================================================
   LIB-SCATTER-CHART — Tipos e interfaces
   Reutiliza los tipos compartidos de models/ui/charts.
   ============================================================ */

import type { ChartPoint, ChartPointSeries, ChartTooltip } from '../../../../models/ui/charts';

/** @deprecated Usar `ChartPoint` de models/ui/charts. Alias por compatibilidad. */
export type ScatterPoint = ChartPoint;

/** @deprecated Usar `ChartPointSeries` de models/ui/charts. Alias por compatibilidad. */
export type ScatterSeries = ChartPointSeries;

/** @deprecated Usar `ChartTooltip` de models/ui/charts. Alias por compatibilidad. */
export type ScatterTooltip = ChartTooltip;

export interface ScatterChartTemplateProps {
  series:     ChartPointSeries[];
  colors:     readonly string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  dotRadius:  number;
  height:     number;
  svgWidth:   number;
  tooltip:    ChartTooltip | null;
  onDotEnter: (e: MouseEvent, point: ChartPoint, seriesIndex: number) => void;
  onDotLeave: () => void;
}
