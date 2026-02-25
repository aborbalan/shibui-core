import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-list.component';
import '../../molecules/profile-card/lib-profile-card.component';

const meta: Meta = {
  title: 'Display/List',
  component: 'lib-list',
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'block'],
    },
    loading: { control: 'boolean' },
    skeletonCount: { control: 'number' },
  },
};

export default meta;

export const GridWithCards: StoryObj = {
  args: {
    layout: 'grid',
    loading: false,
    skeletonCount: 6,
  },
  render: (args) => html`
    <lib-list 
      layout=${args.layout} 
      ?loading=${args.loading} 
      .skeletonCount=${args.skeletonCount}
    >
      <lib-profile-card 
        name="Alex" 
        role="Frontend" 
        avatarSrc="https://i.pravatar.cc/150?u=1">
      </lib-profile-card>
      <lib-profile-card 
        name="Sam" 
        role="UI Designer" 
        avatarSrc="https://i.pravatar.cc/150?u=2">
      </lib-profile-card>
      <lib-profile-card 
        name="Jordan" 
        role="DevOps" 
        avatarSrc="https://i.pravatar.cc/150?u=3">
      </lib-profile-card>
    </lib-list>
  `,
};