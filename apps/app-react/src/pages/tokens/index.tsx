import React from 'react';
import { LibBackground } from '@shibui-ui/ui/react';

import TokensSidebar from './templates/TokensSidebar';
import TokensHero from './templates/ComponentsIntro';
import ColorsSection from './templates/ColorsSection';
import TypographySection from './templates/TypographySection';
import SpacingSection from './templates/SpacingSection';
import RadiusSection from './templates/RadiusSection';
import ShadowsSection from './templates/ShadowsSection';
import AnimationSection from './templates/AnimationSection';
import ZIndexSection from './templates/ZIndexSection';
import GlassSection from './templates/GlassSection';
import SpotlightSection from './templates/SpotlightSection';

export const TokensPage: React.FC = () => {
  return (
    <LibBackground variant="midnight">
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
          {/* ── Intro ─────────────────────────────────────────────── */}
          <TokensHero surface="dark" />

          {/* ── Secciones por categoría ───────────────────────────── */}
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
    </LibBackground>
  );
};

export default TokensPage;
