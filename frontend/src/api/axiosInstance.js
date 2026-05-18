import axios from 'axios';

// Base URL is configurable via Vite env. Falls back to localhost for dev.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — auto-attach the JWT from localStorage.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('epars_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — on 401, clear stale session.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('epars_token');
      localStorage.removeItem('epars_user');
      // Avoid redirect loop on the auth pages themselves
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
