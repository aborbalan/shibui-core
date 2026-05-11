import React from 'react';
import { TokenSection } from './_TokenSection';

const SpotlightSection: React.FC = () => (
  <TokenSection
    id="spotlight"
    eyebrow="spotlight"
    title={<>Efecto <em>spotlight</em></>}
    description="Gradiente radial dinámico que sigue el cursor. Controla opacidad, feather y variantes de color."
  >
    {/* TODO: SpotlightTokenTable + SpotlightPreview interactivo */}
  </TokenSection>
);

export default SpotlightSection;
