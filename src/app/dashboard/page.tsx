'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import DashboardOverview from './components/DashboardOverview';
import WishlistPanel from './components/WishlistPanel';
import NotificationsPanel from './components/NotificationsPanel';
import ImpactLedger from './components/ImpactLedger';
import {
  LayoutDashboard,
  Package,
  Heart,
  Bell,
  Leaf,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'orders':
        return <div className="p-8">Orders Panel (Coming Soon)</div>;
      case 'wishlist':
        return <WishlistPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'impact':
        return <ImpactLedger />;
      case 'settings':
        return <div className="p-8">Settings Panel (Coming Soon)</div>;
      default:
        return <DashboardOverview />;
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'impact', label: 'Impact Ledger', icon: Leaf },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-50 border-r min-h-full p-4 flex flex-col shrink-0">
          <div className="mb-8 px-4 mt-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {user?.companyName || 'Your Company'}
            </h2>
            <p className="text-sm text-slate-500">{user?.industry || 'Industry'}</p>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
