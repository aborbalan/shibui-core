import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthGuard } from '../core/auth/AuthGuard';
import { LoginPage } from '../pages/login';

const DashboardPage = lazy(() => import('../pages/dashboard').then(m => ({ default: m.DashboardPage })));

export function AppShell() {
  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ── Login (sin layout) ─────────────────────────── */}
        <Route path="login" element={<LoginPage />} />

        {/* ── Dashboard (protegido) ──────────────────────── */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
