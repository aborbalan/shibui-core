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
   
  /**
   * Rol estructural del sidebar (no paleta):
   * - dark  → superficie oscura washi-950 (default, para layouts oscuros)
   * - light → superficie clara semántica bg-elevated (para layouts claros)
   *
   * Los efectos de katachi (seam dorado, scanlines) se activan
   * automáticamente vía --lib-effect-* tokens del contexto data-katachi.
   */
  export type SidebarTheme = 'dark' | 'light';
   