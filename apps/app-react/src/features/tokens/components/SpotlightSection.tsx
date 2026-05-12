import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const CONTROL_NAMES = new Set([
  'lib-spotlight-opacity', 'lib-spotlight-feather',
  'lib-spotlight-x', 'lib-spotlight-y', 'lib-spotlight-transition',
]);

const SPOTLIGHT_PREVIEWS = [
  { label: 'kaki',  gradient: 'radial-gradient(circle at 50% 50%, oklch(45% 0.05 45deg / 0.55) 0%, oklch(45% 0.05 45deg / 0) 60%)' },
  { label: 'water', gradient: 'radial-gradient(circle at 50% 50%, oklch(55% 0.06 210deg / 0.55) 0%, oklch(55% 0.06 210deg / 0) 60%)' },
  { label: 'white', gradient: 'radial-gradient(circle at 50% 50%, oklch(100% 0 0deg / 0.35) 0%, oklch(100% 0 0deg / 0) 60%)' },
] as const;

const SpotlightSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('spotlight');

  const controls  = data?.filter(t => CONTROL_NAMES.has(t.name)) ?? [];
  const gradients = data?.filter(t => t.name.startsWith('lib-spotlight-gradient')) ?? [];
  const texture   = data?.filter(t => t.name.startsWith('lib-metal') || t.name === 'lib-kintsugi-border') ?? [];

  return (
    <TokenSection
      id="spotlight"
      eyebrow="spotlight"
      title={<>Efecto <em>spotlight</em></>}
      description="Gradiente radial dinámico que sigue el cursor. Controla opacidad, feather y variantes de color."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && (
        <>
          {/* Gradient previews */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {SPOTLIGHT_PREVIEWS.map(({ label, gradient }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  height: '80px',
                  background: `${gradient}, color-mix(in oklch, var(--color-washi-900) 80%, transparent)`,
                  borderRadius: '4px',
                  border: '1px solid color-mix(in oklch, var(--color-washi-700) 30%, transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.5rem 0.6rem',
                }}
              >
                <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <SubHeader label="Controles" first />
          {controls.map(t => <TokenRow key={t.id} token={t} />)}

          <SubHeader label="Gradientes" />
          {gradients.map(t => <TokenRow key={t.id} token={t} />)}

          <SubHeader label="Textura & borde" />
          {texture.map(t => <TokenRow key={t.id} token={t} />)}
        </>
      )}
    </TokenSection>
  );
};

export default SpotlightSection;
