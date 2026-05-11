import React from 'react';
import { TokenSection } from './_TokenSection';

const ShadowsSection: React.FC = () => (
  <TokenSection
    id="sombras"
    eyebrow="shadow"
    title={<>Escala de <em>sombras</em></>}
    description="Cuatro niveles (sm → xl) basados en ink con opacidades variables para light y dark mode."
  >
    {/* TODO: ShadowGrid con cajas flotantes */}
  </TokenSection>
);

export default ShadowsSection;
