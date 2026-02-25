import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import treeSelectStyles from './lib-tree-select.css?inline';
import { TreeNode } from './lib-tree-node.component';

@customElement('lib-tree-select')
export class LibTreeSelect extends LitElement {
  static override styles = [css`${unsafeCSS(treeSelectStyles)}` || []];

  @property({ type: Array }) data: TreeNode[] = [];
  @property({ type: String }) placeholder = 'Seleccionar opción...';
  
  @state() private _isOpen = false;
  @state() private _selectedLabel = '';

  private _handleNodeSelected(e: CustomEvent<TreeNode>):void {
    this._selectedLabel = e.detail.label;
    this._isOpen = false;
    
    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail: e.detail
    }));
  }

  override render(): TemplateResult {
    return html`
      <div class="tree-select-container">
        <div class="trigger" @click=${():boolean => this._isOpen = !this._isOpen}>
          <span class="value">${this._selectedLabel || this.placeholder}</span>
          <lib-icon name="chevron-down" size="sm"></lib-icon>
        </div>

        ${this._isOpen ? html`
          <div class="dropdown-panel" @node-selected=${this._handleNodeSelected}>
            ${this.data.map(item => html`<lib-tree-node .node=${item}></lib-tree-node>`)}
          </div>
        ` : ''}
      </div>
    `;
  }
}