export interface BreadcrumbItem {
  /** Texto visible del crumb. Puede ser vacío si el crumb es solo icono. */
  label: string;
  /** URL de destino. Si no se proporciona, el crumb es el activo (aria-current). */
  href?: string;
  /** Nombre de icono Phosphor (ej: 'house', 'folder'). Opcional. */
  icon?: string;
}

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'dot' | 'line';
export type BreadcrumbSize      = 'sm' | 'md' | 'lg';
export type BreadcrumbSurface   = 'default' | 'filled' | 'pill';
export type BreadcrumbAccent    = 'none' | 'kaki' | 'celadon' | 'bold';