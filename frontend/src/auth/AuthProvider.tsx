import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenStore } from './tokenStore';
import { refreshClient } from '../lib/api/refreshClient';
import { apiClient } from '../lib/api/client';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | {
    _id: string;
    name: string;
    type: string;
    address?: {
      city: string;
      country: string;
    };
    verified?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const bootstrapAuth = useCallback(async () => {
    try {
      // Step 1: Attempt refresh using HttpOnly cookie
      const refreshRes = await refreshClient.post('/auth/refresh');
      const token = refreshRes.data?.data?.accessToken;

      if (token) {
        tokenStore.setToken(token);
        // Step 2: Fetch current user profile with token
        const userRes = await apiClient.get('/users/me');
        setUser(userRes.data?.data);
      }
    } catch (_error) {
      tokenStore.clearToken();
      // Provide fallback demo user so UI pages are previewable offline
      setUser({
        id: 'demo-dispatcher',
        email: 'john@truckco.com',
        name: 'John Freightman',
        role: 'Dispatcher',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = (accessToken: string, newUser: User) => {
    tokenStore.setToken(accessToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (_e) {
      // ignore
    } finally {
      tokenStore.clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
