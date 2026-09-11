import React from 'react';

export default function StatsRow() {
  const stats = [
    {
      label: 'Weight',
      value: '7,340kg',
      badgeText: '+33%',
      badgeType: 'success', // lime green
    },
    {
      label: 'Pallets',
      value: '120',
      badgeText: '+15%',
      badgeType: 'success', // lime green
    },
    {
      label: 'Alerts',
      value: '62',
      badgeText: '-22%',
      badgeType: 'purple', // purple
    },
  ];

  return (
    <div className="flex items-center gap-12 select-none">
      {stats.map((item) => (
        <div key={item.label} className="flex flex-col">
          <span className="text-[13px] font-medium text-gray-700 tracking-wide mb-1">
            {item.label}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-[28px] font-bold text-black tracking-tight leading-none">
              {item.value}
            </span>
            {item.badgeType === 'success' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8FFE01] text-black shadow-2xs">
                {item.badgeText}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7201FF] text-white shadow-2xs">
                {item.badgeText}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
