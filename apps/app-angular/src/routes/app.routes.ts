import { Routes } from '@angular/router';
import { PrivateLayoutComponent } from 'src/templates/layouts/private-layout.component';
import { PublicLayoutComponent } from 'src/templates/layouts/public-layout.component';

export const routes: Routes = [
  // Rama Pública
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES)
  },

  // Rama Privada
  {
    path: 'dashboard',
    component: PrivateLayoutComponent,
    loadChildren: () => import('./private/private.routes').then(m => m.PRIVATE_ROUTES)
  },

  // Error 404
  { path: '**', redirectTo: '' }
];