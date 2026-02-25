import { html, TemplateResult } from 'lit';
import './lib-alert.component';
import { LibAlert } from './lib-alert.component';

export default {
  title: 'Feedback/Alert',
  component: 'lib-alert',
};

export const Toast = {
  args: {
    type: 'success',
    message: '¡Acción realizada con éxito!',
    glass: true,
    position: 'top-right'
  },
  render: (args: Partial<LibAlert>): TemplateResult => html`
    <lib-alert 
      .type=${args.type} 
      ?glass=${args.glass} 
      .position=${args.position}>
      ${args.message}
    </lib-alert>
  `
};