'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

export function useMaterials(selectedCategory?: string | null, page: number = 1, searchQuery: string = '') {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    fetch(`/api/materials?${params}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result.data ?? []);
        setTotalPages(result.totalPages ?? 1);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCategory, page, searchQuery]);

  return { data, isLoading, totalPages, totalCount: data.length };
}

export function useRecommended() {
  const [recommendedList, setRecommendedList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materials?recommended=true')
      .then((response) => response.json())
      .then((result) => setRecommendedList(result.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  return { data: recommendedList, isLoading };
}
