'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { Leaf, RefreshCw, MapPin } from 'lucide-react';

interface SpotlightRowProps {
  products: Product[];
  onInspect3D: (productId: string) => void;
}

export default function SpotlightRow({ products, onInspect3D }: SpotlightRowProps) {
  // Extract collections
  const topCarbonSavers = products.filter(p => p.topCarbonSaver || p.co2Savings >= 500).slice(0, 4);
  const freeClaims = products.filter(p => p.isFreeReallocation || p.pricePerUnit === 0).slice(0, 3);
  const nearbyLots = products.filter(p => (p.distanceKm || 50) <= 25).slice(0, 4);

  return (
    <div className="space-y-6 my-8">
      {/* 3-Column Spotlight Feature Cards (Alibaba style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Top Carbon Savers */}
        <div className="bg-gradient-to-br from-emerald-950/90 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Leaf className="w-3.5 h-3.5" /> High Impact
              </span>
              <span className="text-xs text-slate-400 font-medium">Rankings</span>
            </div>
            <h3 className="text-lg font-bold font-display mb-1">Top Carbon Savers</h3>
            <p className="text-xs text-slate-300 mb-4">Embodied CO₂ avoidance over 500 kg per lot</p>

            <div className="grid grid-cols-2 gap-2">
              {topCarbonSavers.slice(0, 2).map(item => (
                <div 
                  key={item.id}
                  onClick={() => onInspect3D(item.id)}
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-2 cursor-pointer transition-colors group"
                >
                  <div className="h-16 rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[11px] font-semibold truncate">{item.title}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">-{item.co2Savings} kg CO₂</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Zero-Cost Circular Claims */}
        <div className="bg-gradient-to-br from-blue-950/90 to-slate-900 border border-blue-500/30 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <RefreshCw className="w-3.5 h-3.5" /> ₹0 Claim
              </span>
              <span className="text-xs text-blue-300 font-medium">Free Lots</span>
            </div>
            <h3 className="text-lg font-bold font-display mb-1">Zero-Cost Reallocations</h3>
            <p className="text-xs text-slate-300 mb-4">Claim free surplus lots diverted directly from landfill</p>

            <div className="grid grid-cols-2 gap-2">
              {freeClaims.slice(0, 2).map(item => (
                <div 
                  key={item.id}
                  onClick={() => onInspect3D(item.id)}
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-2 cursor-pointer transition-colors group"
                >
                  <div className="h-16 rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[11px] font-semibold truncate">{item.title}</p>
                  <p className="text-[10px] text-blue-400 font-bold">FREE (₹0)</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Nearby Surplus Stock */}
        <div className="bg-gradient-to-br from-amber-950/90 to-slate-900 border border-amber-500/30 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <MapPin className="w-3.5 h-3.5" /> &lt; 30 km
              </span>
              <span className="text-xs text-amber-300 font-medium">Fast Dispatch</span>
            </div>
            <h3 className="text-lg font-bold font-display mb-1">Nearby Surplus Lots</h3>
            <p className="text-xs text-slate-300 mb-4">Lowest freight emission route radius</p>

            <div className="grid grid-cols-2 gap-2">
              {nearbyLots.slice(0, 2).map(item => (
                <div 
                  key={item.id}
                  onClick={() => onInspect3D(item.id)}
                  className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-2 cursor-pointer transition-colors group"
                >
                  <div className="h-16 rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-[11px] font-semibold truncate">{item.title}</p>
                  <p className="text-[10px] text-amber-400 font-bold">{item.distanceKm || 12} km away</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
