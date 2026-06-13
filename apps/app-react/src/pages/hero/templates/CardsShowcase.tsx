import React from 'react';
import { LibCard, LibComponentGrid } from '@shibui-ui/ui/react';

/** Cada card demuestra un look del sistema: surface canónica o contexto katachi. */
interface VariantCard {
  look:        'inverse' | 'default' | 'kintsugi' | 'glitch' | 'celadon' | 'washi';
  kanji:       string;
  tag:         string;
  title:       string;
  description: string;
}

/** Looks estéticos → se activan por contexto data-katachi, no por prop. */
const KATACHI_BY_LOOK: Record<string, string | undefined> = {
  kintsugi: 'kintsugi',
  glitch:   'terminal',
};

interface CardsShowcaseProps {
  cards?: VariantCard[];
}

const DEFAULT_CARDS: VariantCard[] = [
  {
    look:        'inverse',
    kanji:       '渋',
    tag:         'Dark',
    title:       'Dark',
    description: 'Fondo washi-950. La base nocturna del sistema. Texto en rgba-blanco escalado por función.',
  },
  {
    look:        'default',
    kanji:       '白',
    tag:         'Light',
    title:       'Light',
    description: 'Fondo blanco o washi-50. Bordes en washi-200. Acento kaki para elementos interactivos.',
  },
  {
    look:        'kintsugi',
    kanji:       '金',
    tag:         'Kintsugi',
    title:       'Kintsugi',
    description: 'Seam animada kaki → gold. Anillo cónico rotante. Gradiente dorado en títulos y barras.',
  },
  {
    look:        'glitch',
    kanji:       '⌗',
    tag:         '⌗ Glitch',
    title:       'Glitch',
    description: 'Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.',
  },
  {
    look:        'celadon',
    kanji:       '青',
    tag:         'Celadón',
    title:       'Celadón',
    description: 'Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios de énfasis.',
  },
  {
    look:        'washi',
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
        {cards.map((card, i) => {
          /* La tarjeta Celadón estrena el efecto signature del katachi:
             spotlight-water (foco jade reactivo al cursor) bajo data-katachi="celadon". */
          if (card.look === 'celadon') {
            return (
              <div key={i} data-katachi="celadon">
                <lib-spotlight-card spotlight="water" style={{ display: 'block', height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-sm)' }}>
                    <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {card.kanji} · {card.tag}
                    </span>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{card.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{card.description}</p>
                  </div>
                </lib-spotlight-card>
              </div>
            );
          }
          /* Estéticas (kintsugi/glitch) → contexto katachi; superficies → prop surface. */
          const katachi = KATACHI_BY_LOOK[card.look];
          const inner = (
            <LibCard
              key={katachi ? undefined : i}
              surface={card.look === 'inverse' ? 'inverse' : 'default'}
              kanji={card.kanji}
              style={katachi ? { display: 'block', height: '100%' } : undefined}
            >
              <span slot="tag">{card.tag}</span>
              <h3 slot="title">{card.title}</h3>
              <p>{card.description}</p>
            </LibCard>
          );
          return katachi ? <div key={i} data-katachi={katachi}>{inner}</div> : inner;
        })}
      </LibComponentGrid>
    </section>
  );
};

export default CardsShowcase;