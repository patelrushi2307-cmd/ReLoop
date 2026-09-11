import { apiClient } from '../../lib/api/client';

export interface RouteEstimate {
  distanceKm: number;
  durationMinutes: number;
  estimatedCost: number;
}

export const logisticsApi = {
  getEstimate: async (originLng: number, originLat: number, destLng: number, destLat: number) => {
    const res = await apiClient.get('/logistics/estimate', {
      params: { originLng, originLat, destLng, destLat },
    });
    return res.data;
  },
};
