import { LibCard, LibComponentGrid } from '@shibui/ui/react';
import React from 'react';

interface CardItem {
  tag: string;
  title: string;
  titleAccent?: string;
  description: string;
  footer?: string;
  variant?: 'default' | 'inverse' | 'accent' | 'featured' | 'kintsugi';
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
    tag:          '✦ Kintsugi · Firma',
    title:        'La cicatriz',
    titleAccent:  'de oro',
    description:  'El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados, anillos cónicos y seams que convierten el borde en el elemento más bello del componente.',
    footer:       'Featured · 2 columnas',
  },
  {
    variant:     'kintsugi',
    tag:         '01–05 · Botones',
    title:       'Buttons',
    description: 'Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.',
    footer:      'Atom',
  },
  {
    variant:     'kintsugi',
    tag:         '28–29 · Formularios',
    title:       'Inputs',
    description: 'Text inputs, select, checkbox, radio, switch, pin code y rich text editor.',
    footer:      'Molecule',
  },
  {
    variant:     'kintsugi',
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
    <section style={{
      
      background: 'var(--color-washi-950, #120E0A)',
    }}>
      <LibComponentGrid>
        {cards.map((card, i) => (
          <LibCard
            key={i}
            variant={card.variant ?? 'kintsugi'}
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