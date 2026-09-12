'use client';

import { useNotifications } from '@/contexts/NotificationContext';

export function useSocketNotifications() {
  const { notifications, unreadCount, showToast, markAsRead, markAllAsRead, dismissToast } = useNotifications();

  return {
    notifications,
    unreadCount,
    showToast,
    markAsRead,
    markAllAsRead,
    dismissToast
  };
}
