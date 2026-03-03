import { Meta, StoryObj } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import './lib-radio.component';

const meta: Meta = {
  title: 'Components/Atoms/Radio',
  component: 'lib-radio',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Helper para visualizar varios estados a la vez
const ShowcaseContainer = (content: TemplateResult): TemplateResult => html`
  <div style="
    display: flex; 
    flex-direction: column; 
    gap: var(--lib-space-md); 
    padding: var(--lib-space-xl);
    background-color: var(--color-washi-50);
    border-radius: 8px;
    min-width: 300px;
  ">
    ${content}
  </div>
`;

export const States: StoryObj = {
  render: () => ShowcaseContainer(html`
    <lib-radio name="states" value="1">Opción por defecto</lib-radio>
    <lib-radio name="states" value="2" checked>Opción seleccionada</lib-radio>
    <lib-radio name="states" value="3" disabled>Opción deshabilitada</lib-radio>
    <lib-radio name="states" value="4" checked disabled>Seleccionada y deshabilitada</lib-radio>
  `),
};

export const EditorialSelection: StoryObj = {
  render: () => html`
    <div style="max-width: 400px;">
      <h3 style="font-family: var(--lib-font-family-serif); margin-bottom: var(--lib-space-lg);">
        Selecciona tu estética
      </h3>
      <div style="display: grid; gap: var(--lib-space-sm);">
        <lib-radio name="aesthetic" value="shibui" checked>
          <strong>Shibui</strong> — Elegancia discreta y sutil.
        </lib-radio>
        <lib-radio name="aesthetic" value="wabi">
          <strong>Wabi-sabi</strong> — Belleza en la imperfección.
        </lib-radio>
        <lib-radio name="aesthetic" value="kintsugi">
          <strong>Kintsugi</strong> — Reparado con oro.
        </lib-radio>
      </div>
    </div>
  `,
};