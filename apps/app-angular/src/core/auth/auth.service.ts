import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'admin_auth';
const ADMIN_PASSWORD = 'shibui-dev';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true'
  );

  login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.isAuthenticated.set(false);
  }
}
