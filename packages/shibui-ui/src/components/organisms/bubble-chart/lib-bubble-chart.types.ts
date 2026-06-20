/* ============================================================
   LIB-BUBBLE-CHART — Tipos e interfaces
   Scatter + 3ª dimensión (tamaño). Reutiliza ChartTooltip.
   ============================================================ */

import type { ChartTooltip } from '../../../../models/ui/charts';

export interface BubblePoint {
  x:      number;
  y:      number;
  /** Tercera dimensión: se mapea al área del círculo (escala sqrt). */
  size:   number;
  label?: string;
}

export interface BubbleSeries {
  name:   string;
  points: BubblePoint[];
}

export interface BubbleChartTemplateProps {
  series:     BubbleSeries[];
  colors:     readonly string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  minRadius:  number;
  maxRadius:  number;
  height:     number;
  svgWidth:   number;
  tooltip:    ChartTooltip | null;
  onDotEnter: (e: MouseEvent, point: BubblePoint, seriesIndex: number) => void;
  onDotLeave: () => void;
}
