export type TabsVariant = 'underline' | 'pill' | 'card' | 'outline' | 'vertical';
export type TabsColor   = 'kaki' | 'celadon';
export type TabsSize    = 'sm' | 'md' | 'lg';

export interface TabItem {
  id:       string;
  label:    string;
  /** SVG markup como string — hereda color currentColor */
  icon?:    string;
  /** Número o texto corto — se muestra como pill badge */
  badge?:   number | string;
  disabled?: boolean;
  /**
   * Etiqueta de grupo que aparece ENCIMA de este tab (solo variante vertical).
   * Si se define, se renderiza un div.tb-label antes del tab.
   */
  group?:   string;
  /**
   * Indica cambios sin guardar — muestra un dot de acento junto al label.
   * Útil en editores multi-documento, formularios multi-step y configuraciones.
   */
  dirty?:   boolean;
  /**
   * Muestra botón de cierre (×) en este tab.
   * Si se omite, hereda la prop `closable` del componente.
   * Pasar `false` oculta el botón aunque el componente tenga `closable`.
   */
  closable?: boolean;
}