import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  selected?: boolean;
}

@customElement('lib-tree-node')
export class LibTreeNode extends LitElement {
  @property({ type: Object }) node!: TreeNode;

  @state() private _expanded = false;

  private _toggle():void {
    if (this.node.children) {
      this._expanded = !this._expanded;
    } else {
      this._select();
    }
  }

  private _select():void {
    this.dispatchEvent(new CustomEvent('node-selected', {
      detail: this.node,
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    const hasChildren = this.node.children && this.node.children.length > 0;

    return html`
      <div class="node-wrapper">
        <div class="node-content" @click=${this._toggle}>
          ${hasChildren 
            ? html`<lib-icon name="${this._expanded ? 'chevron-down' : 'chevron-right'}" size="sm"></lib-icon>` 
            : html`<span class="spacer"></span>`}
          <lib-icon name="${hasChildren ? 'folder' : 'file'}" size="sm"></lib-icon>
          <span class="label">${this.node.label}</span>
        </div>

        ${this._expanded && hasChildren ? html`
          <div class="children">
            ${this.node.children?.map(child => html`
              <lib-tree-node .node=${child}></lib-tree-node>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  static override styles = css`
    .node-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .node-content:hover { background: #f1f5f9; }
    .spacer { width: 16px; }
    .children { padding-left: 20px; }
    .label { font-size: 14px; font-family: sans-serif; }
  `;
}