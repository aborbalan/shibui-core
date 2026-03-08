import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { selectTemplate } from './lib-select.html';
import selectCss from './lib-select.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { SelectSize, SelectVariant, SelectChangeDetail, SelectMultiChangeDetail } from './lib-select.types';

/**
 * @element lib-select
 *
 * @fires ui-lib-select-change       — Single: { value, label }
 * @fires ui-lib-select-multi-change — Multi:  { values, labels }
 * @fires ui-lib-select-open         — Panel abierto
 * @fires ui-lib-select-close        — Panel cerrado
 *
 * @slot — lib-select-option children
 */
@customElement('lib-select')
export class LibSelect extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(selectCss)}`,
  ];

  /* ── Field meta ── */
  @property({ type: String }) label        = '';
  @property({ type: String }) placeholder  = 'Selecciona una opción';
  @property({ type: String }) hint         = '';
  @property({ type: String, attribute: 'error-message' }) errorMessage = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;

  /* ── State ── */
  @property({ type: Boolean, reflect: true }) open     = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) error    = false;
  @property({ type: Boolean, reflect: true }) dark     = false;

  /* ── Appearance ── */
  @property({ type: String, reflect: true }) size:    SelectSize    = 'md';
  @property({ type: String, reflect: true }) variant: SelectVariant = 'default';

  /* ── Single value ── */
  @property({ type: String }) value = '';

  /* ── Multi values (JSON array string or space-separated) ── */
  @property({ type: Boolean, reflect: true }) multi = false;

  /* ── Searchable ── */
  @property({ type: Boolean, reflect: true }) searchable = false;

  /* ── Internal state ── */
  @state() private _selectedLabel  = '';
  @state() private _selectedValues: string[] = [];
  @state() private _selectedLabels: string[] = [];
  @state() private _searchQuery    = '';
  @state() private _visibleCount   = 0;

  /* ── Outside click handler (arrow fn for remove ref) ── */
  private readonly _handleOutsideClick = (e: MouseEvent): void => {
    if (this.open && !e.composedPath().includes(this)) {
      this._close();
    }
  };

  /* ── Escape key handler ── */
  private readonly _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.open) {
      this._close();
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
    document.addEventListener('keydown', this._handleKeyDown, true);

    /* Listen for option-selected events bubbled from slotted lib-select-option */
    this.addEventListener('option-selected', this._handleOptionSelected as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    document.removeEventListener('keydown', this._handleKeyDown, true);
  }

  /**
   * Reacts to external value changes.
   * Syncs _selectedLabel by inspecting slotted options.
   */
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    if (changed.has('value') && this.value) {
      this._syncSingleFromValue();
    }
  }

  /* ─────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────── */

  /** Opens the dropdown panel. */
  public openPanel(): void {
    if (!this.disabled) this._open();
  }

  /** Closes the dropdown panel. */
  public closePanel(): void {
    this._close();
  }

  /** Clears current selection. */
  public clear(): void {
    this.value          = '';
    this._selectedLabel = '';
    this._selectedValues = [];
    this._selectedLabels = [];
    this._syncOptionStates();
  }

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */

  override render(): TemplateResult {
    return selectTemplate({
      label:        this.label,
      placeholder:  this.placeholder,
      hint:         this.hint,
      errorMessage: this.errorMessage,
      required:     this.required,
      optional:     this.optional,

      open:     this.open,
      disabled: this.disabled,
      error:    this.error,
      dark:     this.dark,

      size:    this.size,
      variant: this.variant,

      selectedLabel: this._selectedLabel,
      hasSelection:  !!this._selectedLabel,

      multi:         this.multi,
      selectedCount: this._selectedValues.length,

      searchable:   this.searchable,
      searchQuery:  this._searchQuery,
      visibleCount: this._visibleCount,

      onTriggerClick: this._handleTriggerClick.bind(this),
      onSearchInput:  this._handleSearchInput.bind(this),
      onConfirm:      this._handleConfirm.bind(this),
    });
  }

  /* ─────────────────────────────────────────────────────────
     PRIVATE METHODS
  ───────────────────────────────────────────────────────── */

  private _open(): void {
    this.open = true;
    this._updateVisibleCount();
    this.dispatchEvent(new CustomEvent('ui-lib-select-open', {
      bubbles: true, composed: true,
    }));
  }

  private _close(): void {
    this.open = false;
    this._searchQuery = '';
    this._showAllOptions();
    this.dispatchEvent(new CustomEvent('ui-lib-select-close', {
      bubbles: true, composed: true,
    }));
  }

  private _handleTriggerClick(e: Event): void {
    e.stopPropagation();
    if (this.disabled) return;
    if (this.open) {
      this._close();
    } else {
      this._open();
    }
  }

  private _handleOptionSelected(e: Event): void {
    const custom = e as CustomEvent<{ value: string; label: string }>;
    const { value, label } = custom.detail;

    if (this.multi) {
      this._toggleMultiValue(value, label);
    } else {
      this._selectSingle(value, label);
      this._close();
    }
  }

  private _selectSingle(value: string, label: string): void {
    this.value          = value;
    this._selectedLabel = label;
    this._syncOptionStates();

    this.dispatchEvent(new CustomEvent<SelectChangeDetail>('ui-lib-select-change', {
      detail: { value, label },
      bubbles: true,
      composed: true,
    }));
  }

  private _toggleMultiValue(value: string, label: string): void {
    const idx = this._selectedValues.indexOf(value);

    if (idx === -1) {
      this._selectedValues = [...this._selectedValues, value];
      this._selectedLabels = [...this._selectedLabels, label];
    } else {
      this._selectedValues = this._selectedValues.filter((_, i) => i !== idx);
      this._selectedLabels = this._selectedLabels.filter((_, i) => i !== idx);
    }

    this._syncOptionStates();
  }

  private _handleConfirm(): void {
    this.dispatchEvent(new CustomEvent<SelectMultiChangeDetail>('ui-lib-select-multi-change', {
      detail: {
        values: [...this._selectedValues],
        labels: [...this._selectedLabels],
      },
      bubbles: true,
      composed: true,
    }));
    this._close();
  }

  private _handleSearchInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    this._searchQuery = input.value;
    this._filterOptions(this._searchQuery);
  }

  /** Filters slotted lib-select-option elements by text match. */
  private _filterOptions(query: string): void {
    const options = Array.from(
      this.querySelectorAll('lib-select-option')
    ) as HTMLElement[];

    const q = query.toLowerCase().trim();
    let visible = 0;

    options.forEach(opt => {
      const text = (opt.textContent ?? '').toLowerCase();
      const match = !q || text.includes(q);
      opt.toggleAttribute('search-hidden', !match);
      if (match) visible++;
    });

    this._visibleCount = visible;
  }

  private _showAllOptions(): void {
    const options = Array.from(this.querySelectorAll('lib-select-option'));
    options.forEach(opt => opt.removeAttribute('search-hidden'));
    this._updateVisibleCount();
  }

  private _updateVisibleCount(): void {
    const options = this.querySelectorAll('lib-select-option:not([search-hidden])');
    this._visibleCount = options.length;
  }

  /** Syncs selected/unselected state on all slotted option elements. */
  private _syncOptionStates(): void {
    const options = Array.from(this.querySelectorAll('lib-select-option')) as Array<
      HTMLElement & { selected?: boolean; value?: string }
    >;

    if (this.multi) {
      options.forEach(opt => {
        opt.selected = this._selectedValues.includes(opt.value ?? '');
      });
    } else {
      options.forEach(opt => {
        opt.selected = opt.value === this.value;
      });
    }
  }

  /** Called when `value` prop changes externally — syncs label from slotted options. */
  private _syncSingleFromValue(): void {
    // Use setTimeout to allow slotted children to upgrade after hydration
    setTimeout(() => {
      const options = Array.from(
        this.querySelectorAll('lib-select-option')
      ) as Array<HTMLElement & { value?: string; selected?: boolean }>;

      const match = options.find(opt => opt.value === this.value);
      if (match) {
        this._selectedLabel = match.textContent?.trim() ?? '';
        options.forEach(opt => { opt.selected = opt === match; });
      }
    }, 0);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-select': LibSelect;
  }
}