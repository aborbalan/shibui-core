import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const TypographySection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('typography');

  return (
    <TokenSection
      id="tipografia"
      eyebrow="typography"
      title={<>Escala <em>tipográfica</em></>}
      description="Familias (display, body, mono), escala de tamaños, pesos, tracking y leading."
    >
      <DataStatus label="typography" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: FontFamilyCards, SizeScale, WeightRows, TrackingRows, LeadingCards */}
    </TokenSection>
  );
};

export default TypographySection;
