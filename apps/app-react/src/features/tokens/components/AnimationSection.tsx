import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const KEYFRAMES = `
@keyframes tk-slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(72px); }
}
`;

const AnimationSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('animation');

  const durations = data?.filter(t => t.name.startsWith('duration-')) ?? [];
  const easings   = data?.filter(t => t.name.startsWith('ease-')) ?? [];

  return (
    <TokenSection
      id="motion"
      eyebrow="animation"
      title={<>Duración & <em>easing</em></>}
      description="Cuatro duraciones (fast → slower) y cuatro curvas de bezier para motion consistente."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && (
        <>
          <style>{KEYFRAMES}</style>

          <SubHeader label="Duraciones" first />
          {durations.map(t => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 2fr',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 25%, transparent)',
              }}
            >
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--color-kaki-300)' }}>
                {t.cssVar}
              </code>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '80px', height: '8px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-kaki-400)',
                      animation: `tk-slide ${t.value} cubic-bezier(0.4,0,0.2,1) infinite`,
                    }}
                  />
                </div>
                <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                  {t.value}
                </code>
              </div>
              <span style={{ fontFamily: 'var(--lib-font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t.description}
              </span>
            </div>
          ))}

          <SubHeader label="Curvas de easing" />
          {easings.map(t => <TokenRow key={t.id} token={t} />)}
        </>
      )}
    </TokenSection>
  );
};

export default AnimationSection;
