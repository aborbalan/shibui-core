import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthProvider } from './auth/AuthProvider';

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