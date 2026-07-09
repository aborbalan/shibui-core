import { Component, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KatachiSwitcher } from '../components/katachi-switcher/katachi-switcher';
import { DEFAULT_KATACHI, KATACHI_IDS, type KatachiId } from '../data/katachi';

const STORAGE_KEY = 'app-cv:katachi';

function readInitialKatachi(): KatachiId {
  if (typeof localStorage === 'undefined') return DEFAULT_KATACHI;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && (KATACHI_IDS as string[]).includes(stored)
    ? (stored as KatachiId)
    : DEFAULT_KATACHI;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, KatachiSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('app-cv');
  protected readonly katachi = signal<KatachiId>(readInitialKatachi());

  constructor() {
    // Refleja el katachi activo sobre <html> → transiciona toda la página,
    // y persiste la elección para futuras visitas.
    effect(() => {
      const value = this.katachi();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-katachi', value);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, value);
      }
    });
  }
}
