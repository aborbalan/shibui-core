
import { LibListModel } from '../../../../architecture/base-components/lib-list.model';
import { unsafeCSS, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { textListTemplate } from './lib-text-list.html';
import cssStyles from './lib-text-list.css?inline';

@customElement('lib-text-list')
export class LibTextList extends LibListModel<string> {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) variant: 'ordered' | 'unordered' = 'unordered';

  /**
   * Este método ayuda al archivo HTML a ejecutar el render del modelo
   */
  renderBase(): TemplateResult {
    return super.render();
  }

  protected renderItem(item: string): TemplateResult {
    return html`<li class="list-item">${item}</li>`;
  }

  protected override renderSkeleton(): TemplateResult {
    return html`
      <li class="list-item skeleton" aria-hidden="true">
        <div class="skeleton-line"></div>
      </li>
    `;
  }

  protected override render(): TemplateResult {
    return textListTemplate(this);
  }
}