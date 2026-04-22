import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-private-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
      <div class="dashboard-wrapper">
        <aside> <a routerLink="/dashboard">Resumen</a>
          <a routerLink="/profile">Mi Perfil</a>
          <a routerLink="/">Cerrar Sesión</a>
        </aside>
        <section>
          <header>Panel de Control</header>
          <router-outlet></router-outlet> </section>
      </div>
    `
  })
  export class PrivateLayoutComponent {}