'use client';

import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, FileText, PackagePlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function BuyersClubCard({ onRequestQuote }: { onRequestQuote?: () => void }) {
  const router = useRouter();
  const { user, isAuthenticated, requireAuth } = useAuth();

  return (
    <div className="w-full lg:w-72 bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Circular Buyers Benefits
          </h3>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </div>

        {/* Perks Cards */}
        <div className="space-y-2.5 mb-4">
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-2.5">
            <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-950">₹5,000 CO₂ Offset Credits</p>
              <p className="text-[11px] text-emerald-700">On your first verified circular trade</p>
            </div>
          </div>

          <div 
            onClick={onRequestQuote}
            className="p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200 flex items-start gap-2.5 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">RFQ Quote Engine</p>
              <p className="text-[11px] text-slate-500">Post custom specs & get instant quotes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Status & CTAs */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {isAuthenticated ? (
          <div className="bg-slate-900 text-white rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Member
            </div>
            <p className="text-xs font-bold truncate">{user?.companyName || 'Bharat Steel'}</p>
            <p className="text-[10px] text-slate-400">{user?.industry || 'Iron & Steel'}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 mb-2">
            Sign up to compute exact freight charges, save items, and earn carbon impact badges.
          </p>
        )}

        <button
          onClick={() => requireAuth('list surplus packaging materials.', () => router.push('/sell'))}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
        >
          <PackagePlus className="w-4 h-4" />
          List Surplus Material
        </button>

        {!isAuthenticated && (
          <button
            onClick={() => requireAuth('sign in to your company profile.', () => {})}
            className="w-full py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
          >
            Sign In / Register
          </button>
        )}
      </div>

    </div>
  );
}
