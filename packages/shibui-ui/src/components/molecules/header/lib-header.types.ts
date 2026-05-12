export type HeaderVariant =
  | 'classic'      // 01 — light, dropdown
  | 'dark'         // 02 — washi-950, blur
  | 'centered'     // 03 — logo central, nav dividida
  | 'transparent'  // 04 — sobre hero, blur al scroll
  | 'kintsugi'     // 05 — seam animada inferior
  | 'glitch'       // 06 — scanlines, RGB drift
  | 'mega'         // 07 — mega-nav panel full-width
  | 'minimal'      // 08 — sin borde, sin fondo, solo texto
  | 'shrink'       // 09 — 72px → 48px al scroll
  | 'app-bar';     // 10 — breadcrumbs, search, acciones, avatar

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
  /** 'kaki' | 'outline' | 'ghost' */
  variant?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}