// apps/app-react/src/pages/KitchenSink/index.tsx
import React from 'react';
import { OrganismsSink } from './OrganismsSink';
import { AtomsSink } from './AtomSink';
import { MoleculesSink } from './MoleculesSink';

export const KitchenSink: React.FC = () => {
  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)',
      color: 'var(--color-washi-50)',
      padding: 'var(--lib-space-xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <header style={{ marginBottom: 'var(--lib-space-2xl)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '0.5rem' }}>Kitchen Sink</h1>
        <p style={{ color: 'var(--color-washi-400)' }}>Refactorizado por niveles de Atomic Design</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <AtomsSink />
        <MoleculesSink />
        <OrganismsSink />
      </main>
    </div>
  );
};