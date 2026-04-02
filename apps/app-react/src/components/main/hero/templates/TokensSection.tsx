import React from 'react';
import { PALETTE_WASHI } from '../../../../data/constants/colors';
import ColorPalette from '../../../shared/templates/ColorPalette';

/* ── Tipos ── */
interface SpacingItem {
  name:  string;
  value: string;
  width: string; /* CSS width de la barra */
}

interface EasingItem {
  name:  string;
  color: string;
  curve: string; /* cubic-bezier */
}

interface TokensSectionProps {
  /* Columna 1 — Color */
  paletteEyebrow?: string;

  /* Columna 2 — Tipografía */
  displaySample?: string;
  displayAccent?: string;
  bodySample?:    string;
  monoSample?:    string;

  /* Columna 3 — Espaciado */
  spacingItems?:  SpacingItem[];
  easingItems?:   EasingItem[];
}

/* ── Defaults ── */
const DEFAULT_SPACING: SpacingItem[] = [
  { name: 'SP-1 · 0.25rem', value: '0.25rem', width: '4px'  },
  { name: 'SP-2 · 0.5rem',  value: '0.5rem',  width: '8px'  },
  { name: 'SP-4 · 1rem',    value: '1rem',     width: '16px' },
  { name: 'SP-6 · 1.5rem',  value: '1.5rem',   width: '24px' },
  { name: 'SP-8 · 2rem',    value: '2rem',     width: '32px' },
  { name: 'SP-12 · 3rem',   value: '3rem',     width: '48px' },
  { name: 'SP-16 · 4rem',   value: '4rem',     width: '64px' },
  { name: 'SP-24 · 6rem',   value: '6rem',     width: '96px' },
];

const DEFAULT_EASING: EasingItem[] = [
  { name: 'ease-out',    color: '#B85A1E', curve: 'cubic-bezier(0,0,0.2,1)' },
  { name: 'ease-bounce', color: '#4E9482', curve: 'cubic-bezier(0.34,1.4,0.64,1)' },
];

/* ── Helpers de estilo compartidos ── */
const LABEL_MONO: React.CSSProperties = {
  fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
  fontSize:      '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color:         'rgba(184,90,30,0.5)',
  marginBottom:  '0.75rem',
  display:       'block',
};

const DIVIDER: React.CSSProperties = {
  borderTop:    '1px solid rgba(255,255,255,0.07)',
  margin:       '1.25rem 0',
};

/* ══════════════════════════════════════════
   Columna 2 — Tipografía
   ══════════════════════════════════════════ */
const TypographyColumn: React.FC<{
  displaySample: string;
  displayAccent: string;
  bodySample:    string;
  monoSample:    string;
}> = ({ displaySample, displayAccent, bodySample, monoSample }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

    {/* Display */}
    <span style={LABEL_MONO}>Display · Cormorant Garamond</span>
    <p style={{
      fontFamily:    'var(--lib-font-display, "Cormorant Garamond", serif)',
      fontSize:      'clamp(1.6rem, 3vw, 2.2rem)',
      fontWeight:    300,
      letterSpacing: '-0.02em',
      lineHeight:    1.2,
      color:         'rgba(250,247,244,0.55)',
      margin:        '0 0 1.25rem 0',
    }}>
      {displaySample}{' '}
      <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400, #D97234)' }}>
        {displayAccent}
      </em>
    </p>

    <div style={DIVIDER} />

    {/* Body */}
    <span style={LABEL_MONO}>Body · Shippori Mincho</span>
    <p style={{
      fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
      fontSize:   '0.9375rem',
      color:      'rgba(250,247,244,0.4)',
      lineHeight: 1.8,
      margin:     '0 0 1.25rem 0',
    }}>
      {bodySample}
    </p>

    <div style={DIVIDER} />

    {/* Mono */}
    <span style={LABEL_MONO}>Mono · DM Mono</span>
    <p style={{
      fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
      fontSize:      '0.8125rem',
      letterSpacing: '0.08em',
      color:         'rgba(250,247,244,0.35)',
      margin:        '0 0 1.25rem 0',
    }}>
      {monoSample}
    </p>

    <div style={DIVIDER} />

    {/* Tamaños */}
    <span style={LABEL_MONO}>Tamaños</span>
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
      {(['xs', 'sm', 'base', 'xl', '3xl'] as const).map((size, i) => {
        const sizes = ['0.6875rem', '0.8125rem', '0.9375rem', '1.5rem', '2.75rem'];
        return (
          <span key={size} style={{
            fontFamily:    i < 3
              ? 'var(--lib-font-mono, "DM Mono", monospace)'
              : 'var(--lib-font-display, "Cormorant Garamond", serif)',
            fontSize:      sizes[i],
            fontWeight:    300,
            color:         `rgba(250,247,244,${0.15 + i * 0.08})`,
            letterSpacing: i < 3 ? '0.1em' : '-0.02em',
          }}>
            {size}
          </span>
        );
      })}
    </div>

  </div>
);

