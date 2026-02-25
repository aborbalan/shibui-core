export type LibVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type LibSize = 'sm' | 'md' | 'lg' | 'xl';
export type LibStatus = 'success' | 'error' | 'warning' | 'info';

export interface UiClickEventDetail {
    originalEvent: Event;
    timestamp: number;
  }


export interface LibSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
  }
  
  export interface UiSelectChangeEventDetail {
    value: string;
    originalEvent: Event;
  }

  export interface LibOption {
    value: string;
    label?: string; // Opcional, por si queremos extraer texto plano
    selected: boolean;
    disabled: boolean;
  }