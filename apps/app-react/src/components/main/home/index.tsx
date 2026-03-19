// apps/app-react/src/pages/Home/index.tsx
import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { Footer } from './Footer';

export const HomePage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)' 
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};