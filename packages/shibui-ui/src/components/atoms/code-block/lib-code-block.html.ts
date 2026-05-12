import { html, nothing, TemplateResult } from 'lit';

export type LibCodeBlockLanguage =
  | 'bash'
  | 'ts'
  | 'js'
  | 'html'
  | 'css'
  | 'json'
  | 'text';

export interface CodeBlockTemplateProps {
  code: string;
  language: LibCodeBlockLanguage;
  copyable: boolean;
  copied: boolean;
  filename: string;
  onCopy: () => void;
}

export function codeBlockTemplate(props: CodeBlockTemplateProps): TemplateResult {
  return html`
    <div class="code-block">
      <div class="code-block__header">
        <div class="code-block__meta">
          ${props.filename
            ? html`<span class="code-block__filename">${props.filename}</span>`
            : nothing}
          <span class="code-block__lang">${props.language}</span>
        </div>

        ${props.copyable
          ? html`
              <button
                class="code-block__copy ${props.copied ? 'code-block__copy--copied' : ''}"
                aria-label="${props.copied ? 'Copiado' : 'Copiar código'}"
                @click=${props.onCopy}
              >
                ${props.copied
                  ? html`
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>Copiado</span>
                    `
                  : html`
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      <span>Copiar</span>
                    `}
              </button>
            `
          : nothing}
      </div>

      <div class="code-block__body">
        <pre class="code-block__pre"><code class="code-block__code">${props.code}</code></pre>
      </div>
    </div>
  `;
}