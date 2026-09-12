'use client';

import React, { useState, useRef } from 'react';
import { CATEGORIES } from '@/lib/mock-data';
import { useMaterials, useRecommended } from '@/features/materials/api';
import CategoryRail from './CategoryRail';
import RecommendationCarousel from './RecommendationCarousel';
import BuyersClubCard from './BuyersClubCard';
import ServicePillsBar from './ServicePillsBar';
import SpotlightRow from './SpotlightRow';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

interface CategoryPortalProps {
  onProductClick: (productId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function CategoryPortal({ onProductClick, searchQuery = '', onSearchChange }: CategoryPortalProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeConditionFilter, setActiveConditionFilter] = useState<'ALL' | 'A' | 'B' | 'FREE'>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);

  // TanStack Query style hooks
  const { data: materials, isLoading, totalPages } = useMaterials(activeCategoryId, currentPage, searchQuery);
  const { data: recommended } = useRecommended();

  // Apply condition filter client-side for rapid switching
  const displayedMaterials = materials.filter(item => {
    if (activeConditionFilter === 'A') return item.grade === 'A' || item.condition === 'A';
    if (activeConditionFilter === 'B') return item.grade === 'B' || item.condition === 'B';
    if (activeConditionFilter === 'FREE') return item.isFreeReallocation || item.pricePerUnit === 0;
    return true;
  });

  // Entrance animation for cards
  useGSAP(() => {
    gsap.fromTo('.product-card-anim', 
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: 'power2.out'
      }
    );
  }, { scope: containerRef, dependencies: [activeCategoryId, currentPage, activeConditionFilter, searchQuery] });

  return (
    <section ref={containerRef} className="py-8 md:py-12 bg-slate-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Alibaba Top Service Bar */}
        <ServicePillsBar />

        {/* 2. Alibaba 3-Column Catalog Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10 items-stretch">
          
          {/* Left Column (3 cols / ~260px): My Markets Category Rail */}
          <div className="lg:col-span-3">
            <CategoryRail 
              categories={CATEGORIES}
              selectedCategory={activeCategoryId}
              onSelectCategory={(id) => {
                setActiveCategoryId(id);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Center Column (6 cols / flex): Hero Recommendation Carousel */}
          <div className="lg:col-span-6 flex flex-col">
            <RecommendationCarousel 
              products={recommended} 
              onInspect3D={onProductClick}
            />
          </div>

          {/* Right Column (3 cols / ~280px): Buyers Club Benefits */}
          <div className="lg:col-span-3">
            <BuyersClubCard onRequestQuote={() => onProductClick(recommended[0]?.id || 'prd-001')} />
          </div>

        </div>

        {/* 3. Spotlight Collection Rows (Top Carbon Savers, Zero-Cost Claims, Nearby) */}
        <SpotlightRow products={recommended} onInspect3D={onProductClick} />

        {/* 4. Main Marketplace Catalog Grid Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Catalog Header & Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900">
                  {activeCategoryId 
                    ? CATEGORIES.find(c => c.id === activeCategoryId)?.name || 'Marketplace Listings' 
                    : 'All Industrial Material Lots'}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Showing {displayedMaterials.length} verified supplier lots • 3D WebGL Inspection & AI Defect Analysis
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
              </span>
              
              <button
                onClick={() => setActiveConditionFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeConditionFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Lots
              </button>

              <button
                onClick={() => setActiveConditionFilter('A')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeConditionFilter === 'A'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Grade A Only
              </button>

              <button
                onClick={() => setActiveConditionFilter('B')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeConditionFilter === 'B'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Grade B
              </button>

              <button
                onClick={() => setActiveConditionFilter('FREE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeConditionFilter === 'FREE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                ₹0 Free Reallocations
              </button>
            </div>
          </div>

          {/* Products Grid (Dense 10-15 Alibaba style grid) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : displayedMaterials.length > 0 ? (
            <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedMaterials.map((product) => (
                <div key={product.id} className="product-card-anim">
                  <ProductCard product={product} onClick={() => onProductClick(product.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-500 font-semibold mb-2">No material listings match your current filters.</p>
              <button
                onClick={() => {
                  setActiveCategoryId(null);
                  setActiveConditionFilter('ALL');
                  if (onSearchChange) onSearchChange('');
                }}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Clear all filters and view all lots
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === idx + 1
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
