import type { Preview } from '@storybook/web-components-vite';

// Importamos los partials de tokens directamente (no vía tokens.css con
// @import url(...)) para garantizar que Storybook/Vite inyecta TODAS las
// capas a nivel de documento. Sin esto, los @import anidados no siempre se
// resuelven en el preview y los componentes pierden los tokens semánticos
// (--text-accent, --lib-comp-*…) → render sin color ni efectos.
// El orden es crítico: primitivos → semánticos → katachi.
import '../src/styles/shared/tokens/_palette.css';
import '../src/styles/shared/tokens/_typography.css';
import '../src/styles/shared/tokens/_spacing.css';
import '../src/styles/shared/tokens/_breakpoints.css';
import '../src/styles/shared/tokens/_motion.css';
import '../src/styles/shared/tokens/_state.css';
import '../src/styles/shared/tokens/_semantic.css';
import '../src/styles/shared/tokens/_effects.css';
import '../src/styles/shared/tokens/_katachi.css';

const preview: Preview = {
  decorators: [
    (story) => {
      // Aplica el katachi estándar (shizen) al root de la preview.
      // Las stories individuales pueden sobreescribirlo con data-katachi en su render.
      document.documentElement.setAttribute('data-katachi', 'shizen');
      return story();
    },
  ],
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
