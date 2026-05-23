import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthGuard } from '../core/auth/AuthGuard';
import { LoginPage } from '../pages/login';
import { SectionPlaceholder } from '../pages/section-placeholder';

const HubPage       = lazy(() => import('../pages/hub').then(m => ({ default: m.HubPage })));
const FilesPage     = lazy(() => import('../pages/files').then(m => ({ default: m.FilesPage })));
const DashboardPage = lazy(() => import('../pages/dashboard').then(m => ({ default: m.DashboardPage })));

export function AppShell() {
  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ── Login (sin layout) ─────────────────────────── */}
        <Route path="login" element={<LoginPage />} />

        {/* ── Hub — pantalla standalone, sin sidebar ─────── */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <HubPage />
            </AuthGuard>
          }
        />

        {/* ── Secciones — con DashboardLayout + sidebar ──── */}
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route path="files"     element={<FilesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="code"      element={<SectionPlaceholder section="Code"     icon="code" />} />
          <Route path="security"  element={<SectionPlaceholder section="Security" icon="shield-check" />} />
          <Route path="settings"  element={<SectionPlaceholder section="Settings" icon="gear-six" />} />
        </Route>

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
