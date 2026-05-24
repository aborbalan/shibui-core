/* ============================================================
   LIB-METRIC-BAR — Tipos e interfaces
   ============================================================ */

export type { ProgressTone, ProgressSize } from '../../atoms/progress/lib-progress.types';

import type { ProgressTone, ProgressSize } from '../../atoms/progress/lib-progress.types';

export interface MetricBarTemplateProps {
  label:     string;
  value:     number;
  max:       number;
  unit:      string;
  tone:      ProgressTone;
  size:      ProgressSize;
  showValue: boolean;
}
