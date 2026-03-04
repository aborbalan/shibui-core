import { html, TemplateResult } from 'lit';

export const visuallyHiddenTemplate = (): TemplateResult => {
  return html`<slot></slot>`;
};