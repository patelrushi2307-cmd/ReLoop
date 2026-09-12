'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WishlistItem, Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/mock-data';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('reloop_wishlist');
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    if (items.length > 0) {
      localStorage.setItem('reloop_wishlist', JSON.stringify(items));
    } else {
      localStorage.removeItem('reloop_wishlist');
    }
  }, [items, isLoaded]);

  const addToWishlist = useCallback((productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setItems(prevItems => {
      if (prevItems.some(item => item.productId === productId)) {
        return prevItems; // Already in wishlist
      }
      
      return [...prevItems, {
        productId,
        addedAt: new Date().toISOString(),
        priceAtAdd: product.pricePerUnit,
        currentPrice: product.pricePerUnit
      }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
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
      const product = PRODUCTS.find(p => p.id === item.productId);
      return product ? { ...product, addedAt: item.addedAt, priceAtAdd: item.priceAtAdd } : null;
    }).filter((p): p is (Product & { addedAt: string; priceAtAdd: number }) => p !== null);
  }, [items]);

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
