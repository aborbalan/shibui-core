import React from 'react';
import { LibCard, LibComponentGrid } from '@shibui-ui/ui/react';

interface VariantCard {
  variant:     'inverse' | 'default' | 'kintsugi' | 'glitch' | 'celadon' | 'washi';
  kanji:       string;
  tag:         string;
  title:       string;
  description: string;
}

interface CardsShowcaseProps {
  cards?: VariantCard[];
}

const DEFAULT_CARDS: VariantCard[] = [
  {
    variant:     'inverse',
    kanji:       '渋',
    tag:         'Dark',
    title:       'Dark',
    description: 'Fondo washi-950. La base nocturna del sistema. Texto en rgba-blanco escalado por función.',
  },
  {
    variant:     'default',
    kanji:       '白',
    tag:         'Light',
    title:       'Light',
    description: 'Fondo blanco o washi-50. Bordes en washi-200. Acento kaki para elementos interactivos.',
  },
  {
    variant:     'kintsugi',
    kanji:       '金',
    tag:         'Kintsugi',
    title:       'Kintsugi',
    description: 'Seam animada kaki → gold. Anillo cónico rotante. Gradiente dorado en títulos y barras.',
  },
  {
    variant:     'glitch',
    kanji:       '⌗',
    tag:         '⌗ Glitch',
    title:       'Glitch',
    description: 'Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.',
  },
  {
    variant:     'celadon',
    kanji:       '青',
    tag:         'Celadón',
    title:       'Celadón',
    description: 'Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios de énfasis.',
  },
  {
    variant:     'washi',
    kanji:       '和',
    tag:         'Washi',
    title:       'Washi',
    description: 'Paleta neutral cálida. 11 pasos desde washi-50 hasta washi-950. El alma cromática del sistema.',
  },
];

export const CardsShowcase: React.FC<CardsShowcaseProps> = ({
  cards = DEFAULT_CARDS,
}) => {
  return (
    <section style={{ background: 'var(--color-washi-950, #120E0A)' }}>
      <LibComponentGrid style={{ '--cg-cols': 'repeat(3, 1fr)' } as React.CSSProperties}>
        {cards.map((card, i) => (
          <LibCard
            key={i}
            variant={card.variant}
            kanji={card.kanji}
          >
            <span slot="tag">{card.tag}</span>
            <h3 slot="title">{card.title}</h3>
            <p>{card.description}</p>
          </LibCard>
        ))}
      </LibComponentGrid>
    </section>
  );
};

export default CardsShowcase;