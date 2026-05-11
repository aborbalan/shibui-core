import React from 'react';
import { TokenSection } from './_TokenSection';

const SpacingSection: React.FC = () => (
  <TokenSection
    id="espaciado"
    eyebrow="spacing"
    title={<>Escala de <em>espaciado</em></>}
    description="Unidad base de 0.25 rem con escala multiplicativa: xs → xl."
  >
    {/* TODO: SpacingRows con barras visuales proporcionales */}
  </TokenSection>
);

export default SpacingSection;
