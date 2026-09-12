'use client';

import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { PRODUCTS } from '@/lib/mock-data';
import { Heart, Trash2, Tag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPanel() {
  const { items, removeItem } = useWishlist();

  const wishlistIds = items.map(item => item.productId);
  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));
  const recommendations = PRODUCTS.filter(p => !wishlistIds.includes(p.id)).slice(0, 3);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
        <span className="bg-pink-100 text-pink-700 py-1 px-3 rounded-full text-sm font-medium">
          {wishlistedProducts.length} items
        </span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <Heart size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-medium text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Browse the marketplace to save items for later.</p>
          <Link href="/marketplace" className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div 
                className="h-48 w-full relative"
                style={{ background: `linear-gradient(135deg, ${product.meshColor || '#10b981'}20, ${product.meshColor || '#10b981'}40)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                </div>
                {product.id === 'p1' && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow-sm">
                    <Tag size={12} className="mr-1" /> Price Dropped!
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="text-xs font-medium text-emerald-600 mb-1">{product.category}</div>
                <h3 className="font-semibold text-slate-900 mb-1 truncate">{product.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{product.seller.companyName}</p>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{product.currency}{product.pricePerUnit.toLocaleString()}/unit</div>
                    {product.id === 'p1' && <div className="text-xs text-slate-400 line-through">{product.currency}{(product.pricePerUnit * 1.1).toLocaleString()}/unit</div>}
                  </div>
                  <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
                    Save {product.co2Savings}kg CO₂
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => removeItem(product.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-slate-200"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={20} />
                  </button>
                  <Link 
                    href={`/marketplace/${product.id}`}
                    className="flex-1 text-center py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Similar Stock Nearby</h2>
          <span className="bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded text-xs font-medium uppercase tracking-wider">
            Recommended for you
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
          {recommendations.map(product => (
            <div key={`rec-${product.id}`} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               <div className="p-5 flex items-start space-x-4">
                 <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${product.meshColor}20` }}>
                   <span className="text-2xl">📦</span>
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-medium text-slate-900 truncate">{product.title}</h3>
                   <p className="text-sm text-slate-500 truncate">{product.seller.companyName}</p>
                   <p className="text-sm font-semibold text-slate-900 mt-1">{product.currency}{product.pricePerUnit.toLocaleString()}/unit</p>
                 </div>
               </div>
               <div className="px-5 pb-5">
                  <Link 
                    href={`/marketplace/${product.id}`}
                    className="block w-full text-center py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    View Details
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
