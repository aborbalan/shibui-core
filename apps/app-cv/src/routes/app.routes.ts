import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home').then((m) => m.HomePage),
  },
  {
    // Portfolio de Sandra Ortega Arévalo — página independiente.
    path: 'sandra',
    loadComponent: () => import('@pages/portfolio/portfolio').then((m) => m.PortfolioPage),
  },
  // Error 404 → home
  { path: '**', redirectTo: '' },
];
