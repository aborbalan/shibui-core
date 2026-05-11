import React from 'react';
import { TokenSection } from './_TokenSection';

const RadiusSection: React.FC = () => (
  <TokenSection
    id="radio"
    eyebrow="radius"
    title={<>Border <em>radius</em></>}
    description="De none (0) a full (9999px). Los tokens lib- son los usados internamente por los componentes."
  >
    {/* TODO: RadiusGrid con cajas de demo */}
  </TokenSection>
);

export default RadiusSection;
