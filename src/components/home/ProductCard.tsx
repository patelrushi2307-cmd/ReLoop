'use client';

import React from 'react';
import { Heart, MapPin, Leaf, CheckCircle2, Box, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { user, requireAuth } = useAuth();
  const { items: wishlistItems, addItem, removeItem } = useWishlist();

  const isWishlisted = wishlistItems?.some(item => item.productId === product.id) || false;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth('Sign in to save items to your company wishlist.', () => {
      if (isWishlisted) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    });
  };

  const conditionGrade = product.condition || product.grade || 'A';
  const mainImage = product.images && product.images[0]
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isFreeReallocation ? (
          <span className="bg-blue-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase tracking-wider animate-pulse">
            Free Claim
          </span>
        ) : product.topCarbonSaver ? (
          <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-md flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Top Saver
          </span>
        ) : null}

        {/* Condition Grade Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm border ${
          conditionGrade === 'A' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
          conditionGrade === 'B' ? 'bg-amber-50 text-amber-800 border-amber-300' :
          'bg-slate-100 text-slate-800 border-slate-300'
        }`}>
          Grade {conditionGrade} Condition
        </span>
      </div>

      {/* Wishlist Button Top-Right */}
      <button 
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isWishlisted 
            ? 'bg-red-50/90 text-red-500 shadow-md scale-110' 
            : 'bg-white/80 text-slate-400 hover:text-emerald-600 hover:bg-white shadow-sm border border-slate-200/50'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with Hover Zoom */}
      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* 3D Model Inspection Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-lg text-white shadow-md flex items-center gap-1 border border-slate-700">
          <Box className="w-3 h-3 text-emerald-400" /> 3D Stage
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Seller Info & Distance */}
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 truncate max-w-[150px]">
            {product.seller?.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
            <span className="truncate">{product.seller?.name || 'Packaging Hub'}</span>
          </span>
          <span className="flex items-center text-[11px] text-slate-400 font-medium flex-shrink-0">
            <MapPin className="w-3 h-3 mr-0.5 text-slate-400" /> 
            {product.distanceKm || 18} km away
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>
        
        {/* Specs Pill Summary */}
        <div className="text-[11px] text-slate-500 mb-3 line-clamp-1">
          {product.material} • Stock: {product.quantity} • MOQ: {product.moq}
        </div>

        {/* Bottom Pricing and CO2 Row */}
        <div className="mt-auto pt-2 space-y-2">
          
          <div className="flex items-baseline justify-between">
            <div>
              {product.pricePerUnit === 0 || product.isFreeReallocation ? (
                <div className="text-base font-extrabold text-blue-600">
                  FREE <span className="text-xs font-semibold text-slate-500">(₹0 / unit)</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">
                    ₹{product.pricePerUnit.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500">/ unit</span>
                </div>
              )}
            </div>
            
            {/* AI Match Badge if logged in */}
            {user && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> 94% Fit
              </span>
            )}
          </div>

          {/* Carbon Saved Pill */}
          <div className="bg-emerald-50/90 border border-emerald-100 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-emerald-800">
                Saves <span className="font-extrabold">{product.co2Savings || product.co2SavedEstimate} kg</span> CO₂e
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Inspect Button */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between group-hover:bg-emerald-50/40 transition-colors">
        <span className="text-[11px] font-medium text-slate-500">
          {product.unitsPerTruckload} / truckload
        </span>
        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Inspect 3D →
        </span>
      </div>
    </div>
  );
}
