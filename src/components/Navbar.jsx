import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Settings,
  RefreshCw,
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { org, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const baseNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Listings', path: '/listings' },
    { name: 'Requirements', path: '/requirements' },
    { name: 'Matches', path: '/matches' },
    { name: 'Trades', path: '/trades' },
    { name: 'Logistics', path: '/logistics' },
    { name: 'Impact', path: '/impact' },
    { name: 'Network', path: '/network' },
  ];

  // Conditional Nav Items
  const navItems = [...baseNavItems];
  if (org.permissions.platform_admin) {
    navItems.push({ name: 'Admin', path: '/admin', isSpecial: true });
  }
  if (org.permissions.reporting && !navItems.some((i) => i.name === 'Compliance')) {
    navItems.push({ name: 'Compliance', path: '/impact?view=compliance' });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="w-full bg-[#F5F5F7] px-6 pt-4 pb-2 border-b border-gray-200/60 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        
        {/* Left: ReLoop Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-sm group-hover:bg-[#7201FF] transition-colors">
            <RefreshCw className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[19px] font-extrabold tracking-tight text-black leading-none">
              ReLoop
            </span>
            <span className="text-[9.5px] font-semibold text-gray-700 tracking-wider uppercase mt-0.5">
              Circular Logistics
            </span>
          </div>
        </Link>

        {/* Center: Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#EBEBED]/70 p-1 rounded-full border border-gray-200/60">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-700 hover:text-black hover:bg-white/70'
                } ${item.isSpecial ? 'ring-1 ring-[#7201FF]/40 text-[#7201FF]' : ''}`}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Notifications Drawer & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Verification Status Pill */}
          <Link
            to="/settings/organisation"
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              org.verificationStatus === 'verified'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : org.verificationStatus === 'documents_submitted'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {org.verificationStatus === 'verified' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Org</span>
              </>
            ) : org.verificationStatus === 'documents_submitted' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>Pending Review</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Unverified (&lt;€15k)</span>
              </>
            )}
          </Link>

          {/* Search Trigger */}
          <button
            title="Quick Search"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-700 transition-colors"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Notifications with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-700 transition-colors relative"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#F5F5F7]"></span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-floating border border-gray-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-black">Pending Actions &amp; Alerts</span>
                  <span className="text-[10px] text-[#7201FF] font-semibold cursor-pointer">
                    Mark read
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link}
                      onClick={() => setShowNotifications(false)}
                      className={`p-2.5 rounded-xl border text-xs transition-colors block ${
                        n.unread
                          ? 'bg-purple-50/40 border-purple-100 hover:bg-purple-50/70'
                          : 'bg-gray-50/60 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-black mb-0.5">
                        <span className="truncate">{n.title}</span>
                        <span className="text-[10px] text-gray-700 font-normal">{n.date}</span>
                      </div>
                      <p className="text-[11.5px] text-gray-600 line-clamp-2 leading-tight">
                        {n.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Org Profile & Settings */}
          <Link
            to="/settings/organisation"
            className="flex items-center gap-2 pl-1 group select-none"
            title="Organisation Settings"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-white shadow-xs group-hover:ring-2 group-hover:ring-[#7201FF] transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8FFE01] border-2 border-[#F5F5F7] rounded-full"></span>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-700 group-hover:text-black transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}
