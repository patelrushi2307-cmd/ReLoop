import React from 'react';

export default function CargoCell({
  label = 'B2R',
  className = '',
}) {
  return (
    <div
      className={`relative bg-[#F4F4F6]/90 border border-[#D5D5DA] rounded-xl p-2 h-full flex items-center justify-center select-none shadow-2xs ${className}`}
    >
      <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-500 font-mono">
        {label}
      </span>
    </div>
  );
}

