import React, { useState } from 'react';

export const ComponentsPage: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('lib-button');

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '280px 1fr', // Sidebar + Contenido
      height: 'calc(100vh - 64px)', // Restamos la altura del Header
      overflow: 'hidden' 
    }}>
      
      {/* 1. SIDEBAR DE COMPONENTES */}
      <aside style={{ 
        borderRight: '1px solid var(--color-washi-800)',
        padding: 'var(--lib-space-lg)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--lib-space-xl)'
      }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-washi-500)', textTransform: 'uppercase' }}>Atoms</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Button</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Icon</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Label</lib-button>
          </nav>
        </div>
        
        <div>
          <h3 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-washi-500)', textTransform: 'uppercase' }}>Molecules</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Input</lib-button>
          </nav>
        </div>
      </aside>

      {/* 2. AREA DE CONTENIDO PRINCIPAL */}
      <main style={{ 
        padding: 'var(--lib-space-2xl)', 
        overflowY: 'auto',
        backgroundColor: 'var(--color-washi-950)' // Fondo ligeramente más oscuro para resaltar el preview
      }}>
        <header style={{ marginBottom: 'var(--lib-space-2xl)' }}>
          <lib-label variant="outline">Atoms</lib-label>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginTop: 'var(--lib-space-sm)' }}>lib-button</h1>
          <p style={{ color: 'var(--color-washi-400)' }}>El componente base para todas las interacciones de click.</p>
        </header>

        {/* ÁREA DE PREVIEW (El "Altar") */}
        <section style={{ 
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--lib-radius-md)',
          border: '1px solid var(--color-washi-800)',
          padding: 'var(--lib-space-3xl)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          position: 'relative'
        }}>
          <lib-button variant="solid">Interactive Preview</lib-button>
        </section>

        {/* TABLA DE PROPS (Próximamente) */}
        <section style={{ marginTop: 'var(--lib-space-3xl)' }}>
          <h3>Properties</h3>
          {/* Aquí iría un componente lib-table que aún no hemos creado */}
        </section>
      </main>
    </div>
  );
};