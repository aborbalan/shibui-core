import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const ZIndexSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('z-index');

  return (
    <TokenSection
      id="z-index"
      eyebrow="z-index"
      title={<>Capas de <em>apilamiento</em></>}
      description="Seis niveles desde base (0) hasta tooltip (400) para gestionar la pila de renderizado."
    >
      <DataStatus label="z-index" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: ZIndexStackDiagram con barras proporcionales a su z-value */}
    </TokenSection>
  );
};

export default ZIndexSection;