/* ══════════════════════════════════════════
   Columna 3 — Espaciado + Easing
   ══════════════════════════════════════════ */
const SpacingColumn: React.FC<{
  spacingItems: SpacingItem[];
  easingItems:  EasingItem[];
}> = ({ spacingItems, easingItems }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

    {/* Espaciado */}
    <span style={LABEL_MONO}>Espaciado · Scale</span>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
      {spacingItems.map(item => (
        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Barra */}
          <div style={{
            width:      item.width,
            height:     '5px',
            background: 'rgba(184,90,30,0.35)',
            flexShrink: 0,
          }} />
          {/* Label */}
          <span style={{
            fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize:      '0.6rem',
            letterSpacing: '0.14em',
            color:         'rgba(250,247,244,0.25)',
            textTransform: 'uppercase' as const,
          }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>

    <div style={DIVIDER} />

    {/* Easing */}
    <span style={LABEL_MONO}>Easing</span>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {easingItems.map(item => (
        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Barra animada */}
          <div style={{
            width:    '64px',
            height:   '5px',
            background: `rgba(${item.color === '#B85A1E' ? '184,90,30' : '78,148,130'},0.2)`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <div style={{
              position:   'absolute',
              inset:      0,
              background: item.color,
              transform:  'scaleX(0)',
              transformOrigin: 'left',
              animation:  `ease-bar-${item.name} 2s ${item.curve} infinite`,
            }} />
          </div>
          {/* Label */}
          <span style={{
            fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize:      '0.6rem',
            letterSpacing: '0.14em',
            color:         'rgba(250,247,244,0.25)',
            textTransform: 'uppercase' as const,
          }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>

    {/* Keyframes para las barras de easing */}
    <style>{`
      @keyframes ease-bar-ease-out {
        0%   { transform: scaleX(0); }
        60%  { transform: scaleX(1); }
        100% { transform: scaleX(1); }
      }
      @keyframes ease-bar-ease-bounce {
        0%   { transform: scaleX(0); }
        60%  { transform: scaleX(1.05); }
        80%  { transform: scaleX(0.97); }
        100% { transform: scaleX(1); }
      }
    `}</style>

  </div>
);

/* ══════════════════════════════════════════
   Componente principal
   ══════════════════════════════════════════ */
export const TokensSection: React.FC<TokensSectionProps> = ({
  paletteEyebrow = PALETTE_WASHI.eyebrow,
  displaySample  = 'La belleza',
  displayAccent  = 'austera',
  bodySample     = 'Sistema de diseño basado en principios japoneses de austeridad y precisión.',
  monoSample     = 'COMPONENT · 66 · v0.1.0',
  spacingItems   = DEFAULT_SPACING,
  easingItems    = DEFAULT_EASING,
}) => {
  return (
    <section style={{
      background:  'var(--color-washi-950, #120E0A)',
      padding:     'clamp(3rem,6vh,5rem) clamp(1.5rem,5vw,3rem)',
      borderTop:   '1px solid rgba(255,255,255,0.05)',
      borderBottom:'1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        maxWidth:             '1200px',
        margin:               '0 auto',
        display:              'grid',
        gridTemplateColumns:  '1fr 1fr 1fr',
        gap:                  '1px',
        background:           'rgba(255,255,255,0.05)',
      }}>

        {/* ── Col 1: Color ── */}
        <div style={{ background: 'var(--color-washi-950, #120E0A)', padding: '1.5rem 1.75rem' }}>
          <ColorPalette
            eyebrow={paletteEyebrow}
            swatches={PALETTE_WASHI.swatches}
          />
        </div>
        {/* ── Col 2: Tipografía ── */}
        <div style={{ background: 'var(--color-washi-950, #120E0A)', padding: '1.5rem 1.75rem' }}>
          <TypographyColumn
            displaySample={displaySample}
            displayAccent={displayAccent}
            bodySample={bodySample}
            monoSample={monoSample}
          />
        </div>

        {/* ── Col 3: Espaciado ── */}
        <div style={{ background: 'var(--color-washi-950, #120E0A)', padding: '1.5rem 1.75rem' }}>
          <SpacingColumn
            spacingItems={spacingItems}
            easingItems={easingItems}
          />
        </div>

      </div>
    </section>
  );
};

export default TokensSection;