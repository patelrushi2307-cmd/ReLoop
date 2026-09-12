'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/mock-data';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulated TanStack Query style async fetch with live aggregation
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCategories(CATEGORIES);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return { data: categories, isLoading, error };
}
