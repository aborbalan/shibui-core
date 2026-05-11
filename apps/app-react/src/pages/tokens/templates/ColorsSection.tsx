import React from 'react';
import { TokenSection } from './_TokenSection';

const ColorsSection: React.FC = () => (
  <TokenSection
    id="colores"
    eyebrow="color-primitive · color-semantic"
    title={<>Paletas & <em>semántica</em></>}
    description="Primitivos OKLCH (washi, kaki, celadon, ink) y alias semánticos de fondo, texto y borde con soporte dark mode."
  >
    {/* TODO: ColorPrimitiveGrid, SemanticGrid, StateSwatches */}
  </TokenSection>
);

export default ColorsSection;
