'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AppNotification } from '@/lib/types';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  showToast: AppNotification | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissToast: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showToast, setShowToast] = useState<AppNotification | null>(null);
  
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Computed unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const dismissToast = useCallback(() => {
    setShowToast(null);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    fetch('/api/notifications')
      .then((response) => response.json())
      .then((result) => setNotifications(result.data ?? []));
  }, []);

  const addNotification = useCallback((
    notificationData: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ) => {
    fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(notificationData) })
      .then((response) => response.json())
      .then(({ data: newNotification }) => {
        setNotifications(prev => [newNotification, ...prev]);
        setShowToast(newNotification);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setShowToast(null), 5000);
      });
  }, []);

  const markAsRead = useCallback((id: string) => {
    fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  useEffect(() => () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      showToast,
      markAsRead,
      markAllAsRead,
      dismissToast,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
