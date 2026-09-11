import { apiClient } from '../../lib/api/client';

export interface Order {
  _id: string;
  orderNumber: string;
  materialId: any;
  orderType: 'free_claim' | 'paid_purchase';
  quantity: number;
  unit: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export const ordersApi = {
  list: async () => {
    const res = await apiClient.get('/orders');
    return res.data;
  },
  create: async (data: { materialId: string; quantity: number; orderType: string; deliveryNotes?: string }) => {
    const res = await apiClient.post('/orders', data);
    return res.data;
  },
};
