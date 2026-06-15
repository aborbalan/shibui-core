import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const RadiusSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('radius');

  const baseRadii = data?.filter(t => t.name.startsWith('radius-')) ?? [];
  const libRadii  = data?.filter(t => t.name.startsWith('lib-radius-')) ?? [];

  return (
    <TokenSection
      id="radio"
      eyebrow="radius"
      title={<>Border <em>radius</em></>}
      description="De none (0) a full (9999px). Los tokens lib- son los usados internamente por los componentes."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && (
        <>
          <SubHeader label="Escala de radio" first />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            {baseRadii.map(t => (
              <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '80px',
                    height: '56px',
                    background: 'color-mix(in oklch, var(--text-accent) 25%, transparent)',
                    border: '1.5px solid color-mix(in oklch, var(--text-accent) 35%, transparent)',
                    borderRadius: t.value,
                  }}
                />
                <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.62rem', color: 'var(--text-accent)' }}>
                  {t.name.replace('radius-', '')}
                </code>
                <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                  {t.value}
                </code>
              </div>
            ))}
          </div>

          <SubHeader label="Tokens de componentes (lib)" />
          {libRadii.map(t => (
            <TokenRow
              key={t.id}
              token={t}
              preview={
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    background: 'color-mix(in oklch, var(--text-accent) 25%, transparent)',
                    border: '1.5px solid color-mix(in oklch, var(--text-accent) 35%, transparent)',
                    borderRadius: t.value,
                  }}
                />
              }
            />
          ))}
        </>
      )}
    </TokenSection>
  );
};

export default RadiusSection;
