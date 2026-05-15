import { LibBackground } from '@shibui-ui/ui/react';

export function ComponentsPage() {
  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
      <LibBackground variant="kaki-glow">
        <main style={{ padding: '4rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.6rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(250,247,244,0.25)',
            marginBottom: '1rem',
          }}>
            02 · Componentes
          </p>
          <h1 style={{
            fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 300,
            color: 'rgba(250,247,244,0.9)',
            lineHeight: 1.1,
          }}>
            Componentes
          </h1>
        </main>
      </LibBackground>
    </div>
  );
}
