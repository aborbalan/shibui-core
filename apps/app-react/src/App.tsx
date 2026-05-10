import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { AuthProvider } from './core/auth/AuthProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;