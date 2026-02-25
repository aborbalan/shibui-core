import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-data-table.component';
import '../../molecules/pagination/lib-pagination.component';

const meta: Meta = {
  title: 'Organisms/Data Table',
  component: 'lib-data-table',
};

export default meta;

export const Default: StoryObj = {
  args: {
    columns: [
      { header: 'Usuario', key: 'name', sortable: true },
      { header: 'Estado', key: 'status', type: 'badge' },
      { header: 'Progreso', key: 'progress', type: 'progress' },
      { header: 'Acciones', key: 'actions', type: 'action' }
    ],
    data: [
      { name: 'Alex Marín', status: 'Activo', variant: 'success', progress: 85 },
      { name: 'Elena Pozo', status: 'Pendiente', variant: 'warning', progress: 40 },
      { name: 'Marc Soto', status: 'Error', variant: 'error', progress: 15 },
      { name: 'Sonia Gil', status: 'Inactivo', variant: 'neutral', progress: 100 }
    ]
  },
  render: (args) => html`
    <div style="padding: 24px;">
      <lib-data-table .columns=${args.columns} .data=${args.data}>

        <lib-pagination 
          slot="pagination" 
          totalItems="40" 
          itemsPerPage="10" 
          currentPage="1"
        ></lib-pagination>
      </lib-data-table>
    </div>
  `
};