import { apiClient } from '../../lib/api/client';

export interface Organization {
  _id: string;
  name: string;
  type: 'manufacturer' | 'retailer' | 'recycler' | 'logistics';
  contactEmail: string;
  verified: boolean;
  address: {
    city: string;
    country: string;
  };
}

export const organizationsApi = {
  getById: async (id: string) => {
    const res = await apiClient.get(`/organizations/${id}`);
    return res.data;
  },
};
