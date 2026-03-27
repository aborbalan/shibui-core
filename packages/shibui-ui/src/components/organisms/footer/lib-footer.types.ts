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