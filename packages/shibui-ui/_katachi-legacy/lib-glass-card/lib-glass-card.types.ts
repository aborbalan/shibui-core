/* @legacy-katachi-reference
 * ─────────────────────────────────────────────────────────────
 * Este archivo es una COPIA de referencia del estado anterior al
 * sistema katachi sellado. NO se importa ni se compila.
 * Documenta cómo se definían los estilos palette-named por variant.
 * ───────────────────────────────────────────────────────────── */
export type LibGlassVariant   = 'paper' | 'water' | 'kaki';
export type LibGlassIntensity = 'low' | 'md' | 'high';

export interface GlassCardTemplateProps {
  variant:   LibGlassVariant;
  intensity: LibGlassIntensity;
}
