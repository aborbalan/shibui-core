/* ============================================================
   LIB-DATA-TABLE — Tipos e interfaces
   ============================================================ */

   export type TableVariant  = 'lines' | 'grid' | 'striped' | 'borderless';
   export type TableSize     = 'sm' | 'md' | 'lg';
   export type TableColType  = 'text' | 'mono' | 'num' | 'badge' | 'progress' | 'avatar' | 'actions';
   export type TableBadgeTone = 'estable' | 'beta' | 'error' | 'warning' | 'inactive' | 'info';
   export type TableRowState  = 'selected' | 'error' | 'warning' | 'success' | 'disabled';
   export type SortDir        = 'asc' | 'desc';
   
   /** Fila de datos genérica. `_state` aplica el estado semántico de la fila. */
   export interface TableRowData {
     [key: string]: unknown;
     _state?: TableRowState;
   }
   
   /** Definición de columna. */
   export interface TableColumn {
     key:      string;
     header:   string;
     sortable?: boolean;
     type?:    TableColType;
     sticky?:  boolean;   /* columna sticky izquierda */
     truncate?: boolean;  /* texto truncado con ellipsis */
   
     /* Badge: tone estático o derivado de un campo de la fila */
     badgeTone?: TableBadgeTone;
     toneKey?:   string;  /* row[toneKey] → TableBadgeTone */
   
     /* Avatar: campo secundario y override de iniciales */
     hintKey?:     string; /* subtítulo bajo el nombre */
     initialsKey?: string; /* 2 letras; si no se da, primeras 2 del value */
   
     /* Progress: tono del relleno */
     progressTone?: 'kaki' | 'celadon' | '';
   }
   
   /* ── Eventos ── */
   export interface TableSortEventDetail {
     key: string;
     dir: SortDir;
   }
   export interface TableFilterEventDetail {
     query: string;
   }
   export interface TableSelectEventDetail {
     indices: number[];
     rows:    TableRowData[];
   }
   export interface TableRowActionEventDetail {
     row:   TableRowData;
     index: number;
   }