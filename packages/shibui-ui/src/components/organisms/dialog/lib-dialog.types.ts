export type DialogVariant = 'default' | 'danger' | 'warning' | 'dark';
export type DialogSize     = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogLayout   = 'dialog' | 'drawer-right' | 'drawer-bottom' | 'alert';

export interface DialogTemplateProps {
  /** Texto sobre el título — eyebrow mono en mayúsculas */
  eyebrow:          string;
  /** Título principal del header */
  dlgTitle:         string;
  /** Variante de color */
  variant:          DialogVariant;
  /** Ancho del panel */
  size:             DialogSize;
  /** Posicionamiento del panel */
  layout:           DialogLayout;
  /** Texto auxiliar en el pie izquierdo */
  footerMeta:       string;
  /** Dialog está abierto */
  open:             boolean;
  /** Handlers */
  onClose:          () => void;
}