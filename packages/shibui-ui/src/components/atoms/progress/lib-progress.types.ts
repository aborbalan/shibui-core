/* ============================================================
   LIB-PROGRESS — Tipos e interfaces
   ============================================================ */

   export type ProgressSize         = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
   export type ProgressTone         = 'default' | 'kaki' | 'celadon' | 'error';
   export type ProgressSegmentTone  = ProgressTone | 'muted';
   
   /**
    * Un segmento del modo multi-segmento.
    * `percent` es el ancho relativo del segmento (0-100, suma recomendada ≤ 100).
    */
   export interface ProgressSegment {
     percent:  number;
     tone?:    ProgressSegmentTone;
     color?:   string;   // override de color CSS directo
     label?:   string;   // texto de la leyenda
   }
   
   export interface ProgressTemplateProps {
     /* Bar config */
     percent:       number;          // 0–100 computado
     size:          ProgressSize;
     tone:          ProgressTone;
     indeterminate: boolean;
     striped:       boolean;
     square:        boolean;
   
     /* Meta */
     label:         string;
     valueLabel:    string;
     sub:           string;
     showValue:     boolean;
   
     /* Multi */
     segments:      ProgressSegment[];
   
     /* a11y */
     ariaLabel:     string;
     rawValue:      number;
     max:           number;
   }