import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('@pages/public/hero/hero').then(m => m.Hero) 
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/public/auth/login/login').then(m => m.Login)
  },
  {
    path: 'filosofia',
    loadComponent: () => import('@pages/public/filosofia/filosofia').then(m => m.FilosofiaComponent)
  },
];