/** Tinte semántico (subconjunto canónico de `LibTone`). */
export type DialogTone     = 'default' | 'error' | 'warning';
/** Superficie (subconjunto canónico de `LibSurface`). */
export type DialogSurface  = 'default' | 'dark';
export type DialogSize     = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogLayout   = 'dialog' | 'drawer-right' | 'drawer-bottom' | 'alert';

export interface DialogTemplateProps {
  /** Texto sobre el título — eyebrow mono en mayúsculas */
  eyebrow:          string;
  /** Título principal del header */
  dlgTitle:         string;
  /** Tinte semántico (decide el icono) */
  tone:             DialogTone;
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