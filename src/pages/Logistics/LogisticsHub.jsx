import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle2,
  X,
  RotateCcw,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function LogisticsHub() {
  const { org, vehicles, setVehicles, proposedRoutes, setProposedRoutes, backhauls, setBackhauls } = useApp();
  const [activeTab, setActiveTab] = useState('routes'); // 'routes' | 'vehicles' | 'backhauls'
  const isCarrier = org.capabilities.includes('carrier');

  // Add Vehicle Modal State
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: 'Volvo FH Electric Mega #09',
    plate: 'NL-74-VLT',
    vehicle_class: 'Class 8 Electric Semi (53ft)',
    capacity_kg: 24000,
    volume_m3: 88,
    dimensions: '13.6m x 2.45m x 2.65m',
    baseLocation: 'Rotterdam Hub',
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    setVehicles([...vehicles, { ...newVehicle, id: `V-0${vehicles.length + 1}`, status: 'Available', activeShipmentId: null }]);
    setShowVehicleModal(false);
  };

  const handleAcceptRoute = (id) => {
    setProposedRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
    alert(`Route ${id} accepted! Driver dispatch manifest generated.`);
  };

  const handleDeclineRoute = (id) => {
    setProposedRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Header & CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Circular Logistics &amp; Fleet Hub
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white">
              Carrier Dispatch
            </span>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-0.5">
            Dynamic load consolidation, multi-stop route optimization, and empty return backhaul matching
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/logistics/load/SH-8821"
            className="h-10 px-5 bg-[#7201FF] hover:bg-purple-700 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Box className="w-4 h-4" />
            <span>Launch Truck Load Studio</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('routes')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'routes'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Route Board ({proposedRoutes.length})
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'vehicles'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          My Registered Fleet ({vehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('backhauls')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'backhauls'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Declared Backhauls ({backhauls.length})
        </button>
      </div>

      {/* Tab 1: Route Board */}
      {activeTab === 'routes' && (
        <div className="flex flex-col gap-4">
          {proposedRoutes.map((route) => (
            <div
              key={route.id}
              className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-black">
                    {route.id}
                  </span>
                  <h3 className="text-base font-extrabold text-black">{route.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                    route.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {route.status.toUpperCase()}
                  </span>
                </div>

                {/* Stops Stepper */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 mt-1">
                  {route.stops.map((s, i) => (
                    <React.Fragment key={i}>
                      <span className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 font-medium">
                        <strong>{s.time}</strong> • {s.facility} ({s.lot})
                      </span>
                      {i < route.stops.length - 1 && <span className="text-gray-300">→</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-1">
                  <span>Distance: <strong>{route.distance_km} km</strong></span>
                  <span>•</span>
                  <span>Est. Load Factor: <strong>{route.loadFactorPct}%</strong></span>
                  <span>•</span>
                  <span>Est. Revenue: <strong className="text-black font-mono">€{route.estRevenue}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <Link
                  to="/logistics/SH-8821"
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-full text-xs font-semibold text-black transition-colors"
                >
                  Driver View
                </Link>

                {route.status === 'pending' && isCarrier && (
                  <>
                    <button
                      onClick={() => handleDeclineRoute(route.id)}
                      className="px-3 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRoute(route.id)}
                      className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
                    >
                      Accept Route
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: My Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowVehicleModal(true)}
              className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-500">{v.plate}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700">
                      {v.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-black mt-1">{v.name}</h3>
                  <span className="text-xs text-gray-500 block">{v.vehicle_class}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Payload</span>
                    <span className="font-bold font-mono text-black">{(v.capacity_kg / 1000).toFixed(1)} t</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Volume</span>
                    <span className="font-bold font-mono text-black">{v.volume_m3} m³</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Base Depot</span>
                    <span className="font-semibold text-black truncate">{v.baseLocation}</span>
                  </div>
                </div>

                <Link
                  to="/logistics/load/SH-8821"
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full text-xs font-bold transition-colors text-center"
                >
                  Configure Cargo Packing
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Backhauls */}
      {activeTab === 'backhauls' && (
        <div className="flex flex-col gap-4">
          {backhauls.map((bh) => (
            <div key={bh.id} className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                  Declared Empty Return Leg
                </span>
                <h3 className="text-base font-extrabold text-black mt-0.5">
                  {bh.origin} → {bh.destination}
                </h3>
                <span className="text-xs text-gray-500">
                  Window: {bh.dateWindow} • Available: {bh.availableCapacityKg.toLocaleString()} kg ({bh.availableVolumeM3} m³)
                </span>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-[#7201FF] border border-purple-200 rounded-full text-xs font-bold">
                {bh.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddVehicle} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-gray-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-extrabold text-black text-base">Register Fleet Vehicle</span>
              <button onClick={() => setShowVehicleModal(false)} type="button">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Vehicle Name</label>
                <input
                  type="text"
                  required
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">License Plate</label>
                <input
                  type="text"
                  required
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Vehicle Class</label>
                <input
                  type="text"
                  value={newVehicle.vehicle_class}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_class: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Payload (kg)</label>
                  <input
                    type="number"
                    value={newVehicle.capacity_kg}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity_kg: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Volume (m³)</label>
                  <input
                    type="number"
                    value={newVehicle.volume_m3}
                    onChange={(e) => setNewVehicle({ ...newVehicle, volume_m3: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
