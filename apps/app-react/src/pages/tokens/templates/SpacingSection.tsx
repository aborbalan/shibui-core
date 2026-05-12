import React from 'react';
import { TokenSection } from './_TokenSection';
import { LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

function extractPx(desc: string): number {
  const m = desc.match(/(\d+)px/);
  return m ? parseInt(m[1]) : 0;
}

const SpacingSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('spacing');

  const maxPx = 32;

  return (
    <TokenSection
      id="espaciado"
      eyebrow="spacing"
      title={<>Escala de <em>espaciado</em></>}
      description="Unidad base de 0.25 rem con escala multiplicativa: xs → xl."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && data.map(t => {
        const px = extractPx(t.description);
        const barWidth = px > 0 ? Math.max((px / maxPx) * 180, 4) : 4;
        return (
          <div
            key={t.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '190px 220px 1fr',
              gap: '1rem',
              alignItems: 'center',
              padding: '0.65rem 0',
              borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 25%, transparent)',
            }}
          >
            <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--color-kaki-300)' }}>
              {t.cssVar}
            </code>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  height: '18px',
                  width: `${barWidth}px`,
                  background: 'var(--color-kaki-500)',
                  opacity: 0.65,
                  borderRadius: '1px',
                  flexShrink: 0,
                }}
              />
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.63rem', color: 'var(--text-secondary)', opacity: 0.7, whiteSpace: 'nowrap' }}>
                {px > 0 ? `${px}px` : t.value}
              </code>
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

export default SpacingSection;
