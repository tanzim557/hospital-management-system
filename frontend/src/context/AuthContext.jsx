import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * AuthContext
 *
 * Provides authentication state and methods to all child components.
 * Persists user session in localStorage and validates on mount.
 */
const AuthContext = createContext(null);

export function normalizeUser(userData) {
  if (!userData) return null;
  const roleName = typeof userData.role === 'object' ? userData.role?.name : (userData.role || 'patient');
  const roleDisplay = (typeof userData.role === 'object' ? userData.role?.display_name : null) || userData.role_display || (roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1) : 'User');
  return {
    ...userData,
    role: roleName,
    role_name: roleName,
    role_display: roleDisplay,
    role_object: typeof userData.role === 'object' ? userData.role : { name: roleName, display_name: roleDisplay },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Initialize: Check for existing session ──────────────────
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(normalizeUser(parsed));
        // Validate token with the server
        fetchUser().catch(() => logout());
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // ─── Fetch current user from API ─────────────────────────────
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/user');
      const userData = normalizeUser(response.data.user);
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  // ─── Login ───────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const response = await api.post('/login', { email, password });
    const userData = normalizeUser(response.data.user);
    const token = response.data.token;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  // ─── Register ────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    const response = await api.post('/register', data);
    const userData = normalizeUser(response.data.user);
    const token = response.data.token;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  // ─── Logout ──────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // Ignore errors during logout — clear local state regardless
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  // ─── Role Checks ─────────────────────────────────────────────
  const getRole = (u) => (typeof u?.role === 'object' ? u?.role?.name : u?.role);
  const hasRole = useCallback((role) => getRole(user) === role, [user]);
  const hasAnyRole = useCallback((roles) => roles.includes(getRole(user)), [user]);
  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchUser,
    hasRole,
    hasAnyRole,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
