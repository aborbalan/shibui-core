import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      width: '100%',
      backgroundColor: 'var(--bg-base)',
      borderTop: '1px solid var(--color-washi-800)',
      padding: 'var(--lib-space-2xl) var(--lib-space-xl)',
      marginTop: 'var(--lib-space-3xl)',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--lib-space-xl)'
      }}>
        
        {/* COLUMNA 1: BRANDING */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lib-space-sm)' }}>
            <lib-icon name="stack" size="24" style={{ color: 'var(--color-washi-400)' }}></lib-icon>
            <span style={{ fontWeight: '700', fontSize: 'var(--text-lg)', letterSpacing: '-0.02em' }}>
              Shibui <span style={{ color: 'var(--color-washi-500)' }}>UI</span>
            </span>
          </div>
          <p style={{ color: 'var(--color-washi-400)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
            Construyendo un futuro donde la web es ligera, accesible y estéticamente equilibrada.
          </p>
        </div>

        {/* COLUMNA 2: LIBRERÍA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }}>Librería</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }}>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>Componentes</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>Guía de Estilo</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>Tokens</lib-button>
          </nav>
        </div>

        {/* COLUMNA 3: RECURSOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }}>Ecosistema</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }}>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>GitHub</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>NPM Package</lib-button>
            <lib-button variant="ghost" style={{ justifyContent: 'flex-start', padding: '0' }}>Ejemplos</lib-button>
          </nav>
        </div>

        {/* COLUMNA 4: SOCIAL / CONTACTO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }}>Comunidad</h4>
          <div style={{ display: 'flex', gap: 'var(--lib-space-sm)' }}>
            <lib-button variant="outline" style={{ padding: 'var(--lib-space-xs)' }}>
              <lib-icon name="twitter-logo" size="20"></lib-icon>
            </lib-button>
            <lib-button variant="outline" style={{ padding: 'var(--lib-space-xs)' }}>
              <lib-icon name="discord-logo" size="20"></lib-icon>
            </lib-button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: 'var(--lib-space-2xl) auto 0', 
        paddingTop: 'var(--lib-space-lg)',
        borderTop: '1px solid var(--color-washi-900)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--lib-space-md)',
        color: 'var(--color-washi-600)',
        fontSize: 'var(--text-xs)'
      }}>
        <span>© {currentYear} Shibui Studio. Bajo licencia MIT.</span>
        <div style={{ display: 'flex', gap: 'var(--lib-space-md)' }}>
          <span>Privacidad</span>
          <span>Términos</span>
        </div>
      </div>
    </footer>
  );
};