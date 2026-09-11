import React, { useState } from 'react';
import { ChevronDown, Package } from 'lucide-react';

export default function FreightUnits() {
  const [items, setItems] = useState([
    { id: 1, code: '6477715203', weight: '100kg', checked: false },
    { id: 2, code: '6477715203', weight: '800kg', checked: false },
  ]);

  const toggleCheck = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col justify-between py-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-bold text-black tracking-tight">
          Freight Units
        </h3>

        <button className="h-8 px-3 rounded-full border border-gray-200/90 bg-white text-[12px] font-medium text-gray-800 hover:border-gray-300 flex items-center gap-1.5 transition-colors shadow-2xs">
          <span>Freight Orders</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {/* Subheader / Time column markers matching Gantt */}
      <div className="grid grid-cols-4 text-center text-[10.5px] font-semibold text-gray-700 pb-3 border-b border-gray-100 mb-3">
        <span>00-00</span>
        <span>06-00</span>
        <span>12-00</span>
        <span>18-00</span>
      </div>

      {/* Item Rows */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-xs transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              {/* Custom rounded checkbox */}
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="w-4 h-4 rounded-md border-gray-300 text-[#7201FF] focus:ring-[#7201FF] cursor-pointer"
              />
              {/* Package icon & Code */}
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-700 stroke-[2]" />
                <span className="text-[12.5px] font-semibold text-black tracking-tight">
                  {item.code}
                </span>
              </div>
            </div>

            {/* Weight */}
            <span className="text-[12px] font-semibold text-gray-800">
              {item.weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
