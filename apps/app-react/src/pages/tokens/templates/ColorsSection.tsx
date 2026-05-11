import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const ColorsSection: React.FC = () => {
  const primitives = useTokensByCategory('color-primitive');
  const semantic = useTokensByCategory('color-semantic');

  return (
    <TokenSection
      id="colores"
      eyebrow="color-primitive · color-semantic"
      title={<>Paletas & <em>semántica</em></>}
      description="Primitivos OKLCH (washi, kaki, celadon, ink) y alias semánticos de fondo, texto y borde con soporte dark mode."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <DataStatus label="color-primitive" isPending={primitives.isPending} isError={primitives.isError} error={primitives.error} count={primitives.data?.length} />
        <DataStatus label="color-semantic" isPending={semantic.isPending} isError={semantic.isError} error={semantic.error} count={semantic.data?.length} />
      </div>
      {/* TODO: ColorPrimitiveGrid, SemanticGrid, StateSwatches */}
    </TokenSection>
  );
};

export default ColorsSection;
