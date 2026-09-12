'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  RefreshCcw, Search, Truck, Heart, PackagePlus, 
  UserCircle, Bell, Menu, X, LogOut, LayoutDashboard,
  Leaf, ChevronDown, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ searchQuery = '', onSearchChange }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, requireAuth, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { unreadCount } = useNotifications();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchTags = [
    'Oak Skids',
    '200L Steel Drums',
    'HDPE Pallets',
    '1000L IBC Totes',
    'Free Claims',
    'Corrugated Cardboard',
    'Steel Strapping'
  ];

  const handleWishlistClick = () => {
    requireAuth('Sign in to view your company wishlist.', () => {
      router.push('/dashboard?tab=wishlist');
    });
  };

  const handleSellClick = () => {
    requireAuth('Sign in to list surplus packaging materials.', () => {
      router.push('/sell');
    });
  };

  const handleProfileClick = () => {
    if (!user) {
      requireAuth('Sign in to access your company dashboard.', () => {
        router.push('/dashboard');
      });
    } else {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800/80 shadow-md">
      
      {/* 1. Alibaba Top Banner Strip */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-1 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <Leaf className="w-3 h-3" /> Circular Carbon Ecosystem
            </span>
            <span className="hidden sm:inline text-slate-400">
              3,200 Tons CO₂ Avoided • Over 480 verified manufacturers & recyclers connected
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <Link href="/tracking" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Truck className="w-3 h-3" /> Track Shipment
            </Link>
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Impact Ledger
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (Alibaba Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                <RefreshCcw className="h-5 w-5 text-slate-950 font-bold group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black text-white tracking-tight font-display">
                    ReLoop<span className="text-emerald-400">3D</span>
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Circular Exchange
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Alibaba Style Search Bar & Quick Tags */}
          <div className="hidden md:flex flex-col flex-1 max-w-2xl mx-4">
            <div className="relative w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search surplus materials, skids, drums, totes, sellers..."
                className="w-full pl-5 pr-28 py-2.5 bg-slate-900 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              <button 
                onClick={() => {
                  const element = document.getElementById('marketplace');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute right-1 top-1 bottom-1 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                Search
              </button>
            </div>

            {/* Quick Search Tag Pills */}
            <div className="flex items-center gap-2 mt-1.5 px-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                Trending:
              </span>
              {searchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearchChange && onSearchChange(tag === 'Free Claims' ? '' : tag)}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 whitespace-nowrap transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Wishlist Button */}
            <button 
              onClick={handleWishlistClick}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-all"
              title="Company Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => router.push('/dashboard?tab=notifications')}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-all"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Sell Material CTA */}
            <button 
              onClick={handleSellClick}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <PackagePlus className="h-4 w-4 stroke-[2.5]" />
              List Material
            </button>

            {/* User Profile / Menu */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all focus:outline-none"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                  {user?.companyName ? user.companyName.charAt(0).toUpperCase() : <UserCircle className="w-5 h-5" />}
                </div>
                <span className="text-xs font-semibold max-w-[90px] truncate hidden xl:inline">
                  {user?.companyName || 'Sign In'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 py-2 z-50 backdrop-blur-xl">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.companyName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      {user.industry || 'Verified Buyer'}
                    </span>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                    Company Dashboard
                  </Link>

                  <Link 
                    href="/dashboard?tab=impact" 
                    className="flex items-center px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Leaf className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                    Impact Ledger
                  </Link>

                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-xs font-semibold text-red-400 hover:bg-slate-800 hover:text-red-300 border-t border-slate-800 mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search surplus materials..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400"
          />
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <Link href="/" className="text-xs font-semibold text-slate-300 py-1.5">Home Catalog</Link>
            <Link href="/dashboard" className="text-xs font-semibold text-slate-300 py-1.5">Dashboard & Impact</Link>
            <Link href="/tracking" className="text-xs font-semibold text-slate-300 py-1.5">Track Order</Link>
            <button onClick={handleSellClick} className="flex items-center gap-2 text-xs font-bold text-emerald-400 py-2">
              <PackagePlus className="w-4 h-4" /> List Material
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
