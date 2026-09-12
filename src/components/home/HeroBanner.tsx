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
      <div className="flex-1 flex flex-col items-center justify-start px-4 text-center pt-24 mt-16">
        
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 border border-emerald-500/30 backdrop-blur-md mb-6 pointer-events-auto shadow-sm">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 tracking-wide uppercase">Circular Carbon Ecosystem</span>
        </div>

        <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-slate-950 mb-3 max-w-4xl tracking-tight drop-shadow-sm">
          The Circular <br className="md:hidden" /> Packaging Exchange
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-slate-600 mb-5 max-w-2xl drop-shadow-sm font-light">
          Trade surplus materials. Cut carbon. Close the loop.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row gap-3 pointer-events-auto translate-y-24">
          <button 
            onClick={onBrowseClick}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Browse Marketplace
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onSellClick}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold backdrop-blur-md border border-slate-700 transition-all hover:scale-105 shadow-xl"
          >
            <PackagePlus className="w-5 h-5" />
            List Your Surplus
          </button>
        </div>
      </div>

      {/* Bottom Bar - Stats */}
      <div className="hero-stats w-full max-w-4xl mx-auto mb-3 px-4 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-300 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
          <div className="bg-white/95 px-4 py-2.5 text-center">
            <div className="text-2xl font-bold text-slate-900 leading-none mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalWasteDiverted} />
            </div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Tons Diverted</div>
          </div>
          
          <div className="bg-white/95 px-4 py-2.5 text-center">
            <div className="text-2xl font-bold text-emerald-400 leading-none mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalCo2Saved} />
            </div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Tons CO₂ Saved</div>
          </div>
          
          <div className="bg-white/95 px-4 py-2.5 text-center">
            <div className="text-2xl font-bold text-slate-900 leading-none mb-1 flex items-center justify-center gap-1">
              <AnimatedCounter target={PLATFORM_STATS.totalCompanies} />+
            </div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Companies Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
