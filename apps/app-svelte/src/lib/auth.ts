import { writable } from 'svelte/store';

const STORAGE_KEY = 'admin_auth';
const ADMIN_PASSWORD = 'shibui-dev';

const initial =
  typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true';

export const isAuthenticated = writable<boolean>(initial);

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    isAuthenticated.set(true);
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  isAuthenticated.set(false);
}
