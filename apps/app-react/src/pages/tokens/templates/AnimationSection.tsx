import React from 'react';
import { TokenSection } from './_TokenSection';

const AnimationSection: React.FC = () => (
  <TokenSection
    id="motion"
    eyebrow="animation"
    title={<>Duración & <em>easing</em></>}
    description="Cuatro duraciones (fast → slower) y cuatro curvas de bezier para motion consistente."
  >
    {/* TODO: DurationRows con dot animado, EasingRows con ball demo */}
  </TokenSection>
);

export default AnimationSection;
