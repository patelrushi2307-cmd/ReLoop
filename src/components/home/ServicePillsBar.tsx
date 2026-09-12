'use client';

import React from 'react';
import { Bot, RefreshCw, Truck } from 'lucide-react';

export default function ServicePillsBar({ onRequestQuote }: { onRequestQuote?: () => void }) {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* Service 1: Request for Quotation */}
        <div 
          onClick={onRequestQuote}
          className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Request Instant AI Quote
            </h4>
            <p className="text-xs text-slate-500">One request, multiple seller quotes & AI match</p>
          </div>
        </div>

        {/* Service 2: Zero-Cost Reallocation */}
        <div className="flex items-center gap-3.5 p-2 md:pl-6 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Zero-Cost Circular Claim
            </h4>
            <p className="text-xs text-slate-500">Claim free surplus material & divert waste</p>
          </div>
        </div>

        {/* Service 3: Green Logistics */}
        <div className="flex items-center gap-3.5 p-2 md:pl-6 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Green Freight & Logistics
            </h4>
            <p className="text-xs text-slate-500">Distance & CO₂-optimized transport rates</p>
          </div>
        </div>

      </div>
    </div>
  );
}
