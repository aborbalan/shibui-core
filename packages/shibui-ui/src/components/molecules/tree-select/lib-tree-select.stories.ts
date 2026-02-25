import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-tree-select.component';
import './lib-tree-node.component';
import '../../atoms/icon/lib-icon.component';

const meta: Meta = {
  title: 'Forms/Tree Select',
  component: 'lib-tree-select',
};

export default meta;

const mockData = [
  {
    id: '1',
    label: 'Desarrollo Frontend',
    children: [
      {
        id: '1-1',
        label: 'Frameworks JavaScript',
        children: [
          { id: '1-1-1', label: 'Lit Element' },
          { id: '1-1-2', label: 'React' },
          { id: '1-1-3', label: 'Vue.js' }
        ]
      },
      {
        id: '1-2',
        label: 'Preprocesadores CSS',
        children: [
          { id: '1-2-1', label: 'Sass' },
          { id: '1-2-2', label: 'Less' }
        ]
      }
    ]
  },
  {
    id: '2',
    label: 'Diseño UI/UX',
    children: [
      { id: '2-1', label: 'Figma' },
      { id: '2-2', label: 'Adobe XD' }
    ]
  },
  {
    id: '3',
    label: 'Despliegue',
    children: [
      { id: '3-1', label: 'Vercel' },
      { id: '3-2', label: 'Netlify' }
    ]
  }
];

export const Default: StoryObj = {
  args: {
    data: mockData,
    placeholder: 'Selecciona una tecnología...'
  },
  render: (args) => html`
    <div style="max-width: 400px; min-height: 400px;">
      <lib-tree-select 
        .data=${args.data} 
        .placeholder=${args.placeholder}
        @ui-lib-change=${(e: CustomEvent):void => console.log('Nodo seleccionado:', e.detail)}
      ></lib-tree-select>
    </div>
  `
};