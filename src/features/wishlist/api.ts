'use client';

import { useWishlist as useWishlistContext } from '@/contexts/WishlistContext';

export function useWishlist() {
  const wishlist = useWishlistContext();
  return {
    items: wishlist.items,
    wishlistCount: wishlist.wishlistCount,
    isInWishlist: wishlist.isInWishlist,
    getWishlistProducts: wishlist.getWishlistProducts,
  };
}

export function useToggleWishlist() {
  const wishlist = useWishlistContext();
  return {
    toggleWishlist: wishlist.toggleWishlist,
    addToWishlist: wishlist.addToWishlist,
    removeFromWishlist: wishlist.removeFromWishlist,
  };
}
