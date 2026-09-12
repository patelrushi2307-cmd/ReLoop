'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { Order } from '@/lib/types';

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((response) => response.json())
      .then((result) => setOrders(result.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-2 text-slate-500">Track every order placed by your company.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
          <Package className="mx-auto mb-4 text-slate-300" size={48} />
          <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-slate-500">Orders you place will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{order.id}</p>
                  <h2 className="mt-1 font-semibold text-slate-900">{order.products[0]?.product.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">Tracking: {order.trackingNumber}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">{order.status.replace('-', ' ')}</span>
                    <p className="mt-2 font-semibold text-slate-900">₹{order.total.toLocaleString()}</p>
                  </div>
                  <Link href={`/tracking/${order.trackingNumber}`} className="flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                    Track <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleString()} · {order.products[0]?.quantity} units</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}