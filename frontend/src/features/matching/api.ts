import { apiClient } from '../../lib/api/client';

export interface MatchingCriteria {
  materialType: string;
  requiredQuantity: number;
  buyerLocation: {
    longitude: number;
    latitude: number;
  };
  maxDistanceKm?: number;
}

export const matchingApi = {
  getRecommendations: async (criteria: MatchingCriteria) => {
    const res = await apiClient.post('/matching/recommendations', criteria);
    return res.data;
  },
};
