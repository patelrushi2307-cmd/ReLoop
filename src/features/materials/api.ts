'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import { PRODUCTS } from '@/lib/mock-data';

export function useMaterials(selectedCategory?: string | null, page: number = 1, searchQuery: string = '') {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...PRODUCTS];

      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query) ||
          p.seller.name.toLowerCase().includes(query)
        );
      }

      const total = Math.ceil(filtered.length / limit) || 1;
      setTotalPages(total);

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      setData(paginated);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, page, searchQuery]);

  return { data, isLoading, totalPages, totalCount: data.length };
}

export function useRecommended() {
  const recommendedList = useMemo(() => {
    // Curated recommendations: high CO2 savings + featured + free reallocations
    return PRODUCTS.filter(p => p.featured || p.topCarbonSaver || p.isFreeReallocation).slice(0, 8);
  }, []);

  return { data: recommendedList, isLoading: false };
}
