import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

// Pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import AIRecommendations from './pages/AIRecommendations.jsx';
import Analytics from './pages/Analytics.jsx';
import NotFound from './pages/NotFound.jsx';

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loader-wrap" style={{ height: '100vh', background: 'var(--bg)' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-soft)', marginTop: '12px' }}>Loading PerformIQ...</p>
      </div>
    );
  }

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const showSidebar = user && sidebarOpen && !isAuthPage;
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-shell">
      {/* Sidebar - only shown on protected routes */}
      {showSidebar && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}
      <div className="main-area">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onMenuToggle={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees onMenuToggle={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-recommendations"
            element={
              <ProtectedRoute>
                <AIRecommendations onMenuToggle={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics onMenuToggle={toggleSidebar} />
              </ProtectedRoute>
            }
          />

          {/* Default routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
