import React from 'react';
import CargoCell from './CargoCell';

export default function CargoGrid() {
  const cells = [
    // Row 1
    { id: 1, label: 'B2R', weight: '500 kg', route: '', showPlus: true },
    { id: 2, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 3, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 4, label: 'B2R', weight: '500 kg', route: '', showPlus: true },
    { id: 5, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 6, label: 'B2R', weight: '500 kg', route: '', showPlus: false },

    // Row 2
    { id: 7, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 8, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 9, label: 'B2R', weight: '500 kg', route: '', showPlus: true, isSelected: true },
    { id: 10, label: 'B2R', weight: '', route: '', showPlus: true },
    { id: 11, label: '', weight: '500 kg', route: '', showPlus: false },
    { id: 12, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },

    // Row 3
    { id: 13, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 14, label: 'B2R', weight: '500 kg', route: '', showPlus: true },
    { id: 15, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
    { id: 16, label: 'B2R', weight: '', route: '2-NYK-LDN', showPlus: false },
    { id: 17, label: '', weight: '500 kg', route: '', showPlus: false },
    { id: 18, label: 'B2R', weight: '500 kg', route: '2-NYK-LDN', showPlus: false },
  ];

  return (
    <div className="grid grid-cols-6 grid-rows-3 gap-1 w-full h-full p-0.5 box-border">
      {cells.map((cell) => (
        <CargoCell
          key={cell.id}
          label={cell.label}
          weight={cell.weight}
          route={cell.route}
          isSelected={cell.isSelected}
          showPlus={cell.showPlus}
        />
      ))}
    </div>
  );
}
