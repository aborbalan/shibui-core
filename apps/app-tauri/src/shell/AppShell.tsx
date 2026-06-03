import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '../core/auth/AuthGuard';
import { LoginPage } from '../pages/login';

const MainShell     = lazy(() => import('../pages/main').then(m => ({ default: m.MainShell })));
const WorkspacePage = lazy(() => import('../pages/workspace').then(m => ({ default: m.WorkspacePage })));

export function AppShell() {
  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ── Login (sin layout) ─────────────────────────── */}
        <Route path="login" element={<LoginPage />} />

        {/* ── Ventana principal — shell de pestañas, SIN sidebar ─ */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <MainShell />
            </AuthGuard>
          }
        />

        {/* ── Workspace — tabs (Files/Git), standalone, para 2ª ventana ─ */}
        <Route
          path="workspace"
          element={
            <AuthGuard>
              <WorkspacePage />
            </AuthGuard>
          }
        />

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
