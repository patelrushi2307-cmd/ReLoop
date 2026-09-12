"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { ORDERS } from "@/lib/mock-data";
import { Order } from "@/lib/types";
import { motion } from "framer-motion";
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Home, 
  Leaf, 
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function TrackingPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    
    setSearched(true);
    // Mock lookup: Any valid ID from ORDERS or standard format
    const foundOrder = ORDERS.find(
      o => o.id === trackingInput || o.id === trackingInput.toUpperCase() || trackingInput.includes('4092') ? ORDERS[0] : false
    ) || (trackingInput.includes('4092') ? ORDERS[0] : null);
    
    setOrder(foundOrder);
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "In_Transit": return 1;
      case "Delivered": return 3;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Top Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Track Your Shipment
            </h1>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Enter your tracking number to see real-time shipment status, estimated delivery, and environmental impact.
            </p>

            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter tracking number, e.g. TRK-4092"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full pl-6 pr-14 py-4 rounded-full border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Try: TRK-4092, TRK-4156, TRK-4201
              </p>
            </form>
          </div>

          {/* Results Area */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {order ? (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                  
                  {/* Visual Tracker */}
                  <div className="p-8 pb-4 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <p className="text-emerald-400 text-sm font-medium mb-1">Order #{order.id}</p>
                          <h2 className="text-2xl font-bold">{order.products[0]?.product.title}</h2>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm mb-1">Est. Delivery</p>
                          <p className="text-xl font-bold flex items-center gap-2 justify-end">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* SVG Curved Path Tracker */}
                      <div className="relative h-48 w-full max-w-3xl mx-auto my-8">
                        <svg viewBox="0 0 800 200" className="w-full h-full drop-shadow-lg overflow-visible">
                          {/* Base dashed path */}
                          <path
                            d="M 100,100 C 250,20 350,180 500,100 S 650,20 700,100"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="4"
                            strokeDasharray="8 8"
                          />
                          
                          {/* Animated progress path */}
                          <motion.path
                            d="M 100,100 C 250,20 350,180 500,100 S 650,20 700,100"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: getStageIndex(order.status) === 0 ? 0.1 : getStageIndex(order.status) === 1 ? 0.5 : getStageIndex(order.status) === 3 ? 1 : 0.8 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />

                          {/* Nodes */}
                          {[
                            { cx: 100, cy: 100, icon: "package", label: "Confirmed", stage: 0 },
                            { cx: 330, cy: 100, icon: "truck", label: "In Transit", stage: 1 },
                            { cx: 550, cy: 100, icon: "map", label: "Out for Delivery", stage: 2 },
                            { cx: 700, cy: 100, icon: "home", label: "Delivered", stage: 3 }
                          ].map((node, i) => {
                            const currentStageIndex = getStageIndex(order.status);
                            const isCompleted = currentStageIndex > node.stage;
                            const isActive = currentStageIndex === node.stage;
                            
                            return (
                              <g key={i}>
                                <circle
                                  cx={node.cx}
                                  cy={node.cy}
                                  r={isActive ? 24 : 18}
                                  fill={isCompleted || isActive ? "#10b981" : "#1e293b"}
                                  stroke={isCompleted || isActive ? "#047857" : "#334155"}
                                  strokeWidth="3"
                                  className={isActive ? "animate-pulse origin-center" : ""}
                                />
                                {node.icon === "package" && <Package x={node.cx - 10} y={node.cy - 10} width="20" height="20" color={isCompleted || isActive ? "white" : "#64748b"} />}
                                {node.icon === "truck" && <Truck x={node.cx - 10} y={node.cy - 10} width="20" height="20" color={isCompleted || isActive ? "white" : "#64748b"} />}
                                {node.icon === "map" && <MapPin x={node.cx - 10} y={node.cy - 10} width="20" height="20" color={isCompleted || isActive ? "white" : "#64748b"} />}
                                {node.icon === "home" && <Home x={node.cx - 10} y={node.cy - 10} width="20" height="20" color={isCompleted || isActive ? "white" : "#64748b"} />}
                                
                                <text
                                  x={node.cx}
                                  y={node.cy + 40}
                                  textAnchor="middle"
                                  fill={isActive ? "#fff" : "#94a3b8"}
                                  className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}
                                >
                                  {node.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
                    {[
                      { title: "Order Confirmed", time: "Oct 12, 09:41 AM", desc: "Payment verified", icon: Package, stage: 0 },
                      { title: "In Transit", time: "Oct 13, 02:15 PM", desc: "Left origin facility", icon: Truck, stage: 1 },
                      { title: "Out for Delivery", time: "Pending", desc: "Arriving at destination hub", icon: MapPin, stage: 2 },
                      { title: "Delivered", time: "Pending", desc: "Signed by recipient", icon: Home, stage: 3 }
                    ].map((step, i) => {
                      const currentStage = getStageIndex(order.status);
                      const isCompleted = currentStage > step.stage;
                      const isActive = currentStage === step.stage;
                      const isFuture = currentStage < step.stage;

                      return (
                        <div key={i} className={`p-6 ${isActive ? 'bg-orange-50/50 relative' : ''}`}>
                          {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-orange-400"></div>}
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 rounded-full p-1.5 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isActive ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Clock className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isActive ? 'text-orange-900' : isFuture ? 'text-slate-400' : 'text-slate-800'}`}>
                                {step.title}
                              </h4>
                              <p className={`text-xs mt-1 ${isFuture ? 'text-slate-400' : 'text-slate-500'}`}>{step.time}</p>
                              <p className={`text-sm mt-2 ${isFuture ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Details Grid */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Shipment Details</h3>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Quantity</span>
                        <span className="font-medium text-slate-800">{order.products[0]?.quantity || 1} units</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Total Price</span>
                        <span className="font-medium text-slate-800">₹{order.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Freight Cost</span>
                        <span className="font-medium text-slate-800">Included</span>
                      </div>
                      
                      <div className="p-4 bg-emerald-50 rounded-xl flex items-start gap-3 border border-emerald-100 mt-4">
                        <Leaf className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">Environmental Impact</p>
                          <p className="text-sm text-emerald-700 mt-1">
                            This circular order saved <span className="font-bold">420 kg CO₂e</span> compared to buying new materials.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Route Information</h3>
                      
                      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:to-slate-200">
                        <div className="relative">
                          <div className="absolute left-[-2.3rem] w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow"></div>
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Origin</p>
                          <p className="font-medium text-slate-800">Seller Facility</p>
                          <p className="text-sm text-slate-500">{order.sellerId === "seller-123" ? "Mumbai, MH" : "Origin City"}</p>
                        </div>
                        
                        <div className="relative">
                          <div className={`absolute left-[-2.3rem] w-4 h-4 rounded-full border-4 border-white shadow ${getStageIndex(order.status) === 3 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                          <p className="font-medium text-slate-800">Your Facility</p>
                          <p className="text-sm text-slate-500">{order.buyerId === "buyer-456" ? "Pune, MH" : "Destination City"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-12 text-center max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <Package className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Order Found</h3>
                  <p className="text-slate-600">
                    We couldn&apos;t find an order with the tracking number &quot;{trackingInput}&quot;. Please check the number and try again.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Placeholder state */}
          {!searched && (
            <div className="mt-16 text-center opacity-50">
              <div className="inline-flex items-center justify-center p-8 bg-slate-200/50 rounded-full mb-6">
                <Truck className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-500">Awaiting tracking number...</h3>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
