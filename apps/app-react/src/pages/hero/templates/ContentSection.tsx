import { LibDisplayHeading, LibEyebrow } from '@shibui-ui/ui/react';
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
  dark:        { background: 'var(--color-washi-950)' },
  light:       { background: 'var(--color-white)' },
  washi:       { background: 'var(--color-washi-100)' },
  transparent: { background: 'none' },
};

type DisplaySurface = 'dark' | 'light' | 'washi';

function toDisplaySurface(s: NonNullable<ContentSectionProps['surface']>): DisplaySurface {
  return s === 'transparent' ? 'light' : s;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  eyebrow        = '66 · Componentes',
  headingLine1   = 'Todo lo que',
  headingLine2Prefix = 'necesitas,',
  headingAccent  = 'nada más',
  description    = 'Cada componente existe porque tiene un propósito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes estéticas: light, dark, kintsugi y glitch.',
  surface        = 'dark',
}) => {
  return (
    <section style={{ ...SURFACES[surface] }}>

      {/* Eyebrow */}
      <LibEyebrow
        surface={surface === 'dark' ? 'inverse' : 'default'}
        size="sm"
        style={{ marginBottom: 'var(--lib-space-md)', display: 'inline-flex' } as React.CSSProperties}
      >
        {eyebrow}
      </LibEyebrow>

      {/* Display heading — reemplaza el <h2> y <p> manuales */}
      <LibDisplayHeading
        tag="h2"
        size="md"
        surface={toDisplaySurface(surface)}
        line1={headingLine1}
        line2Prefix={headingLine2Prefix}
        accent={headingAccent}
        description={description}
      />

    </section>
  );
};

export default ContentSection;
