import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { showNotification } from '@/components/Notification';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: hydrate from HttpOnly cookie via /api/auth/me
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser(data.user);
          setToken(data.token);
        }
      })
      .catch((err) => {
        // 401 is expected for unauthenticated users, don't show error
        if (err.response?.status !== 401) {
          showNotification('Connection error. Please check your network.', 'error');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setToken(null);
  }, []);

  const getAuthHeaders = useCallback(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isLoggedIn: !!token,
      login,
      logout,
      getAuthHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
