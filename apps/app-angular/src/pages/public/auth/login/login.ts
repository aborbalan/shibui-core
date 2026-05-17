import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  password = signal('');
  error = signal(false);
  shake = signal(false);

  handleSubmit(e?: Event): void {
    e?.preventDefault();
    const ok = this.auth.login(this.password());
    if (ok) {
      this.router.navigate(['/admin'], { replaceUrl: true });
    } else {
      this.error.set(true);
      this.shake.set(true);
      setTimeout(() => this.shake.set(false), 500);
    }
  }
}
