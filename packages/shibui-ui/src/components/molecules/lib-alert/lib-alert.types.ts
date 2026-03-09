/* ============================================================
   LIB-ALERT — Tipos e interfaces
   ============================================================ */

   export type AlertType = 'default' | 'info' | 'warning' | 'error' | 'success';

   export interface AlertCloseDetail {
     type: AlertType;
   }
   
   export interface AlertTemplateProps {
     type:        AlertType;
     heading:     string;
     closable:    boolean;
     glass:       boolean;
     handleClose: () => void;
   }