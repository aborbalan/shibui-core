import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-table-search.component';

const meta: Meta = {
  title: 'Molecules/Table Search',
  component: 'lib-table-search',
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    placeholder: 'Buscar registros...',
    value: "yutyu\n",
  },
  render: (args) => html`
    <div style="padding: 3rem; background-color: #f8fafc; min-height: 200px;">
      <div style="max-width: 400px; background: white; padding: 1rem; border-radius: 8px; shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
        
        <lib-table-search 
          .placeholder="${args.placeholder}"
          .value="${args.value}"
          @ui-lib-search="${(e: CustomEvent):void => console.log('🚀 Evento ui-lib-search:', e.detail.query)}"
        ></lib-table-search>

        <div style="margin-top: 1.5rem; font-family: sans-serif; font-size: 0.875rem; color: #64748b;">
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Escribe algo en el buscador.</li>
            <li>Abre la consola del navegador (F12) o la pestaña <strong>Actions</strong> de Storybook.</li>
            <li>Verás el texto filtrado en tiempo real.</li>
          </ol>
        </div>
      </div>
    </div>
  `,
};