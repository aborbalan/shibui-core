import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  { 
    path: '', 
    //loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    //loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) 
  }
];