'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryPortal from '@/components/home/CategoryPortal';
import ImpactFooter from '@/components/home/ImpactFooter';
import CanvasWrapper from '@/components/three/CanvasWrapper';
import ProductModal from '@/components/product/ProductModal';
import AuthModal from '@/components/auth/AuthModal';
import { PRODUCTS } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Alibaba Style Top Navbar */}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 2. 3D WebGL Showroom Hero Banner Section */}
      <section className="relative h-[min(680px,85vh)] min-h-[520px] overflow-hidden pt-24">
        <CanvasWrapper className="absolute inset-0 h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/30 to-slate-950/95 pointer-events-none" />
        <HeroBanner
          onBrowseClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
          onSellClick={() => requireAuth('list your surplus materials.', () => router.push('/sell'))}
        />
      </section>

      {/* 3. Alibaba Catalog & Marketplace Portal */}
      <div id="marketplace">
        <CategoryPortal 
          onProductClick={setSelectedProductId} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* 4. Carbon Impact Ledger Footer Section */}
      <ImpactFooter />

      {/* 5. Modals */}
      <AuthModal />
      <ProductModal
        isOpen={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
        initialProductId={selectedProductId ?? PRODUCTS[0].id}
        products={PRODUCTS}
      />
    </main>
  );
}
