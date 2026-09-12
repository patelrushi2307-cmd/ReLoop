'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ORDERS } from '@/lib/mock-data';
import { Package, Heart, Leaf, Repeat, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuth();
  
  const activeOrders = ORDERS.filter(o => o.status !== 'delivered');
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.companyName || 'Company'} 👋
        </h1>
        <p className="text-slate-500 mt-2">Here&apos;s what&apos;s happening with your circular materials today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Active Orders</p>
            <p className="text-2xl font-semibold text-slate-900">{activeOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Wishlist Items</p>
            <p className="text-2xl font-semibold text-slate-900">12</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Leaf size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">CO₂ Saved (tons)</p>
            <p className="text-2xl font-semibold text-slate-900">45.2</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Repeat size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Materials Exchanged</p>
            <p className="text-2xl font-semibold text-slate-900">8</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ORDERS.slice(0, 5).map((order) => (
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
                    <td className="py-4 text-right">
                      <Link href={`/tracking/${order.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-end">
                        Track <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tracking Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Delivery</h2>
          {firstActiveOrder ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500">Order {firstActiveOrder.id}</p>
                <p className="font-medium text-slate-900">{firstActiveOrder.products[0]?.product.title}</p>
              </div>

              <div className="relative">
                <div className="absolute top-2 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/2"></div>
                </div>
                <div className="relative flex justify-between">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-900 capitalize">{firstActiveOrder.status.replace('-', ' ')}</p>
                <p className="text-sm text-slate-500 mt-1">Estimated delivery: {firstActiveOrder.estimatedDelivery || 'Tomorrow'}</p>
              </div>

              <Link 
                href={`/tracking/${firstActiveOrder.id}`}
                className="block w-full py-2.5 bg-emerald-50 text-emerald-600 text-center rounded-xl font-medium hover:bg-emerald-100 transition-colors"
              >
                View Full Details
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-slate-500 text-sm">No active deliveries at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
