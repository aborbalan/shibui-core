import { LibEyebrow } from '@shibui/ui/react';
import React from 'react';

interface ContentSectionProps {
  /** Texto del eyebrow (ej: "66 · Componentes") */
  eyebrow?: string;
  /** Primera línea del heading */
  headingLine1?: string;
  /** Segunda línea antes del acento itálico */
  headingLine2Prefix?: string;
  /** Texto en itálica con acento kaki */
  headingAccent?: string;
  /** Párrafo de descripción */
  description?: string;
  /** Superficie: 'dark' | 'light' | 'washi' */
  surface?: 'dark' | 'light' | 'washi' | 'transparent';
}

const SURFACES: Record<NonNullable<ContentSectionProps['surface']>, React.CSSProperties> = {
  dark:  { background: 'var(--color-washi-950, #120E0A)' },
  light: { background: '#ffffff' },
  washi: { background: 'var(--color-washi-100, #F2EDE6)' },
  transparent: {background: 'none'}
};

const HEADING_COLOR: Record<NonNullable<ContentSectionProps['surface']>, string> = {
  dark:  'rgba(250, 247, 244, 0.65)',
  light: 'var(--color-washi-800, #3D332A)',
  washi: 'var(--color-washi-800, #3D332A)',
  transparent: 'var(--color-washi-800, #3D332A)',

};

const DESC_COLOR: Record<NonNullable<ContentSectionProps['surface']>, string> = {
  dark:  'rgba(250, 247, 244, 0.28)',
  light: 'var(--color-washi-500, #9A8878)',
  washi: 'var(--color-washi-600, #7A6A5C)',
  transparent: 'var(--color-washi-800, #3D332A)',

};

export const ContentSection: React.FC<ContentSectionProps> = ({
  eyebrow        = '66 · Componentes',
  headingLine1   = 'Todo lo que',
  headingLine2Prefix = 'necesitas,',
  headingAccent  = 'nada más',
  description    = 'Cada componente existe porque tiene un propósito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes estéticas: light, dark, kintsugi y glitch.',
  surface        = 'dark',
}) => {
  const headingColor = HEADING_COLOR[surface];
  const descColor    = DESC_COLOR[surface];

  return (
    <section style={{ ...SURFACES[surface]}}>

      {/* Eyebrow */}
      <LibEyebrow
        color={surface === 'dark' ? 'dark' : 'kaki'}
        size="sm"
        style={{ marginBottom: 'var(--lib-space-md, 1rem)', display: 'inline-flex' } as React.CSSProperties}
      >
        {eyebrow}
      </LibEyebrow>
      {/* Display heading */}
      <h2 style={{
        fontFamily:    'var(--lib-font-display, "Cormorant Garamond", Georgia, serif)',
        fontSize:      'clamp(2.2rem, 5vw, 3.5rem)',
        fontWeight:    300,
        letterSpacing: '-0.02em',
        lineHeight:    1.15,
        color:         headingColor,
        margin:        '0 0 var(--lib-space-lg, 1.5rem) 0',
        maxWidth:      '640px',
      }}>
        {headingLine1}
        <br />
        {headingLine2Prefix}{' '}
        <em style={{
          fontStyle: 'italic',
          color:     'var(--color-kaki-400, #D97234)',
        }}>
          {headingAccent}
        </em>
      </h2>

      {/* Description */}
      {description && (
        <p style={{
          fontFamily:  'var(--lib-font-body, "Shippori Mincho", serif)',
          fontSize:    'var(--text-sm, 0.8125rem)',
          color:       descColor,
          lineHeight:  1.9,
          maxWidth:    '520px',
          margin:      0,
        }}>
          {description}
        </p>
      )}

    </section>
  );
};

export default ContentSection;