import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { AuthProvider } from './core/auth/AuthProvider';

function App() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </MemoryRouter>
  );
}

export default App;
