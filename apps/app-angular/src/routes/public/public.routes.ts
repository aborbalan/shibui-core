import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/public/hero/hero').then((m) => m.Hero),
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/public/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'philosophy',
    loadComponent: () => import('@pages/public/philosophy/philosophy').then((m) => m.Philosophy),
  },
  {
    path: 'about',
    loadComponent: () => import('@pages/public/about/about').then((m) => m.About),
  },
  {
    path: 'componentes',
    loadComponent: () => import('@pages/public/componentes/componentes').then((m) => m.Componentes),
  },
  {
    path: 'componentes/:slug',
    loadComponent: () =>
      import('@pages/public/componentes-detail/componentes-detail').then(
        (m) => m.ComponentesDetail
      ),
  },
  {
    path: 'tokens',
    loadComponent: () => import('@pages/public/tokens/tokens').then((m) => m.Tokens),
  },
];
