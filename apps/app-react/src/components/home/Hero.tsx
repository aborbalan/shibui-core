import React from 'react';

/**
 * Hero Component
 * @description El primer impacto visual de la web. 
 * Usa una estructura de flex-column centrada y tipografía fluida.
 */
export const Hero: React.FC = () => {
  return (
    <section style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: 'var(--lib-space-3xl) var(--lib-space-xl)',
      gap: 'var(--lib-space-lg)',
      // Añadimos un min-height para que el contenido respire
      minHeight: '60vh',
      justifyContent: 'center',
      // Sutil gradiente de fondo usando nuestros tokens
      background: 'radial-gradient(circle at center, var(--color-washi-900) 0%, var(--bg-base) 100%)'
    }}>
      
      {/* 1. BADGE DE VERSIÓN: Indica que el proyecto está vivo */}
      <lib-label variant="outline">v0.1.0 Alpha — Experimental</lib-label>

      {/* 2. TÍTULO: Usamos clamp para que el tamaño sea responsivo sin media queries */}
      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', 
        fontWeight: '800',
        maxWidth: '900px',
        lineHeight: '1',
        letterSpacing: '-0.02em',
        margin: 0,
        color: 'var(--color-washi-50)'
      }}>
        Interfaces que respiran <br />
        <span style={{ 
          color: 'var(--color-washi-500)',
          fontStyle: 'italic',
          fontWeight: '300'
        }}>belleza funcional.</span>
      </h1>

      {/* 3. SUBTÍTULO: Cuerpo de texto legible */}
      <p style={{ 
        maxWidth: '650px', 
        color: 'var(--color-washi-400)', 
        fontSize: 'var(--text-lg)',
        lineHeight: '1.6'
      }}>
        Shibui UI es una librería de Web Components agnósticos inspirada en la 
        estética japonesa. Ligera, accesible y preparada para el futuro.
      </p>

      {/* 4. ACCIONES (CTAs) */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--lib-space-md)', 
        marginTop: 'var(--lib-space-xl)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <lib-button variant="solid">
          Empieza ahora
          <lib-icon slot="suffix" name="arrow-right" size="18"></lib-icon>
        </lib-button>
        
        <lib-button variant="ghost">
          <lib-icon slot="prefix" name="github-logo" size="20"></lib-icon>
          Ver en GitHub
        </lib-button>
      </div>

    </section>
  );
};