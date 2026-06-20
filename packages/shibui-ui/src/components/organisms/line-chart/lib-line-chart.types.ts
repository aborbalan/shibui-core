/* ============================================================
   LIB-LINE-CHART — Tipos e interfaces
   Reutiliza los tipos compartidos de models/ui/charts.
   ============================================================ */

import type { ChartPointSeries, ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

/**
 * Modo de trazado:
 * - `line`         → solo línea.
 * - `area`         → línea + relleno hasta la baseline.
 * - `stacked-area` → áreas apiladas (solo eje de banda).
 */
export type LineChartMode = 'line' | 'area' | 'stacked-area';

/** Modo del eje X derivado de los datos aportados. */
export type LineAxisMode = 'band' | 'linear';

export interface LineChartTemplateProps {
  /** Series categóricas (eje de banda). Se usan si no hay `pointSeries`. */
  series:      ChartSeries[];
  /** Etiquetas del eje X en modo banda. */
  categories:  string[];
  /** Series cartesianas (eje X numérico). Tienen prioridad sobre `series`. */
  pointSeries: ChartPointSeries[];
  colors:      readonly string[];
  xLabel:      string;
  yLabel:      string;
  showGrid:    boolean;
  showLegend:  boolean;
  showDots:    boolean;
  smooth:      boolean;
  mode:        LineChartMode;
  height:      number;
  svgWidth:    number;
  tooltip:     ChartTooltip | null;
  onDotEnter:  (e: MouseEvent, seriesIndex: number, content: string) => void;
  onDotLeave:  () => void;
}
