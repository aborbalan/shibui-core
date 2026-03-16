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
      padding: 'var(--lib-space-md) var(--lib-space-xl)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* LOGO */}
        <div 
          onClick={() => window.location.href = '/'}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--lib-space-sm)', 
            cursor: 'pointer' 
          }}
        >
          <lib-icon name="stack" size="28" style={{ color: 'var(--color-washi-400)' }}></lib-icon>
          <span style={{ 
            fontWeight: '800', 
            fontSize: 'var(--text-lg)', 
            letterSpacing: '-0.04em',
            color: 'var(--color-washi-50)' 
          }}>
            SHIBUI <span style={{ color: 'var(--color-washi-600)', fontWeight: '300' }}>UI</span>
          </span>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--lib-space-sm)' 
        }}>
          <lib-button variant="ghost" onClick={() => console.log('Nav to /components')}>
            Components
          </lib-button>
          <lib-button variant="ghost" onClick={() => console.log('Nav to /docs')}>
            Docs
          </lib-button>
          <lib-button variant="ghost" onClick={() => console.log('Nav to /blog')}>
            Blog
          </lib-button>
          <lib-button variant="ghost" onClick={() => console.log('Nav to /about-me')}>
            About me
          </lib-button>
          
          {/* DIVIDER VISUAL */}
          <div style={{ 
            width: '1px', 
            height: '20px', 
            backgroundColor: 'var(--color-washi-800)', 
            margin: '0 var(--lib-space-xs)' 
          }}></div>

          <lib-button variant="outline" size="sm">
            <lib-icon slot="prefix" name="github-logo" size="18"></lib-icon>
            v0.1.0
          </lib-button>
        </nav>
      </div>
    </header>
  );
};