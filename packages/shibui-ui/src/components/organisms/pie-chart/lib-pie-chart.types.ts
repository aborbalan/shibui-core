/* ============================================================
   LIB-PIE-CHART — Tipos e interfaces
   Reutiliza los tipos compartidos de models/ui/charts.
   ============================================================ */

import type { ChartTooltip, PieSlice } from '../../../../models/ui/charts';

export type { PieSlice } from '../../../../models/ui/charts';

export interface PieChartTemplateProps {
  slices:       PieSlice[];
  colors:       readonly string[];
  /** 0 = tarta llena; >0 = donut (proporción del radio, 0–0.9). */
  innerRatio:   number;
  showLegend:   boolean;
  /** Muestra el porcentaje sobre cada porción. */
  showLabels:   boolean;
  /** Texto en el hueco del donut (ignorado si innerRatio = 0). */
  centerLabel:  string;
  height:       number;
  svgWidth:     number;
  tooltip:      ChartTooltip | null;
  onSliceEnter: (x: number, y: number, content: string, color: string) => void;
  onSliceLeave: () => void;
}
