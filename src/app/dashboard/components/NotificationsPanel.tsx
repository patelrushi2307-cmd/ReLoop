'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Package, TrendingDown, PackagePlus, Megaphone, Heart, CheckCircle2, Bell } from 'lucide-react';

export default function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'order': return <Package className="text-blue-500" size={20} />;
      case 'price-drop': return <TrendingDown className="text-emerald-500" size={20} />;
      case 'restock': return <PackagePlus className="text-amber-500" size={20} />;
      case 'platform': return <Megaphone className="text-purple-500" size={20} />;
      case 'wishlist': return <Heart className="text-pink-500" size={20} />;
      default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-50';
      case 'price-drop': return 'bg-emerald-50';
      case 'restock': return 'bg-amber-50';
      case 'platform': return 'bg-purple-50';
      case 'wishlist': return 'bg-pink-50';
      default: return 'bg-slate-50';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-emerald-500 text-white py-1 px-3 rounded-full text-sm font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center"
        >
          <CheckCircle2 size={16} className="mr-1" /> Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        {['all', 'order', 'price-drop', 'restock', 'platform'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === tab 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500">No notifications found.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start space-x-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                notif.read 
                  ? 'bg-white border-slate-100 hover:border-slate-200' 
                  : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'
              }`}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${getBgForType(notif.type)}`}>
                {getIconForType(notif.type)}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-base truncate ${notif.read ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-sm ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-3 flex-shrink-0"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
