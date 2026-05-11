import React from 'react';
import { TokenSection } from './_TokenSection';

const GlassSection: React.FC = () => (
  <TokenSection
    id="glass"
    eyebrow="glass"
    title={<>Efecto <em>glass</em></>}
    description="Variables que controlan blur, saturación, opacidad de fondo y borde del efecto glassmorphism."
  >
    {/* TODO: GlassTokenTable + GlassPreview con variantes default, water, kaki */}
  </TokenSection>
);

export default GlassSection;
