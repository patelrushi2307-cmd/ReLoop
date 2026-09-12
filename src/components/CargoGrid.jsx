import React from 'react';
import CargoCell from './CargoCell';

export default function CargoGrid() {
  const cells = [
    // Row 1
    { id: 1, label: 'B2R' },
    { id: 2, label: 'B2R' },
    { id: 3, label: 'B2R' },
    { id: 4, label: 'B2R' },

    // Row 2
    { id: 5, label: 'B2R' },
    { id: 6, label: 'B2R' },
    { id: 7, label: 'B2R' },
    { id: 8, label: 'B2R' },
  ];

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full h-full p-1.5 box-border">
      {cells.map((cell) => (
        <CargoCell key={cell.id} label={cell.label} />
      ))}
    </div>
  );
}

