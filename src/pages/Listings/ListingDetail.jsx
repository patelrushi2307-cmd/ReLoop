import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import MaterialPassport3D from '../../components/visuals/MaterialPassport3D';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Leaf,
  Scale,
  Calendar,
  Sparkles,
  Gavel,
  Calculator,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, org, facilities, trades, setTrades } = useApp();

  // Find listing or fallback
  const listing = listings.find((l) => l.id === id) || listings[0];

  // "What if?" Carbon Estimator state
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?.id || 1);
  const selectedFacility = facilities.find((f) => f.id === Number(selectedFacilityId)) || facilities[0];
  const simulatedDistance = selectedFacility.id === 1 ? 42 : selectedFacility.id === 2 ? 78 : 145;
  const simulatedNetCo2 = Math.round(listing.mass_kg * 1.35 - simulatedDistance * 12);
  const isBreakEven = simulatedNetCo2 > 0;

  // Auction State
  const [bidAmount, setBidAmount] = useState((listing.leadingBid || listing.price_per_kg) + 0.05);
  const [bids, setBids] = useState([
    { bidder: 'Circular Poly GmbH', amount: 1.38, time: '12m ago' },
    { bidder: 'Nordic Packaging NV', amount: 1.35, time: '1h ago' },
    { bidder: 'EcoPlast Polymers France', amount: 1.30, time: '3h ago' },
  ]);

  // Unverified threshold check
  const totalLotValue = listing.mass_kg * listing.price_per_kg;
  const isClaimBlocked = org.verificationStatus !== 'verified' && totalLotValue > org.verificationThreshold;

  const handlePlaceBid = () => {
    setBids([{ bidder: org.name, amount: Number(bidAmount), time: 'Just now' }, ...bids]);
    alert(`Bid of €${bidAmount}/kg submitted successfully!`);
  };

  const handleClaim = () => {
    const newTradeId = `TR-${Math.floor(4100 + Math.random() * 800)}`;
    const newTrade = {
      id: newTradeId,
      listingId: listing.id,
      material: listing.title,
      mass_kg: listing.mass_kg,
      agreedPrice: listing.price_per_kg,
      totalValue: totalLotValue,
      currency: '€',
      counterpartOrg: listing.sellerOrg,
      status: 'claimed',
      stepIndex: 0,
      escrow_state: 'held',
      pickupFacility: listing.facilityName,
      deliveryFacility: selectedFacility.name,
      shipmentId: `SH-${Math.floor(8000 + Math.random() * 900)}`,
      deliveredAt: null,
      disputeCountdownHours: null,
      originalGrade: listing.grade,
      deliveryGrade: null,
      photosOriginal: listing.photos,
      photosDelivery: [],
    };
    setTrades([newTrade, ...trades]);
    navigate(`/trades/${newTradeId}`);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => navigate('/listings')}
          className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings Browse
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#7201FF] tracking-wider uppercase block">
              Lot #{listing.id} • {listing.materialType}
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-black tracking-tight mt-0.5">
              {listing.title}
            </h1>
          </div>

          {/* Seller Trust Badge */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-200/80 shadow-xs">
            <Building className="w-4 h-4 text-gray-400" />
            <div className="text-xs">
              <span className="text-gray-500 block text-[10px]">Seller:</span>
              <span className="font-bold text-black flex items-center gap-1">
                {listing.sellerOrg}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Material Passport on Left + Action/Specs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Material Passport 3D + "What if?" Carbon Estimator */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 3D Material Passport Surface */}
          <MaterialPassport3D
            materialType={listing.materialType}
            hotspots={listing.hotspots}
            photos={listing.photos}
          />

          {/* "What If?" Carbon Estimator Widget */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#7201FF]" />
                <h3 className="text-sm font-extrabold text-black">
                  "What If?" Pre-Claim Carbon Estimator
                </h3>
              </div>
              <span className="text-[11px] font-bold text-gray-500">
                Live LCA Estimation API
              </span>
            </div>

            <p className="text-xs text-gray-600">
              Simulate net emissions saved and break-even status based on your delivery facility before submitting an offer or claiming.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-1">
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Destination Facility
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-[#7201FF] outline-hidden bg-gray-50"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Estimated Net CO₂e Outcome
                  </span>
                  <span className={`text-base font-extrabold font-mono ${isBreakEven ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isBreakEven ? `+${simulatedNetCo2.toLocaleString()} kg saved` : `${simulatedNetCo2.toLocaleString()} kg (penalty)`}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Haul Distance: {simulatedDistance} km • Break-Even: {isBreakEven ? 'Yes (Profitable)' : 'No (Excess Transport)'}
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isBreakEven ? 'bg-[#8FFE01] text-black' : 'bg-rose-100 text-rose-700'}`}>
                  {isBreakEven ? 'Carbon Positive' : 'Carbon Negative'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Specs & Claim / Auction Bidding Widget */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Spec Panel */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                Specification Passport
              </span>
              <span className="text-[10px] font-bold text-[#7201FF] bg-purple-50 px-2.5 py-0.5 rounded-full">
                {listing.gradeSource}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Polymer Family</span>
                <span className="font-extrabold text-black text-sm">{listing.materialType}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Material Sub-Type</span>
                <span className="font-semibold text-black">{listing.subType}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Certified Grade</span>
                <span className="font-bold text-black inline-block px-2 py-0.5 bg-gray-100 rounded-md mt-0.5">
                  {listing.grade}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Available Volume</span>
                <span className="font-bold text-black font-mono text-sm">
                  {listing.mass_kg.toLocaleString()} kg
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Unit Dimensions</span>
                <span className="font-medium text-black">{listing.unit_dimensions || '120x100x110 cm'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Packaging Type</span>
                <span className="font-medium text-black">{listing.unit_count || 24} Gaylord Boxes</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Available Window</span>
                <span className="font-medium text-black">{listing.available_from} → {listing.available_until}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Origin Facility</span>
                <span className="font-medium text-black">{listing.facilityName}</span>
              </div>
            </div>

            {/* Price & Value Banner */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Unit Price
                </span>
                <span className="text-2xl font-black text-black font-mono">
                  €{listing.price_per_kg.toFixed(2)}
                  <span className="text-xs text-gray-500 font-sans font-normal"> / kg</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Total Lot Value
                </span>
                <span className="text-lg font-extrabold text-black font-mono">
                  €{totalLotValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Auction Bidding Widget OR Static Claim CTA */}
            {listing.isAuction ? (
              /* Live Bidding Widget */
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col gap-3 mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <Gavel className="w-3.5 h-3.5 text-[#7201FF]" /> Live Auction Bidding
                  </span>
                  <span className="font-mono text-purple-700 font-bold bg-white px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2h 45m left
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Leading Bid:</span>
                  <span className="text-base font-extrabold font-mono text-black">
                    €{listing.leadingBid?.toFixed(2) || listing.price_per_kg} / kg
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-32 p-2 rounded-xl border border-purple-200 bg-white font-mono font-bold text-sm focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                  />
                  <button
                    onClick={handlePlaceBid}
                    className="flex-1 py-2 bg-[#7201FF] hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Place Live Bid
                  </button>
                </div>

                {/* Bid History */}
                <div className="mt-1 divide-y divide-purple-100 text-[11px]">
                  {bids.map((b, i) => (
                    <div key={i} className="py-1 flex items-center justify-between text-gray-700">
                      <span>{b.bidder}</span>
                      <span className="font-mono font-bold text-black">€{b.amount.toFixed(2)} ({b.time})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Static Claim & Counter Actions */
              <div className="flex flex-col gap-2.5 mt-2">
                {isClaimBlocked ? (
                  /* Gated Claim Alert */
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col gap-1.5">
                    <span className="font-bold flex items-center gap-1.5 text-amber-950">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Claiming Limited: High-Value Lot (€{totalLotValue.toLocaleString()})
                    </span>
                    <p className="text-[11.5px] leading-tight text-amber-800">
                      Your organisation is currently unverified. Unverified accounts cannot claim trades exceeding €{org.verificationThreshold.toLocaleString()}.
                    </p>
                    <Link
                      to="/settings/organisation"
                      className="text-xs font-bold text-amber-900 underline hover:text-black mt-1"
                    >
                      Submit Verification Documents →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleClaim}
                    className="w-full py-3 bg-[#7201FF] hover:bg-purple-700 text-white rounded-full text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Claim Lot &amp; Initiate Escrow Trade</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {listing.openToOffers && (
                  <button
                    onClick={() => alert('Counter-offer dialogue opened with seller.')}
                    className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-black rounded-full text-xs font-semibold transition-colors"
                  >
                    Submit Counter-Offer
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
