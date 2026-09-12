'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((result) => setCategories(result.data ?? []))
      .catch((reason) => setError(reason instanceof Error ? reason : new Error('Failed to load categories')))
      .finally(() => setIsLoading(false));
  }, []);

  return { data: categories, isLoading, error };
}
