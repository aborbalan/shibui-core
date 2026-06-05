import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
  },
  // Error 404 → home
  { path: '**', redirectTo: '' },
];
