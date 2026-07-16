import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface VariantCard {
  kanji: string;
  tag: string;
  title: string;
  description: string;
}

/** Home · "seis pieles" — grid 3×2 con las identidades del sistema. Contexto celadon. */
@Component({
  selector: 'app-cards-showcase',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="showcase" data-katachi="celadon">
      <lib-component-grid transparent class="showcase__grid">
        @for (card of cards; track card.title) {
          <lib-card variant="solid" [attr.kanji]="card.kanji">
            <span slot="tag">{{ card.tag }}</span>
            <h3 slot="title">{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </lib-card>
        }
      </lib-component-grid>
    </section>
  `,
  styles: [
    `
      .showcase {
        background: var(--color-washi-950);
      }
      .showcase__grid {
        --cg-cols: repeat(3, 1fr);
        --cg-gap: 0;
      }
      @media (max-width: 860px) {
        .showcase__grid {
          --cg-cols: 1fr;
        }
      }
    `,
  ],
})
export class CardsShowcaseComponent {
  readonly cards: VariantCard[] = [
    { kanji: '渋', tag: 'Dark', title: 'Dark', description: 'Fondo washi-950. La base nocturna del sistema. Texto en rgba-blanco escalado por función.' },
    { kanji: '白', tag: 'Light', title: 'Light', description: 'Fondo blanco o washi-50. Bordes en washi-200. Acento kaki para elementos interactivos.' },
    { kanji: '金', tag: 'Kintsugi', title: 'Kintsugi', description: 'Seam animada kaki → gold. Anillo cónico rotante. Gradiente dorado en títulos y barras.' },
    { kanji: '⌗', tag: 'Glitch', title: 'Glitch', description: 'Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.' },
    { kanji: '青', tag: 'Celadón', title: 'Celadón', description: 'Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios de énfasis.' },
    { kanji: '和', tag: 'Washi', title: 'Washi', description: 'Paleta neutral cálida. 11 pasos desde washi-50 hasta washi-950. El alma cromática del sistema.' },
  ];
}
