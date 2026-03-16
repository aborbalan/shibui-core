// apps/app-react/src/components/layout/Layout.tsx
import React from 'react';

interface LayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Layout Genérico de la Aplicación
 * @description Estructura base con Sidebar opcional y área de contenido scrollable.
 */
export const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div style={{
      display: 'grid',
      // Si hay sidebar, 280px. si no, 1fr (ocupa todo).
      gridTemplateColumns: sidebar ? '280px 1fr' : '1fr',
      height: 'calc(100vh - 64px)', // Restamos la altura del Header global
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-base)'
    }}>
      
      {/* SIDEBAR CONDICIONAL */}
      {sidebar && (
        <aside style={{
          borderRight: '1px solid var(--color-washi-800)',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-base)',
          zIndex: 10
        }}>
          {sidebar}
        </aside>
      )}

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main style={{
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Contenedor de ancho máximo para lectura (Editorial) */}
        <div style={{
          width: '100%',
          maxWidth: '1200px', // Un poco más ancho para permitir grids de docs
          padding: 'var(--lib-space-2xl) var(--lib-space-xl)',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};