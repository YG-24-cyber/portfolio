import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response.data.data or fallback, handle 401
apiClient.interceptors.response.use(
  (response) => {
    if (response?.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';

    if (status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('portfolio_admin_token');
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
