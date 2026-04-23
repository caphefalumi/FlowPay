import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AccountsPage } from '../pages/AccountsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { FxPage } from '../pages/FxPage';
import { FraudPage } from '../pages/FraudPage';
import { NotificationsPage } from '../pages/NotificationsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export const AppRoutes = () => (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
    <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
    <Route path="/fx" element={<ProtectedRoute><FxPage /></ProtectedRoute>} />
    <Route path="/fraud" element={<ProtectedRoute><FraudPage /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
