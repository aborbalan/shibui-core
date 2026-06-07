/* ============================================================
   LIB-SPARKLINE — Tipos e interfaces
   ============================================================ */

export type SparklineType = 'line' | 'area' | 'bar';

/** Rol semántico de color (mapeado a tokens --text-*). */
export type SparklineTone = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface SparklineTemplateProps {
  values:     number[];
  type:       SparklineType;
  width:      number;
  height:     number;
  smooth:     boolean;
  showEndDot: boolean;
  /** Mínimo del dominio Y; si es null se usa el mínimo de los datos. */
  min:        number | null;
  /** Máximo del dominio Y; si es null se usa el máximo de los datos. */
  max:        number | null;
}
