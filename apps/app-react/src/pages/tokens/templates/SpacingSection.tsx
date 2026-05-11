import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const SpacingSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('spacing');

  return (
    <TokenSection
      id="espaciado"
      eyebrow="spacing"
      title={<>Escala de <em>espaciado</em></>}
      description="Unidad base de 0.25 rem con escala multiplicativa: xs → xl."
    >
      <DataStatus label="spacing" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: SpacingRows con barras visuales proporcionales */}
    </TokenSection>
  );
};

export default SpacingSection;
