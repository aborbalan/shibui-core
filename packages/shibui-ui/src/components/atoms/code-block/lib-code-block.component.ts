import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { LibCodeBlockLanguage } from './lib-code-block.html';
import { codeBlockTemplate } from './lib-code-block.html';
import codeBlockCss from './lib-code-block.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type LibCodeBlockVariant = 'default' | 'ghost';

/**
 * @element lib-code-block
 *
 * Bloque de código con sintaxis destacada, etiqueta de lenguaje y botón de copia.
 *
 * @slot - Código a mostrar. Si se usa este slot, tiene prioridad sobre el atributo `code`.
 *
 * @example
 * <lib-code-block language="bash" code="npm install @shibui-ui/ui lit"></lib-code-block>
 *
 * @example
 * <lib-code-block language="ts" filename="main.ts">
 *   import '@shibui-ui/ui';
 * </lib-code-block>
 */
@customElement('lib-code-block')
export class LibCodeBlock extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(codeBlockCss)}
    `,
  ];

  /** Código a mostrar como texto plano */
  @property({ type: String })
  code = '';

  /** Etiqueta de lenguaje mostrada en el header (decorativa) */
  @property({ type: String, reflect: true })
  language: LibCodeBlockLanguage = 'bash';

  /** Nombre de fichero opcional mostrado en el header */
  @property({ type: String })
  filename = '';

  /** Muestra u oculta el botón de copiar */
  @property({ type: Boolean, reflect: true })
  copyable = true;

  /** Variante visual: default (oscuro) | ghost (claro) */
  @property({ type: String, reflect: true })
  variant: LibCodeBlockVariant = 'default';

  /** Estado interno: feedback tras copiar */
  @state()
  private _copied = false;

  private _copyTimeout: ReturnType<typeof setTimeout> | null = null;

  private _handleCopy(): void {
    const content = this.code || this._getSlotText();
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      this._copied = true;
      if (this._copyTimeout) clearTimeout(this._copyTimeout);
      this._copyTimeout = setTimeout(() => {
        this._copied = false;
      }, 2000);
    }).catch(() => {
      // Fallback para entornos sin clipboard API
      const ta = document.createElement('textarea');
      ta.value = content;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this._copied = true;
      if (this._copyTimeout) clearTimeout(this._copyTimeout);
      this._copyTimeout = setTimeout(() => {
        this._copied = false;
      }, 2000);
    });
  }

  private _getSlotText(): string {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return '';
    return slot.assignedNodes({ flatten: true })
      .map(node => node.textContent ?? '')
      .join('');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._copyTimeout) clearTimeout(this._copyTimeout);
  }

  override render(): TemplateResult {
    return codeBlockTemplate({
      code: this.code,
      language: this.language,
      filename: this.filename,
      copyable: this.copyable,
      copied: this._copied,
      onCopy: () => this._handleCopy(),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-code-block': LibCodeBlock;
  }
}