import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './components/auth/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/common/ToastProvider';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Core pages - eagerly loaded
import HomePage from './pages/HomePage';
import PersonaSelection from './pages/PersonaSelection';
import CautionFeed from './pages/CautionFeed';
import SimpleDashboard from './pages/SimpleDashboard';

// Auth pages - lazily loaded
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Legal pages
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));

// Other core pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                <Layout />
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      }
    >
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="about" element={
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      } />

      {/* Auth Routes */}
      <Route path="login" element={
        <Suspense fallback={<PageLoader />}>
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        </Suspense>
      } />
      <Route path="register" element={
        <Suspense fallback={<PageLoader />}>
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        </Suspense>
      } />

      {/* Protected Routes */}
      <Route path="dashboard" element={
        <ProtectedRoute>
          <SimpleDashboard />
        </ProtectedRoute>
      } />

      <Route path="persona-selection" element={
        <ProtectedRoute>
          <PersonaSelection />
        </ProtectedRoute>
      } />

      <Route path="cautions" element={
        <ProtectedRoute>
          <CautionFeed />
        </ProtectedRoute>
      } />

      {/* Legal Routes */}
      <Route path="privacy-policy" element={
        <Suspense fallback={<PageLoader />}>
          <PrivacyPolicyPage />
        </Suspense>
      } />
      <Route path="terms" element={
        <Suspense fallback={<PageLoader />}>
          <TermsPage />
        </Suspense>
      } />

      {/* 404 Route */}
      <Route path="*" element={
        <Suspense fallback={<PageLoader />}>
          <NotFoundPage />
        </Suspense>
      } />
    </Route>
  )
);

export default function AppSimplified() {
  return <RouterProvider router={router} />;
}
