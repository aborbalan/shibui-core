import { Injectable, signal, inject, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackgroundLogicService {
  private router = inject(Router);

  // Señal privada con la URL para consumo interno
  private _currentUrl = signal<string>(this.router.url);

  // Señal pública "computada": se actualiza sola cuando cambia la URL
  // Aquí es donde centralizas todas tus reglas de negocio
  currentVariant = computed<string>(() => {
    const url = this._currentUrl();

    if (url.includes('/login')) {
      return 'pulse';
    }

    if (url.includes('/dashboard')) {
      return 'mesh';
    }

    if (url.includes('/tokens')) {
      return 'mesh';
    }

    if (url.includes('/componentes')) {
      return 'washi-grain';
    }

    return 'washi-grain';
  });

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this._currentUrl.set(event.urlAfterRedirects);
    });
  }
}