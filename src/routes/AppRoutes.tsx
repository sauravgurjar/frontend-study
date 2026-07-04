import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AuthCallback from '../pages/AuthCallback';
import { ProtectedRoute } from './ProtectedRoute';
import { CurrentAffairsDetail } from '../features/dashboard/CurrentAffairsDetail';
import { DashboardShell } from '../features/dashboard/DashboardShell';
import { ResourceHubPage } from '../features/dashboard/ResourceHubPage';
import { TopNavPage } from '../features/dashboard/TopNavPage';
import { DailyCAPage } from '../features/dashboard/DailyCAPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/feed/:articleId"
        element={
          <ProtectedRoute>
            <CurrentAffairsDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/resources/:resourceId"
        element={
          <ProtectedRoute>
            <DashboardShell>
              <ResourceHubPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/daily-ca"
        element={
          <ProtectedRoute>
            <DashboardShell showSidebar={false}>
              <DailyCAPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:sectionId"
        element={
          <ProtectedRoute>
            <DashboardShell>
              <TopNavPage />
            </DashboardShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};
