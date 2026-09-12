'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import DashboardOverview from './components/DashboardOverview';
import WishlistPanel from './components/WishlistPanel';
import NotificationsPanel from './components/NotificationsPanel';
import ImpactLedger from './components/ImpactLedger';
import OrdersPanel from './components/OrdersPanel';
import {
  LayoutDashboard,
  Package,
  Heart,
  Bell,
  Leaf,
  Settings,
  List,
  ShoppingCart,
} from 'lucide-react';
import ListingsPanel from './components/ListingsPanel';
import SellerOrdersPanel from './components/SellerOrdersPanel';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const validTabs = ['overview', 'orders', 'listings', 'sell-orders', 'wishlist', 'notifications', 'impact', 'settings'];
  const [activeTab, setActiveTab] = useState(validTabs.includes(requestedTab ?? '') ? requestedTab ?? 'overview' : 'overview');

  useEffect(() => {
    setActiveTab(validTabs.includes(requestedTab ?? '') ? requestedTab ?? 'overview' : 'overview');
  }, [requestedTab]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      openAuthModal('Sign in to access your company dashboard.');
    }
  }, [isLoading, isAuthenticated, openAuthModal, router]);

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
        return <OrdersPanel />;
      case 'listings':
        return <ListingsPanel />;
      case 'sell-orders':
        return <SellerOrdersPanel />;
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
    { id: 'listings', label: 'My Listings', icon: List },
    { id: 'sell-orders', label: 'Sell Orders', icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'impact', label: 'Impact Ledger', icon: Leaf },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-100 border-r border-slate-300 min-h-full p-4 flex flex-col shrink-0">
          <div className="mb-8 px-4 mt-4 rounded-2xl border border-slate-300 bg-slate-200 p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-600 mb-2">Workspace</p>
            <h2 className="text-lg font-semibold text-slate-900">
              {user?.companyName || 'Your Company'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{user?.industry || 'Industry'}</p>
          </div>
          
          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.replace(`/dashboard?tab=${item.id}`, { scroll: false });
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all border ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-200 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
