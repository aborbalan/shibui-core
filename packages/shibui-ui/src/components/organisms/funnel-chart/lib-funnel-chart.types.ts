/* ============================================================
   LIB-FUNNEL-CHART — Tipos e interfaces
   ============================================================ */

import type { ChartTooltip } from '../../../../models/ui/charts';

/** Etapa del embudo. El orden del array es el orden de arriba (ancha) a abajo. */
export interface FunnelStage {
  label:  string;
  value:  number;
  /** Color opcional; si se omite se asigna desde la paleta de series. */
  color?: string;
}

export interface FunnelChartTemplateProps {
  stages:       FunnelStage[];
  colors:       readonly string[];
  /** Muestra valor y % dentro de cada banda. */
  showValues:   boolean;
  height:       number;
  svgWidth:     number;
  tooltip:      ChartTooltip | null;
  onStageEnter: (e: MouseEvent, index: number) => void;
  onStageLeave: () => void;
}
