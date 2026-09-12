'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Recycle, TreePine, Trees, Download, Share2 } from 'lucide-react';
import { MOCK_CARBON_IMPACT } from '@/lib/mock-data';

function useCountUp(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

export default function ImpactLedger() {
  const totalCo2 = useCountUp(MOCK_CARBON_IMPACT.totalCo2Saved, 2500);
  const totalWaste = useCountUp(MOCK_CARBON_IMPACT.wasteDiverted, 2500);
  const totalVirgin = useCountUp(MOCK_CARBON_IMPACT.virginMaterialDisplaced, 2500);
  const treesEquivalent = useCountUp(MOCK_CARBON_IMPACT.equivalentTreesSaved, 2500);

  const maxMonthly = Math.max(...MOCK_CARBON_IMPACT.monthlyData.map(m => m.co2Saved));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
          <Leaf size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Impact Ledger</h1>
        <p className="text-lg text-slate-500">Your company’s contribution to a circular carbon ecosystem</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Leaf size={64} /></div>
          <div className="relative z-10">
            <Leaf size={24} className="mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-1">{totalCo2.toLocaleString()} <span className="text-lg font-normal opacity-80">tons</span></div>
            <div className="text-emerald-100 font-medium">Total CO₂e Avoided</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Recycle size={64} /></div>
          <div className="relative z-10">
            <Recycle size={24} className="mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-1">{totalWaste.toLocaleString()} <span className="text-lg font-normal opacity-80">kg</span></div>
            <div className="text-blue-100 font-medium">Waste Diverted</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><TreePine size={64} /></div>
          <div className="relative z-10">
            <TreePine size={24} className="mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-1">{totalVirgin.toLocaleString()} <span className="text-lg font-normal opacity-80">tons</span></div>
            <div className="text-green-100 font-medium">Virgin Material Displaced</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Trees size={64} /></div>
          <div className="relative z-10">
            <Trees size={24} className="mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-1">{treesEquivalent.toLocaleString()} <span className="text-lg font-normal opacity-80">trees</span></div>
            <div className="text-teal-100 font-medium">Equivalent Trees Saved</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Monthly CO₂ Savings Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-2 pt-6 relative">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full h-px bg-slate-100"></div>
              ))}
            </div>
            
            {MOCK_CARBON_IMPACT.monthlyData.map((month, idx) => {
              const heightPct = (month.co2Saved / maxMonthly) * 100;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center flex-1 h-full justify-end">
                  <div className="text-sm font-medium text-slate-600 mb-2">{month.co2Saved}</div>
                  <div 
                    className="w-full max-w-[3rem] bg-gradient-to-t from-emerald-400 to-emerald-500 rounded-t-md transition-all duration-1000 ease-out"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <div className="mt-2 text-sm text-slate-500">{month.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Card */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-emerald-300 rounded-full flex items-center justify-center bg-white text-emerald-600">
              <Leaf size={28} />
            </div>
            <h3 className="font-serif text-2xl text-emerald-900 font-bold uppercase tracking-wider">Certificate</h3>
            <p className="text-sm text-emerald-800 uppercase tracking-widest font-semibold">of Environmental Impact</p>
            
            <div className="py-4 border-y border-emerald-200/60 my-4">
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-emerald-900">Bharat Steel Industries</strong> has saved <strong className="text-emerald-700">{totalCo2.toLocaleString()} tons</strong> of CO₂ through circular materials exchange.
              </p>
            </div>
            
            <p className="text-xs text-slate-500">Issued on {new Date().toLocaleDateString()}<br/>by ReLoop 3D</p>
          </div>

          <div className="flex space-x-3 mt-6 relative z-10">
            <button className="flex-1 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center justify-center hover:bg-emerald-50 transition-colors">
              <Share2 size={16} className="mr-2" /> Share
            </button>
            <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center hover:bg-emerald-700 transition-colors">
              <Download size={16} className="mr-2" /> Download
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Impact by Transaction</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-100">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Material Type</th>
                <th className="pb-3 font-medium text-right">CO₂ Saved (tons)</th>
                <th className="pb-3 font-medium text-right">Waste Diverted (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CARBON_IMPACT.transactions.map((t) => (
                <tr key={t.orderId} className="text-sm">
                  <td className="py-4 text-slate-600">{t.date}</td>
                  <td className="py-4 font-medium text-slate-900 flex items-center">
                    <Leaf size={14} className="text-emerald-500 mr-2" />
                    {t.productTitle}
                  </td>
                  <td className="py-4 text-slate-600">{t.materialType}</td>
                  <td className="py-4 text-right font-medium text-emerald-600">{t.co2Saved}</td>
                  <td className="py-4 text-right font-medium text-blue-600">{t.wasteDiverted}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-100 bg-slate-50/50">
              <tr>
                <td colSpan={3} className="py-4 font-semibold text-slate-900 px-4">Total Impact</td>
                <td className="py-4 text-right font-bold text-emerald-700">{totalCo2.toLocaleString()}</td>
                <td className="py-4 text-right font-bold text-blue-700">{totalWaste.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
