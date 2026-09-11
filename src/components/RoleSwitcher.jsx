import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function RoleSwitcher() {
  const { org, toggleCapability, togglePermission, setVerificationStatus } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const allCapabilities = [
    { id: 'seller', label: 'Seller' },
    { id: 'buyer', label: 'Buyer' },
    { id: 'recycler', label: 'Recycler' },
    { id: 'carrier', label: 'Carrier' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {/* Expanded Control Box */}
      {isOpen && (
        <div className="mb-2 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-floating border border-gray-200/90 w-72 text-xs flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="font-bold text-black flex items-center gap-1.5 text-[13px]">
              <Sparkles className="w-3.5 h-3.5 text-[#7201FF]" />
              Role &amp; Capability Switcher
            </span>
            <span className="text-[10px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              Live Test Mode
            </span>
          </div>

          {/* Capabilities */}
          <div>
            <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
              Active Org Capabilities (Multi-select)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allCapabilities.map((cap) => {
                const active = org.capabilities.includes(cap.id);
                return (
                  <button
                    key={cap.id}
                    onClick={() => toggleCapability(cap.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-all text-left flex items-center justify-between ${
                      active
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cap.label}</span>
                    {active && <CheckCircle2 className="w-3 h-3 text-[#8FFE01]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
              User Permissions
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => togglePermission('platform_admin')}
                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all text-center ${
                  org.permissions.platform_admin
                    ? 'bg-[#7201FF] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin {org.permissions.platform_admin ? '✓' : '✗'}
              </button>
              <button
                onClick={() => togglePermission('reporting')}
                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all text-center ${
                  org.permissions.reporting
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reporting {org.permissions.reporting ? '✓' : '✗'}
              </button>
            </div>
          </div>

          {/* Verification State */}
          <div>
            <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
              Verification State Machine
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'verified', label: 'Verified', color: 'bg-emerald-500' },
                { id: 'documents_submitted', label: 'Pending', color: 'bg-amber-500' },
                { id: 'unverified', label: 'Unverified', color: 'bg-rose-500' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVerificationStatus(v.id)}
                  className={`px-1.5 py-1 rounded-md text-[10.5px] font-medium transition-all text-center ${
                    org.verificationStatus === v.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3.5 bg-black hover:bg-neutral-800 text-white rounded-full shadow-floating border border-white/20 flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all hover:scale-105"
      >
        <Shield className="w-3.5 h-3.5 text-[#8FFE01]" />
        <span>Role: {org.capabilities.join(', ')}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
