import { setupServer } from 'msw/node';
import { aboutHandlers } from './about.handlers';
// Cuando añadas más dominios: import { projectsHandlers } from './projects.handlers';

export const server = setupServer(
  ...aboutHandlers,
  // ...projectsHandlers,
);