'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Recycle, Leaf, Building2 } from 'lucide-react';
import { PLATFORM_STATS } from '@/lib/mock-data';

// Hook for animating numbers when scrolled into view
function useCountUp(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

function StatCard({ 
  icon: Icon, 
  value, 
  suffix = '', 
  label, 
  isVisible 
}: { 
  icon: React.ElementType, 
  value: number, 
  suffix?: string,
  label: string,
  isVisible: boolean
}) {
  // Only start counting when visible
  const count = useCountUp(isVisible ? value : 0, 2500);

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
        <Icon className="w-8 h-8 text-emerald-400" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
        {isVisible ? count.toLocaleString() : '0'}{suffix}
      </div>
      <div className="text-slate-300 font-medium text-lg">{label}</div>
    </div>
  );
}

export default function ImpactFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 bg-gradient-to-b from-slate-900 to-emerald-950 overflow-hidden"
    >
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-800/50 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Collective Impact</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
            Every material reused is a step toward a carbon-neutral future. 
            Here is what the ReLoop 3D community has achieved so far.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCard 
            icon={Recycle} 
            value={PLATFORM_STATS.totalWasteDiverted} 
            label="Tons of Waste Diverted" 
            isVisible={isVisible}
          />
          <StatCard 
            icon={Leaf} 
            value={PLATFORM_STATS.totalCo2Saved} 
            label="Tons of CO₂ Saved" 
            isVisible={isVisible}
          />
          <StatCard 
            icon={Building2} 
            value={PLATFORM_STATS.totalCompanies} 
            suffix="+"
            label="Companies Connected" 
            isVisible={isVisible}
          />
        </div>

      </div>
    </section>
  );
}
