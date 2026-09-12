'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AppNotification } from '@/lib/types';
import { NOTIFICATIONS } from '@/lib/mock-data';

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

// Templates for random notifications
const RANDOM_TEMPLATES = [
  { title: 'New Material Available', message: '10 tons of Grade A recycled PET just listed.', type: 'market' as const },
  { title: 'Price Alert', message: 'HDPE prices have dropped by 5% in your region.', type: 'alert' as const },
  { title: 'Logistics Update', message: 'Your order #4892 is out for delivery.', type: 'order' as const },
  { title: 'System Maintenance', message: 'Scheduled maintenance on Saturday 2AM UTC.', type: 'system' as const },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
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

  const addNotification = useCallback((
    notificationData: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ) => {
    const newNotification: AppNotification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notification
    setShowToast(newNotification);
    
    // Auto-dismiss after 5s
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(null);
    }, 5000);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Mock WebSocket via setInterval
  useEffect(() => {
    const scheduleNextNotification = () => {
      // Random interval between 20s and 40s
      const delay = Math.floor(Math.random() * (40000 - 20000 + 1)) + 20000;
      
      return setTimeout(() => {
        const template = RANDOM_TEMPLATES[Math.floor(Math.random() * RANDOM_TEMPLATES.length)];
        addNotification({
          title: template.title,
          message: template.message,
          type: template.type,
        });
        
        // Schedule the next one
        intervalId = scheduleNextNotification();
      }, delay);
    };

    let intervalId = scheduleNextNotification();

    return () => {
      clearTimeout(intervalId);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [addNotification]);

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
