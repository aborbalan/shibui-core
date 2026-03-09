/* ============================================================
   LIB-SELECT-OPTION — Tipos e interfaces
   ============================================================ */

   export interface SelectOptionTemplateProps {
    value:    string;
    selected: boolean;
    disabled: boolean;
    handleClick: (e: Event) => void;
  }