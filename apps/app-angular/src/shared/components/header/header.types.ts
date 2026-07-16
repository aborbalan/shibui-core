/**
 * Tipos locales del header del showcase.
 *
 * Modelan los datos de navegación que la app pasa al web component
 * `<lib-header>`. Se definen aquí (y no se importan de `@shibui-ui/ui`)
 * porque son el contrato de DATOS del consumidor: el paquete solo expone
 * su API pública (`.`, `/react`, `/angular`, `/svelte`, `/tokens`, `/styles`),
 * no rutas internas a los `.types` de cada componente.
 */

export interface DropdownItem {
  label: string;
  href?: string;
  /** Añade línea separadora antes */
  divider?: boolean;
}

export interface NavLink {
  id: string;
  label: string;
  href?: string;
  /** Items del dropdown */
  dropdown?: DropdownItem[];
  /** Indica si es el link activo */
  active?: boolean;
}

export interface HeaderAction {
  label: string;
  href?: string;
  variant?: string;
}
