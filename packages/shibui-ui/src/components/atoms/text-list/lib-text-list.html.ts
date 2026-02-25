import { html, TemplateResult } from 'lit';
import { LibTextList } from './lib-text-list.component';

export const textListTemplate = (context: LibTextList): TemplateResult => {
  // Invocamos la lógica de renderizado del modelo base (LibListModel)
  // que ya gestiona el bucle de 'items' y el estado 'loading'.
  const content = context.renderBase(); 

  return context.variant === 'ordered'
    ? html`<ol class="text-list">${content}</ol>`
    : html`<ul class="text-list">${content}</ul>`;
};