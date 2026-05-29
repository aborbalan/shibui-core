/**
 * Tinte estructural del cristal:
 * - neutral → neutro paper (default)
 * - cool    → tinte azul sereno  — era 'water'
 * - warm    → tinte cálido orgánico — era 'kaki'
 *
 * Dentro de un [data-katachi] el color es anulado por el contexto
 * automáticamente; estos roles se usan fuera de katachi.
 */
export type LibGlassVariant   = 'neutral' | 'cool' | 'warm';
export type LibGlassIntensity = 'low' | 'md' | 'high';

export interface GlassCardTemplateProps {
  variant:   LibGlassVariant;
  intensity: LibGlassIntensity;
}
