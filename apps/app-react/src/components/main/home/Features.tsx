import React from 'react';

const FEATURE_DATA = [
  {
    icon: ' lightning',
    title: 'Agnóstico y Ligero',
    description: 'Construido con Web Components nativos. Funciona en React, Vue, Svelte o HTML puro sin dependencias pesadas.'
  },
  {
    icon: 'shield-check',
    title: 'Accesibilidad Nativa',
    description: 'Cumple con los estándares WCAG desde el núcleo. Gestión de foco, ARIA y navegación por teclado out-of-the-box.'
  },
  {
    icon: 'palette',
    title: 'Tokens de Autor',
    description: 'Sistema basado en OKLCH para colores perceptualmente uniformes y una escala editorial japonesa.'
  },
  {
    icon: 'intersect',
    title: 'Composición Total',
    description: 'Uso extensivo de Slots para que puedas insertar lo que quieras donde quieras sin romper el diseño.'
  }
];

export const Features: React.FC = () => {
  return (
    <section style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: 'var(--lib-space-3xl) var(--lib-space-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--lib-space-2xl)'
    }}>
      
      {/* CABECERA DE SECCIÓN */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', marginBottom: 'var(--lib-space-md)' }}>
          Diseñado para el <span style={{ color: 'var(--color-washi-500)' }}>desarrollador moderno</span>
        </h2>
        <p style={{ color: 'var(--color-washi-400)' }}>
          Una base técnica sólida para que te centres en la experiencia, no en la configuración.
        </p>
      </div>

      {/* GRID DE CARDS */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--lib-space-lg)'
      }}>
        {FEATURE_DATA.map((feature, index) => (
          <div 
            key={index}
            style={{ 
              backgroundColor: 'var(--bg-surface)',
              padding: 'var(--lib-space-xl)',
              borderRadius: 'var(--lib-radius-md, 8px)',
              border: '1px solid var(--color-washi-800)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--lib-space-md)'
            }}
            // Efecto sutil de hover (puedes moverlo a un CSS module luego)
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-washi-600)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-washi-800)'}
          >
            <div style={{ 
              backgroundColor: 'var(--color-washi-900)', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 'var(--lib-radius-sm, 4px)',
              color: 'var(--color-washi-400)'
            }}>
              <lib-icon name={feature.icon} size="24"></lib-icon>
            </div>
            
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: '600', margin: 0 }}>
              {feature.title}
            </h3>
            
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--color-washi-400)', 
              lineHeight: '1.6',
              margin: 0 
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};