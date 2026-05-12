import React from 'react';
import { LibBackground, LibDivider } from '@shibui-ui/ui/react';

import PhilosophyHero from './templates/PhilosophyHero';
import PillarsSection from './templates/PillarsSection';
import PrinciplesSection from './templates/PrinciplesSection';

export const FilosofiaPage: React.FC = () => {
  return (
    <LibBackground variant="ash-grid">
      <div style={{ paddingTop: 'calc(80px + clamp(2rem, 5vh, 4rem))' }}>

        <PhilosophyHero />

        <LibDivider style-variant="hairline" style={{ margin: '0' } as React.CSSProperties} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(1.5rem, 5vw, 5rem)',
        }}>
          <PillarsSection />

          <LibDivider style-variant="hairline" style={{ margin: '0' } as React.CSSProperties} />

          <PrinciplesSection />
        </div>

      </div>
    </LibBackground>
  );
};

export default FilosofiaPage;
