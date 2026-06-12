/** Tratamiento visual (subconjunto canónico de `LibVariant`). */
export type LibButtonVariant =
  | 'solid'      // era 'primary'
  | 'outlined'   // era 'secondary'
  | 'ghost';
/** Tinte semántico (subconjunto canónico de `LibTone`). */
export type LibButtonTone =
  | 'default'
  | 'accent'
  | 'error';      // era variant 'danger'
