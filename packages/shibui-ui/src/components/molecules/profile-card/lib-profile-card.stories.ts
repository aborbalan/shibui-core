import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-profile-card.component';

const meta: Meta = {
  title: 'Display/Profile Card',
  component: 'lib-profile-card',
  argTypes: {
    statusVariant: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'neutral'],
    },
    loading: { control: 'boolean' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    name: 'Elon Musk',
    role: 'Chief Engineer at SpaceX',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon',
    statusVariant: 'success',
    loading: false,
    pulse: true
  }
};

export const LoadingState: StoryObj = {
  args: {
    loading: true
  }
};