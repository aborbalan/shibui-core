import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-pagination.component';
import '../../atoms/button/lib-button.component';
import '../../atoms/icon/lib-icon.component';

const meta: Meta = {
  title: 'Forms/Pagination',
  component: 'lib-pagination',
};

export default meta;

export const Default: StoryObj = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 1
  },
  render: (args) => html`
    <div style="padding: 20px; background: #f7fafc; border-radius: 8px;">
      <lib-pagination 
        .totalItems=${args.totalItems} 
        .itemsPerPage=${args.itemsPerPage}
        .currentPage=${args.currentPage}
        @ui-lib-page-change=${(e: CustomEvent):void => console.log('Ir a página:', e.detail.page)}
      ></lib-pagination>
    </div>
  `
};

export const ManyPages: StoryObj = {
  args: {
    totalItems: 1000,
    itemsPerPage: 10,
    currentPage: 50
  }
};