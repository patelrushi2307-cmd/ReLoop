'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductViewer3D from './ProductViewer3D';
import ProductSpecs from './ProductSpecs';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId: string;
  products: Product[];
}

export default function ProductModal({ isOpen, onClose, initialProductId, products }: ProductModalProps) {
  const initialIndex = products.findIndex(p => p.id === initialProductId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const idx = products.findIndex(p => p.id === initialProductId);
      if (idx >= 0) setCurrentIndex(idx);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialProductId, products]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();

    touchStartX.current = null;
  };

  if (!isOpen || !products.length) return null;

  const currentProduct = products[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 flex w-full h-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Arrows & Controls */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] text-white bg-black/40 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md">
            Inspection Stage ({currentIndex + 1} / {products.length})
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[100] bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[100] bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-[calc(50%+1rem)] top-1/2 -translate-y-1/2 z-[100] bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md transition-all hidden md:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] text-white/60 text-sm hidden md:block">
            Use ← or → keys or swipe to switch products
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex w-full h-full flex-col md:flex-row"
            >
              {/* Left Panel: 3D Viewer */}
              <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
                <ProductViewer3D product={currentProduct} />
              </div>

              {/* Right Panel: Specs */}
              <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-white relative">
                <ProductSpecs product={currentProduct} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
