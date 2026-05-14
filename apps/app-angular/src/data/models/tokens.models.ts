export type TokenCategory =
  | 'typography'
  | 'color-primitive'
  | 'color-semantic'
  | 'spacing'
  | 'shadow'
  | 'animation'
  | 'radius'
  | 'z-index'
  | 'glass'
  | 'spotlight';

export interface DesignTokenDto {
  id: string;
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
  darkValue: string | null;
}
