import React from 'react';
import { LibButton, LibButtonGroup } from '@shibui-ui/ui/react';

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

const EASE    = 'cubic-bezier(0,0,0.2,1)';
const STYLE_ID = 'hero-intro-keyframes';

function useHeroKeyframes(): void {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
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
      <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>
        66 componentes.
      </strong>{' '}
      Sin dependencias externas. CSS puro y vanilla JS bajo principios
      estéticos japoneses —{' '}
      <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>wabi-sabi</strong>,{' '}
      <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>kintsugi</strong>{' '}
      y{' '}
      <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>ma</strong>.
      {' '}Donde cada elemento justifica su presencia.
    </>
  );

  return (
    <div>

      {/* Eyebrow */}
      <div style={{
        fontFamily:    'var(--lib-font-mono)',
        fontSize:      'var(--text-xs)',
        letterSpacing: 'var(--tracking-widest)',
        textTransform: 'uppercase',
        color:         'color-mix(in oklch, var(--text-accent), transparent 45%)',
        marginBottom:  'var(--lib-space-2xl)',
        display:       'flex',
        alignItems:    'center',
        gap:           'var(--lib-space-md)',
        opacity:       0,
        animation:     `fadeUp 0.8s 0.1s ${EASE} forwards`,
      }}>
        <span style={{
          width:      32,
          height:     1,
          background: 'linear-gradient(90deg, transparent, var(--text-accent))',
          display:    'block',
          flexShrink: 0,
        }} />
        {eyebrow}
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily:    'var(--lib-font-display)',
        fontSize:      'var(--text-5xl)',
        fontWeight:    'var(--weight-light)' as React.CSSProperties['fontWeight'],
        lineHeight:    'var(--leading-tight)',
        letterSpacing: 'var(--tracking-tight)',
        color:         'var(--text-primary)',
        margin:        '0 0 var(--lib-space-lg) 0',
        opacity:       0,
        animation:     `fadeUp 0.9s 0.2s ${EASE} forwards`,
      }}>
        {titleLine1}<br />{titleLine2}{' '}
        <em style={{
          fontStyle: 'italic',
          color:     'var(--text-accent)',
          display:   'block',
        }}>
          {titleEm}
        </em>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily:   'var(--lib-font-body)',
        fontSize:     'var(--text-sm)',
        color:        'var(--text-secondary)',
        lineHeight:   'var(--leading-relaxed)',
        maxWidth:     520,
        margin:       '0 0 var(--lib-space-2xl) 0',
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
          variant="solid"
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
