import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowGlobe from '../../components/visuals/FlowGlobe';
import {
  Globe2,
  Filter,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function NetworkGlobe() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Network Flow Globe &amp; Trade Corridors
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white">
              3D Spatial Engine
            </span>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-0.5">
            Full macroscopic view of circular material arcs, regional break-even domes, and carbon trajectory
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200/80 shadow-xs">
          {['all', 'benelux', 'rhine-ruhr', 'nordic'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                selectedRegion === reg
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {reg === 'all' ? 'All European Corridors' : reg.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Full 3D Flow Globe Surface */}
      <div className="h-[620px] w-full">
        <FlowGlobe
          previewMode={false}
          onSelectFacility={(facId) => navigate(`/listings?facility=${facId}`)}
        />
      </div>

      {/* Network Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Active Trade Corridors
          </span>
          <span className="text-2xl font-extrabold font-mono text-black mt-1 block">
            14 Corridors
          </span>
          <p className="text-xs text-gray-600 mt-1">
            Highest throughput: Rotterdam ↔ Antwerp (18.5k tonnes/mo).
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Average Break-Even Reach
          </span>
          <span className="text-2xl font-extrabold font-mono text-[#7201FF] mt-1 block">
            345 km
          </span>
          <p className="text-xs text-gray-600 mt-1">
            Dynamic dome limit prevents carbon-negative haulage across borders.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Network Diversion Rate
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 mt-1 block">
            97.0%
          </span>
          <p className="text-xs text-gray-600 mt-1">
            Over 28,100 tCO₂e net saved compared to baseline incineration.
          </p>
        </div>
      </div>

    </div>
  );
}
