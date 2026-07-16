import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface CardItem {
  tag: string;
  title: string;
  titleAccent?: string;
  description: string;
  footer?: string;
  variant?: 'solid' | 'featured';
  featured?: boolean;
}

/** Home · grid editorial de familias de componentes, con una card destacada. Contexto celadon. */
@Component({
  selector: 'app-cards-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="cards" data-katachi="celadon">
      <lib-component-grid transparent class="cards__grid">
        @for (card of cards; track card.title) {
          <lib-card
            [attr.variant]="card.variant ?? 'solid'"
            [style.grid-column]="card.featured ? 'span 2' : null"
          >
            <span slot="tag">{{ card.tag }}</span>
            <h3 slot="title">
              {{ card.title }}
              @if (card.titleAccent) {
                <br /><em>{{ card.titleAccent }}</em>
              }
            </h3>
            <p>{{ card.description }}</p>
            @if (card.footer) {
              <span slot="footer">{{ card.footer }}</span>
            }
          </lib-card>
        }
      </lib-component-grid>
    </section>
  `,
  styles: [
    `
      .cards {
        background: var(--color-washi-950);
      }
      .cards__grid {
        --cg-gap: 0;
      }
    `,
  ],
})
export class CardsSectionComponent {
  readonly cards: CardItem[] = [
    {
      variant: 'featured',
      featured: true,
      tag: '青 Celadón · Firma',
      title: 'La glasura',
      titleAccent: 'de jade',
      description:
        'La cerámica celadon coreana (青磁): una glasura jade honda y serena sobre la que la luz, el agua y el craquelé del esmalte cobran protagonismo. En Shibui, la variante celadon tiñe la superficie de jade frío, proyecta una sombra jade ambiental y ofrece diez decoraciones cerámicas —craquelé, marea, niebla, reflejo— activadas por contexto.',
      footer: 'Featured · 2 columnas',
    },
    {
      variant: 'solid',
      tag: '01–05 · Botones',
      title: 'Buttons',
      description:
        'Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.',
      footer: 'Atom',
    },
    {
      variant: 'solid',
      tag: '28–29 · Formularios',
      title: 'Inputs',
      description:
        'Text inputs, select, checkbox, radio, switch, pin code y rich text editor.',
      footer: 'Molecule',
    },
    {
      variant: 'solid',
      tag: '53 · 65 · 66 · Layout',
      title: 'Nav',
      description:
        'Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.',
      footer: 'Organism',
    },
  ];
}
