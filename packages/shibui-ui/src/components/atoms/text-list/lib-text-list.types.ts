/* ============================================================
   LIB-TEXT-LIST — Tipos públicos
   ============================================================

   Tres familias del sistema:

   1. CONTENT LIST — listas tipográficas para prosa
      variant: 'ul' | 'ol'
      marker:  'default' | 'kaki' | 'dash' | 'check'
      counter: 'decimal' | 'roman' | 'alpha'  (solo ol)
      size:    'sm' | 'md' | 'lg'
      items:   ContentItem[]

   2. UI LIST — componente de interfaz (menú, opciones)
      variant: 'ui'
      items:   UiItem[]
      modifiers: divided · bordered · inset · interactive · dark

   3. DESCRIPTION LIST — pares clave/valor
      variant: 'dl'
      items:   DlItem[]
      layout:  'inline' | 'wide' | 'stack'
      divided: boolean

   ============================================================ */

/* ── Familia ── */
export type ListFamily = 'ul' | 'ol' | 'ui' | 'dl';

/* ── Marcadores de contenido ── */
export type ContentMarker  = 'default' | 'kaki' | 'dash' | 'check';
export type OrderedCounter = 'decimal' | 'roman' | 'alpha';

/* ── Tamaños ── */
export type ListSize = 'sm' | 'md' | 'lg';

/* ── DL layout ── */
export type DlLayout = 'inline' | 'wide' | 'stack';

/* ── Variantes de icono en UI list ── */
export type RowIconVariant = 'default' | 'kaki' | 'celadon' | 'error' | 'info' | 'plain' | 'round';

/* ── Variantes de badge en UI list ── */
export type RowBadgeVariant = 'default' | 'kaki' | 'celadon' | 'error';

/* ──────────────────────────────────────
   ITEMS — Content List
   ────────────────────────────────────── */

export interface ContentItem {
  /** Texto del ítem */
  label: string;
  /** Estado del check (solo para marker='check') — true: check, false: circle vacío */
  checked?: boolean;
  /** Ítems anidados (máx. 1 nivel extra) */
  children?: ContentItem[];
}

/* ──────────────────────────────────────
   ITEMS — UI List
   ────────────────────────────────────── */

/** Separador horizontal entre ítems */
export interface UiSeparator {
  type: 'separator';
}

/** Cabecera de sección agrupada */
export interface UiSectionHeader {
  type: 'header';
  label: string;
}

/** Fila de datos */
export interface UiRow {
  type?: 'row';
  /** Clave única */
  key: string;
  /** Texto principal */
  label: string;
  /** Texto secundario */
  desc?: string;
  /** Nombre de icono Phosphor */
  icon?: string;
  /** Variante de color del icono */
  iconVariant?: RowIconVariant;
  /** Iniciales o texto de avatar (si se usa avatar en lugar de icono) */
  avatar?: string;
  /** Metadata a la derecha (texto, badge, toggle, chevron) */
  meta?: string;
  badge?: { label: string; variant?: RowBadgeVariant };
  toggle?: boolean;
  chevron?: boolean;
  /** Estados */
  selected?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export type UiItem = UiRow | UiSeparator | UiSectionHeader;

/* ──────────────────────────────────────
   ITEMS — Description List
   ────────────────────────────────────── */

export interface DlItem {
  term: string;
  description: string;
  /** Renderiza description en font-mono */
  mono?: boolean;
}

/* ──────────────────────────────────────
   PROPS del template
   ────────────────────────────────────── */

export interface TextListTemplateProps {
  /* Familia */
  family: ListFamily;

  /* Content list */
  contentItems:  ContentItem[];
  marker:        ContentMarker;
  counter:       OrderedCounter;
  size:          ListSize;
  nested:        boolean;

  /* UI list */
  uiItems:     UiItem[];
  divided:     boolean;
  bordered:    boolean;
  inset:       boolean;
  interactive: boolean;
  dark:        boolean;

  /* DL */
  dlItems:  DlItem[];
  dlLayout: DlLayout;
  dlDivided: boolean;

  /* Eventos */
  onRowClick: (item: UiRow) => void;
  onToggle:   (item: UiRow, value: boolean) => void;
}

/* ──────────────────────────────────────
   Event details
   ────────────────────────────────────── */

export interface ListRowClickDetail {
  key: string;
  item: UiRow;
}

export interface ListToggleDetail {
  key: string;
  value: boolean;
}