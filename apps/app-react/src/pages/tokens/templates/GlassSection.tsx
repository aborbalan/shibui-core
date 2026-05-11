import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const GlassSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('glass');

  return (
    <TokenSection
      id="glass"
      eyebrow="glass"
      title={<>Efecto <em>glass</em></>}
      description="Variables que controlan blur, saturación, opacidad de fondo y borde del efecto glassmorphism."
    >
      <DataStatus label="glass" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: GlassTokenTable + GlassPreview con variantes default, water, kaki */}
    </TokenSection>
  );
};

export default GlassSection;
