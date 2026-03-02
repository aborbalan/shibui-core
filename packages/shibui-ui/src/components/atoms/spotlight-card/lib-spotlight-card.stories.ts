import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-spotlight-card.component';

const meta: Meta = {
  title: 'Components/Atoms/SpotlightCard',
  component: 'lib-spotlight-card',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <div style="padding: 40px; background: #000; min-height: 200px;">
      <lib-spotlight-card>
        <h3 style="color: white; margin: 0;">Efecto Spotlight</h3>
        <p style="color: #888;">Mueve el ratón por encima para iluminar la tarjeta.</p>
      </lib-spotlight-card>
    </div>
  `,
};