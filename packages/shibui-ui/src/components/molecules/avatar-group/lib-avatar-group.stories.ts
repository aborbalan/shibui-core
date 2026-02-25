import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-avatar-group.component';
import '../../atoms/avatar/lib-avatar.component';

const meta: Meta = {
  title: 'Display/Avatar Group',
  component: 'lib-avatar-group',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    max: { control: 'number' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: { size: 'md', max: 3 },
  render: (args) => html`
    <div style="padding: 40px;">
      <lib-avatar-group .size=${args.size} .max=${args.max}>
        <lib-avatar name="User 1" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"></lib-avatar>
        <lib-avatar name="User 2" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2"></lib-avatar>
        <lib-avatar name="User 3" src="https://api.dicebear.com/7.x/avataaars/svg?seed=3"></lib-avatar>
        <lib-avatar name="User 4" src="https://api.dicebear.com/7.x/avataaars/svg?seed=4"></lib-avatar>
      </lib-avatar-group>
    </div>
  `,
};