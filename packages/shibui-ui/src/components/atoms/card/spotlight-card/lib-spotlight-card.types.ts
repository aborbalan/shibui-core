export type LibSpotlightVariant = 'accent' | 'water' | 'white';

export interface SpotlightCardTemplateProps {
  spotlight:    LibSpotlightVariant;
  gold:         boolean;
  onMouseMove:  (e: MouseEvent) => void;
  onMouseLeave: () => void;
}
