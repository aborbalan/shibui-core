import { html, TemplateResult } from 'lit';
import type { StoryObj } from '@storybook/web-components-vite';

/* ============================================================
   KATACHI STORIES HELPER
   ────────────────────────────────────────────────────────────
   Genera las 6 historias katachi estándar para cualquier
   componente. Uso mínimo:

     import { createKatachiStories } from '../../../stories/katachi-stories.helper';

     export const {
       KatachiShizen, KatachiWabi, KatachiKintsugi,
       KatachiCeladon, KatachiSabi, KatachiTerminal,
     } = createKatachiStories(() => html`
       <mi-componente variant="primary">Primary</mi-componente>
       <mi-componente variant="secondary">Secondary</mi-componente>
     `);

   El renderContent recibe el id del katachi activo por si el
   componente necesita adaptar su contenido por contexto.
   ============================================================ */

/** Identificadores válidos de katachi */
export type KatachiId =
  | 'shizen'
  | 'wabi'
  | 'kintsugi'
  | 'celadon'
  | 'sabi'
  | 'terminal';

/** Metadatos de cada contexto katachi */
export interface KatachiMeta {
  readonly id: KatachiId;
  readonly kanji: string;
  readonly label: string;
  /** Nombre de la historia en el sidebar de Storybook */
  readonly storyName: string;
  /** Fondo de Storybook ('paper' | 'dark') */
  readonly background: 'paper' | 'dark';
}

/** Los seis contextos katachi definidos en el sistema */
export const KATACHI_META: readonly KatachiMeta[] = [
  {
    id:        'shizen',
    kanji:     '自',
    label:     'shizen · 自然',
    storyName: 'Katachi · Shizen 自 · estándar',
    background: 'paper',
  },
  {
    id:        'wabi',
    kanji:     '侘',
    label:     'wabi · 侘び',
    storyName: 'Katachi · Wabi 侘',
    background: 'dark',
  },
  {
    id:        'kintsugi',
    kanji:     '金',
    label:     'kintsugi · 金継ぎ',
    storyName: 'Katachi · Kintsugi ◈',
    background: 'dark',
  },
  {
    id:        'celadon',
    kanji:     '青',
    label:     'celadon · 青磁',
    storyName: 'Katachi · Celadon ◎',
    background: 'dark',
  },
  {
    id:        'sabi',
    kanji:     '寂',
    label:     'sabi · 寂び',
    storyName: 'Katachi · Sabi ◻',
    background: 'paper',
  },
  {
    id:        'terminal',
    kanji:     '>_',
    label:     'terminal',
    storyName: 'Katachi · Terminal >_',
    background: 'dark',
  },
] as const;

/** Objeto con las 6 stories exportables */
export interface KatachiStoriesExport<T> {
  KatachiShizen:   StoryObj<T>;
  KatachiWabi:     StoryObj<T>;
  KatachiKintsugi: StoryObj<T>;
  KatachiCeladon:  StoryObj<T>;
  KatachiSabi:     StoryObj<T>;
  KatachiTerminal: StoryObj<T>;
}

/**
 * Genera las 6 historias katachi estándar para un componente.
 *
 * @param renderContent  Función que devuelve el contenido del componente.
 *                       Recibe el KatachiMeta del contexto activo — útil
 *                       si el componente necesita adaptar su contenido.
 * @param gap            Espacio entre items (por defecto `var(--lib-space-md)`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createKatachiStories<T = any>(
  renderContent: (katachi: KatachiMeta) => TemplateResult,
  gap = 'var(--lib-space-md)',
): KatachiStoriesExport<T> {

  const makeStory = (k: KatachiMeta): StoryObj<T> => ({
    name: k.storyName,
    parameters: {
      backgrounds: { default: k.background },
    },
    render: (): TemplateResult => html`
      <div
        data-katachi="${k.id}"
        style="
          display: flex;
          flex-wrap: wrap;
          gap: ${gap};
          align-items: center;
          justify-content: center;
          padding: var(--lib-space-xl);
          background: var(--bg-base);
        "
      >
        ${renderContent(k)}
      </div>
    `,
  });

  return {
    KatachiShizen:   makeStory(KATACHI_META[0]!),
    KatachiWabi:     makeStory(KATACHI_META[1]!),
    KatachiKintsugi: makeStory(KATACHI_META[2]!),
    KatachiCeladon:  makeStory(KATACHI_META[3]!),
    KatachiSabi:     makeStory(KATACHI_META[4]!),
    KatachiTerminal: makeStory(KATACHI_META[5]!),
  };
}
