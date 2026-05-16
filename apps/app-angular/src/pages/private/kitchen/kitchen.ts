import { Component, signal } from '@angular/core';
import { KatachiSwitcher } from './katachi-switcher';
import { AtomsSink } from './sections/atoms-sink';
import { MoleculesSink } from './sections/molecules-sink';
import { OrganismsSink } from './sections/organisms-sink';
import type { KatachiId } from './catalog';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [KatachiSwitcher, AtomsSink, MoleculesSink, OrganismsSink],
  template: `
    <div class="root">
      <app-katachi-switcher [value]="katachi()" (valueChange)="katachi.set($event)" />

      <div class="content" [attr.data-katachi]="katachi() || null">
        <header>
          <h1>Kitchen Sink</h1>
          <p>
            78 componentes <code>lib-*</code> bajo contexto Katachi
            <strong>{{ katachi() || 'none' }}</strong>.
            Cambia el switcher arriba para reevaluar la propagación.
          </p>
        </header>

        <app-atoms-sink />
        <app-molecules-sink />
        <app-organisms-sink />
      </div>
    </div>
  `,
  styles: [`
    .root { min-height: 100vh; background: var(--bg-base); color: var(--text-primary); }
    .content { padding: var(--lib-space-xl); display: flex; flex-direction: column; gap: var(--lib-space-2xl); }
    header { display: flex; flex-direction: column; gap: var(--lib-space-xs); }
    h1 { font-size: var(--text-3xl); margin: 0; }
    p { color: var(--text-muted); margin: 0; }
    code { background: var(--bg-elevated); padding: 2px 6px; border-radius: 2px; }
    strong { color: var(--text-primary); }
  `],
})
export class Kitchen {
  katachi = signal<KatachiId | ''>('');
}
