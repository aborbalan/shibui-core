import { Component, input } from '@angular/core';
import { StatusBadge } from '../status-badge';

@Component({
  selector: 'app-kitchen-item',
  standalone: true,
  imports: [StatusBadge],
  template: `
    <article class="item">
      <header>
        <h4>{{ name() }}</h4>
        <app-status-badge [name]="name()" />
        @if (note()) { <small>{{ note() }}</small> }
      </header>
      <div class="body"><ng-content /></div>
    </article>
  `,
  styles: [`
    .item { display: flex; flex-direction: column; gap: var(--lib-space-sm);
            padding: var(--lib-space-md); background: var(--bg-surface);
            border: 1px solid var(--border-subtle); border-radius: var(--radius-sm, 2px); }
    header { display: flex; align-items: center; gap: var(--lib-space-sm); flex-wrap: wrap; }
    h4 { margin: 0; font-family: var(--lib-font-mono, monospace); font-size: 0.9rem; color: var(--text-primary); }
    small { color: var(--text-muted); }
    .body { display: flex; flex-wrap: wrap; gap: var(--lib-space-sm); align-items: flex-start; }
  `],
})
export class KitchenItem {
  readonly name = input.required<string>();
  readonly note = input<string>('');
}
