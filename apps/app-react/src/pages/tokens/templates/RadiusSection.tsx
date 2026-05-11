import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const RadiusSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('radius');

  return (
    <TokenSection
      id="radio"
      eyebrow="radius"
      title={<>Border <em>radius</em></>}
      description="De none (0) a full (9999px). Los tokens lib- son los usados internamente por los componentes."
    >
      <DataStatus label="radius" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: RadiusGrid con cajas de demo */}
    </TokenSection>
  );
};

export default RadiusSection;
