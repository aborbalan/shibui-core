/* ============================================================
   LIB-SEGMENTED-CONTROL — Tipos e interfaces públicas
   ============================================================ */

/**
 * Modo de presentación del control (eje `display`).
 * outline · underline · pill · ghost
 */
export type SegmentedDisplay =
  | 'outline'
  | 'underline'
  | 'pill'
  | 'ghost';

/** Superficie del control (subconjunto canónico de `LibSurface`). */
export type SegmentedSurface = 'default' | 'dark';

/** Tinte semántico del thumb (subconjunto canónico de `LibTone`). */
export type SegmentedTone = 'default' | 'accent' | 'info';

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
  display:     SegmentedDisplay;
  surface:     SegmentedSurface;
  tone:        SegmentedTone;
  size:        SegmentedSize;
  full:        boolean;
  iconOnly:    boolean;
  disabled:    boolean;
  glitch:      boolean;
  thumbStyle:  string;
  onSelect:    (option: SegmentedOption, evt: MouseEvent) => void;
}