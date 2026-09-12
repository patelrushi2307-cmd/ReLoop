'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WishlistItem, Product } from '@/lib/types';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  addItem: (product: Product | string) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistProducts: () => (Product & { addedAt: string; priceAtAdd: number })[];
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/wishlist')
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!result) return;
        setItems(result.data ?? []);
        setProducts(result.products ?? []);
      });
  }, []);

  const addToWishlist = useCallback((productId: string) => {
    fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => result && setItems(result.data ?? []));
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, { method: 'DELETE' })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => result && setItems(result.data ?? []));
  }, []);

  const addItem = useCallback((product: Product | string) => {
    addToWishlist(typeof product === 'string' ? product : product.id);
  }, [addToWishlist]);

  const removeItem = removeFromWishlist;

  const toggleWishlist = useCallback((productId: string) => {
    if (items.some(item => item.productId === productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [addToWishlist, items, removeFromWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.productId === productId);
  }, [items]);

  const getWishlistProducts = useCallback(() => {
    return items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...product, addedAt: item.addedAt, priceAtAdd: item.priceAtAdd } : null;
    }).filter((p): p is (Product & { addedAt: string; priceAtAdd: number }) => p !== null);
  }, [items, products]);

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      addItem,
      removeItem,
      toggleWishlist,
      isInWishlist,
      getWishlistProducts,
      wishlistCount: items.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
