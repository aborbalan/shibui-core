export interface ColorStep {
    /** Número del paso en la escala (50, 100, 200 … 950) */
    step: number;
    /** Valor hex para mostrar en el label y como fallback */
    hex: string;
    /** Valor OKLCH opcional — si no se pasa se usa el hex */
    oklch?: string;
  }