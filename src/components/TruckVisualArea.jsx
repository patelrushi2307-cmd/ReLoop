import React, { useState } from 'react';
import StatsRow from './StatsRow';
import CargoGrid from './CargoGrid';
import { Plus, Minus, Move } from 'lucide-react';

export default function TruckVisualArea() {
  const [zoomLevel, setZoomLevel] = useState(60);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 mb-6">
      <div className="relative w-full min-h-[580px] bg-gradient-to-b from-[#EDEDF0]/70 via-[#F7F7F9] to-white rounded-[28px] border border-gray-200/80 p-6 shadow-xs overflow-hidden flex flex-col justify-between">
        
        {/* Top Section: Stats Row */}
        <div className="relative z-20 flex items-center justify-start pl-16 pt-1 pb-3">
          <StatsRow />
        </div>

        {/* Central Visual Stage */}
        <div className="relative flex-1 flex items-end justify-center w-full mt-2">
          
          {/* Left: Floating Zoom Controls */}
          <div className="absolute left-1 bottom-16 flex flex-col items-center gap-4 z-30">
            {/* Vertical Slider Pill */}
            <div className="w-4 h-24 bg-gray-200/90 rounded-full flex flex-col items-center justify-start p-0.5 relative shadow-inner">
              <div
                className="w-3 h-6 bg-black rounded-full shadow-xs cursor-pointer hover:scale-105 transition-transform"
                style={{ marginTop: `${Math.max(0, Math.min(60, 100 - zoomLevel))}%` }}
              />
            </div>

            {/* Stacked + and - buttons */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(100, z + 10))}
                title="Zoom in"
                className="w-8 h-8 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(20, z - 10))}
                title="Zoom out"
                className="w-8 h-8 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Center: Responsive Truck + Cargo Overlay Container */}
          <div className="relative flex-1 max-w-[1440px] ml-14 mr-4 pb-4">
            {/* Unified Relative Wrapper: Anchors truck and cargo grid together */}
            <div className="relative w-full select-none">
              {/* Base Layer (z-1): Complete Truck + Trailer Image */}
              <img
                src="/truck-target.png"
                alt="Truck & Trailer"
                className="w-full h-auto block select-none pointer-events-none relative z-1"
              />

              {/* Overlay Layer (z-2): Cargo Grid perfectly matching trailer box coordinates */}
              <div
                className="absolute z-2"
                style={{
                  left: '29.18%',
                  top: '1.92%',
                  width: '70.59%',
                  height: '70.77%',
                }}
              >
                <CargoGrid />
              </div>
            </div>

            {/* Pan/move icon centered below trailer wheels */}
            <div className="mt-3 flex items-center justify-center">
              <button
                title="Pan view"
                className="w-8 h-8 rounded-full bg-white border border-gray-200/90 shadow-xs flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-300 transition-colors cursor-grab active:cursor-grabbing"
              >
                <Move className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

