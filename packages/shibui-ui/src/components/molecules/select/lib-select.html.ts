import { html, nothing, TemplateResult } from 'lit';
import type { SelectSize, SelectVariant } from './lib-select.types';

export interface SelectTemplateProps {
  /* Field meta */
  label:        string;
  placeholder:  string;
  hint:         string;
  errorMessage: string;
  required:     boolean;
  optional:     boolean;

  /* State */
  open:         boolean;
  disabled:     boolean;
  error:        boolean;
  dark:         boolean;

  /* Appearance */
  size:         SelectSize;
  variant:      SelectVariant;

  /* Single selection */
  selectedLabel:       string;
  hasSelection:        boolean;

  /* Multi selection */
  multi:               boolean;
  selectedCount:       number;

  /* Searchable */
  searchable:          boolean;
  searchQuery:         string;
  visibleCount:        number;

  /* Handlers */
  onTriggerClick:      (e: Event) => void;
  onSearchInput:       (e: Event) => void;
  onConfirm:           () => void;
}

/**
 * Template para lib-select.
 * Las opciones son elementos slotted — lib-select-option hijos en el light DOM.
 */
export function selectTemplate(props: SelectTemplateProps): TemplateResult {
  const {
    label, placeholder, hint, errorMessage,
    required, optional,
    open, error,
    selectedLabel, hasSelection,
    multi, selectedCount,
    searchable, searchQuery, visibleCount,
    onTriggerClick, onSearchInput, onConfirm,
  } = props;

  /* ── Label section ── */
  const labelTpl = label
    ? html`
        <label class="sel-label">
          ${label}
          ${required ? html`<span class="sel-label-req" aria-hidden="true">*</span>` : nothing}
          ${optional ? html`<span class="sel-label-opt">(opcional)</span>` : nothing}
        </label>`
    : nothing;

  /* ── Hint / error message ── */
  const hintTpl = error && errorMessage
    ? html`<span class="sel-hint is-error">${errorMessage}</span>`
    : hint
      ? html`<span class="sel-hint">${hint}</span>`
      : nothing;

  /* ── Trigger value display ── */
  const triggerValueTpl = multi
    ? selectedCount > 0
      ? html`
          <span class="sel-trigger-value">
            ${selectedCount} seleccionada${selectedCount !== 1 ? 's' : ''}
            <span class="sel-trigger-count">${selectedCount}</span>
          </span>`
      : html`<span class="sel-trigger-value is-placeholder">${placeholder}</span>`
    : hasSelection
      ? html`<span class="sel-trigger-value">${selectedLabel}</span>`
      : html`<span class="sel-trigger-value is-placeholder">${placeholder}</span>`;

  /* ── Search row ── */
  const searchTpl = searchable
    ? html`
        <div class="sel-panel-search">
          <span class="sel-panel-search-icon" aria-hidden="true"></span>
          <input
            type="text"
            placeholder="Buscar…"
            .value="${searchQuery}"
            @input="${onSearchInput}"
            autocomplete="off"
            aria-label="Buscar opciones"
          >
        </div>`
    : nothing;

  /* ── Panel footer for multi ── */
  const footerTpl = multi
    ? html`
        <div class="sel-panel-footer">
          <span class="sel-panel-footer-text">
            ${selectedCount} seleccionada${selectedCount !== 1 ? 's' : ''}
          </span>
          <button
            class="sel-panel-footer-btn"
            type="button"
            @click="${onConfirm}"
          >Confirmar</button>
        </div>`
    : nothing;

  /* ── Empty state when search yields 0 results ── */
  const emptyTpl = searchable && searchQuery && visibleCount === 0
    ? html`<div class="sel-panel-empty">Sin resultados</div>`
    : nothing;

  return html`
    <div class="sel-field">

      ${labelTpl}

      <div class="sel-custom">
        <button
          class="sel-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="${open}"
          @click="${onTriggerClick}"
        >
          ${triggerValueTpl}
          <span class="sel-trigger-chevron" aria-hidden="true"></span>
        </button>

        <div
          class="sel-panel"
          role="listbox"
          aria-multiselectable="${multi}"
        >
          ${searchTpl}

          <div class="sel-panel-list">
            <slot></slot>
            ${emptyTpl}
          </div>

          ${footerTpl}
        </div>
      </div>

      ${hintTpl}

    </div>
  `;
}