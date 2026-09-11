import { apiClient } from '../../lib/api/client';

export interface ImpactSummary {
  organizationId: string;
  completedTransactions: number;
  wasteDivertedKg: number;
  co2SavedKg: number;
}

export const impactApi = {
  getSummary: async (organizationId: string): Promise<{ success: boolean; data: ImpactSummary }> => {
    const res = await apiClient.get(`/impact/organization/${organizationId}`);
    return res.data;
  },
};
