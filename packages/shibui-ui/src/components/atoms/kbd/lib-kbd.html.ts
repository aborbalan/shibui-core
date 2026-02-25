import { html, TemplateResult } from 'lit';
import { LibKbd } from './lib-kbd.component';

export const kbdTemplate = (context: LibKbd): TemplateResult => html`
  <kbd class="kbd-key">
    ${context.key ? context.key : html`<slot></slot>`}
  </kbd>
`;