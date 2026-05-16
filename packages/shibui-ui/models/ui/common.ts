export type LibVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type LibSize = 'sm' | 'md' | 'lg' | 'xl';
export type LibStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Identificador del katachi (形) activo en un subárbol del DOM.
 * Cada katachi es una personalidad visual nombrada y coherente.
 * Ver src/styles/shared/tokens/_katachi.css para el contrato completo.
 */
export type KatachiId =
  | 'wabi'      // 侘び  — austero, dark + glass
  | 'kintsugi'  // 金継ぎ — reparado, oro + spotlight
  | 'sabi'      // 寂び  — envejecido, washi + shadow-brutal
  | 'terminal'  //        — CRT, glitch + shadow-brutal
  | 'shizen'    // 自然  — natural, sin adorno (base)
  | 'celadon';  // 青磁  — jade, frío + spotlight water

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