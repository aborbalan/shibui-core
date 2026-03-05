import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import './lib-stagger-container.component';

export default {
  title: 'Organisms/Stagger Container',
  component: 'lib-stagger-container',
} as Meta;

export const DiagnosticTest: StoryObj = {
  render: (): TemplateResult => html`
    <div style="height: 120vh; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 100px; background: #1a1a1a;">
      <p style="color: #666; font-family: sans-serif;">↓ Haz un poco más de scroll para activar ↓</p>
    </div>

    <div style="background: #1a1a1a; padding: 50px;">
      <lib-stagger-container delay="200">
        <div style="height: 150px; background: #FF5733; margin: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif;">
          TARJETA NARANJA (1)
        </div>
        <div style="height: 150px; background: #33FF57; margin: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-family: sans-serif;">
          TARJETA VERDE (2)
        </div>
        <div style="height: 150px; background: #3357FF; margin: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif;">
          TARJETA AZUL (3)
        </div>
        <div style="height: 150px; background: #F333FF; margin: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif;">
          TARJETA ROSA (4)
        </div>
      </lib-stagger-container>
    </div>

    <div style="height: 50vh; background: #1a1a1a;"></div>
  `
};