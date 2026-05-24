/* ============================================================
   LIB-BAR-CHART — Tipos e interfaces
   ============================================================ */

export type BarChartMode = 'grouped' | 'stacked';

export interface BarSeries {
  name:   string;
  values: number[];
}

export interface BarTooltip {
  x:       number;
  y:       number;
  content: string;
  color:   string;
}

export interface BarChartTemplateProps {
  series:     BarSeries[];
  categories: string[];
  colors:     readonly string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  mode:       BarChartMode;
  height:     number;
  svgWidth:   number;
  tooltip:    BarTooltip | null;
  onBarEnter: (e: MouseEvent, seriesIndex: number, categoryIndex: number, value: number) => void;
  onBarLeave: () => void;
}
