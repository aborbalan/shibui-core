import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteTrackerService {
  private router = inject(Router);

  // Exponemos una señal con la URL actual
  currentUrl = signal<string>(this.router.url);

  constructor() {
    // Nos suscribimos a los eventos de navegación
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}
