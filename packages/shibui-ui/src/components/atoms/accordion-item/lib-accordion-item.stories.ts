import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-accordion-item.component';

interface AccordionItemArgs {
  label: string;
  open: boolean;
  slotContent: string;
}

const meta: Meta<AccordionItemArgs> = {
  title: 'Layout/Accordion Item',
  tags:['autodocs'],
  component: 'lib-accordion-item',
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AccordionItemArgs>;

// Función de renderizado limpia sin 'any'
const renderTemplate = (args: AccordionItemArgs): TemplateResult => html`
  <div style="max-width: 500px; margin: 2rem auto; border: 1px solid #e2e8f0; border-radius: 8px;">
    <lib-accordion-item .label=${args.label} ?open=${args.open}>
      <p>${args.slotContent}</p>
    </lib-accordion-item>
  </div>
`;

export const Default: Story = {
  args: {
    label: '¿Es esto un Átomo?',
    open: false,
    slotContent: 'Sí, en nuestra arquitectura técnica es un átomo porque es la unidad mínima de información colapsable.',
  },
  render: (args) => renderTemplate(args),
};

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
  render: (args) => renderTemplate(args),
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="border:1px solid var(--border-subtle);">
            <lib-accordion-item label="Pregunta frecuente" open>
              <p style="font-size:.875rem;color:var(--text-secondary);margin:0;">
                La imperfección no es un error — es la firma del tiempo sobre la materia.
              </p>
            </lib-accordion-item>
            <lib-accordion-item label="Otra sección">
              <p style="font-size:.875rem;color:var(--text-secondary);margin:0;">
                Contenido oculto hasta ser invocado.
              </p>
            </lib-accordion-item>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};