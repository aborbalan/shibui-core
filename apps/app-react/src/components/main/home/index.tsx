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
import CardsShowcase from '../components/hero-stats/CardsShowcase';
import TokensSection from '../components/hero-stats/TokensSection';

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
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <ContentSection
              eyebrow="03 · Proyectos"
              headingLine1="Arquitectura que"
              headingLine2Prefix="perdura,"
              headingAccent="zero deps"
              description="Cada decisión técnica tiene un porqué."
              surface="transparent"
            />
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <CardsSection></CardsSection>
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <PhilosophySection></PhilosophySection>
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <ContentSection
              eyebrow=" VARIANTES ESTETICAS"
              headingLine1="Un sistema"
              headingLine2Prefix=""
              headingAccent="seis pieles"
              description="Cada componente existe en múltiples superficies. La misma lógica, la misma API, seis expresiones visuales coherentes."
              surface="transparent"
            />
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
            <CardsShowcase />
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
          <ContentSection
              eyebrow=" DESIGN TOKENS"
              headingLine1="La gramática"
              headingLine2Prefix="del "
              headingAccent="sistema"
              description="Colores, tipografías y espaciado como variables CSS. Cambia un token, transforma todo el sistema."
              surface="transparent"
            />
          </div>
          <div style={{ flex: 1, paddingBottom: '30px' }}>
          <TokensSection></TokensSection>
          </div>
        </main>
      </LibBackground>

      <Footer />
    </div>
  );
};