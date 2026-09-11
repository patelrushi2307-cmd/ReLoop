import { apiClient } from '../../lib/api/client';

export interface Listing {
  _id: string;
  facilityId: string;
  materialCategory: string;
  materialSubtype: string;
  title: string;
  description: string;
  grade: 'A' | 'B' | 'C' | 'reject';
  massKg: number;
  status: 'draft' | 'published' | 'matched' | 'reserved' | 'in-transit' | 'completed' | 'cancelled';
  availableFrom: string;
  availableUntil: string;
}

export const listingsApi = {
  list: async (params: Record<string, string | number> = {}) => {
    const response = await apiClient.get<{ data: { items: Listing[]; nextCursor: string | null; hasMore: boolean } }>('/listings', { params });
    return response.data.data;
  },
  create: async (payload: unknown) => {
    const response = await apiClient.post<{ data: Listing }>('/listings', payload);
    return response.data.data;
  },
  uploadMedia: async (listingId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/listings/${listingId}/media`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data.data;
  },
  publish: async (listingId: string) => {
    const response = await apiClient.post<{ data: Listing }>(`/listings/${listingId}/publish`);
    return response.data.data;
  },
};
