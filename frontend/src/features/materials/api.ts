import { apiClient } from '../../lib/api/client';
import { Material, MaterialFilters } from './types';

export const materialsApi = {
  list: async (filters?: MaterialFilters) => {
    const res = await apiClient.get('/materials', { params: filters });
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Material }> => {
    const res = await apiClient.get(`/materials/${id}`);
    return res.data;
  },

  create: async (data: Partial<Material>) => {
    const res = await apiClient.post('/materials', data);
    return res.data;
  },
};
