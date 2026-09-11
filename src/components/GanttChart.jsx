import React from 'react';
import {
  ChevronDown,
  Minus,
  Plus,
  LayoutGrid,
  Columns,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';

export default function GanttChart() {
  const days = [
    { title: 'Jun 14, 2024', sub: ['00-00', '06-00', '12-00', '18-00'] },
    { title: '15, Jun', sub: ['00-00', '06-00', '12-00', '18-00'] },
    { title: '16, Jun', sub: ['00-00', '06-00', '12-00', '18-00'] },
    { title: '17, Jun', sub: ['00-00', '06-00', '12-00', '18-00'] },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Title + Dropdown */}
        <div className="flex items-center gap-3">
          <h3 className="text-[17px] font-bold text-black tracking-tight">
            Gant Chart
          </h3>
          <button className="h-8 px-3 rounded-full border border-gray-200/90 bg-white text-[12px] font-medium text-gray-800 hover:border-gray-300 flex items-center gap-1.5 transition-colors shadow-2xs">
            <span>Freight Orders</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        {/* Right side: Zoom controls & View toggles */}
        <div className="flex items-center gap-4">
          {/* Zoom slider */}
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="w-20 h-3.5 bg-gray-200/90 rounded-full flex items-center px-0.5 relative">
              <div className="w-5 h-2.5 bg-black rounded-full shadow-2xs" />
            </div>
            <button className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View icons */}
          <div className="flex items-center gap-1 text-gray-600 border-l border-gray-200 pl-3">
            <button
              title="Grid view"
              className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
            <button
              title="Columns view"
              className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Columns className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
            <button
              title="Calendar"
              className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
            <button
              title="Settings"
              className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative overflow-x-auto select-none">
        <div className="min-w-[840px]">
          
          {/* Day Headers (4 days) */}
          <div className="grid grid-cols-4 border-b border-gray-100 pb-1.5">
            {days.map((day, idx) => (
              <div key={idx} className="text-left px-2">
                <span className="text-[12px] font-bold text-gray-800 tracking-tight">
                  {day.title}
                </span>
              </div>
            ))}
          </div>

          {/* Sub-hour Headers (16 slots: 4 slots per day) */}
          <div className="grid grid-cols-16 text-center text-[10px] font-semibold text-gray-700 py-2 border-b border-gray-100 relative">
            {days.flatMap((day, dayIdx) =>
              day.sub.map((slot, slotIdx) => {
                const isNowSlot = dayIdx === 1 && slotIdx === 2; // Jun 15, 12-00
                return (
                  <div
                    key={`${dayIdx}-${slotIdx}`}
                    className={`${
                      isNowSlot
                        ? 'font-bold text-black text-[11px]'
                        : 'text-gray-500'
                    }`}
                  >
                    {slot}
                  </div>
                );
              })
            )}

            {/* Red / Coral 'NOW' vertical indicator line */}
            <div
              className="absolute top-7 bottom-[-135px] w-[1.5px] bg-[#FF453A] z-30 pointer-events-none"
              style={{ left: '40.6%' }}
            />
          </div>

          {/* Gantt Bar Rows */}
          <div className="flex flex-col gap-3.5 pt-3 pb-2 relative">
            
            {/* Row 1 */}
            <div className="grid grid-cols-16 items-center h-8 relative">
              {/* Segment 1: Solid Purple (Jun 14 00:00 -> Jun 15 12:00) */}
              <div className="col-start-1 col-end-7 z-20">
                <div className="h-8 rounded-l-full bg-[#7201FF] text-white px-3.5 flex items-center justify-between text-[10.5px] font-bold shadow-2xs">
                  <span>SLO_MADRID</span>
                  <span>6477715203</span>
                </div>
              </div>

              {/* Segment 2: Gray transition bar (Jun 15 12:00 -> Jun 16 14:00) */}
              <div className="col-start-7 col-end-12 z-10 -ml-1">
                <div className="h-8 bg-[#D3D3D3]/95 text-black px-4 flex items-center justify-start text-[10.5px] font-bold">
                  <span>SLO_BERLIN</span>
                </div>
              </div>

              {/* Segment 3: Gray bar on Jun 17 */}
              <div className="col-start-12 col-end-16 z-10 ml-2">
                <div className="h-8 rounded-full bg-[#D3D3D3]/95 text-black px-3.5 flex items-center justify-between text-[10.5px] font-bold">
                  <span>SLO_BERLIN</span>
                  <span>6477715203</span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-16 items-center h-8 relative">
              {/* Segment 1: Purple (start) */}
              <div className="col-start-1 col-end-4 z-20">
                <div className="h-8 rounded-full bg-[#7201FF] text-white px-3 flex items-center justify-between text-[10.5px] font-bold shadow-2xs">
                  <span>_MADRID</span>
                  <span>6477715203</span>
                </div>
              </div>

              {/* Segment 2: Gray */}
              <div className="col-start-4 col-end-6 z-10 ml-1">
                <div className="h-8 rounded-full bg-[#D3D3D3]/95 text-black px-2 flex items-center justify-center text-[10.5px] font-bold">
                  <span>SLO_BERLIN</span>
                </div>
              </div>

              {/* Segment 3: Gray */}
              <div className="col-start-6 col-end-11 z-10 ml-1">
                <div className="h-8 rounded-full bg-[#D3D3D3]/95 text-black px-3.5 flex items-center justify-between text-[10.5px] font-bold">
                  <span>SLO_BERLIN</span>
                  <span>6477715203</span>
                </div>
              </div>

              {/* Segment 4: Solid Purple on Jun 17 */}
              <div className="col-start-11 col-end-17 z-20 ml-1">
                <div className="h-8 rounded-full bg-[#7201FF] text-white px-3.5 flex items-center justify-between text-[10.5px] font-bold shadow-2xs">
                  <span>SLO_BERLIN</span>
                  <span>6477715203</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
