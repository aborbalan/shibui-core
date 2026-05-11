import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
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
      <DataStatus label="shadow" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: ShadowGrid con cajas flotantes */}
    </TokenSection>
  );
};

export default ShadowsSection;
