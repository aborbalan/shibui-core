import { Routes } from '@angular/router';
import { authGuard } from 'src/core/auth/auth.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@pages/private/auth/login').then((m) => m.AdminLogin),
  },
  {
    path: 'kitchen-sink',
    canActivate: [authGuard],
    loadComponent: () => import('@pages/private/kitchen/kitchen').then((m) => m.Kitchen),
  },
  {
    path: '',
    redirectTo: 'kitchen-sink',
    pathMatch: 'full',
  },
];
