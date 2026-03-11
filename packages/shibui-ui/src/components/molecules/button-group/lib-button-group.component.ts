import { LitElement, css, unsafeCSS, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibVariant, LibSize } from '../../../types';
import groupCss from './lib-button-group.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { buttonGroupTemplate, buttonSplitTemplate } from './lib-button-group.html';
import type { ButtonGroupShape, ButtonGroupOrientation, SplitMenuItem } from './lib-button-group.types';
import type { LibButton } from '../../atoms/button/lib-button.component';

/* Registro del elemento lib-button (side-effect) */
import '../../atoms/button/lib-button.component';

/* ══════════════════════════════════════════════════════════════
   LIB-BUTTON-GROUP
   ══════════════════════════════════════════════════════════════
   Wrapper que agrupa lib-button en una unidad visual:
   · Colapsa bordes internos (margin-left: -1px)
   · Propaga shape, size, dark, kintsugi a cada hijo
   · Toggle single / multi con estado [active]
   · Separadores lib-button-sep reconocidos automáticamente

   @fires ui-lib-group-change — {detail: {active: string[], activeIndex: number[]}}
*/
@customElement('lib-button-group')
export class LibButtonGroup extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(groupCss)}`,
  ];

  /** Forma de los extremos del grupo */
  @property({ type: String, reflect: true })
  shape: ButtonGroupShape = 'flat';

  /** Orientación del grupo */
  @property({ type: String, reflect: true })
  orientation: ButtonGroupOrientation = 'horizontal';

  /** Ancho completo */
  @property({ type: Boolean, reflect: true })
  block = false;

  /** Activa comportamiento toggle (click activa/desactiva) */
  @property({ type: Boolean, reflect: true })
  toggle = false;

  /** Permite selección múltiple (requiere toggle=true) */
  @property({ type: Boolean, reflect: true })
  multi = false;

  /** Propaga dark a todos los lib-button hijos */
  @property({ type: Boolean, reflect: true })
  dark = false;

  /** Propaga kintsugi a botones accent/kaki adyacentes */
  @property({ type: Boolean, reflect: true })
  kintsugi = false;

  /** Tamaño propagado a todos los hijos */
  @property({ type: String, reflect: true })
  size: LibSize | '' = '';

  /* ── Lifecycle ── */

  protected override render(): TemplateResult {
    return buttonGroupTemplate();
  }

  override firstUpdated(): void {
    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', (): void => this._updateChildren());
    }
    this._updateChildren();

    if (this.toggle) {
      this.addEventListener('click', this._handleToggleClick);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.toggle) {
      this.removeEventListener('click', this._handleToggleClick);
    }
  }

  /* ── Children management ── */

  private _getButtons(): LibButton[] {
    return Array.from(this.querySelectorAll<LibButton>('lib-button'));
  }

  private _updateChildren(): void {
    const all = Array.from(this.children) as Element[];

    /* Solo lib-button para posicionamiento — ignorar lib-button-sep */
    const btns = all.filter((el): el is LibButton =>
      el.tagName.toLowerCase() === 'lib-button'
    );

    btns.forEach((btn: LibButton, i: number): void => {
      /* Position */
      if (btns.length === 1) {
        btn.removeAttribute('group-pos');
      } else if (i === 0) {
        btn.setAttribute('group-pos', 'first');
      } else if (i === btns.length - 1) {
        btn.setAttribute('group-pos', 'last');
      } else {
        btn.setAttribute('group-pos', 'middle');
      }

      /* Shape */
      if (this.shape !== 'flat') {
        btn.setAttribute('group-shape', this.shape);
      } else {
        btn.removeAttribute('group-shape');
      }

      /* Vertical */
      if (this.orientation === 'vertical') {
        btn.setAttribute('group-vertical', '');
      } else {
        btn.removeAttribute('group-vertical');
      }

      /* Dark */
      if (this.dark) {
        btn.setAttribute('dark', '');
      } else {
        btn.removeAttribute('dark');
      }

      /* Size */
      if (this.size) {
        btn.setAttribute('size', this.size);
      }

      /* Kintsugi — solo middle y last */
      if (this.kintsugi && i > 0) {
        btn.setAttribute('kintsugi', '');
      } else {
        btn.removeAttribute('kintsugi');
      }
    });
  }

  /* ── Toggle logic ── */

  private _handleToggleClick = (e: Event): void => {
    const target = (e.target as Element).closest('lib-button') as LibButton | null;
    if (!target || target.hasAttribute('disabled')) return;

    if (this.multi) {
      /* Multi: toggle individual */
      const isActive = target.hasAttribute('active');
      if (isActive) {
        target.removeAttribute('active');
      } else {
        target.setAttribute('active', '');
      }
    } else {
      /* Single: solo uno activo */
      this._getButtons().forEach((btn: LibButton): void => {
        btn.removeAttribute('active');
      });
      target.setAttribute('active', '');
    }

    this._emitChange();
  };

  private _emitChange(): void {
    const btns = this._getButtons();
    const active: string[] = [];
    const activeIndex: number[] = [];

    btns.forEach((btn: LibButton, i: number): void => {
      if (btn.hasAttribute('active')) {
        activeIndex.push(i);
        active.push(btn.textContent?.trim() ?? String(i));
      }
    });

    this.dispatchEvent(new CustomEvent('ui-lib-group-change', {
      detail: { active, activeIndex },
      bubbles: true,
      composed: true,
    }));
  }
}

/* ══════════════════════════════════════════════════════════════
   LIB-BUTTON-SEP
   ══════════════════════════════════════════════════════════════
   Separador visual explícito entre botones del grupo.
   El lib-button-group lo reconoce y no le asigna group-pos.
*/
@customElement('lib-button-sep')
export class LibButtonSep extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(groupCss)}`,
  ];

  @property({ type: Boolean, reflect: true })
  dark = false;

  protected override render(): TemplateResult {
    const color = this.dark
      ? 'rgba(255,255,255,0.1)'
      : 'var(--border-default)';
    return html`<div style="width:1px;align-self:stretch;background:${color};flex-shrink:0;z-index:1;"></div>`;
  }
}

