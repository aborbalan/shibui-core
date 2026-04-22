import { Routes } from '@angular/router';

export const PRIVATE_ROUTES: Routes = [
  { 
    path: '', // Esto sería /dashboard
    //loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'profile', // Esto sería /dashboard/profile
    //loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) 
  }
];