import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
      <nav class="public-nav">
        <a routerLink="/">Branding / Inicio</a>
        <a routerLink="/login">Login</a>
      </nav>
      <main>
        <router-outlet></router-outlet> </main>
    `
  })
  export class PublicLayoutComponent {}