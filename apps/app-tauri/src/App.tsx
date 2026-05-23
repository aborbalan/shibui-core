import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { AuthProvider } from './core/auth/AuthProvider';
import { LibCanvas } from '@shibui-ui/ui/react';

function App() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <LibCanvas katachi="terminal">
          <AppShell />
        </LibCanvas>
      </AuthProvider>
    </MemoryRouter>
  );
}

export default App;
