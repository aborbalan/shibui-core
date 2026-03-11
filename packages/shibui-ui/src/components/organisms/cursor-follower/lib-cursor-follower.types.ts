/** Cuatro modos visuales del cursor */
export type CursorMode = 'ink' | 'minimal' | 'kaki' | 'ghost';

/** Estados contextuales detectados automáticamente */
export type CursorState = 'default' | 'hover' | 'text' | 'press' | 'hidden';

/** Configuración interna por modo */
export interface CursorModeConfig {
  dotBg:      string;
  dotSize:    string;
  ringBorder: string;
  ringBg:     string;
  ringSize:   string;
  ringMix:    string;
  lerpFactor: number;
}

export const CURSOR_MODES: Record<CursorMode, CursorModeConfig> = {
  ink: {
    dotBg:      'var(--color-washi-900)',
    dotSize:    '6px',
    ringBorder: '1px solid var(--color-washi-400)',
    ringBg:     'transparent',
    ringSize:   '36px',
    ringMix:    'multiply',
    lerpFactor: 0.12,
  },
  minimal: {
    dotBg:      'var(--color-washi-600)',
    dotSize:    '4px',
    ringBorder: 'none',
    ringBg:     'transparent',
    ringSize:   '0px',
    ringMix:    'normal',
    lerpFactor: 0.2,
  },
  kaki: {
    dotBg:      'var(--color-kaki-500)',
    dotSize:    '8px',
    ringBorder: '1.5px solid var(--color-kaki-200, #F4C099)',
    ringBg:     'rgba(217,114,52,0.04)',
    ringSize:   '40px',
    ringMix:    'normal',
    lerpFactor: 0.09,
  },
  ghost: {
    dotBg:      'transparent',
    dotSize:    '0px',
    ringBorder: '1px solid rgba(250,247,244,0.25)',
    ringBg:     'rgba(250,247,244,0.03)',
    ringSize:   '28px',
    ringMix:    'normal',
    lerpFactor: 0.1,
  },
};