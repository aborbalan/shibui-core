/* ============================================================
   LIB-BACKGROUND — Tipos e interfaces públicas
   ============================================================ */

/** 10 fondos light inspirados en papel y textil japonés */
export type LibBackgroundLight =
  | 'washi'
  | 'washi-grain'
  | 'washi-weave'
  | 'seigaiha'
  | 'tatami'
  | 'asanoha'
  | 'sashiko'
  | 'komon'
  | 'kasuri'
  | 'nishiki';

/** 10 fondos dark derivados de la tinta sumi */
export type LibBackgroundDark =
  | 'sumi'
  | 'sumi-grain'
  | 'kintsugi'
  | 'ash-grid'
  | 'ink-dot'
  | 'mokume'
  | 'kumo'
  | 'temari'
  | 'dusk'
  | 'embers';

/** 5 fondos de gradiente mesh — radial stacking */
export type LibBackgroundGradient =
  | 'aurora-light'
  | 'kaki-glow'
  | 'celadon-mist'
  | 'noctiluca'
  | 'horizon';

/** 5 fondos animados en CSS puro */
export type LibBackgroundAnimated =
  | 'breathing'
  | 'aurora-drift'
  | 'scan'
  | 'ink-drop'
  | 'shimmer';

/** 4 fondos generativos en Canvas 2D */
export type LibBackgroundCanvas =
  | 'particles'
  | 'rain'
  | 'wave-mesh'
  | 'constellation';

/** Unión completa de las 34 variantes */
export type LibBackgroundVariant =
  | LibBackgroundLight
  | LibBackgroundDark
  | LibBackgroundGradient
  | LibBackgroundAnimated
  | LibBackgroundCanvas;

/** Props del template */
export interface BackgroundTemplateProps {
  variant:  LibBackgroundVariant;
  isCanvas: boolean;
}

/** Grupos para la story y la documentación */
export const BG_CANVAS_VARIANTS = new Set<LibBackgroundVariant>([
  'particles', 'rain', 'wave-mesh', 'constellation',
]);

export const BG_DARK_VARIANTS = new Set<LibBackgroundVariant>([
  'sumi', 'sumi-grain', 'kintsugi', 'ash-grid', 'ink-dot',
  'mokume', 'kumo', 'temari', 'dusk', 'embers',
  'noctiluca', 'aurora-drift', 'scan', 'particles', 'rain', 'constellation',
]);