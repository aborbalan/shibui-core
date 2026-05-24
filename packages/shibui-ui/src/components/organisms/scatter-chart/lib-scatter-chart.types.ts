/* ============================================================
   LIB-SCATTER-CHART — Tipos e interfaces
   ============================================================ */

export interface ScatterPoint {
  x:      number;
  y:      number;
  label?: string;
}

export interface ScatterSeries {
  name:   string;
  points: ScatterPoint[];
}

export interface ScatterTooltip {
  x:       number;
  y:       number;
  content: string;
  color:   string;
}

export interface ScatterChartTemplateProps {
  series:     ScatterSeries[];
  colors:     readonly string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  dotRadius:  number;
  height:     number;
  svgWidth:   number;
  tooltip:    ScatterTooltip | null;
  onDotEnter: (e: MouseEvent, point: ScatterPoint, seriesIndex: number) => void;
  onDotLeave: () => void;
}
