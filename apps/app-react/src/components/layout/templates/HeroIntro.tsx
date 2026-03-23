import React, { useEffect } from 'react';
import { LibButton, LibButtonGroup } from '@shibui/ui/react';

interface HeroIntroProps {
  eyebrow?:      string;
  titleLine1?:   string;
  titleLine2?:   string;
  titleEm?:      string;
  subtitle?:     React.ReactNode;
  primaryLabel?: string;
  onPrimary?:    () => void;
  ghostLabel?:   string;
  onGhost?:      () => void;
}

// ─── Tokens que viven en :host de Lit y no llegan al DOM global ───────────────
const TOKENS: React.CSSProperties = {
  ['--lib-font-display' as string]: '"Cormorant Garamond", Georgia, serif',
  ['--lib-font-mono'    as string]: '"DM Mono", "Courier New", monospace',
  ['--lib-font-body'    as string]: '"Shippori Mincho", "Times New Roman", serif',
  ['--color-kaki-400'   as string]: 'oklch(61.85% 0.149 48.72deg)',
  ['--color-kaki-500'   as string]: 'oklch(51.65% 0.134 46.13deg)',
};

const EASE    = 'cubic-bezier(0,0,0.2,1)';
const STYLE_ID = 'hero-intro-keyframes';

// ─── Inyecta @keyframes + fuentes una sola vez en <head> ─────────────────────
function useHeroKeyframes(): void {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&family=Shippori+Mincho:wght@400;600&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  eyebrow      = 'Design System · v1.0.0 · Zaragoza',
  titleLine1   = 'La belleza',
  titleLine2   = 'de lo',
  titleEm      = 'austero',
  subtitle,
  primaryLabel = 'Ver componentes',
  onPrimary,
  ghostLabel   = 'Leer filosofía',
  onGhost,
}) => {
  useHeroKeyframes();

  const defaultSubtitle: React.ReactNode = (
    <>
      <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>
        66 componentes.
      </strong>{' '}
      Sin dependencias externas. CSS puro y vanilla JS bajo principios
      estéticos japoneses —{' '}
      <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>wabi-sabi</strong>,{' '}
      <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>kintsugi</strong>{' '}
      y{' '}
      <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>ma</strong>.
      {' '}Donde cada elemento justifica su presencia.
    </>
  );

  return (
    // El div raíz expone los tokens como CSS custom properties al árbol descendente
    <div style={{ ...TOKENS }}>

      {/* Eyebrow */}
      <div style={{
        fontFamily:    'var(--lib-font-mono)',
        fontSize:      '0.68rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color:         'rgba(184,90,30,0.55)',
        marginBottom:  '1.5rem',
        display:       'flex',
        alignItems:    'center',
        gap:           '0.75rem',
        opacity:       0,
        animation:     `fadeUp 0.8s 0.1s ${EASE} forwards`,
      }}>
        <span style={{
          width:      32,
          height:     1,
          background: 'linear-gradient(90deg, transparent, var(--color-kaki-400))',
          display:    'block',
          flexShrink: 0,
        }} />
        {eyebrow}
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily:    'var(--lib-font-display)',
        fontSize:      'clamp(3.5rem, 9vw, 9rem)',
        fontWeight:    300,
        lineHeight:    1.0,
        letterSpacing: '-0.03em',
        color:         'rgba(250,247,244,0.72)',
        margin:        '0 0 1.25rem 0',
        opacity:       0,
        animation:     `fadeUp 0.9s 0.2s ${EASE} forwards`,
      }}>
        {titleLine1}<br />{titleLine2}{' '}
        <em style={{
          fontStyle: 'italic',
          color:     'var(--color-kaki-400)',
          display:   'block',
        }}>
          {titleEm}
        </em>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily:   'var(--lib-font-body)',
        fontSize:     'clamp(0.85rem, 1.5vw, 1.05rem)',
        color:        'rgba(250,247,244,0.3)',
        lineHeight:   1.9,
        maxWidth:     520,
        margin:       '0 0 2.5rem 0',
        opacity:      0,
        animation:    `fadeUp 0.9s 0.35s ${EASE} forwards`,
      }}>
        {subtitle ?? defaultSubtitle}
      </p>

      {/* Actions */}
      <LibButtonGroup
        dark
        style={{
          opacity:   0,
          animation: `fadeUp 0.9s 0.45s ${EASE} forwards`,
        }}
      >
        <LibButton
          variant="primary"
          size="lg"
          onUiLibClick={onPrimary}
        >
          <svg
            slot="prefix"
            viewBox="0 0 16 16"
            style={{
              width:         14,
              height:        14,
              stroke:        'currentColor',
              fill:          'none',
              strokeWidth:   1.8,
              strokeLinecap: 'round' as const,
            }}
          >
            <rect x="1" y="1" width="6" height="6" />
            <rect x="9" y="1" width="6" height="6" />
            <rect x="1" y="9" width="6" height="6" />
            <rect x="9" y="9" width="6" height="6" />
          </svg>
          {primaryLabel}
        </LibButton>

        <LibButton
          variant="ghost"
          size="lg"
          onUiLibClick={onGhost}
        >
          {ghostLabel}
        </LibButton>
      </LibButtonGroup>

    </div>
  );
};

export default HeroIntro;