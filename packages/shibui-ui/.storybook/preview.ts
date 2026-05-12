import type { Preview } from '@storybook/web-components-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'paper', value: '#FAF7F4' },  // washi-50
        { name: 'dark',  value: '#0f1923' },
      ],
      default: 'paper',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
