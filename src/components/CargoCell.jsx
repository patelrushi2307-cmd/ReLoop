import React from 'react';
import { Plus } from 'lucide-react';

export default function CargoCell({
  label = 'B2R',
  weight = '500 kg',
  route = '2-NYK-LDN',
  isSelected = false,
  showPlus = true,
  className = '',
}) {
  return (
    <div
      className={`relative bg-[#F4F4F6]/92 hover:bg-white/95 border border-[#D5D5DA] rounded-lg px-1.5 py-1 h-full flex flex-col justify-between transition-all duration-150 select-none group shadow-2xs ${
        isSelected ? 'ring-1.5 ring-[#7201FF] bg-white' : ''
      } ${className}`}
    >
      {/* Top row: Label & Weight */}
      <div className="flex items-center justify-between text-[9px] leading-none text-gray-500 font-medium">
        {label ? <span>{label}</span> : <span>&nbsp;</span>}
        {weight ? <span>{weight}</span> : <span>&nbsp;</span>}
      </div>

      {/* Center: Plus button */}
      {showPlus && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isSelected ? (
            <div className="w-5 h-5 rounded-full bg-[#7201FF] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-gray-400/80 text-gray-400 flex items-center justify-center group-hover:border-gray-600 group-hover:text-gray-700 transition-colors">
              <Plus className="w-2 h-2 stroke-[2.2]" />
            </div>
          )}
        </div>
      )}

      {/* Bottom row: Route */}
      <div className="text-[9.5px] leading-none text-gray-500 font-medium truncate">
        {route || '\u00A0'}
      </div>
    </div>
  );
}
