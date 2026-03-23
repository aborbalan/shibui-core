// apps/app-react/src/pages/Home/index.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import HeroIntro from '../../layout/templates/HeroIntro';

export const HomePage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        <HeroIntro
          onPrimary={() => document.querySelector('#componentes')?.scrollIntoView({ behavior: 'smooth' })}
          onGhost={() => document.querySelector('#filosofia')?.scrollIntoView({ behavior: 'smooth' })}
        />
        {/**<ShibuiHeroPage />
        {/** <Features /> */}
      </main>
      <Footer />
    </div>
  );
};