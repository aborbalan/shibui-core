import { LibButton } from '@shibui/ui/react';
import React from 'react';

export const AtomsSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={{ color: 'var(--color-washi-400)', borderBottom: '1px solid var(--color-washi-800)' }}>🟢 Atoms</h2>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
      <h4>Buttons</h4>
      <div style={{ display: 'flex', gap: 'var(--lib-space-sm)' }}>
        <LibButton variant="solid">Solid</LibButton>
        <LibButton variant="ghost">Ghost</LibButton>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
      <h4>Icons & Labels</h4>
      <div style={{ display: 'flex', gap: 'var(--lib-space-sm)', alignItems: 'center' }}>
        <lib-icon name="command" size="24"></lib-icon>
        <lib-label variant="success">Pro</lib-label>
        <lib-label>Default</lib-label>
      </div>
    </div>
  </section>
);