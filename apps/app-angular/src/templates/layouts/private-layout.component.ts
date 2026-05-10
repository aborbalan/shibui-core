import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-private-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
      <div class="dashboard-wrapper">
        <section>
          <router-outlet></router-outlet> </section>
      </div>
    `
  })
  export class PrivateLayoutComponent {}