'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { ChevronRight, Grid } from 'lucide-react';
import Image from 'next/image';

interface CategoryRailProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryRail({ categories, selectedCategory, onSelectCategory }: CategoryRailProps) {
  return (
    <aside className="w-full lg:w-64 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
          <Grid className="w-4 h-4 text-emerald-600" />
          My Markets
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">Live Lots</span>
      </div>

      <nav className="space-y-1 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
        {/* All Categories Option */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === null || selectedCategory === 'all'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              selectedCategory === null || selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              All
            </div>
            <span>All Categories</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === null ? 'translate-x-0.5 text-emerald-600' : 'text-slate-400'}`} />
        </button>

        {/* Category Rows */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Category Thumbnail Image */}
                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                  {cat.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cat.thumbnailUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                      {cat.name.substring(0, 2)}
                    </div>
                  )}
                </div>
                <span className="truncate text-left">{cat.name}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  {cat.count || cat.listingCount || 0}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-emerald-600' : 'text-slate-300 group-hover:text-slate-500'}`} />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
