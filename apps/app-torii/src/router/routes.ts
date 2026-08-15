import type { RouteDefinition } from '@open-cells/core/types';

/**
 * Mapa de rutas de torii.
 *
 * Dos cosas que Open Cells no perdona:
 *  - Se navega por `name`, nunca por `path`. Dos rutas con el mismo nombre se
 *    pisan la una a la otra.
 *  - La 404 es la ruta con `notFound: true`. Sin ella, un path desconocido no
 *    renderiza nada — ni error, ni página en blanco con aviso: nada.
 */
export const routes: RouteDefinition[] = [
  {
    path: '/',
    name: 'home',
    component: 'torii-home',
    action: async () => {
      await import('../pages/home/torii-home.component');
    },
  },
  {
    path: '/arquitectura',
    name: 'arquitectura',
    component: 'torii-arquitectura',
    action: async () => {
      await import('../pages/arquitectura/torii-arquitectura.component');
    },
  },
  {
    path: '/salud',
    name: 'salud',
    component: 'torii-health',
    action: async () => {
      await import('../pages/health/torii-health.component');
    },
  },
  {
    path: '/deploys',
    name: 'deploys',
    component: 'torii-deploys',
    action: async () => {
      await import('../pages/deploys/torii-deploys.component');
    },
  },
  {
    path: '/404',
    name: 'not-found',
    notFound: true,
    component: 'torii-not-found',
    action: async () => {
      await import('../pages/not-found/torii-not-found.component');
    },
  },
];
