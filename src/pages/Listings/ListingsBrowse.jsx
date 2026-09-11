import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  List,
  Map as MapIcon,
  Upload,
  Plus,
  Filter,
  Leaf,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  X,
  Check,
} from 'lucide-react';

export default function ListingsBrowse() {
  const { listings } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [showCarbonNegative, setShowCarbonNegative] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Filter listings: hide carbon_negative by default unless toggle is on
  const filteredListings = listings.filter((item) => {
    if (!showCarbonNegative && item.carbon_class === 'carbon_negative') {
      return false;
    }
    if (selectedMaterial !== 'all' && item.materialType !== selectedMaterial) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Circular Material Listings
          </h1>
          <p className="text-xs text-gray-700 font-medium mt-0.5">
            Verified secondary polymers, industrial regrinds, and post-consumer feedstocks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Map</span>
            </button>
          </div>

          {/* Bulk Upload Button */}
          <button
            onClick={() => setShowBulkModal(true)}
            className="h-10 px-4 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-full text-xs font-semibold text-gray-800 shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Upload</span>
          </button>

          {/* Create Listing Primary CTA */}
          <Link
            to="/listings/new"
            className="h-10 px-5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Material & Grade Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-700 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'rHDPE', 'rPET', 'rLDPE', 'rPP'].map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedMaterial === mat
                  ? 'bg-[#7201FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mat === 'all' ? 'All Materials' : mat}
            </button>
          ))}
        </div>

        {/* Carbon-Negative Guardrail Filter Toggle */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCarbonNegative}
              onChange={(e) => setShowCarbonNegative(e.target.checked)}
              className="w-4 h-4 rounded text-[#7201FF] focus:ring-[#7201FF] cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">
              Show all, including carbon-negative
            </span>
          </label>
          <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
            Default: Suppressed
          </span>
        </div>

      </div>

      {/* View Mode: List vs Map */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/90 text-gray-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Material &amp; Description</th>
                  <th className="py-3.5 px-4">Grade</th>
                  <th className="py-3.5 px-4">Available Mass</th>
                  <th className="py-3.5 px-4">Facility Distance</th>
                  <th className="py-3.5 px-4">Price / kg</th>
                  <th className="py-3.5 px-4">Carbon Class</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredListings.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Material */}
                    <td className="py-4 px-6">
                      <Link to={`/listings/${l.id}`} className="block">
                        <span className="font-extrabold text-black group-hover:text-[#7201FF] text-[13px] block transition-colors">
                          {l.title}
                        </span>
                        <span className="text-[11px] text-gray-500">{l.subType}</span>
                      </Link>
                    </td>

                    {/* Grade */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-black">
                        {l.grade}
                      </span>
                    </td>

                    {/* Mass */}
                    <td className="py-4 px-4 font-mono font-bold text-black text-[12.5px]">
                      {l.mass_kg.toLocaleString()} kg
                    </td>

                    {/* Distance */}
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      {l.distance_km} km
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-mono font-bold text-black text-[13px]">
                      €{l.price_per_kg.toFixed(2)}
                    </td>

                    {/* Carbon Class Badge */}
                    <td className="py-4 px-4">
                      {l.carbon_class === 'carbon_positive' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8FFE01] text-black">
                          <Leaf className="w-3 h-3" /> Carbon Positive
                        </span>
                      ) : l.carbon_class === 'marginal' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-800">
                          Marginal (0 kg)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                          <AlertTriangle className="w-3 h-3" /> Carbon Negative
                        </span>
                      )}
                    </td>

                    {/* Action Link */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/listings/${l.id}`}
                        className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-colors inline-block"
                      >
                        View Passport
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2D Map View of Listings */
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
          <div className="h-[480px] bg-[#EAEAEA] rounded-2xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-radial from-gray-100 to-gray-300 opacity-60" />
            <div className="relative z-10 text-center max-w-md p-6 bg-white/95 rounded-2xl shadow-floating border border-gray-200">
              <MapIcon className="w-8 h-8 text-[#7201FF] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-black">2D Geospatial Facility Map</h3>
              <p className="text-xs text-gray-600 mt-1">
                Displaying {filteredListings.length} material lot pins across Benelux &amp; Rhine-Ruhr corridors with break-even radii.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {filteredListings.map((l) => (
                  <Link
                    key={l.id}
                    to={`/listings/${l.id}`}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-[#7201FF] hover:text-white rounded-full text-[11px] font-semibold transition-colors"
                  >
                    📍 {l.materialType} ({l.facilityName})
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-floating border border-gray-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 font-extrabold text-black text-base">
                <FileSpreadsheet className="w-5 h-5 text-[#7201FF]" />
                <span>Bulk Listing Import</span>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Upload lots in bulk using the standard ReLoop circular taxonomy schema or integrate directly via our ERP REST endpoint (<code className="bg-gray-100 px-1 py-0.5 rounded text-black font-mono">POST /listings/bulk</code>).
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center flex flex-col items-center gap-2 hover:border-[#7201FF] transition-colors cursor-pointer bg-gray-50">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-bold text-black">Drag CSV file here, or browse</span>
              <span className="text-[10px] text-gray-500">Supports .csv, .xlsx up to 50MB</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="text-xs font-bold text-[#7201FF] flex items-center gap-1 hover:underline">
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV Template</span>
              </button>

              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Import Lots
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
