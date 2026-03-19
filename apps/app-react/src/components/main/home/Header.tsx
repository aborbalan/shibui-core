import { LibTabs } from '@shibui/ui/react';
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      backgroundColor: 'rgba(10, 10, 10, 0.8)', // Fondo translúcido (usando oklch de tokens sería ideal)
      backdropFilter: 'blur(12px)', // Efecto cristal
      borderBottom: '1px solid var(--color-washi-800)',
      boxSizing: 'border-box'
    }}>
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
    </header>
  );
};