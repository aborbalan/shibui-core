import React from 'react';
import ColorSwatch, { ColorSwatchProps } from '../dumb/ColorSwatch';

export interface ColorPaletteProps {
  /** Eyebrow label (ej: "Color · Washi") */
  eyebrow?: string;
  /** Lista de swatches */
  swatches: ColorSwatchProps[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  eyebrow,
  swatches,
}) => {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      gap:            'var(--lib-space-xs, 0.25rem)',
    }}>

      {/* Eyebrow */}
      {eyebrow && (
        <lib-eyebrow
          color="dark"
          size="sm"
          style={{
            marginBottom: 'var(--lib-space-md, 1rem)',
            display:      'inline-flex',
          } as React.CSSProperties}
        >
          {eyebrow}
        </lib-eyebrow>
      )}

      {/* Swatches */}
      <div>
        {swatches.map((swatch, i) => (
          <ColorSwatch key={i} {...swatch} />
        ))}
      </div>

    </div>
  );
};


export default ColorPalette;