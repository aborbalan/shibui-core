import { html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { tabsTemplate } from './lib-tabs.html';
import cssStyles from './lib-tabs.css?inline';
import { LibListModel } from '../../../../architecture/base-components/lib-list.model';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}


@customElement('lib-tabs')
export class LibTabs extends LibListModel<TabItem> {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String, reflect: true }) activeTabId = '';

  renderBase(): TemplateResult {
    return super.render();
  }

  /**
   * Implementamos el render de cada botón de la pestaña
   */
  protected renderItem(item: TabItem): TemplateResult {
    const isActive = this.activeTabId === item.id;
    
    return html`
      <button
        role="tab"
        aria-selected="${isActive}"
        class="tab-button ${isActive ? 'is-active' : ''}"
        ?disabled=${item.disabled}
        @click=${():void => this._handleTabClick(item.id)}
      >
        ${item.label}
      </button>
    `;
  }

  private _handleTabClick(id: string):void {
    this.activeTabId = id;
    this.dispatchEvent(new CustomEvent('tab-changed', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return tabsTemplate(this);
  }
}