/* ══════════════════════════════════════════════════════════════
   LIB-BUTTON-SPLIT
   ══════════════════════════════════════════════════════════════
   Botón de acción principal + flecha que despliega menú.

   @prop variant  — variante visual (igual que lib-button)
   @prop size     — tamaño
   @prop dark     — surface oscura
   @prop disabled
   @prop label    — texto del botón principal (también slot default)
   @prop items    — JSON con [{label, value, disabled?}] para el menú
                    Si está vacío se usa <slot name="menu">

   @fires ui-lib-split-action — click en acción principal
   @fires ui-lib-split-select — click en item del menú {value, label}
*/
@customElement('lib-button-split')
export class LibButtonSplit extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(groupCss)}`,
  ];

  @property({ type: String, reflect: true })
  variant: LibVariant = 'primary';

  @property({ type: String, reflect: true })
  size: LibSize = 'md';

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  label = '';

  /** JSON array de items: '[{"label":"Publicar","value":"publish"}]' */
  @property({ type: String })
  items = '';

  private _open = false;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click',   this._onDocClick);
    document.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click',   this._onDocClick);
    document.removeEventListener('keydown', this._onKeyDown);
  }

  protected override render(): TemplateResult {
    let parsedItems: SplitMenuItem[] = [];
    if (this.items) {
      try { parsedItems = JSON.parse(this.items) as SplitMenuItem[]; }
      catch { /* ignore */ }
    }

    return buttonSplitTemplate({
      label:       this.label,
      variant:     this.variant,
      size:        this.size,
      dark:        this.dark,
      disabled:    this.disabled,
      menuOpen:    this._open,
      items:       parsedItems,
      onMainClick:  (e: Event): void => this._onMainClick(e),
      onArrowClick: (e: Event): void => this._onArrowClick(e),
    });
  }

  private _onMainClick(e: Event): void {
    this.dispatchEvent(new CustomEvent('ui-lib-split-action', {
      detail: { originalEvent: e },
      bubbles: true,
      composed: true,
    }));
  }

  private _onArrowClick(e: Event): void {
    e.stopPropagation();
    this._open = !this._open;
    this.requestUpdate();

    /* Delegación de clicks en items data-driven */
    if (this._open) {
      setTimeout((): void => {
        const menu = this.shadowRoot?.querySelector('.split-menu');
        if (!menu) return;
        menu.querySelectorAll<HTMLButtonElement>('.split-menu-item').forEach((item: HTMLButtonElement): void => {
          item.addEventListener('click', (ev: Event): void => {
            ev.stopPropagation();
            this._open = false;
            this.requestUpdate();
            this.dispatchEvent(new CustomEvent('ui-lib-split-select', {
              detail: {
                value: item.dataset['value'] ?? '',
                label: item.textContent?.trim() ?? '',
              },
              bubbles: true,
              composed: true,
            }));
          }, { once: true });
        });

        /* Slot items (slotted buttons) */
        const slottedMenu = menu.querySelector<HTMLSlotElement>('slot[name="menu"]');
        if (slottedMenu) {
          slottedMenu.assignedElements().forEach((el: Element): void => {
            el.addEventListener('click', (ev: Event): void => {
              ev.stopPropagation();
              this._open = false;
              this.requestUpdate();
            }, { once: true });
          });
        }
      }, 0);
    }
  }

  private _onDocClick = (e: MouseEvent): void => {
    if (!this._open) return;
    if (!this.contains(e.target as Node) && !(this.shadowRoot?.contains(e.target as Node) ?? false)) {
      this._open = false;
      this.requestUpdate();
    }
  };

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._open) {
      this._open = false;
      this.requestUpdate();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-button-group': LibButtonGroup;
    'lib-button-sep':   LibButtonSep;
    'lib-button-split': LibButtonSplit;
  }
}