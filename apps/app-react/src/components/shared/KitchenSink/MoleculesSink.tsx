import { LibTabs } from '@shibui/ui/react';
import React from 'react';

export const MoleculesSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={{ color: 'var(--color-washi-400)', borderBottom: '1px solid var(--color-washi-800)' }}>🟡 Molecules</h2>
    
    <div style={{ maxWidth: '400px' }}>
      <h4>Inputs con Slots</h4>
      <lib-input label="Buscador avanzado" placeholder="Escribe para buscar...">
        <lib-icon slot="prefix" name="magnifying-glass" size="18"></lib-icon>
        <lib-button slot="suffix" variant="ghost" style={{ padding: 0 }}>
          <lib-icon name="arrow-right" size="18"></lib-icon>
        </lib-button>
      </lib-input>
    </div>

    <div style={{ maxWidth: '400px' }}>
      <h4>Tabs</h4>
        <LibTabs color="kaki" active="overview" variant="underline" items={[{ id: 'overview', label: 'Overview' },
          { id: 'code',     label: 'Código' },
          { id: 'docs',     label: 'Docs' },
          { id: 'issues',   label: 'Issues', disabled: true },]}>
        <div>
          <strong>Overview</strong> — Contenido del primer panel.
        </div>
        <div slot="code">
          &lt;lib-tabs variant="underline" active="code"&gt;&lt;/lib-tabs&gt;
        </div>
        <div slot="docs">
          Documentación — Navegación por teclado: ← → mueve entre tabs.
        </div>
        </LibTabs>
    </div>

    <div style={{ maxWidth: '400px' }}>
      <h4>Tabs</h4>

    </div>
  </section>
);