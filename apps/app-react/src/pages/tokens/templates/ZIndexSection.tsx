import React from 'react';
import { TokenSection } from './_TokenSection';
import { LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const MAX_Z = 400;

const ZIndexSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('z-index');

  return (
    <TokenSection
      id="z-index"
      eyebrow="z-index"
      title={<>Capas de <em>apilamiento</em></>}
      description="Seis niveles desde base (0) hasta tooltip (400) para gestionar la pila de renderizado."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && data.map(t => {
        const zVal = parseInt(t.value) || 0;
        const barPct = (zVal / MAX_Z) * 100;
        return (
          <div
            key={t.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 52px 180px 1fr',
              gap: '1rem',
              alignItems: 'center',
              padding: '0.65rem 0',
              borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 25%, transparent)',
            }}
          >
            <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--color-kaki-300)' }}>
              {t.cssVar}
            </code>
            <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
              {t.value}
            </code>
            <div
              style={{
                height: '6px',
                background: 'color-mix(in oklch, var(--color-washi-700) 30%, transparent)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(barPct, 1)}%`,
                  background: `color-mix(in oklch, var(--color-kaki-500) ${30 + barPct * 0.7}%, var(--color-kaki-300))`,
                  borderRadius: '2px',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--lib-font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t.description}
            </span>
          </div>
        );
      })}
    </TokenSection>
  );
};

export default ZIndexSection;
