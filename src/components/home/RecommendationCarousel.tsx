'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Box, Eye, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/types';

interface RecommendationCarouselProps {
  products: Product[];
  onInspect3D: (productId: string) => void;
}

export default function RecommendationCarousel({ products, onInspect3D }: RecommendationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const activeProducts = products.length > 0 ? products : [];

  const handleNext = () => {
    if (activeProducts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
  };

  const handlePrev = () => {
    if (activeProducts.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
  };

  // Auto advance every 5 seconds unless paused on hover
  useEffect(() => {
    if (isPaused || activeProducts.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isPaused, activeProducts.length]);

  if (activeProducts.length === 0) return null;

  const currentItem = activeProducts[currentIndex];

  return (
    <div 
      className="relative w-full h-[360px] md:h-[420px] rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Framer Motion transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Main Background Image */}
          {currentItem.images && currentItem.images[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={currentItem.images[0]} 
              alt={currentItem.title}
              className="w-full h-full object-cover object-center brightness-75"
            />
          ) : (
            <div 
              className="w-full h-full" 
              style={{ backgroundColor: currentItem.meshColor || '#1e293b' }} 
            />
          )}

          {/* Dark Overlay Gradient for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/65 via-slate-900/15 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Slide Content Overlay */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
        
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            Featured Circular Lot
          </span>

          {currentItem.isFreeReallocation && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-sm animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              FREE REALLOCATION
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <Leaf className="w-3.5 h-3.5" />
            Saves {currentItem.co2Savings || currentItem.co2SavedEstimate} kg CO₂e
          </span>
        </div>

        {/* Bottom Details & Call to Action */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
            {currentItem.seller?.name || 'Verified Supplier'} • {currentItem.location?.city}, {currentItem.location?.state}
          </p>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 line-clamp-2 drop-shadow-md font-display">
            {currentItem.title}
          </h2>

          <p className="text-sm text-slate-300 mb-6 line-clamp-2 hidden md:block">
            {currentItem.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Price / Free Pill */}
            <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-4 py-2 rounded-2xl">
              <span className="text-xs text-slate-400 block">Listing Price</span>
              <span className="text-xl font-black text-white">
                {currentItem.pricePerUnit === 0 || currentItem.isFreeReallocation ? (
                  <span className="text-emerald-400 font-extrabold">FREE Claim (₹0)</span>
                ) : (
                  `₹${currentItem.pricePerUnit.toLocaleString()} / ${currentItem.specs?.['Unit'] || 'unit'}`
                )}
              </span>
            </div>

            {/* Inspect 3D CTA Button */}
            <button
              onClick={() => onInspect3D(currentItem.id)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <Box className="w-4 h-4" />
              Inspect in 3D
            </button>

            {/* Quick Details Trigger */}
            <button
              onClick={() => onInspect3D(currentItem.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm backdrop-blur-md border border-slate-600 transition-all"
            >
              <Eye className="w-4 h-4" />
              View Specs
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Controls: Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
        {activeProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === idx ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
