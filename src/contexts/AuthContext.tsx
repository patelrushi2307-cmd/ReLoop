'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, PendingAction, AuthState } from '@/lib/types';

interface AuthContextType extends AuthState {
  showAuthModal: boolean;
  pendingAction: PendingAction | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (companyName: string, industry: string, email: string, password: string, city: string, state: string) => Promise<void>;
  logout: () => void;
  requireAuth: (actionDescription: string, callback: () => void) => void;
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authMessage, setAuthMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((result) => {
        setUser(result.user ?? null);
        setIsAuthenticated(Boolean(result.user));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to sign in');
      setUser(result.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      pendingAction?.callback();
      setPendingAction(null);
    } finally {
      setIsLoading(false);
    }
  }, [pendingAction]);

  const signup = useCallback(async (
    companyName: string, 
    industry: string, 
    email: string, 
    password: string, 
    city: string, 
    state: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyName, industry, email, password, city, state }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to create account');
      setUser(result.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      pendingAction?.callback();
      setPendingAction(null);
    } finally {
      setIsLoading(false);
    }
  }, [pendingAction]);

  const logout = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  const openAuthModal = useCallback((message?: string) => {
    setAuthMessage(message);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
    setPendingAction(null);
    setAuthMessage(undefined);
  }, []);

  const requireAuth = useCallback((actionDescription: string, callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setPendingAction({ description: actionDescription, callback });
      openAuthModal(`Please log in to ${actionDescription.toLowerCase()}`);
    }
  }, [isAuthenticated, openAuthModal]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      showAuthModal,
      pendingAction,
      login,
      signup,
      logout,
      requireAuth,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
