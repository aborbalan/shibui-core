import React from 'react';

export interface ColorSwatchProps {
  /** Nombre del token (ej: "WASHI-50") */
  name: string;
  /** Valor de color CSS — hex, oklch, gradient… */
  value: string;
  /** Texto del valor mostrado (ej: "#FAF7F4" o "gradient") */
  label?: string;
  /** Ancho del cuadrado de muestra en px. Default: 24 */
  swatchSize?: number;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  value,
  label,
  swatchSize = 24,
}) => {
  const displayLabel = label ?? value;

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      gap:            'var(--lib-space-md, 1rem)',
      padding:        'var(--lib-space-sm, 0.5rem) 0',
      borderBottom:   '1px solid rgba(255,255,255,0.05)',
    }}>

      {/* Color square */}
      <div style={{
        width:        swatchSize,
        height:       swatchSize,
        flexShrink:   0,
        background:   value,
        border:       '1px solid rgba(255,255,255,0.08)',
      }} />

      {/* Token name */}
      <span style={{
        flex:          1,
        fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
        fontSize:      '0.6rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase' as const,
        color:         'rgba(250,247,244,0.45)',
      }}>
        {name}
      </span>

      {/* Value */}
      <span style={{
        fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
        fontSize:      '0.6rem',
        letterSpacing: '0.12em',
        color:         'rgba(250,247,244,0.2)',
        flexShrink:    0,
      }}>
        {displayLabel}
      </span>

    </div>
  );
};

export default ColorSwatch;