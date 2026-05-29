export type LibCardVariant =
  | 'default'   // superficie elevada neutra — adapta al katachi activo
  | 'inverse'   // fondo invertido — siempre contrasta con el base de página
  | 'accent'    // borde izquierdo de énfasis — color vía prop `accent-color`
  | 'featured'; // destacada, título grande — pensada para 2 cols en grid

export interface ComponentCardTag {
  label: string;
}
