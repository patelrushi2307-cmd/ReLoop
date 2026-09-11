import { apiClient } from '../../lib/api/client';

export interface Organization {
  _id: string;
  name: string;
  legalName: string;
  businessId?: string;
  roles: Array<'seller' | 'buyer' | 'recycler' | 'carrier'>;
  verificationStatus: 'unverified' | 'document-submitted' | 'verified';
  address: {
    city: string;
    country: string;
  };
  facilities: Facility[];
}

export interface Facility {
  _id: string;
  name: string;
  address: { street: string; city: string; state?: string; country: string; postalCode?: string };
  location: { type: 'Point'; coordinates: [number, number] };
  hasForklift: boolean;
}

export const organizationsApi = {
  getMe: async () => {
    const res = await apiClient.get<{ data: Organization }>('/organizations/me');
    return res.data.data;
  },
  updateMe: async (data: Partial<Organization>) => {
    const res = await apiClient.patch<{ data: Organization }>('/organizations/me', data);
    return res.data.data;
  },
  addFacility: async (data: unknown) => {
    const res = await apiClient.post<{ data: Facility }>('/organizations/me/facilities', data);
    return res.data.data;
  },
  submitVerification: async () => {
    const res = await apiClient.post<{ data: Organization }>('/organizations/me/verification', { documents: [] });
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/organizations/${id}`);
    return res.data;
  },
};
