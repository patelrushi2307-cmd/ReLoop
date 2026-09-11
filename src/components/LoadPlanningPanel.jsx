import React from 'react';
import {
  ArrowUpRight,
  Trash2,
  SlidersHorizontal,
  Columns,
  History,
  Plus,
  Package,
  Pencil,
} from 'lucide-react';

export default function LoadPlanningPanel() {
  const tableRows = [
    { id: 1, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
    { id: 2, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
    { id: 3, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
    { id: 4, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
    { id: 5, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
    { id: 6, item: '10', vehicle: 'D17_TRUCK 2', seq: '6', status: 'Planning' },
  ];

  return (
    <div className="w-[330px] bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-panel border border-gray-100 flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-medium text-gray-500 tracking-wider block">
            C2-11_1
          </span>
          <h2 className="text-[18px] font-bold text-black tracking-tight mt-0.5">
            Load Planning
          </h2>
        </div>
        <button
          title="Expand"
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
        >
          <ArrowUpRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Button Row 1 */}
      <div className="grid grid-cols-2 gap-2">
        <button className="h-9 px-3 rounded-full border border-gray-200/90 text-[12px] font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center text-center">
          Remove Assignment
        </button>
        <button className="h-9 px-3 rounded-full bg-gray-100/90 hover:bg-gray-200/90 text-[12px] font-medium text-gray-900 transition-colors flex items-center justify-center gap-1">
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Button Row 2: Clear plan + view icons */}
      <div className="flex items-center justify-between pt-0.5">
        <button className="h-8 px-3 rounded-full border border-gray-200/90 text-[11.5px] font-medium text-gray-700 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-1.5 bg-white">
          <Trash2 className="w-3.5 h-3.5 text-gray-500" />
          <span>Clear Plan</span>
        </button>

        <div className="flex items-center gap-1.5 text-gray-600">
          <button
            title="Filter/Sliders"
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
          <button
            title="Columns view"
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Columns className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
          <button
            title="History"
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <History className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
          <button
            title="Add item"
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-1">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_40px_60px_45px] text-[11px] font-semibold text-gray-700 pb-2 border-b border-gray-100 px-1">
          <span>Item</span>
          <span>Vehicle</span>
          <span>Seq...</span>
          <span></span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-50">
          {tableRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[60px_1fr_40px_60px_45px] items-center py-2.5 px-1 text-[11.5px] hover:bg-gray-50/80 rounded-lg transition-colors group"
            >
              {/* Item */}
              <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                <Package className="w-3.5 h-3.5 text-gray-600 stroke-[1.8]" />
                <span>{row.item}</span>
              </div>

              {/* Vehicle */}
              <span className="text-gray-800 font-medium truncate">
                {row.vehicle}
              </span>

              {/* Seq */}
              <span className="text-gray-500">{row.seq}</span>

              {/* Status */}
              <span className="text-[11px] text-gray-500 font-medium">
                {row.status}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5 text-gray-400 group-hover:text-gray-600">
                <button title="Edit" className="hover:text-black transition-colors">
                  <Pencil className="w-3 h-3 stroke-[1.8]" />
                </button>
                <button title="Delete" className="hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3 stroke-[1.8]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
