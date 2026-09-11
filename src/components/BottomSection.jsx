import React from 'react';
import FreightUnits from './FreightUnits';
import GanttChart from './GanttChart';
import { MoreVertical } from 'lucide-react';

export default function BottomSection() {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 pb-10">
      <div className="bg-white rounded-[28px] border border-gray-200/80 p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-stretch relative">
        {/* Left: Freight Units List */}
        <FreightUnits />

        {/* Center Vertical Divider with 3-dot drag handle */}
        <div className="hidden lg:flex items-center justify-center px-1">
          <div className="h-full w-[1px] bg-gray-100 relative flex items-center justify-center">
            <div className="w-5 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black cursor-col-resize shadow-2xs">
              <MoreVertical className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Right: Gantt Chart */}
        <GanttChart />
      </div>
    </div>
  );
}
