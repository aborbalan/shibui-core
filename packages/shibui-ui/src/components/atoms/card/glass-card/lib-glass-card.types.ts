export type LibGlassVariant   = 'paper' | 'water' | 'kaki';
export type LibGlassIntensity = 'low' | 'md' | 'high';

export interface GlassCardTemplateProps {
  variant:   LibGlassVariant;
  intensity: LibGlassIntensity;
}
