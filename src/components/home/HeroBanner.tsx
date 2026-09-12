'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Leaf, ArrowRight, PackagePlus } from 'lucide-react';
import { PLATFORM_STATS } from '@/lib/mock-data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

// Simple Counter component for stats
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

interface HeroBannerProps {
  onBrowseClick: () => void;
  onSellClick: () => void;
}

export default function HeroBanner({ onBrowseClick, onSellClick }: HeroBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-badge', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-buttons', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-stats', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.2');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
      {/* Top Section - Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-16">
        
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md mb-6 pointer-events-auto">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300 tracking-wide uppercase">Circular Carbon Ecosystem</span>
        </div>

        <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl tracking-tight drop-shadow-2xl">
          The Circular <br className="md:hidden" /> Packaging Exchange
        </h1>

        <p className="hero-subtitle text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl drop-shadow-md font-light">
          Trade surplus materials. Cut carbon. Close the loop.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <button 
            onClick={onBrowseClick}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Browse Marketplace
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onSellClick}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white font-semibold backdrop-blur-md border border-slate-700 transition-all hover:scale-105 shadow-xl"
          >
            <PackagePlus className="w-5 h-5" />
            List Your Surplus
          </button>
        </div>
      </div>

      {/* Bottom Bar - Stats */}
      <div className="hero-stats w-full max-w-5xl mx-auto mb-8 px-4 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="bg-slate-900/80 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalWasteDiverted} />
            </div>
            <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Tons Diverted</div>
          </div>
          
          <div className="bg-slate-900/80 p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalCo2Saved} />
            </div>
            <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Tons CO₂ Saved</div>
          </div>
          
          <div className="bg-slate-900/80 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalCompanies} />+
            </div>
            <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Companies Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
