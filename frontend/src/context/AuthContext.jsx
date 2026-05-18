import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { getErrorMessage } from '../utils/helpers.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until session is resolved
  const [toasts, setToasts] = useState([]);

  // ---------- Toast system ----------
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, type = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast]
  );

  const toast = {
    success: (m) => pushToast(m, 'success'),
    error: (m) => pushToast(m, 'error'),
    info: (m) => pushToast(m, 'info'),
  };

  // ---------- Session restore on mount ----------
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('epars_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axiosInstance.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('epars_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('epars_token');
        localStorage.removeItem('epars_user');
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ---------- Auth actions ----------
  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('epars_token', data.token);
    localStorage.setItem('epars_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/signup', { name, email, password });
    localStorage.setItem('epars_token', data.token);
    localStorage.setItem('epars_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('epars_token');
    localStorage.removeItem('epars_user');
    setUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, toast, getErrorMessage }}
    >
      {children}
      {/* Toast stack — globally available */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} onClick={() => dismissToast(t.id)}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
