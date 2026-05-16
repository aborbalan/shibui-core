import { useState } from 'react';
import { AtomsSink } from './AtomSink';
import { MoleculesSink } from './MoleculesSink';
import { OrganismsSink } from './OrganismsSink';
import { KatachiSwitcher } from './KatachiSwitcher';
import type { KatachiId } from './catalog';

export const KitchenSink: React.FC = () => {
  const [katachi, setKatachi] = useState<KatachiId | ''>('');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <KatachiSwitcher value={katachi} onChange={setKatachi} />

      <div
        {...(katachi ? { 'data-katachi': katachi } : {})}
        style={{
          padding: 'var(--lib-space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--lib-space-2xl)',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>Kitchen Sink</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            78 componentes <code>lib-*</code> bajo contexto Katachi{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{katachi || 'none'}</strong>.
            Cambia el switcher arriba para reevaluar la propagación.
          </p>
        </header>

        <AtomsSink />
        <MoleculesSink />
        <OrganismsSink />
      </div>
    </div>
  );
};
