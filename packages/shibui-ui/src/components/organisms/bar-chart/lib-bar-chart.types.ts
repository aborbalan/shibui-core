/* ============================================================
   LIB-BAR-CHART — Tipos e interfaces
   Reutiliza los tipos compartidos de models/ui/charts.
   ============================================================ */

import type { ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

export type BarChartMode = 'grouped' | 'stacked';

/** @deprecated Usar `ChartSeries` de models/ui/charts. Alias por compatibilidad. */
export type BarSeries = ChartSeries;

/** @deprecated Usar `ChartTooltip` de models/ui/charts. Alias por compatibilidad. */
export type BarTooltip = ChartTooltip;

export interface BarChartTemplateProps {
  series:     ChartSeries[];
  categories: string[];
  colors:     readonly string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  mode:       BarChartMode;
  height:     number;
  svgWidth:   number;
  tooltip:    ChartTooltip | null;
  onBarEnter: (e: MouseEvent, seriesIndex: number, categoryIndex: number, value: number) => void;
  onBarLeave: () => void;
}
