import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store/hooks.js';
import { loadSession } from './store/slices/authSlice.js';
import { FlashToast } from './components/common/FlashToast.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then((module) => ({ default: module.LoginPage })));
const DashboardHomePage = lazy(() => import('./pages/DashboardHomePage.jsx').then((module) => ({ default: module.DashboardHomePage })));
const DrivesPage = lazy(() => import('./pages/DrivesPage.jsx').then((module) => ({ default: module.DrivesPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx').then((module) => ({ default: module.AnalyticsPage })));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx').then((module) => ({ default: module.UsersPage })));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx').then((module) => ({ default: module.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx').then((module) => ({ default: module.ProfilePage })));

const ProtectedRoute = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm font-medium text-[var(--muted)]">Loading placement workspace...</div>}>
      <FlashToast />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="drives" element={<DrivesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
    
  );
}
