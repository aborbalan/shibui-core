import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthGuard } from '../core/auth/AuthGuard';
import { LoginPage } from '../pages/login';

const HubPage       = lazy(() => import('../pages/hub').then(m => ({ default: m.HubPage })));
const FilesPage     = lazy(() => import('../pages/files').then(m => ({ default: m.FilesPage })));
const DashboardPage = lazy(() => import('../pages/dashboard').then(m => ({ default: m.DashboardPage })));

export function AppShell() {
  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ── Login (sin layout) ─────────────────────────── */}
        <Route path="login" element={<LoginPage />} />

        {/* ── App (protegido) ────────────────────────────── */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index            element={<HubPage />} />
          <Route path="files"     element={<FilesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
