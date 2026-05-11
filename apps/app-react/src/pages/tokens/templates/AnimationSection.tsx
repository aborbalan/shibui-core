import React from 'react';
import { TokenSection } from './_TokenSection';
import { DataStatus } from './_DataStatus';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const AnimationSection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('animation');

  return (
    <TokenSection
      id="motion"
      eyebrow="animation"
      title={<>Duración & <em>easing</em></>}
      description="Cuatro duraciones (fast → slower) y cuatro curvas de bezier para motion consistente."
    >
      <DataStatus label="animation" isPending={isPending} isError={isError} error={error} count={data?.length} />
      {/* TODO: DurationRows con dot animado, EasingRows con ball demo */}
    </TokenSection>
  );
};

export default AnimationSection;
