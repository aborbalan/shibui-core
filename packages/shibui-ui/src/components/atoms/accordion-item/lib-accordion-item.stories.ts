import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-accordion-item.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

interface AccordionItemArgs {
  label: string;
  open: boolean;
  slotContent: string;
}

const meta: Meta<AccordionItemArgs> = {
  title: 'Universal/Layout/Accordion Item',
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
   KATACHI · 形 · Las 6 historias estándar
   lib-accordion-item usa tokens semánticos (--bg-elevated,
   --text-primary…) que adaptan al katachi activo sin CSS extra.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="width:100%;max-width:400px;border:1px solid var(--border-subtle);">
    <lib-accordion-item label="Pregunta frecuente" open>
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0;">
        La imperfección no es un error — es la firma del tiempo sobre la materia.
      </p>
    </lib-accordion-item>
    <lib-accordion-item label="Otra sección">
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:0;">
        Contenido oculto hasta ser invocado.
      </p>
    </lib-accordion-item>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;