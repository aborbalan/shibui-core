export type LibSize = 'sm' | 'md' | 'lg' | 'xl';

// Colores semánticos que mapean directamente a tus tokens
export type LibSemanticColor = 'primary' | 'danger' | 'text' | 'inherit';
export type LibVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';

export interface UiClickEventDetail {
  originalEvent: Event;
  timestamp: number;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SidebarLink {
  /** Identificador único de la sección a la que navega */
  id: string;
  /** Texto visible del enlace */
  label: string;
  /** Nombre de icono Phosphor (ej: 'house', 'user', 'envelope') */
  icon: string;
  /** Número decorativo opcional (ej: '01', '02') */
  number?: string;
}

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