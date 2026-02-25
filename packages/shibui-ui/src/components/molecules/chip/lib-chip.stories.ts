import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-chip.component';

const meta: Meta = {
  title: 'Forms/Chip',
  component: 'lib-chip',
};

export default meta;

export const Default: StoryObj = {
  args: {
    label: 'User Chip',
    removable: true,
    selectable: true,
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  render: (args) => html`
    <lib-chip 
      .label=${args.label} 
      ?removable=${args.removable}
      ?selectable=${args.selectable}
      .avatar=${args.avatar}
      @chip-remove=${(e: CustomEvent):void => console.log('Removed:', e.detail)}
    ></lib-chip>
  `
};