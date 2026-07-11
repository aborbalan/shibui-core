/* ============================================================
   LIB-BACKGROUND — Tipos e interfaces públicas
   70 variantes: 25 light · 21 dark · 8 gradient · 10 animated · 6 canvas
   ============================================================ */

/** 25 fondos light inspirados en papel y textil japonés */
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
  | 'chirimen'    /* 縮緬  crepe silk fine crinkle */
  | 'celadon-wash' /* 青磁洗い  light celadon-tinted paper */
  | 'kintsugi-light' /* 金繕い  costuras de oro sobre cerámica pálida */
  /* ── Sabi · 寂び (superficie envejecida, katachi "sabi") ── */
  | 'foxed'       /* 寂紙  papel amarilleado con motas de foxing */
  | 'rust'        /* 錆   pátina de óxido ferroso, manchas cálidas */
  | 'aizome'      /* 褪せ藍  índigo textil desteñido y gastado */
  | 'craquele'    /* 貫入  craquelado de esmalte envejecido */
  /* ── Shizen · 自然 (naturaleza, katachi "shizen") ── */
  | 'koke'        /* 苔    musgo orgánico sobre papel cálido */
  | 'komorebi'    /* 木漏れ日  luz del sol filtrada entre las hojas */
  | 'karesansui'  /* 枯山水  jardín seco de arena rastrillada */
  | 'wakaba';     /* 若葉   hojas nuevas dispersas */

/** 21 fondos dark derivados de la tinta sumi */
export type LibBackgroundDark =
  | 'sumi'
  | 'sumi-grain'
  | 'kintsugi'
  | 'kintsugi-veins' /* 金継ぎ脈  vetas de oro reparando la grieta sobre sumi */
  | 'kintsugi-gold'  /* 金        laca negra con pooling de oro rico + vetas */
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
  | 'midnight'    /* 深夜   matriz de puntos finos sobre near-black */
  | 'celadon'     /* 青磁   dark jade surface — deep celadon grid */
  /* ── Terminal · CRT (katachi "terminal") ── */
  | 'phosphor'    /* 燐    pantalla de fósforo verde monocromo */
  | 'crt'         /* CRT   scanlines densos + curvatura del tubo */
  | 'amber';      /* 琥珀   fósforo ámbar monocromo (DEC/IBM) */

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

/** 10 fondos animados en CSS puro */
export type LibBackgroundAnimated =
  | 'breathing'
  | 'aurora-drift'
  | 'scan'
  | 'ink-drop'
  | 'shimmer'
  /* ── Nuevos ── */
  | 'pulse'       /* anillos kintsugi expandiéndose desde el centro */
  | 'fog'         /* niebla lenta cruzando de izquierda a derecha */
  | 'static'      /* ruido CRT — estética glitch */
  | 'glitch'      /* CRT terminal — scanlines + horizontal RGB jitter */
  | 'matrix';     /* 雨    lluvia digital — columnas de fósforo cayendo */

/** 6 fondos generativos en Canvas 2D */
export type LibBackgroundCanvas =
  | 'particles'
  | 'rain'
  | 'wave-mesh'
  | 'constellation'
  /* ── Nuevos ── */
  | 'fireflies'   /* partículas luminosas con movimiento orgánico */
  | 'ink-wash';   /* manchas de tinta expandiéndose sobre papel */

/** Unión completa de las 70 variantes */
export type LibBackgroundTheme =
  | LibBackgroundLight
  | LibBackgroundDark
  | LibBackgroundGradient
  | LibBackgroundAnimated
  | LibBackgroundCanvas;

/** Props del template */
export interface BackgroundTemplateProps {
  theme:    LibBackgroundTheme;
  isCanvas: boolean;
}

/** Set de variantes canvas (requieren inicialización JS) */
export const BG_CANVAS_VARIANTS = new Set<LibBackgroundTheme>([
  'particles', 'rain', 'wave-mesh', 'constellation',
  'fireflies', 'ink-wash',
]);

/** Set de variantes oscuras (para decidir color de demo content) */
export const BG_DARK_VARIANTS = new Set<LibBackgroundTheme>([
  'sumi', 'sumi-grain', 'kintsugi', 'kintsugi-veins', 'kintsugi-gold',
  'ash-grid', 'ink-dot',
  'mokume', 'kumo', 'temari', 'dusk', 'embers',
  'obsidian', 'forge', 'void', 'yami', 'midnight', 'celadon',
  'noctiluca', 'aurora-drift', 'scan', 'particles', 'rain',
  'constellation', 'twilight', 'jade-deep', 'pulse', 'fog',
  'static', 'glitch', 'fireflies', 'ink-wash',
  'phosphor', 'crt', 'amber', 'matrix',
]);