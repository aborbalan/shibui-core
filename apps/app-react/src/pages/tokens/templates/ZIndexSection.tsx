import React from 'react';
import { TokenSection } from './_TokenSection';

const ZIndexSection: React.FC = () => (
  <TokenSection
    id="z-index"
    eyebrow="z-index"
    title={<>Capas de <em>apilamiento</em></>}
    description="Seis niveles desde base (0) hasta tooltip (400) para gestionar la pila de renderizado."
  >
    {/* TODO: ZIndexStackDiagram con barras proporcionales a su z-value */}
  </TokenSection>
);

export default ZIndexSection;
