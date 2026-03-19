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
   
  export type SidebarVariant = 'dark' | 'light' | 'kintsugi' | 'glitch';
   