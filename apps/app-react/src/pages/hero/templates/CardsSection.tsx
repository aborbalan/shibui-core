import { LibCard, LibComponentGrid } from '@shibui-ui/ui/react';
import React from 'react';

interface CardItem {
  tag: string;
  title: string;
  titleAccent?: string;
  description: string;
  footer?: string;
  variant?: 'solid' | 'featured';
  /** Cuando es featured, ocupa 2 columnas */
  featured?: boolean;
}

interface CardsSectionProps {
  cards?: CardItem[];
}

const DEFAULT_CARDS: CardItem[] = [
  {
    variant:      'featured',
    featured:     true,
    tag:          '青 Celadón · Firma',
    title:        'La glasura',
    titleAccent:  'de jade',
    description:  'La cerámica celadon coreana (青磁): una glasura jade honda y serena sobre la que la luz, el agua y el craquelé del esmalte cobran protagonismo. En Shibui, la variante celadon tiñe la superficie de jade frío, proyecta una sombra jade ambiental y ofrece diez decoraciones cerámicas —craquelé, marea, niebla, reflejo— activadas por contexto.',
    footer:       'Featured · 2 columnas',
  },
  {
    variant:     'solid',
    tag:         '01–05 · Botones',
    title:       'Buttons',
    description: 'Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.',
    footer:      'Atom',
  },
  {
    variant:     'solid',
    tag:         '28–29 · Formularios',
    title:       'Inputs',
    description: 'Text inputs, select, checkbox, radio, switch, pin code y rich text editor.',
    footer:      'Molecule',
  },
  {
    variant:     'solid',
    tag:         '53 · 65 · 66 · Layout',
    title:       'Nav',
    description: 'Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.',
    footer:      'Organism',
  },
];

export const CardsSection: React.FC<CardsSectionProps> = ({
  cards = DEFAULT_CARDS,
}) => {
  return (
    /* Sección celadon: el tema jade + la sombra jade ambiental se activan por
       contexto (data-katachi), no por prop. Las cards adaptan automáticamente. */
    <section
      data-katachi="celadon"
      style={{
        background: 'var(--color-washi-950, #120E0A)',
      }}
    >
      <LibComponentGrid transparent style={{ '--cg-gap': '0' } as React.CSSProperties}>
        {cards.map((card, i) => (
          <LibCard
            key={i}
            variant={card.variant ?? 'solid'}
            style={card.featured ? { gridColumn: 'span 2' } : undefined}
          >
            <span slot="tag">{card.tag}</span>

            <h3 slot="title">
              {card.title}
              {card.titleAccent && (
                <>
                  <br />
                  <em>{card.titleAccent}</em>
                </>
              )}
            </h3>

            <p>{card.description}</p>

            {card.footer && (
              <span slot="footer">{card.footer}</span>
            )}
          </LibCard>
        ))}
      </LibComponentGrid>
    </section>
  );
};

export default CardsSection;