import { Meta, StoryObj } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import './lib-visually-hidden.component';

const meta: Meta = {
  title: 'Components/Atoms/VisuallyHidden',
  component: 'lib-visually-hidden',
};

export default meta;

export const Default: StoryObj = {
  render: (): TemplateResult => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <p>A la derecha hay un botón que solo tiene un icono (X), pero es accesible:</p>
      
      <button style="padding: 8px; cursor: pointer;">
        <span aria-hidden="true">❌</span>
        <lib-visually-hidden>Cerrar ventana modal</lib-visually-hidden>
      </button>
    </div>
    
    <div style="margin-top: 2rem; padding: 1rem; background: var(--color-washi-100);">
      <strong>Nota:</strong> Si inspeccionas el botón con el navegador, verás el texto. 
      Si usas un lector de pantalla, escuchará "Cerrar ventana modal". 
      Visualmente, el texto no ocupa espacio.
    </div>
  `
};