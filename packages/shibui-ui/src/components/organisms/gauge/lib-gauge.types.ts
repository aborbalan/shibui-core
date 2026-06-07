/* ============================================================
   LIB-GAUGE — Tipos e interfaces
   ============================================================ */

/** Rol semántico de color (mapeado a tokens --text-*). */
export type GaugeTone = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'error';

/** Zona de umbral: tramo [from, to] del dominio con su tono. */
export interface GaugeZone {
  from: number;
  to:   number;
  tone: GaugeTone;
}

export interface GaugeTemplateProps {
  value:     number;
  min:       number;
  max:       number;
  tone:      GaugeTone;
  /** Si tiene elementos → modo zonas (bandas de color + aguja). Si vacío → arco de valor. */
  zones:     GaugeZone[];
  showValue: boolean;
  /** Sufijo del valor (p.ej. '%'). */
  unit:      string;
  /** Texto/caption bajo el valor. */
  label:     string;
  height:    number;
  svgWidth:  number;
}
