/**
 * Tres familias semánticas del SG-26:
 * - static  → taxonomía, etiqueta read-only      (.chip)
 * - toggle  → filtro, multi-select seleccionable (.chip-toggle)
 * - input   → tag removible en campo de entrada  (.chip-input)
 */
export type ChipKind  = 'static' | 'toggle' | 'input';
export type ChipSize  = 'xs' | 'sm' | 'md' | 'lg';
export type ChipColor = 'default' | 'kaki' | 'celadon' | 'error' | 'info' | 'dark';