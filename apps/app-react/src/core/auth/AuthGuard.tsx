import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Guardamos la ruta a la que intentaba acceder para redirigir tras login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}