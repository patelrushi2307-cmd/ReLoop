import React, { useState } from 'react';
import TruckSilhouette from './TruckSilhouette';

export default function ShipmentCardsRow() {
  const [selectedId, setSelectedId] = useState(3);

  const cards = [
    { id: 1, shipmentNumber: 'USA-146279BS' },
    { id: 2, shipmentNumber: 'USA-146279BS' },
    { id: 3, shipmentNumber: 'USA-146279BS' }, // Active by default
    { id: 4, shipmentNumber: 'USA-146279BS' },
    { id: 5, shipmentNumber: 'USA-146279BS' },
  ];

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const isSelected = selectedId === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setSelectedId(card.id)}
              className={`group bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'border-2 border-[#7201FF] shadow-xs'
                  : 'border border-gray-200/90 hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              {/* Left: Label & ID */}
              <div>
                <span className="text-[11.5px] font-medium text-gray-500 block mb-0.5">
                  Shipment number
                </span>
                <span className="text-[14px] font-bold text-black tracking-tight block">
                  {card.shipmentNumber}
                </span>
              </div>

              {/* Right: Truck Silhouette */}
              <div className="pl-2">
                <TruckSilhouette className="w-16 h-7" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
