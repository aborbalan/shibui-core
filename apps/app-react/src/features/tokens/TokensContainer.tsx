import React from 'react';
import TokensSidebar from './components/TokensSidebar';
import ColorsSection from './components/ColorsSection';
import TypographySection from './components/TypographySection';
import SpacingSection from './components/SpacingSection';
import RadiusSection from './components/RadiusSection';
import ShadowsSection from './components/ShadowsSection';
import AnimationSection from './components/AnimationSection';
import ZIndexSection from './components/ZIndexSection';
import GlassSection from './components/GlassSection';
import SpotlightSection from './components/SpotlightSection';

export const TokensContainer: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 56px)',
        paddingTop: '56px',
      }}
    >
        <TokensSidebar />

        <main
          style={{
            flex: 1,
            padding: '3rem clamp(1.5rem, 4vw, 3.5rem) 6rem',
            maxWidth: '1080px',
          }}
        >
          <ColorsSection />
          <TypographySection />
          <SpacingSection />
          <RadiusSection />
          <ShadowsSection />
          <AnimationSection />
          <ZIndexSection />
          <GlassSection />
          <SpotlightSection />
        </main>
    </div>
  );
};

export default TokensContainer;
