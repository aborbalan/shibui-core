/** Evento emitido cuando cambia el progreso del scroll */
export interface HorizontalScrollProgressEvent {
    /** Valor entre 0 y 1 */
    progress: number;
    /** Porcentaje redondeado 0–100 */
    percent: number;
  }