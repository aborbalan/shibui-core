import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('@pages/public/home/home').then(m => m.Home) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('@pages/public/auth/login/login').then(m => m.Login)
  },
];