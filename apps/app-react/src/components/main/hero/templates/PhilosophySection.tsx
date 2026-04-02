import React from 'react';

interface PhilosophyPillar {
  kanji: string;
  label: string;
  description: string;
}

interface PhilosophySectionProps {
  eyebrow?: string;
  quote?: string;
  quoteAccent?: string;
  cite?: string;
  pillars?: PhilosophyPillar[];
}

const DEFAULT_PILLARS: PhilosophyPillar[] = [
  {
    kanji:       '侘',
    label:       'Wabi · Imperfección',
    description: 'La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia, no como error a corregir.',
  },
  {
    kanji:       '金',
    label:       'Kintsugi · Cicatrices de oro',
    description: 'Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente.',
  },
  {
    kanji:       '間',
    label:       'Ma · El espacio',
    description: 'El silencio entre notas. El espacio vacío no es ausencia — es presencia. Los tokens de espaciado están calibrados para crear respiración visual intencional.',
  },
];

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  eyebrow    = 'Filosofía',
  quote      = 'Lo bello no se anuncia.',
  quoteAccent = 'Se descubre con pausa.',
  cite       = '— Principio Shibui · 渋い',
  pillars    = DEFAULT_PILLARS,
}) => {
  return (
    <section style={{
      background:  'var(--color-washi-950, #120E0A)',
      borderTop:   '1px solid rgba(255,255,255,.05)',
      borderBottom:'1px solid rgba(255,255,255,.05)',
      padding:     'clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
    }}>
      <div style={{
        maxWidth:             '1200px',
        margin:               '0 auto',
        display:              'grid',
        gridTemplateColumns:  '1fr 1fr',
        gap:                  'clamp(3rem, 6vw, 5rem)',
        alignItems:           'center',
      }}>

        {/* ── Columna izquierda: cita ── */}
        <div>
          {/* Eyebrow */}
          <lib-eyebrow
            color="dark"
            size="sm"
            style={{ marginBottom: '1.5rem', display: 'inline-flex' } as React.CSSProperties}
          >
            {eyebrow}
          </lib-eyebrow>

          {/* Quote display */}
          <div style={{
            fontFamily:    'var(--lib-font-display, "Cormorant Garamond", serif)',
            fontSize:      'clamp(1.6rem, 3vw, 2.8rem)',
            fontWeight:    300,
            letterSpacing: '-0.02em',
            lineHeight:    1.35,
            color:         'rgba(250, 247, 244, 0.55)',
          }}>
            <span>{quote}</span>
            <em style={{
              display:    'block',
              fontStyle:  'italic',
              color:      'var(--color-kaki-400, #D97234)',
              marginTop:  '0.25rem',
            }}>
              {quoteAccent}
            </em>
          </div>

          {/* Cite */}
          <cite style={{
            display:       'block',
            fontStyle:     'normal',
            fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize:      '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color:         'rgba(250, 247, 244, 0.18)',
            marginTop:     '1.5rem',
          }}>
            {cite}
          </cite>
        </div>

        {/* ── Columna derecha: pilares ── */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '2rem',
        }}>
          {pillars.map((pillar, i) => (
            <div key={i} style={{
              display: 'flex',
              gap:     '1.25rem',
              alignItems: 'flex-start',
            }}>
              {/* Kanji */}
              <div style={{
                fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
                fontSize:   '2rem',
                fontWeight: 300,
                color:      'rgba(184, 90, 30, 0.35)',
                lineHeight: 1,
                flexShrink: 0,
                width:      '2.5rem',
                textAlign:  'center' as const,
              }}>
                {pillar.kanji}
              </div>

              {/* Body */}
              <div>
                <p style={{
                  fontFamily:    'var(--lib-font-mono, "DM Mono", monospace)',
                  fontSize:      '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color:         'rgba(184, 90, 30, 0.5)',
                  marginBottom:  '0.35rem',
                }}>
                  {pillar.label}
                </p>
                <p style={{
                  fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
                  fontSize:   '0.82rem',
                  color:      'rgba(250, 247, 244, 0.25)',
                  lineHeight: 1.8,
                  margin:     0,
                }}>
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PhilosophySection;