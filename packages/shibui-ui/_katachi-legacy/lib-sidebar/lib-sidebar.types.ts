/* @legacy-katachi-reference
 * ─────────────────────────────────────────────────────────────
 * Este archivo es una COPIA de referencia del estado anterior al
 * sistema katachi sellado. NO se importa ni se compila.
 * Documenta cómo se definían los estilos palette-named por variant.
 * ───────────────────────────────────────────────────────────── */
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
   
