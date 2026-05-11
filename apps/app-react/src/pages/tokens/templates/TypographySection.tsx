import React from 'react';
import { TokenSection } from './_TokenSection';

const TypographySection: React.FC = () => (
  <TokenSection
    id="tipografia"
    eyebrow="typography"
    title={<>Escala <em>tipográfica</em></>}
    description="Familias (display, body, mono), escala de tamaños, pesos, tracking y leading."
  >
    {/* TODO: FontFamilyCards, SizeScale, WeightRows, TrackingRows, LeadingCards */}
  </TokenSection>
);

export default TypographySection;
