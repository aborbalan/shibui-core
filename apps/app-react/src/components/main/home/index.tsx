// apps/app-react/src/pages/Home/index.tsx
import React from 'react';
import { Footer } from './Footer';
import HeroIntro from '../../layout/templates/HeroIntro';
import ShibuiHeader from '../../layout/Header';
import { LibBackground, LibDivider } from '@shibui/ui/react';
import HeroStats from '../components/hero-stats/HeroStats';
import ContentSection from '../components/hero-stats/ContentSection';
import CardsSection from '../components/hero-stats/CardsSection ';
import PhilosophySection from '../components/hero-stats/PhilosophySection';

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
        <main style={{ flex: 1, padding: '90px 60px' }}>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <HeroIntro
              onPrimary={() => document.querySelector('#componentes')?.scrollIntoView({ behavior: 'smooth' })}
              onGhost={() => document.querySelector('#filosofia')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>

          <LibDivider>sobre...</LibDivider>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <HeroStats></HeroStats>
          </div>
          <div>
            <ContentSection
              eyebrow="03 · Proyectos"
              headingLine1="Arquitectura que"
              headingLine2Prefix="perdura,"
              headingAccent="zero deps"
              description="Cada decisión técnica tiene un porqué."
              surface="dark"
            />
          </div>
          <div>
          <CardsSection></CardsSection>
          </div>
          <div>
          <PhilosophySection></PhilosophySection>
          </div>
        </main>
      </LibBackground>

      <Footer />
    </div>
  );
};