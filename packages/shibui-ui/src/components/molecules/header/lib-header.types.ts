/**
 * Variante estructural del header (layout + superficie, no paleta).
 *
 * Los efectos de katachi (seam dorado, scanlines) se activan
 * automáticamente vía --lib-effect-* tokens del contexto data-katachi.
 */
export type HeaderVariant =
  | 'classic'      // 01 — light, dropdown
  | 'dark'         // 02 — washi-950, blur
  | 'centered'     // 03 — logo central, nav dividida
  | 'transparent'  // 04 — sobre hero, blur al scroll
  | 'mega'         // 05 — mega-nav panel full-width
  | 'minimal'      // 06 — sin borde, sin fondo, solo texto
  | 'shrink'       // 07 — 72px → 48px al scroll
  | 'app-bar'      // 08 — breadcrumbs, search, acciones, avatar
  | 'celadon'      // 09 — jade oscuro, seam jade, spotlight water
  | 'sabi'         // 10 — papel washi, tinta, sombra brutal
  | 'shizen';      // 11 — natural, limpio, sin adorno

export interface NavLink {
  id: string;
  label: string;
  href?: string;
  /** Items del dropdown */
  dropdown?: DropdownItem[];
  /** Indica si es el link activo */
  active?: boolean;
}

export interface DropdownItem {
  label: string;
  href?: string;
  /** Añade línea separadora antes */
  divider?: boolean;
}

export interface HeaderAction {
  label: string;
  href?: string;
  /** 'accent' | 'secondary' | 'ghost' */
  variant?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}