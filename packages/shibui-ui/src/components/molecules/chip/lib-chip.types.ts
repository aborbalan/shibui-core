/**
 * Tres familias semánticas del SG-26:
 * - static  → taxonomía, etiqueta read-only      (.chip)
 * - toggle  → filtro, multi-select seleccionable (.chip-toggle)
 * - input   → tag removible en campo de entrada  (.chip-input)
 */
export type ChipKind  = 'static' | 'toggle' | 'input';
export type ChipSize  = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Rol semántico del color:
 * - default → neutro adaptativo (katachi-aware)
 * - accent  → énfasis cálido (kaki/persimón)    — era 'kaki'
 * - info    → informativo jade/celadon           — era 'celadon'
 * - error   → estado de error
 * - strong  → contraste máximo (inverso)         — era 'dark'
 */
// `strong` = emphasis de contraste máximo; extensión documentada de chip/badge
// (no es un LibTone canónico).
export type ChipTone = 'default' | 'accent' | 'info' | 'error' | 'strong';