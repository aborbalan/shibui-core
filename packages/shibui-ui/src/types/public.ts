export type LibSize = 'sm' | 'md' | 'lg' | 'xl';

// Colores semánticos que mapean directamente a tus tokens
export type LibSemanticColor = 'primary' | 'danger' | 'text' | 'inherit';
export type LibVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';

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

