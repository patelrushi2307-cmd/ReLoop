'use client';

import { useEffect, useState } from 'react';
import { PackageOpen, Tag } from 'lucide-react';
import { Product } from '@/lib/types';

export default function ListingsPanel() {
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const confirmInterest = async (productId: string) => {
    setConfirmingId(productId);
    const response = await fetch('/api/listings/interest/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (response.ok) {
      setListings((current) => current.map((listing) => listing.id === productId && listing.buyerInterest
        ? { ...listing, buyerInterest: { ...listing.buyerInterest, status: 'confirmed' } }
        : listing));
    }
    setConfirmingId(null);
  };

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => response.json())
      .then((result) => setListings(result.sellerListings ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-600 mb-3">Seller workspace</p>
        <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
        <p className="mt-2 text-slate-500">Products you are currently selling on ReLoop.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <PackageOpen className="mx-auto mb-4 text-slate-300" size={48} />
          <h2 className="text-xl font-semibold text-slate-900">No listings yet</h2>
          <p className="mt-2 text-slate-500">Products you publish from Seller Studio will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((product) => (
            <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-400">{product.status || 'active'}</p>
                  <h2 className="mt-1 font-semibold text-slate-900">{product.title}</h2>
                </div>
                <Tag className="shrink-0 text-emerald-300" size={20} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Selling price</p>
                  <p className="mt-1 font-semibold text-slate-900">INR {product.pricePerUnit.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Wholesale</p>
                  <p className="mt-1 font-semibold text-slate-900">INR {product.wholesalePrice.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Available stock</p>
                  <p className="mt-1 font-semibold text-slate-900">{product.quantity.toLocaleString()} units</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Minimum order</p>
                  <p className="mt-1 font-semibold text-slate-900">{product.moq.toLocaleString()} units</p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
                Grade {product.grade} · Listed {new Date(product.createdAt).toLocaleDateString()}
              </div>
              {product.buyerInterest && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-emerald-800">Buyer interest received</p>
                    {product.buyerInterest.status === 'pending' ? (
                      <button
                        onClick={() => confirmInterest(product.id)}
                        disabled={confirmingId === product.id}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {confirmingId === product.id ? 'Confirming...' : 'Confirm order'}
                      </button>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Confirmed</span>
                    )}
                  </div>
                  <p className="mt-1 text-emerald-700">{product.buyerInterest.companyName} wants {product.buyerInterest.quantity} units from {product.buyerInterest.city}.</p>
                  <p className="mt-1 text-xs text-emerald-600">{product.buyerInterest.distanceKm} km · Expected {new Date(product.buyerInterest.expectedDelivery).toLocaleDateString()}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
