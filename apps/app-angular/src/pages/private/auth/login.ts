import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-wrapper">
      <form (submit)="$event.preventDefault(); submit()">
        <h1>Admin · Kitchen</h1>
        <p>Acceso dev — password: <code>shibui-dev</code></p>
        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          autofocus
          placeholder="password"
          [class.shake]="error()"
        />
        @if (error()) { <p class="err">password incorrecto</p> }
        <button type="submit">entrar</button>
      </form>
    </div>
  `,
  styles: [`
    .login-wrapper { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    form { display: flex; flex-direction: column; gap: 1rem; min-width: 320px; padding: 2rem;
           background: var(--bg-surface); border: 1px solid var(--border-default); }
    h1 { margin: 0; font-size: 1.5rem; }
    p { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
    code { background: var(--bg-elevated); padding: 2px 6px; border-radius: 2px; }
    input { padding: 0.6rem 0.8rem; border: 1px solid var(--border-default); background: var(--bg-base);
            color: var(--text-primary); font-family: inherit; }
    input.shake { animation: shake 0.4s; border-color: oklch(60% 0.2 25); }
    .err { color: oklch(60% 0.2 25); }
    button { padding: 0.6rem; background: var(--text-primary); color: var(--bg-base); border: none; cursor: pointer; }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  `],
})
export class AdminLogin {
  private auth = inject(AuthService);
  private router = inject(Router);

  password = '';
  error = signal(false);

  submit() {
    if (this.auth.login(this.password)) {
      this.router.navigateByUrl('/admin/kitchen-sink');
    } else {
      this.error.set(true);
      setTimeout(() => this.error.set(false), 600);
    }
  }
}
