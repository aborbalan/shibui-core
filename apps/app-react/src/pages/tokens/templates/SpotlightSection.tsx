import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const SpotlightSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('spotlight');

  return (
    <TokenSection
      id="spotlight"
      eyebrow="spotlight"
      title={<>Efecto <em>spotlight</em></>}
      description="Gradiente radial dinámico que sigue el cursor. Controla opacidad, feather y variantes de color."
    >
      <DataStatus label="spotlight" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: SpotlightTokenTable + SpotlightPreview interactivo */}
    </TokenSection>
  );
};

export default SpotlightSection;
