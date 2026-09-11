import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  Save,
  Send,
} from 'lucide-react';

export default function ListingNew() {
  const navigate = useNavigate();
  const { listings, setListings } = useApp();

  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([
    'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
  ]);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState(null);
  const [manualConfirmed, setManualConfirmed] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Clean Post-Industrial rHDPE Flakes',
    materialType: 'rHDPE',
    subType: 'Rigid Blow-Molding Flakes',
    grade: 'Grade A',
    mass_kg: 18500,
    unit_dimensions: '120x100x110 cm',
    unit_count: 24,
    price_per_kg: 1.15,
    openToOffers: true,
    available_from: '2026-09-18',
    available_until: '2026-10-18',
    pickupConstraints: 'Dock height required. 24h notice prior to dispatch.',
  });

  // Run Mock AI Grading
  const triggerGrading = () => {
    setIsGrading(true);
    setTimeout(() => {
      setIsGrading(false);
      setGradingResult({
        detectedMaterial: 'rHDPE (High-Density Polyethylene)',
        grade: 'Grade A',
        confidence: 0.94, // Try 0.65 to test low confidence guardrail
        flags: ['Low dust content (<0.5%)', 'Melt Index: 0.75 g/10min', 'No heavy PVC trace'],
      });
      setStep(3);
    }, 1200);
  };

  const handlePublish = () => {
    const newId = `L-${Math.floor(100 + Math.random() * 900)}`;
    const newListing = {
      id: newId,
      title: formData.title,
      materialType: formData.materialType,
      subType: formData.subType,
      grade: formData.grade,
      gradeSource: gradingResult?.confidence >= 0.7 ? `AI (Confidence ${(gradingResult.confidence * 100).toFixed(0)}%)` : 'Manual Confirmed',
      mass_kg: Number(formData.mass_kg),
      price_per_kg: Number(formData.price_per_kg),
      currency: '€',
      carbon_class: 'carbon_positive',
      net_co2e_saved_kg: Math.round(Number(formData.mass_kg) * 1.35),
      distance_km: 35,
      breakeven_radius_km: 340,
      facilityName: 'Rotterdam Circular Hub (HQ)',
      sellerOrg: 'BioPolymer Labs Europe',
      isVerified: true,
      openToOffers: formData.openToOffers,
      isAuction: false,
      available_from: formData.available_from,
      available_until: formData.available_until,
      unit_dimensions: formData.unit_dimensions,
      unit_count: formData.unit_count,
      photos,
      hotspots: [
        { id: 'h1', region: 'top_deck', type: 'Uniform Granule Size', severity: 'optimal', x: 0, y: 0.2, z: 0 },
      ],
    };
    setListings([newListing, ...listings]);
    navigate(`/listings/${newId}`);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/listings')}
            className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
          </button>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Create Circular Material Listing
          </h1>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                step === s
                  ? 'bg-[#7201FF] w-6'
                  : step > s
                  ? 'bg-black'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col gap-6">
        
        {/* Step 1 & 2: Photos Upload & AI Grading */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold text-[#7201FF] uppercase tracking-wider block">
                Step 1 of 6
              </span>
              <h2 className="text-lg font-extrabold text-black mt-0.5">
                Upload Material Photos (Min. 3 Required)
              </h2>
              <p className="text-xs text-gray-600">
                Our automated vision model will analyze morphology, color consistency, and contaminant markers.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {photos.map((p, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 h-48 group">
                  <img src={p} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Photo #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  setStep(2);
                  triggerGrading();
                }}
                className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Run AI Material Grading</span>
                <Sparkles className="w-4 h-4 text-[#8FFE01]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing state */}
        {step === 2 && (
          <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[#7201FF] animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-black">
              Analyzing Material Morphology with Vision AI...
            </h3>
            <p className="text-xs text-gray-600 max-w-sm">
              Computing melt-flow index estimates, color distribution, and surface contamination flags.
            </p>
          </div>
        )}

        {/* Step 3: Grading Result & Manual Override */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[#7201FF] uppercase tracking-wider block">
                Step 2 of 6
              </span>
              <h2 className="text-lg font-extrabold text-black mt-0.5">
                Review &amp; Confirm Material Specifications
              </h2>
            </div>

            {/* AI Result Card */}
            {gradingResult && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7201FF]" />
                    AI Detected: <strong>{gradingResult.detectedMaterial}</strong>
                  </span>
                  <span className="text-xs font-bold text-[#7201FF] bg-white px-3 py-1 rounded-full border border-purple-200">
                    Confidence: {(gradingResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {gradingResult.flags.map((f, i) => (
                    <span key={i} className="text-[11px] font-semibold text-gray-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-100">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Listing Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Material Sub-Type</label>
                <input
                  type="text"
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Grade</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                >
                  <option>Grade A+</option>
                  <option>Grade A</option>
                  <option>Grade B+</option>
                  <option>Grade B</option>
                  <option>Grade C</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Total Mass (kg)</label>
                <input
                  type="number"
                  value={formData.mass_kg}
                  onChange={(e) => setFormData({ ...formData, mass_kg: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <span>Continue to Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Price Guidance Step */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[#7201FF] uppercase tracking-wider block">
                Step 3 of 6
              </span>
              <h2 className="text-lg font-extrabold text-black mt-0.5">
                Price Guidance &amp; Valuation
              </h2>
            </div>

            {/* Regression Price Guidance Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  AI Hedonic Regression Guidance
                </span>
                <span className="text-lg font-extrabold text-black font-mono">
                  €1.08 – €1.22 / kg
                </span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Based on recent {formData.grade} rHDPE contracts in Benelux region.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8FFE01] text-black">
                92% Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Set Price per kg (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_per_kg}
                  onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-bold text-base focus:ring-1 focus:ring-[#7201FF] outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.openToOffers}
                    onChange={(e) => setFormData({ ...formData, openToOffers: e.target.checked })}
                    className="w-4 h-4 rounded text-[#7201FF] focus:ring-[#7201FF] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-black">
                    Open to Counter-Offers from Qualified Buyers
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <span>Continue to Availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Availability & Constraints */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[#7201FF] uppercase tracking-wider block">
                Step 4 of 6
              </span>
              <h2 className="text-lg font-extrabold text-black mt-0.5">
                Availability Window &amp; Logistics Constraints
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Available From</label>
                <input
                  type="date"
                  value={formData.available_from}
                  onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Available Until</label>
                <input
                  type="date"
                  value={formData.available_until}
                  onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Facility Pickup Notes &amp; Constraints</label>
                <textarea
                  rows="3"
                  value={formData.pickupConstraints}
                  onChange={(e) => setFormData({ ...formData, pickupConstraints: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <span>Preview Break-Even Dome</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Break-Even Radius Preview & Publish */}
        {step === 6 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[#7201FF] uppercase tracking-wider block">
                Step 5 of 6
              </span>
              <h2 className="text-lg font-extrabold text-black mt-0.5">
                Computed Break-Even Radius &amp; Market Reach
              </h2>
            </div>

            {/* Break-even Summary Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Autonomous Carbon Solver
                </span>
                <span className="text-xl font-extrabold text-emerald-950 font-mono">
                  340 km Break-Even Radius
                </span>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Within this radius, transporting this lot saves more CO₂e than virgin synthesis.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-black">14</span>
                <span className="text-xs text-gray-700 block font-semibold">Active Buyer Matches Waiting</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(5)}
                className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/listings')}
                  className="px-5 py-2 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save as Draft</span>
                </button>
                <button
                  onClick={handlePublish}
                  className="px-7 py-2.5 bg-[#7201FF] hover:bg-purple-700 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Network</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
