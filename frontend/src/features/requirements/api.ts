import { apiClient } from '../../lib/api/client';

export type RequirementGrade = 'A' | 'B' | 'C' | 'reject';
export type RequirementStatus = 'active' | 'paused' | 'closed';
export type RequirementPeriod = 'weekly' | 'monthly';

export interface Requirement {
  _id: string;
  organizationId: string;
  facilityId: { _id: string; name: string; address?: { street?: string; city?: string } } | string;
  materialTypeId?: { _id: string; slug: string; category: string; name: string } | string;
  materialCategory: string;
  materialSubtype: string;
  description?: string;
  minGrade: RequirementGrade;
  massKgPerPeriod: number;
  period: RequirementPeriod;
  maxPricePerKg?: number;
  maxDistanceKm?: number;
  useCarbonLimit: boolean;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequirementInput {
  facilityId: string;
  materialCategory: string;
  materialSubtype: string;
  description?: string;
  minGrade: RequirementGrade;
  massKgPerPeriod: number;
  period: RequirementPeriod;
  maxPricePerKg?: number;
  maxDistanceKm?: number;
  useCarbonLimit: boolean;
}

export interface UpdateRequirementInput {
  facilityId?: string;
  description?: string;
  minGrade?: RequirementGrade;
  massKgPerPeriod?: number;
  period?: RequirementPeriod;
  maxPricePerKg?: number;
  maxDistanceKm?: number;
  useCarbonLimit?: boolean;
}

export const requirementsApi = {
  list: async (params: Record<string, string | number> = {}) => {
    const response = await apiClient.get<{ data: { items: Requirement[]; nextCursor: string | null; hasMore: boolean } }>(
      '/requirements',
      { params }
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Requirement }>(`/requirements/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateRequirementInput) => {
    const response = await apiClient.post<{ data: Requirement }>('/requirements', payload);
    return response.data.data;
  },

  update: async (id: string, payload: UpdateRequirementInput) => {
    const response = await apiClient.patch<{ data: Requirement }>(`/requirements/${id}`, payload);
    return response.data.data;
  },

  pause: async (id: string) => {
    const response = await apiClient.post<{ data: Requirement }>(`/requirements/${id}/pause`);
    return response.data.data;
  },

  resume: async (id: string) => {
    const response = await apiClient.post<{ data: Requirement }>(`/requirements/${id}/resume`);
    return response.data.data;
  },

  close: async (id: string) => {
    const response = await apiClient.post<{ data: Requirement }>(`/requirements/${id}/close`);
    return response.data.data;
  },
};
