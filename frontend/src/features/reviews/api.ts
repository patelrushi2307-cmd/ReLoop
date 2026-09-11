import { apiClient } from '../../lib/api/client';

export interface Review {
  _id: string;
  orderId: string;
  reviewerOrganizationId: { _id: string; name: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

export const reviewsApi = {
  getForOrg: async (organizationId: string) => {
    const res = await apiClient.get(`/reviews/organization/${organizationId}`);
    return res.data;
  },
};
