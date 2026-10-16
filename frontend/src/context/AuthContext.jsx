import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('portfolio_admin_token'));
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Verify session on initial load if token exists
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token = localStorage.getItem('portfolio_admin_token');
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        if (isMounted && data?.admin) {
          setIsAuthenticated(true);
          setAdminUser(data.admin);
          localStorage.setItem('admin_auth', 'true');
          localStorage.setItem('admin_user', JSON.stringify(data.admin));
        }
      } catch (error) {
        console.warn('Authentication token verification failed:', error.message);
        if (isMounted) {
          authService.logout();
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const data = await authService.login(usernameOrEmail.trim(), password);
      if (data?.token && data?.admin) {
        localStorage.setItem('portfolio_admin_token', data.token);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        setIsAuthenticated(true);
        setAdminUser(data.admin);
        return { success: true };
      }
      return {
        success: false,
        message: 'Invalid administrative credentials.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid administrative credentials. Access restricted.',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const updateCredentials = async ({ displayName, email, currentPassword, newPassword }) => {
    try {
      const data = await authService.updateCredentials({
        displayName,
        email,
        currentPassword,
        newPassword,
      });

      if (data?.admin) {
        setAdminUser(data.admin);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        return {
          success: true,
          message: 'Administrative security credentials updated successfully.',
        };
      }
      return {
        success: false,
        message: 'Failed to update credentials.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update credentials.',
      };
    }
  };

  const revokeAllSessions = () => {
    logout();
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        loading,
        login,
        logout,
        updateCredentials,
        revokeAllSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
