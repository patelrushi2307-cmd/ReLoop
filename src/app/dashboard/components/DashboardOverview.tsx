'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order, Product } from '@/lib/types';
import { Package, Heart, Leaf, Repeat, ChevronRight, List, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<{ orders: Order[], sellerListings: Product[], sellerOrders: Order[], impact: any }>({
    orders: [],
    sellerListings: [],
    sellerOrders: [],
    impact: null
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => response.json())
      .then((result) => setDashboardData({
        orders: result.orders ?? [],
        sellerListings: result.sellerListings ?? [],
        sellerOrders: result.sellerOrders ?? [],
        impact: result.impact
      }));
  }, []);

  const { orders, sellerListings, sellerOrders } = dashboardData;

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const firstActiveOrder = activeOrders[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'in-transit': return 'bg-amber-100 text-amber-700';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-600 mb-3">Overview</p>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.companyName || 'Company'} 👋
        </h1>
        <p className="text-slate-500 mt-2">Here&apos;s what&apos;s happening with your circular materials today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-300 rounded-xl border border-blue-500/20">
            <Package size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Active Orders</p>
            <p className="text-2xl font-semibold text-slate-900">{activeOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <List size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">My Listings</p>
            <p className="text-2xl font-semibold text-slate-900">{sellerListings.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Sell Orders</p>
            <p className="text-2xl font-semibold text-slate-900">{sellerOrders.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/20">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">CO₂ Saved (tons)</p>
            <p className="text-2xl font-semibold text-slate-900">{dashboardData.impact?.netEmissions ? (dashboardData.impact.netEmissions / 1000).toFixed(1) : '45.2'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Listings & Orders */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Listings</h2>
              <Link href="/dashboard?tab=listings" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</Link>
            </div>
            {sellerListings.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">You have no active listings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-sm border-b border-slate-200">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Interest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sellerListings.slice(0, 3).map((listing) => (
                      <tr key={listing.id} className="text-sm">
                        <td className="py-4 font-medium text-slate-900">{listing.title}</td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                            {listing.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 text-slate-600">{listing.quantity}</td>
                        <td className="py-4 font-medium text-slate-900">₹{listing.pricePerUnit.toLocaleString()}</td>
                        <td className="py-4">
                          {listing.buyerInterest?.status === 'pending' ? (
                            <span className="text-amber-600 font-medium">1 Request</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Buyer Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-200">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-4 font-medium text-slate-900">{order.id}</td>
                      <td className="py-4 text-slate-600">{order.products[0]?.product.title}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 font-medium text-slate-900">₹{order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tracking Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Delivery</h2>
          {firstActiveOrder ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500">Order {firstActiveOrder.id}</p>
                <p className="font-medium text-slate-900">{firstActiveOrder.products[0]?.product.title}</p>
              </div>

              <div className="relative">
                <div className="absolute top-2 left-0 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/2"></div>
                </div>
                <div className="relative flex justify-between">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-sm font-medium text-slate-900 capitalize">{firstActiveOrder.status.replace('-', ' ')}</p>
                <p className="text-sm text-slate-500 mt-1">Estimated delivery: {firstActiveOrder.estimatedDelivery || 'Tomorrow'}</p>
              </div>

              <Link 
                href={`/tracking/${firstActiveOrder.id}`}
                className="block w-full py-2.5 bg-emerald-500/10 text-emerald-300 text-center rounded-xl font-medium hover:bg-emerald-500/15 transition-colors border border-emerald-500/20"
              >
                View Full Details
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto text-slate-500 mb-3" size={32} />
              <p className="text-slate-500 text-sm">No active deliveries at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
