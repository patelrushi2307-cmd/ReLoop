import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  Upload,
  Sparkles,
} from 'lucide-react';

export default function DriverExecution() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();

  const [stops, setStops] = useState([
    {
      id: 's1',
      type: 'pickup',
      facility: 'Rotterdam Circular Hub (HQ)',
      address: 'Maashaven Zuidzijde 12, 3072 AE Rotterdam',
      timeWindow: '08:00 – 09:30',
      tradeId: 'TR-4091',
      lot: '18,500kg rHDPE Rigid Flakes',
      completed: true,
      completedAt: '08:42',
      verificationCode: 'REL-8921-OK',
    },
    {
      id: 's2',
      type: 'pickup',
      facility: 'Breda Secondary Yard',
      address: 'Spinveld 45, 4815 HV Breda',
      timeWindow: '11:00 – 12:30',
      tradeId: 'TR-4105',
      lot: '4,200kg rPP Dark Flakes',
      completed: false,
      completedAt: null,
      verificationCode: '',
    },
    {
      id: 's3',
      type: 'delivery',
      facility: 'Antwerp Processing Depot',
      address: 'Haven 1025, 2030 Antwerp',
      timeWindow: '14:30 – 16:00',
      tradeId: 'Consolidated Benelux Delivery',
      lot: 'All Loaded Lots',
      completed: false,
      completedAt: null,
      verificationCode: '',
    },
  ]);

  const [activeScanStopId, setActiveScanStopId] = useState(null);
  const [inputCode, setInputCode] = useState('');

  const handleCompleteStop = (stopId) => {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId
          ? {
              ...s,
              completed: true,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              verificationCode: inputCode || 'REL-VERIFIED-77',
            }
          : s
      )
    );
    setActiveScanStopId(null);
    setInputCode('');
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-6 py-6 flex flex-col gap-6">
      
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
              Driver Manifest #{shipmentId || 'SH-8821'}
            </span>
            <h1 className="text-2xl font-extrabold text-black tracking-tight mt-0.5">
              Stop-by-Stop Route Execution View
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#7201FF]">
            Volvo FH Electric #12
          </span>
        </div>
      </div>

      {/* Ordered Stops List */}
      <div className="flex flex-col gap-4">
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className={`p-6 rounded-3xl border shadow-xs transition-all flex flex-col gap-4 ${
              stop.completed
                ? 'bg-gray-50/80 border-gray-200 opacity-80'
                : 'bg-white border-black ring-1 ring-black/10'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    stop.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-black text-white'
                  }`}
                >
                  {stop.completed ? <CheckCircle2 className="w-5 h-5" /> : `0${index + 1}`}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-black">
                      {stop.type.toUpperCase()}
                    </span>
                    <h3 className="text-base font-extrabold text-black">{stop.facility}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {stop.address}
                  </p>
                  <p className="text-xs font-semibold text-black mt-1">
                    Lot: {stop.lot} (Trade Ref: {stop.tradeId})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-gray-500 font-medium block">Time Window</span>
                <span className="text-xs font-extrabold text-black">{stop.timeWindow}</span>
                {stop.completed && (
                  <span className="text-[11px] font-mono font-bold text-emerald-700 block mt-1">
                    ✓ Completed at {stop.completedAt}
                  </span>
                )}
              </div>
            </div>

            {/* Scan / Complete Action */}
            {!stop.completed && (
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-600 font-medium">
                  Scan facility custody transfer QR code or enter security PIN:
                </span>

                {activeScanStopId === stop.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter Transfer PIN..."
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="p-2 rounded-xl border border-gray-200 text-xs font-mono font-bold w-40 focus:ring-1 focus:ring-[#7201FF] outline-hidden"
                    />
                    <button
                      onClick={() => handleCompleteStop(stop.id)}
                      className="px-4 py-2 bg-[#7201FF] hover:bg-purple-700 text-white rounded-full text-xs font-bold transition-colors shadow-xs"
                    >
                      Confirm Stop
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveScanStopId(stop.id)}
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-[#8FFE01]" />
                    <span>Scan Transfer QR &amp; Confirm Stop</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
