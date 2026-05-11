export enum TokenCategory {
  TYPOGRAPHY = 'typography',
  COLOR_PRIMITIVE = 'color-primitive',
  COLOR_SEMANTIC = 'color-semantic',
  SPACING = 'spacing',
  SHADOW = 'shadow',
  ANIMATION = 'animation',
  RADIUS = 'radius',
  Z_INDEX = 'z-index',
  GLASS = 'glass',
  SPOTLIGHT = 'spotlight',
}

export class DesignToken {
  id: string;
  /** CSS variable name without the leading '--', e.g. 'text-xs' */
  name: string;
  /** Full CSS custom property, e.g. '--text-xs' */
  cssVar: string;
  /** Resolved value in light mode */
  value: string;
  category: TokenCategory;
  description: string;
  /** Resolved value when data-theme="dark" is set; null if unchanged */
  darkValue: string | null;
}
