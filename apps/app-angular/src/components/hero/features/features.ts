import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

/** Home · "Diseñado para el desarrollador moderno" — grid de 4 features en contexto celadon. */
@Component({
  selector: 'app-features',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="features" data-katachi="celadon">
      <div class="features__inner">
        <lib-display-heading
          tag="h2"
          size="md"
          surface="dark"
          centered
          line1="Diseñado para el"
          accent="desarrollador moderno"
          description="Una base técnica sólida para que te centres en la experiencia, no en la configuración."
        ></lib-display-heading>

        <lib-component-grid transparent class="features__grid">
          @for (f of features; track f.title) {
            <lib-card variant="solid">
              <span slot="tag"><lib-icon [attr.name]="f.icon" size="20"></lib-icon></span>
              <h3 slot="title">{{ f.title }}</h3>
              <p>{{ f.description }}</p>
            </lib-card>
          }
        </lib-component-grid>
      </div>
    </section>
  `,
  styles: [
    `
      .features {
        background: var(--color-washi-950);
      }
      .features__inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--lib-space-3xl, 4rem) var(--lib-space-xl, 2rem);
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-2xl, 3rem);
      }
      .features__grid {
        --cg-cols: repeat(auto-fit, minmax(240px, 1fr));
        --cg-gap: var(--lib-space-lg, 1.5rem);
      }
    `,
  ],
})
export class FeaturesComponent {
  readonly features: Feature[] = [
    {
      icon: 'globe',
      title: 'Agnóstico y Ligero',
      description:
        'Construido con Web Components nativos. Funciona en React, Vue, Svelte o HTML puro sin dependencias pesadas.',
    },
    {
      icon: 'shield',
      title: 'Accesibilidad Nativa',
      description:
        'Cumple con los estándares WCAG desde el núcleo. Gestión de foco, ARIA y navegación por teclado out-of-the-box.',
    },
    {
      icon: 'atom',
      title: 'Tokens de Autor',
      description:
        'Sistema basado en OKLCH para colores perceptualmente uniformes y una escala editorial japonesa.',
    },
    {
      icon: 'plugin',
      title: 'Composición Total',
      description:
        'Uso extensivo de Slots para que puedas insertar lo que quieras donde quieras sin romper el diseño.',
    },
  ];
}
