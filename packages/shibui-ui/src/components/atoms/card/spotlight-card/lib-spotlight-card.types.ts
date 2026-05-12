export type LibSpotlightVariant = 'kaki' | 'water' | 'white';

export interface SpotlightCardTemplateProps {
  spotlight:    LibSpotlightVariant;
  kintsugi:     boolean;
  onMouseMove:  (e: MouseEvent) => void;
  onMouseLeave: () => void;
}
