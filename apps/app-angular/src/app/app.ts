import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected readonly title = signal('app-angular');
  private router = inject(Router);

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      this.router.navigateByUrl('/admin/login');
    }
  }
}
