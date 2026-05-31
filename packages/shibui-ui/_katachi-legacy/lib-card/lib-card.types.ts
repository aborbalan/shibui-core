/* @legacy-katachi-reference
 * ─────────────────────────────────────────────────────────────
 * Este archivo es una COPIA de referencia del estado anterior al
 * sistema katachi sellado. NO se importa ni se compila.
 * Documenta cómo se definían los estilos palette-named por variant.
 * ───────────────────────────────────────────────────────────── */
export type LibCardVariant =
  | 'default'
  | 'inverse'
  | 'accent'
  | 'featured'
  | 'kintsugi'
  | 'glitch'
  | 'celadon'
  | 'washi'
  | 'brutal';

export interface ComponentCardTag {
  label: string;
}
