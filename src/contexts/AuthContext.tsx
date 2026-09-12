'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, PendingAction, AuthState } from '@/lib/types';
import { MOCK_USER } from '@/lib/mock-data';

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
    // Check for existing session
    const storedUser = localStorage.getItem('reloop_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (email && password) {
          // Validated mock credentials
        }
        setUser(MOCK_USER);
        setIsAuthenticated(true);
        localStorage.setItem('reloop_user', JSON.stringify(MOCK_USER));
        setIsLoading(false);
        setShowAuthModal(false);
        
        if (pendingAction) {
          pendingAction.callback();
          setPendingAction(null);
        }
        resolve();
      }, 500);
    });
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
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: companyName, // Map company name to user name for simplicity
          email,
          companyName,
          role: 'buyer', // Default role
          industry,
          location: {
            city,
            state,
            country: 'USA',
            lat: 0,
            lng: 0
          },
          sustainabilityScore: 0,
          joinedDate: new Date().toISOString()
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('reloop_user', JSON.stringify(newUser));
        setIsLoading(false);
        setShowAuthModal(false);
        
        if (pendingAction) {
          pendingAction.callback();
          setPendingAction(null);
        }
        resolve();
      }, 500);
    });
  }, [pendingAction]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('reloop_user');
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
