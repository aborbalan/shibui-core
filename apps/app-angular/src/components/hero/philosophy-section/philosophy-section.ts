import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface PhilosophyPillar {
  kanji: string;
  label: string;
  description: string;
}

/** Home · teaser de filosofía — cita a la izquierda, tres pilares a la derecha. */
@Component({
  selector: 'app-philosophy-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="phi">
      <div class="phi__inner">
        <div class="phi__quote-col">
          <lib-eyebrow surface="inverse" size="sm" class="phi__eyebrow">Filosofía</lib-eyebrow>
          <div class="phi__quote">
            <span>Lo bello no se anuncia.</span>
            <em>Se descubre con pausa.</em>
          </div>
          <cite class="phi__cite">— Principio Shibui · 渋い</cite>
        </div>

        <div class="phi__pillars">
          @for (p of pillars; track p.kanji) {
            <div class="phi__pillar">
              <div class="phi__kanji">{{ p.kanji }}</div>
              <div>
                <p class="phi__label">{{ p.label }}</p>
                <p class="phi__desc">{{ p.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .phi {
        background: var(--color-washi-950);
        border-top: 1px solid color-mix(in oklch, var(--color-white), transparent 95%);
        border-bottom: 1px solid color-mix(in oklch, var(--color-white), transparent 95%);
        padding: clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem);
      }
      .phi__inner {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(3rem, 6vw, 5rem);
        align-items: center;
      }
      .phi__eyebrow {
        display: inline-flex;
        margin-bottom: 1.5rem;
      }
      .phi__quote {
        font-family: var(--lib-font-display, 'Cormorant Garamond', serif);
        font-size: clamp(1.6rem, 3vw, 2.8rem);
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.35;
        color: color-mix(in oklch, var(--color-washi-50), transparent 45%);
      }
      .phi__quote em {
        display: block;
        font-style: italic;
        color: var(--text-accent);
        margin-top: 0.25rem;
      }
      .phi__cite {
        display: block;
        font-style: normal;
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: color-mix(in oklch, var(--color-washi-50), transparent 82%);
        margin-top: 1.5rem;
      }
      .phi__pillars {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      .phi__pillar {
        display: flex;
        gap: 1.25rem;
        align-items: flex-start;
      }
      .phi__kanji {
        font-family: var(--lib-font-display, 'Cormorant Garamond', serif);
        font-size: 2rem;
        font-weight: 300;
        color: color-mix(in oklch, var(--text-accent), transparent 60%);
        line-height: 1;
        flex-shrink: 0;
        width: 2.5rem;
        text-align: center;
      }
      .phi__label {
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: color-mix(in oklch, var(--text-accent), transparent 45%);
        margin: 0 0 0.35rem;
      }
      .phi__desc {
        font-family: var(--lib-font-body, 'Shippori Mincho', serif);
        font-size: 0.82rem;
        color: color-mix(in oklch, var(--color-washi-50), transparent 75%);
        line-height: 1.8;
        margin: 0;
      }
      @media (max-width: 860px) {
        .phi__inner {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PhilosophySectionComponent {
  readonly pillars: PhilosophyPillar[] = [
    {
      kanji: '侘',
      label: 'Wabi · Imperfección',
      description:
        'La belleza en lo incompleto e impermanente. Los componentes abrazan el estado de transición como parte de la experiencia, no como error a corregir.',
    },
    {
      kanji: '金',
      label: 'Kintsugi · Cicatrices de oro',
      description:
        'Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente.',
    },
    {
      kanji: '間',
      label: 'Ma · El espacio',
      description:
        'El silencio entre notas. El espacio vacío no es ausencia — es presencia. Los tokens de espaciado están calibrados para crear respiración visual intencional.',
    },
  ];
}
