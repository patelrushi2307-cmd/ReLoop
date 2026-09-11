import React, { useState } from 'react';
import { ArrowLeft, Lock, ChevronDown, MoreHorizontal } from 'lucide-react';

export default function PageHeader() {
  const [selectedDispatcher, setSelectedDispatcher] = useState('John Freightman');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 pt-3 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back button + Title & subtitle */}
        <div className="flex items-start gap-4">
          <button
            title="Go back"
            className="mt-1 w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>
          <div>
            <h1 className="text-[34px] font-semibold text-black tracking-tight leading-tight">
              Trucks Management
            </h1>
            <p className="text-[13px] text-[#8A8A8E] font-medium mt-0.5">
              This page shows recent dispatcher activity
            </p>
          </div>
        </div>

        {/* Right: Controls & Dispatcher Actions */}
        <div className="flex items-center gap-3">
          {/* Dispatcher Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-10 px-3.5 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center gap-2 text-[13px] font-medium text-black hover:border-gray-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-black stroke-[2]" />
              <span className="text-gray-900">
                <span className="text-gray-500 font-normal">Dispatcer:</span> {selectedDispatcher}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 stroke-[2] ml-0.5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating border border-gray-100 py-1.5 z-50">
                {['John Freightman', 'Sarah Jenkins', 'Alex Rivera', 'Marcus Vance'].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedDispatcher(name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                      selectedDispatcher === name
                        ? 'bg-purple-50 text-[#7201FF] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dispatcher avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="John Freightman"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Resent to driver primary button */}
          <button className="h-10 px-5 rounded-full bg-black hover:bg-neutral-800 text-white text-[13px] font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer">
            Resent to driver
          </button>

          {/* More options button */}
          <button
            title="More options"
            className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-300 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
