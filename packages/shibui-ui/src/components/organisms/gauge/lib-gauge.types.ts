/* ============================================================
   LIB-GAUGE — Tipos e interfaces
   ============================================================ */

import type { LibSemanticTone } from '../../../types';

/** Rol semántico de color (mapeado a tokens --text-*). Alias del tono semántico canónico. */
export type GaugeTone = LibSemanticTone;

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
