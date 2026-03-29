/* ============================================================
   LIB-BACKGROUND — Tipos e interfaces públicas
   52 variantes: 15 light · 15 dark · 8 gradient · 8 animated · 6 canvas
   ============================================================ */

/** 15 fondos light inspirados en papel y textil japonés */
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
  | 'nishiki'
  /* ── Nuevos ── */
  | 'kagome'      /* 籠目  hexagonal basket weave */
  | 'shoji'       /* 障子  paper screen fine grid */
  | 'shibori'     /* 絞り  tie-dye concentric circles */
  | 'ori'         /* 織   diagonal woven textile */
  | 'chirimen';   /* 縮緬  crepe silk fine crinkle */

/** 15 fondos dark derivados de la tinta sumi */
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
  | 'embers'
  /* ── Nuevos ── */
  | 'obsidian'    /* 黒曜石  mineral shimmer sobre negro profundo */
  | 'forge'       /* 鍛冶   brasa naranja desde abajo */
  | 'void'        /* 虚空   vignette radial, oscuridad pura */
  | 'yami'        /* 闇     degradado de profundidad casi imperceptible */
  | 'midnight';   /* 深夜   matriz de puntos finos sobre near-black */

/** 8 fondos de gradiente mesh */
export type LibBackgroundGradient =
  | 'aurora-light'
  | 'kaki-glow'
  | 'celadon-mist'
  | 'noctiluca'
  | 'horizon'
  /* ── Nuevos ── */
  | 'sakura'      /* 桜    rosa-washi suave */
  | 'twilight'    /* 黄昏  kaki cálido a oscuro */
  | 'jade-deep';  /* 翡翠  celadón profundo con humo */

/** 8 fondos animados en CSS puro */
export type LibBackgroundAnimated =
  | 'breathing'
  | 'aurora-drift'
  | 'scan'
  | 'ink-drop'
  | 'shimmer'
  /* ── Nuevos ── */
  | 'pulse'       /* anillos kintsugi expandiéndose desde el centro */
  | 'fog'         /* niebla lenta cruzando de izquierda a derecha */
  | 'static';     /* ruido CRT — estética glitch */

/** 6 fondos generativos en Canvas 2D */
export type LibBackgroundCanvas =
  | 'particles'
  | 'rain'
  | 'wave-mesh'
  | 'constellation'
  /* ── Nuevos ── */
  | 'fireflies'   /* partículas luminosas con movimiento orgánico */
  | 'ink-wash';   /* manchas de tinta expandiéndose sobre papel */

/** Unión completa de las 52 variantes */
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

/** Set de variantes canvas (requieren inicialización JS) */
export const BG_CANVAS_VARIANTS = new Set<LibBackgroundVariant>([
  'particles', 'rain', 'wave-mesh', 'constellation',
  'fireflies', 'ink-wash',
]);

/** Set de variantes oscuras (para decidir color de demo content) */
export const BG_DARK_VARIANTS = new Set<LibBackgroundVariant>([
  'sumi', 'sumi-grain', 'kintsugi', 'ash-grid', 'ink-dot',
  'mokume', 'kumo', 'temari', 'dusk', 'embers',
  'obsidian', 'forge', 'void', 'yami', 'midnight',
  'noctiluca', 'aurora-drift', 'scan', 'particles', 'rain',
  'constellation', 'twilight', 'jade-deep', 'pulse', 'fog',
  'static', 'fireflies', 'ink-wash',
]);