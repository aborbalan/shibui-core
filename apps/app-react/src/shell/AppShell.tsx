import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthGuard } from '../core/auth/AuthGuard';
import { LoginPage } from '../pages/login';
import { useAdminShortcut } from '../core/hooks/useAdminShortcut';

// — Público —
const HomePage = lazy(() => import('../pages/hero').then(m => ({ default: m.HomePage })));
const ComponentsPage = lazy(() => import('../pages/components').then(m => ({ default: m.ComponentsPage })));
const ComponentDetailPage = lazy(() => import('../pages/components/ComponentDetailPage').then(m => ({ default: m.ComponentDetailPage })));
const TokensPage = lazy(() => import('../pages/tokens').then(m => ({ default: m.TokensPage })));
const AboutPage = lazy(() => import('../pages/about').then(m => ({ default: m.AboutPage })));

// — Admin —
const KitchenSink = lazy(() => import('../dev/KitchenSink').then(m => ({ default: m.KitchenSink })));

export function AppShell() {
  // Ctrl + Shift + A → /admin/login
  useAdminShortcut();

  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ── Mundo público ──────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="tokens" element={<TokensPage />} />
          <Route path="componentes" element={<ComponentsPage />} />
          <Route path="componentes/:slug" element={<ComponentDetailPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* ── Login admin (sin layout) ───────────────────── */}
        <Route path="admin/login" element={<LoginPage />} />

        {/* ── Mundo admin (protegido) ────────────────────── */}
        <Route
          path="admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          {/* /admin → redirige al kitchen-sink por defecto */}
          <Route index element={<Navigate to="kitchen-sink" replace />} />
          <Route path="kitchen-sink" element={<KitchenSink />} />
          {/* Aquí irán creciendo las rutas admin */}
        </Route>

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}