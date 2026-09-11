import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TruckVisualArea from '../../components/TruckVisualArea';
import TruckLoad3D from '../../components/visuals/TruckLoad3D';
import {
  ArrowLeft,
  Box,
  Rotate3D,
  Plus,
  Sparkles,
  TrendingUp,
  Leaf,
  Scale,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function TruckLoadStudio() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('2d'); // '2d' | '3d'
  const [isSolving, setIsSolving] = useState(false);

  // 3D Packed Lots state
  const [lots, setLots] = useState([
    { id: 'LOT-1', material: 'rHDPE Regrind Flakes', mass: 18500, volume_m3: 42, w: 2.2, h: 1.1, d: 2.0, x: -3.0, y: 0.55, z: 0, color: 0x7201ff },
    { id: 'LOT-2', material: 'rPET Clear Flakes', mass: 8200, volume_m3: 20, w: 1.8, h: 1.0, d: 1.8, x: -0.5, y: 0.5, z: 0, color: 0x5a01cc },
    { id: 'LOT-3', material: 'Industrial LDPE Bales', mass: 6400, volume_m3: 16, w: 1.5, h: 0.9, d: 1.6, x: 1.8, y: 0.45, z: 0, color: 0x480199 },
  ]);

  // Solver Metrics
  const [metrics, setMetrics] = useState({
    loadFactorPct: 84,
    usedVolumeM3: 74,
    totalVolumeM3: 88,
    co2ePerKg: 0.042,
  });

  // Add nearby unclaimed lot to trigger solver re-run
  const handleAddNearbyLot = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      const newLot = {
        id: 'LOT-4',
        material: 'Secondary rPP Pellets (Rotterdam Hub)',
        mass: 3800,
        volume_m3: 9.5,
        w: 1.4,
        h: 0.85,
        d: 1.5,
        x: 3.5,
        y: 0.45,
        z: 0,
        color: 0x8ffe01,
        isNew: true,
      };
      setLots([...lots, newLot]);
      setMetrics({
        loadFactorPct: 96,
        usedVolumeM3: 83.5,
        totalVolumeM3: 88,
        co2ePerKg: 0.038, // Improved CO2e per kg with consolidated packing!
      });
      alert('Solver Re-run Completed! Additional lot packed into rear cargo space. Load factor increased to 96% with reduced CO₂e per kg.');
    }, 900);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Header */}
      <div>
        <button
          onClick={() => navigate('/logistics')}
          className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Logistics Hub
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#7201FF] tracking-wider uppercase block">
              Automated Bin-Packing Optimization
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Truck Load Studio #{shipmentId || 'SH-8821'}
            </h1>
          </div>

          {/* 2D Side Profile vs 3D Orbit View Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === '2d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>2D Trailer Grid</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === '3d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Rotate3D className="w-3.5 h-3.5" />
              <span>3D Cargo Container</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Solver Stats Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Consolidated Load Factor
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-black">
              {metrics.loadFactorPct}%
            </span>
            <span className="text-[11px] font-bold text-black bg-[#8FFE01] px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Volumetric Capacity Used
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-black">
              {metrics.usedVolumeM3} / {metrics.totalVolumeM3} m³
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Specific Transport Intensity
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-700">
              {metrics.co2ePerKg}
            </span>
            <span className="text-xs text-gray-500 font-medium">kg CO₂e / kg</span>
          </div>
        </div>

        {/* Re-Run Solver Action */}
        <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#7201FF] uppercase tracking-wider block">
              Nearby Unclaimed Lots (2)
            </span>
            <span className="text-xs font-bold text-black block mt-0.5">
              Add lot to maximize payload
            </span>
          </div>
          <button
            onClick={handleAddNearbyLot}
            disabled={isSolving || lots.length >= 4}
            className="px-3.5 py-1.5 bg-[#7201FF] hover:bg-purple-700 disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8FFE01]" />
            <span>{isSolving ? 'Solving...' : '+ Pack Lot'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio View: 2D Truck & Cargo or 3D Container */}
      {viewMode === '2d' ? (
        <TruckVisualArea />
      ) : (
        <div className="h-[480px]">
          <TruckLoad3D lots={lots} />
        </div>
      )}

      {/* Current Packed Lots Manifest */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
        <h3 className="text-xs font-bold text-black uppercase tracking-wider pb-2 border-b border-gray-100">
          Currently Packed Shipment Lots ({lots.length})
        </h3>
        <div className="divide-y divide-gray-100">
          {lots.map((lot) => (
            <div key={lot.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Box className="w-4 h-4 text-[#7201FF]" />
                <div>
                  <span className="font-extrabold text-black block">{lot.material}</span>
                  <span className="text-[11px] text-gray-500 font-mono">
                    ID: {lot.id} • Dim: {lot.w}m x {lot.h}m x {lot.d}m
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-black text-sm">
                  {lot.mass.toLocaleString()} kg
                </span>
                <span className="text-gray-500 font-mono">
                  {lot.volume_m3} m³
                </span>
                {lot.isNew && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8FFE01] text-black">
                    Dynamic Add
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
