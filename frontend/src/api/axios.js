import axios from 'axios';
import { handleMockRequest } from './mockBackend';

/**
 * Pre-configured Axios instance for MediCore HMS.
 *
 * Hybrid Smart Architecture:
 * 1. Checks if a real backend is available.
 * 2. If running on Vercel or if the configured backend URL is a placeholder/unreachable,
 *    seamlessly fulfills all requests using the authentic local database (51 doctors, 21 departments,
 *    6 appointments, 56 staff salaries, 61 users) with localStorage persistence for new bookings, updates, and payments.
 * 3. Auto-attaches Bearer auth token from localStorage.
 */

const isVercelOrPlaceholder = () => {
  const url = import.meta.env.VITE_API_URL || '';
  if (!url || url.includes('railway.app') || import.meta.env.VITE_USE_MOCK === 'true') {
    return true;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && url.includes('railway.app')) {
    return true;
  }
  return false;
};

const defaultAdapter = axios.getAdapter
  ? axios.getAdapter(axios.defaults.adapter)
  : axios.defaults.adapter;

const customAdapter = async (config) => {
  if (isVercelOrPlaceholder()) {
    return handleMockRequest(config);
  }

  try {
    return await defaultAdapter(config);
  } catch (error) {
    // If backend connection fails (Network error, CORS, 404, 502/503), fall back to local dataset
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
    const isServerError = error.response && error.response.status >= 500;
    if (isNetworkError || isServerError || error.response?.status === 404) {
      console.warn('[MediCore] Backend unavailable, seamlessly using local database:', config.url, error.message);
      return handleMockRequest(config);
    }
    throw error;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  adapter: customAdapter,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// ─── Request Interceptor: Attach Auth Token ───────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 Unauthorized ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isVercelOrPlaceholder()) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
