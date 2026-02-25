import { LitElement, html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import { BreadcrumbItem } from './lib-breadcrumb.types';
import cssStyles from './lib-breadcrumb.css?inline';

@customElement('lib-breadcrumb')
export class LibBreadcrumb extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: Array }) items: BreadcrumbItem[] = [];
  @property({ type: String }) separator = 'caret-right'; // Icono por defecto

  protected override render(): TemplateResult {
    return html`
      <nav aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          ${this.items.map((item, index) => this._renderItem(item, index))}
        </ol>
      </nav>
    `;
  }

  private _renderItem(item: BreadcrumbItem, index: number): TemplateResult {
    const isLast = index === this.items.length - 1;

    return html`
      <li class="breadcrumb-item">
        ${item.icon ? html`<lib-icon name="${item.icon}" size="sm"></lib-icon>` : ''}
        
        ${isLast || !item.href
          ? html`<span class="breadcrumb-current">${item.label}</span>`
          : html`<a href="${item.href}" class="breadcrumb-link">${item.label}</a>`
        }

        ${!isLast ? html`
          <span class="separator" aria-hidden="true">
            <lib-icon name="${this.separator}" size="sm"></lib-icon>
          </span>
        ` : ''}
      </li>
    `;
  }
}