/* ============================================================
   CONTRATO DE TIPOS CANÓNICOS — fuente única del design system.
   Todos los componentes importan sus ejes transversales de aquí.
   No declarar alias propios de size/tone/variant salvo extensión
   documentada (p.ej. LibAvatarSize = LibSize | '2xl').

   Ejes ortogonales:
     · size    → escala dimensional (LibSize)
     · tone    → color/estado SEMÁNTICO (LibTone)
     · variant → tratamiento VISUAL (LibVariant)
     · theme   → variantes estéticas signature (por componente, fuera
                 del mandato de cohesión)
   ============================================================ */

/* ── Eje SIZE ──────────────────────────────────────────────────
   Escala canónica. Default siempre 'md'. Un componente puede
   soportar un subconjunto CONTIGUO, pero nunca nombres nuevos. */
export type LibSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Overlays (dialog, drawer, modal): añade 'full'. */
export type LibOverlaySize = LibSize | 'full';

/** Avatar: añade '2xl' (escala de presencia más grande). */
export type LibAvatarSize = LibSize | '2xl';

/** Display/tipografía (parallax-text…): añade '2xl', default suele ser 'lg'. */
export type LibDisplaySize = LibSize | '2xl';

/* ── Eje TONE ──────────────────────────────────────────────────
   Color/estado semántico. Default 'default'. Absorbe los valores
   semánticos que históricamente vivían en `variant`. 'danger' se
   unifica como 'error' en todo el sistema. */
export type LibSemanticTone =
  | 'default'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

/** Tono completo: semántico + de-énfasis 'muted' (gris bajo contraste). */
export type LibTone = LibSemanticTone | 'muted';

/* ── Eje VARIANT ───────────────────────────────────────────────
   Tratamiento visual (relleno/borde). Default 'solid'.
   NOTA: el `LibVariant` legacy (jerarquía primary/secondary/…) se
   redefine a este contrato durante la fase de migración de variant;
   hasta entonces button-group/button-split aún usan el legacy. */
export type LibVariant = 'solid' | 'outlined' | 'ghost' | 'subtle';

/* ── SUPERFICIE / CONTEXTO (modificadores no-tone) ─────────────
   Contexto de fondo sobre el que vive el componente. No son tones.
   - default : superficie natural del tema
   - light   : forzar variante clara
   - dark    : forzar variante oscura (antes 'on-dark')
   - inverse : colores invertidos respecto a la superficie */
export type LibSurface = 'default' | 'light' | 'dark' | 'inverse';

/* ── TINT (color DECORATIVO, no semántico) ─────────────────────
   Para avatar/glass-card: tintes cálidos/fríos sin significado de
   estado. Reservar `tone` para semántica. */
export type LibTint = 'neutral' | 'warm' | 'cool' | 'inverse';

/* ── Otros ejes transversales ──────────────────────────────────*/
export type LibStatus = 'default' | 'active' | 'success' | 'warning' | 'error';
export type LibOrientation = 'horizontal' | 'vertical';
export type LibShape = 'square' | 'rounded' | 'circle';

// Colores semánticos legacy que mapean a tokens (en desuso; conservar
// hasta confirmar que ningún consumidor externo depende de ellos).
export type LibSemanticColor = 'primary' | 'danger' | 'text' | 'inherit';

export interface UiClickEventDetail {
  originalEvent: Event;
  timestamp: number;
}

export interface SidebarLink {
  id: string;
  label: string;
  icon: string;
  number?: string;
  // ── Nuevos campos SG-65 ──
  /** Renderiza una cabecera de grupo antes de este item */
  group?: string;
  /** Badge contador (ej: 12, "new") */
  badge?: string | number;
  /** Desactiva el item visualmente */
  disabled?: boolean;
}

export type SidebarVariant = 'dark' | 'light' | 'kintsugi' | 'glitch';

export interface SidebarSocial {
  /** URL de destino */
  href: string;
  /** Nombre de icono Phosphor */
  icon: string;
  /** Texto accesible para aria-label */
  label: string;
}

export interface ActiveElement extends HTMLElement {
  active: string | number; // Define el tipo real de tu ID
}

export type FooterVariant =
  | 'social'
  | 'accordion'
  | 'kintsugi'
  | 'glitch';

export interface FooterLink {
  /** Texto visible del enlace */
  label: string;
  /** URL de destino */
  href: string;
}

export interface FooterColumn {
  /** Título de la columna */
  heading: string;
  /** Lista de enlaces */
  links: FooterLink[];
}

export interface FooterSocial {
  /** Nombre de la red (para aria-label) */
  label: string;
  /** URL de destino */
  href: string;
  /**
   * SVG inline como string.
   * Se pasa como propiedad JSON o se delega a slots.
   */
  icon: string;
}
