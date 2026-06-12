/** Tratamiento visual (LibVariant + extensión documentada `featured`). */
export type LibCardVariant =
  | 'solid'     // superficie elevada neutra (era 'default') — adapta al katachi
  | 'featured'; // destacada, título grande — pensada para 2 cols en grid
/** Superficie (subconjunto canónico de `LibSurface`). */
export type LibCardSurface = 'default' | 'inverse';
/** Tinte semántico (subconjunto canónico de `LibTone`). */
export type LibCardTone    = 'default' | 'accent';

export interface ComponentCardTag {
  label: string;
}
