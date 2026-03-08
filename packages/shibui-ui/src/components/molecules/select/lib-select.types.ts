/* ============================================================
   LIB-SELECT — Tipos e interfaces
   ============================================================ */

   export type SelectSize    = 'sm' | 'md' | 'lg';
   export type SelectVariant = 'default' | 'filled' | 'ghost';
   
   export interface SelectChangeDetail {
     value:  string;
     label:  string;
   }
   
   export interface SelectMultiChangeDetail {
     values: string[];
     labels: string[];
   }