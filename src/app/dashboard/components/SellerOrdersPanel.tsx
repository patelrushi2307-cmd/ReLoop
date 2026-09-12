'use client';

import { useEffect, useState } from 'react';
import { MapPin, PackageCheck, Truck } from 'lucide-react';
import { Order } from '@/lib/types';

type SellerOrder = Order & { distanceKm?: number };

export default function SellerOrdersPanel() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => response.json())
      .then((result) => setOrders(result.sellerOrders ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-600 mb-3">Seller workspace</p>
        <h1 className="text-3xl font-bold text-slate-900">Sell Orders</h1>
        <p className="mt-2 text-slate-500">Incoming orders placed for products you are selling.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading sell orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <PackageCheck className="mx-auto mb-4 text-slate-300" size={48} />
          <h2 className="text-xl font-semibold text-slate-900">No incoming orders yet</h2>
          <p className="mt-2 text-slate-500">Orders placed for your listings will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const line = order.products[0];
            const product = line?.product;
            return (
              <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{order.id}</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">{product?.title || 'Material order'}</h2>
                    <p className="mt-1 text-sm text-slate-500">Tracking: {order.trackingNumber}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">{order.status.replace('-', ' ')}</span>
                    <p className="mt-2 font-semibold text-slate-900">INR {order.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="flex items-center gap-1 text-xs text-slate-500"><PackageCheck size={14} /> Quantity</p>
                    <p className="mt-1 font-semibold text-slate-900">{line?.quantity ?? 0} units</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={14} /> Delivery to</p>
                    <p className="mt-1 font-semibold text-slate-900">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="flex items-center gap-1 text-xs text-slate-500"><Truck size={14} /> Distance</p>
                    <p className="mt-1 font-semibold text-slate-900">{order.distanceKm ?? 'Calculating'}{order.distanceKm ? ' km' : ''}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Expected delivery</p>
                    <p className="mt-1 font-semibold text-slate-900">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'To be confirmed'}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">Placed {new Date(order.createdAt).toLocaleString()} · Buyer subtotal INR {order.subtotal.toLocaleString()}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
