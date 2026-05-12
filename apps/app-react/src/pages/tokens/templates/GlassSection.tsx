import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const CONTROL_NAMES = new Set([
  'lib-glass-blur-amount', 'lib-glass-saturate-amount', 'lib-glass-bg-opacity',
  'lib-glass-border-opacity', 'lib-glass-shadow-opacity', 'lib-glass-shine-start', 'lib-glass-shine-end',
]);
const COMPOSITE_NAMES = new Set([
  'lib-glass-bg', 'lib-glass-bg-water', 'lib-glass-bg-kaki', 'lib-glass-filter',
  'lib-glass-border', 'lib-glass-shadow', 'lib-glass-shadow-hover', 'lib-glass-shine',
  'lib-glass-text', 'lib-glass-text-shadow',
]);

const GLASS_VARIANTS = [
  { label: 'default', bg: 'oklch(98% 0.01 60deg / 0.15)' },
  { label: 'water',   bg: 'oklch(55% 0.06 210deg / 0.15)' },
  { label: 'kaki',    bg: 'oklch(45% 0.05 45deg / 0.15)' },
] as const;

const GlassSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('glass');

  const controls   = data?.filter(t => CONTROL_NAMES.has(t.name)) ?? [];
  const composites = data?.filter(t => COMPOSITE_NAMES.has(t.name)) ?? [];
  const presets    = data?.filter(t => !CONTROL_NAMES.has(t.name) && !COMPOSITE_NAMES.has(t.name)) ?? [];

  return (
    <TokenSection
      id="glass"
      eyebrow="glass"
      title={<>Efecto <em>glass</em></>}
      description="Variables que controlan blur, saturación, opacidad de fondo y borde del efecto glassmorphism."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && (
        <>
          {/* Preview */}
          <div
            style={{
              position: 'relative',
              height: '110px',
              background: 'linear-gradient(135deg, var(--color-celadon-400), var(--color-kaki-400) 50%, var(--color-celadon-600))',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', background: 'var(--color-kaki-300)', top: '-20px', left: '8%', filter: 'blur(24px)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-celadon-300)', bottom: '-15px', right: '15%', filter: 'blur(18px)', opacity: 0.45 }} />
            {GLASS_VARIANTS.map(({ label, bg }, i) => (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  top: '18%',
                  left: `${12 + i * 29}%`,
                  width: '23%',
                  height: '64%',
                  backdropFilter: 'blur(12px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(120%)',
                  background: bg,
                  border: '1px solid oklch(100% 0 0deg / 0.20)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '0.35rem',
                }}
              >
                <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.55rem', color: 'oklch(95% 0 0deg / 0.8)', letterSpacing: '0.1em' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <SubHeader label="Controles primitivos" first />
          {controls.map(t => <TokenRow key={t.id} token={t} />)}

          <SubHeader label="Tokens compuestos" />
          {composites.map(t => <TokenRow key={t.id} token={t} />)}

          <SubHeader label="Presets de intensidad" />
          {presets.map(t => <TokenRow key={t.id} token={t} />)}
        </>
      )}
    </TokenSection>
  );
};

export default GlassSection;
