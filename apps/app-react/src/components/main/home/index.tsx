// apps/app-react/src/pages/Home/index.tsx
import React from 'react';
import { Footer } from './Footer';
import HeroIntro from '../../layout/templates/HeroIntro';
import ShibuiHeader from '../../layout/Header';
import { LibBackground, LibDivider } from '@shibui/ui/react';
import HeroStats from '../components/hero-stats/HeroStats';

export const HomePage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <ShibuiHeader
        onNavLink={(id) => document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })}
      />
      <LibBackground variant="ash-grid">
      <main style={{ flex: 1,padding: '90px 60px' }}>
        <div style={{ flex: 1,paddingBottom:'30px' }}>
        <HeroIntro
          onPrimary={() => document.querySelector('#componentes')?.scrollIntoView({ behavior: 'smooth' })}
          onGhost={() => document.querySelector('#filosofia')?.scrollIntoView({ behavior: 'smooth' })}
        />
        </div>

      <LibDivider>sobre...</LibDivider>
      <div>
      <HeroStats></HeroStats>
      </div>
      </main>
      </LibBackground>

      <Footer />
    </div>
  );
};