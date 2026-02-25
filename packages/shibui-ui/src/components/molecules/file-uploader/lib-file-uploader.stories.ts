import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-file-uploader.component';

const meta: Meta = {
  title: 'Forms/File Uploader',
  component: 'lib-file-uploader',
};

export default meta;

export const Default: StoryObj = {
  args: {
    label: 'Documentación técnica',
    multiple: true,
    accept: '.pdf,.docx'
  },
  render: (args) => html`
    <lib-file-uploader 
      .label=${args.label} 
      ?multiple=${args.multiple} 
      .accept=${args.accept}
    ></lib-file-uploader>
  `
};