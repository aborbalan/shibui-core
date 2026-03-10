/* ============================================================
   LIB-SEGMENTED-CONTROL — Tipos e interfaces públicas
   ============================================================ */

/**
 * Variantes de superficie del control.
 * Light: outline · underline · pill · ghost · kaki · celadon
 * Dark:  dark-outline · dark-pill · dark-kaki · dark-underline
 */
export type SegmentedVariant =
  | 'outline'
  | 'underline'
  | 'pill'
  | 'ghost'
  | 'kaki'
  | 'celadon'
  | 'dark-outline'
  | 'dark-pill'
  | 'dark-kaki'
  | 'dark-underline';

/** Tamaños */
export type SegmentedSize = 'sm' | 'md' | 'lg';

/** Opción individual del control */
export interface SegmentedOption {
  /** Valor único — lo que se emite en ui-lib-change */
  value: string;
  /** Texto visible */
  label: string;
  /** Nombre de icono Phosphor (opcional) */
  icon?: string;
  /** Badge numérico sobre el label (opcional) */
  badge?: number;
  /** Opción no interactuable */
  disabled?: boolean;
}

/** Detail del evento ui-lib-change */
export interface SegmentedChangeDetail {
  value: string;
  previousValue: string;
}

/** Props del template */
export interface SegmentedTemplateProps {
  options:     SegmentedOption[];
  value:       string;
  variant:     SegmentedVariant;
  size:        SegmentedSize;
  full:        boolean;
  iconOnly:    boolean;
  disabled:    boolean;
  glitch:      boolean;
  thumbStyle:  string;
  onSelect:    (option: SegmentedOption, evt: MouseEvent) => void;
}