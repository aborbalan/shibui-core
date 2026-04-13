import React from 'react';

export const OrganismsSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={{ color: 'var(--color-washi-400)', borderBottom: '1px solid var(--color-washi-800)' }}>🔴 Organisms</h2>
    
    <div style={{ height: '300px', border: '1px dashed var(--color-washi-700)', position: 'relative' }}>
       {/* Aquí iría el lib-sidebar una vez lo tengamos registrado */}
       <p style={{ padding: 'var(--lib-space-md)' }}>Contenedor para componentes de estructura (Sidebar, Navs, etc.)</p>
    </div>
  </section>
);