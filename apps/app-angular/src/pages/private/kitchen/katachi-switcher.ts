import { Component, input, output } from '@angular/core';
import { KATACHI_IDS, KATACHI_KANJI, type KatachiId } from './catalog';

@Component({
  selector: 'app-katachi-switcher',
  standalone: true,
  template: `
    <div role="radiogroup" aria-label="Katachi context" class="switcher">
      <button type="button" role="radio" [attr.aria-checked]="value() === ''"
              [class.active]="value() === ''" (click)="valueChange.emit('')">
        <span class="kanji">○</span><span>none</span>
      </button>
      @for (id of ids; track id) {
        <button type="button" role="radio" [attr.aria-checked]="value() === id"
                [class.active]="value() === id" (click)="valueChange.emit(id)">
          <span class="kanji">{{ kanji[id] }}</span><span>{{ id }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .switcher { position: sticky; top: 0; z-index: 100; display: flex; flex-wrap: wrap; gap: 6px;
                padding: var(--lib-space-md); background: var(--bg-base);
                border-bottom: 1px solid var(--border-subtle); margin-bottom: var(--lib-space-lg); }
    button { appearance: none; border: 1px solid var(--border-default); background: var(--bg-elevated);
             color: var(--text-primary); padding: 8px 14px;
             font-family: var(--lib-font-mono, monospace); font-size: 0.85rem; cursor: pointer;
             display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 90px; }
    button.active { background: var(--text-primary); color: var(--bg-base); border-color: var(--text-primary); }
    .kanji { font-size: 1.1rem; }
  `],
})
export class KatachiSwitcher {
  readonly value = input<KatachiId | ''>('');
  readonly valueChange = output<KatachiId | ''>();
  readonly ids = KATACHI_IDS;
  readonly kanji = KATACHI_KANJI;
}
