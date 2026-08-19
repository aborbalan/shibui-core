import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { KATACHI_IDS, KATACHI_KANJI, KATACHI_LABEL, type KatachiId } from '../../data/katachi';

/**
 * Selector de katachi en formato botón + panel desplegable.
 * Dumb: recibe el katachi activo por `value` y emite el elegido por `valueChange`.
 * Fijo arriba-derecha; se oculta en impresión vía la clase `.no-print` del consumidor.
 */
@Component({
  selector: 'app-katachi-switcher',
  standalone: true,
  template: `
    <div class="switcher">
      <button
        type="button"
        class="trigger"
        [class.open]="open()"
        aria-haspopup="menu"
        [attr.aria-expanded]="open()"
        aria-label="Cambiar katachi"
        (click)="toggle($event)"
      >
        <span class="kanji" aria-hidden="true">{{ kanji[value()] }}</span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>

      @if (open()) {
        <div class="panel" role="menu" aria-label="Katachi">
          @for (id of ids; track id) {
            <button
              type="button"
              class="item"
              role="menuitemradio"
              [class.active]="value() === id"
              [attr.aria-checked]="value() === id"
              (click)="select(id)"
            >
              <span class="kanji" aria-hidden="true">{{ kanji[id] }}</span>
              <span class="label">{{ label[id] }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .switcher {
        position: fixed;
        top: var(--lib-space-md, 12px);
        right: var(--lib-space-md, 12px);
        z-index: 1000;
        font-family: var(--lib-font-mono, monospace);
      }

      .trigger {
        display: flex;
        align-items: center;
        gap: 4px;
        appearance: none;
        cursor: pointer;
        padding: 8px 10px;
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-lg);
        background: var(--bg-elevated, var(--bg-base));
        color: var(--text-primary, inherit);
        box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 0.12));
        transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
      }
      .trigger:hover,
      .trigger.open {
        border-color: var(--text-primary, currentColor);
      }
      .trigger .kanji {
        font-size: 1.15rem;
        line-height: 1;
      }
      .trigger .chevron {
        font-size: 0.9rem;
        line-height: 1;
        transition: transform 200ms ease;
      }
      .trigger.open .chevron {
        transform: rotate(180deg);
      }

      .panel {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        min-width: 220px;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-lg);
        background: var(--bg-elevated, var(--bg-base));
        box-shadow: var(--shadow-md, 0 8px 24px rgb(0 0 0 / 0.18));
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        appearance: none;
        cursor: pointer;
        width: 100%;
        text-align: left;
        padding: 8px 10px;
        border: none;
        border-radius: var(--radius-lg);
        background: transparent;
        color: var(--text-primary, inherit);
        font: inherit;
        transition: background 150ms ease, color 150ms ease;
      }
      .item:hover {
        background: var(--bg-subtle, rgb(128 128 128 / 0.12));
      }
      .item.active {
        background: var(--text-primary, currentColor);
        color: var(--bg-base, canvas);
      }
      .item .kanji {
        font-size: 1.15rem;
        line-height: 1;
        min-width: 1.6em;
        text-align: center;
      }
      .item .label {
        font-size: 0.8rem;
        letter-spacing: 0.01em;
      }
    `,
  ],
})
export class KatachiSwitcher {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly value = input<KatachiId>('shizen');
  readonly valueChange = output<KatachiId>();

  protected readonly open = signal(false);
  protected readonly ids = KATACHI_IDS;
  protected readonly kanji = KATACHI_KANJI;
  protected readonly label = KATACHI_LABEL;

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  protected select(id: KatachiId): void {
    this.valueChange.emit(id);
    this.open.set(false);
  }

  /** Cerrar al hacer click fuera del control. */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  /** Cerrar con Escape. */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }
}
