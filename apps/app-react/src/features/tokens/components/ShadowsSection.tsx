import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const ShadowsSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('shadow');

  return (
    <TokenSection
      id="sombras"
      eyebrow="shadow"
      title={<>Escala de <em>sombras</em></>}
      description="Cuatro niveles (sm → xl) basados en ink con opacidades variables para light y dark mode."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && data.map(t => (
        <TokenRow
          key={t.id}
          token={t}
          preview={
            <div
              style={{
                width: '44px',
                height: '44px',
                flexShrink: 0,
                background: 'oklch(88% 0.006 72deg)',
                borderRadius: '2px',
                boxShadow: t.value,
              }}
            />
          }
        />
      ))}
    </TokenSection>
  );
};

export default ShadowsSection;
