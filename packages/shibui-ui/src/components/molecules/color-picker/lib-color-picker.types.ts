/** Modo de visualización del componente */
export type ColorPickerVariant = 'inline' | 'trigger';

/** Modo de los inputs de texto */
export type ColorInputMode = 'hex' | 'rgb' | 'hsl';

/** Fila de swatches para el swatch-grid */
export interface SwatchRow {
  label: string;
  colors: SwatchColor[];
}

export interface SwatchColor {
  value: string;   // hex
  name?: string;   // tooltip
}

/** Props internas del estado de color (HSL + alpha) */
export interface ColorState {
  h: number;       // 0–360
  s: number;       // 0–100
  l: number;       // 0–100
  alpha: number;   // 0–100
}

/** Paleta Shibui por defecto para el swatch grid */
export const SHIBUI_SWATCHES: SwatchRow[] = [
  {
    label: 'washi',
    colors: [
      { value: '#FAF7F4', name: 'washi-50' },
      { value: '#F2EDE6', name: 'washi-100' },
      { value: '#E5DDD3', name: 'washi-200' },
      { value: '#D3C8BC', name: 'washi-300' },
      { value: '#B8A99A', name: 'washi-400' },
      { value: '#9A8878', name: 'washi-500' },
      { value: '#7A6A5C', name: 'washi-600' },
      { value: '#5C4E42', name: 'washi-700' },
      { value: '#3D332A', name: 'washi-800' },
      { value: '#221C16', name: 'washi-900' },
      { value: '#120E0A', name: 'washi-950' },
    ],
  },
  {
    label: 'kaki',
    colors: [
      { value: '#FDF3EC', name: 'kaki-50' },
      { value: '#FAE2CC', name: 'kaki-100' },
      { value: '#F5C89A', name: 'kaki-200' },
      { value: '#EBAA66', name: 'kaki-300' },
      { value: '#D97234', name: 'kaki-400' },
      { value: '#B85A1E', name: 'kaki-500' },
      { value: '#8C4115', name: 'kaki-600' },
    ],
  },
  {
    label: 'celadón',
    colors: [
      { value: '#EFF5F3', name: 'celadon-50' },
      { value: '#D3E8E1', name: 'celadon-100' },
      { value: '#A8D0C5', name: 'celadon-200' },
      { value: '#76B3A5', name: 'celadon-300' },
      { value: '#4D8E82', name: 'celadon-400' },
      { value: '#357164', name: 'celadon-500' },
      { value: '#245249', name: 'celadon-600' },
    ],
  },
];