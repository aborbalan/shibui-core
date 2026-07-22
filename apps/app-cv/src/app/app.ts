import { Component, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KatachiSwitcher } from '../components/katachi-switcher/katachi-switcher';
import { katachi, setKatachi, STORAGE_KEY } from '../state/katachi.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, KatachiSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly katachi = katachi;
  protected readonly setKatachi = setKatachi;

  constructor() {
    // Effect único escritor: refleja el katachi sobre <html> → transiciona
    // toda la página, y persiste la elección para futuras visitas.
    effect(() => {
      const value = katachi();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-katachi', value);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, value);
      }
    });
  }
}
