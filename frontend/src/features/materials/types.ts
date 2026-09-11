export interface Material {
  _id: string;
  title: string;
  description: string;
  materialType: string;
  condition: 'new' | 'reusable' | 'damaged_recyclable' | 'clean_scrap';
  quantity: number;
  availableQuantity: number;
  unit: 'kg' | 'tonnes' | 'units' | 'pallets';
  pricePerUnit: number;
  isFreeClaim: boolean;
  images: string[];
  pickupLocation: {
    address: string;
    city: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  sellerOrganizationId?: {
    _id: string;
    name: string;
    city?: string;
  };
  status: string;
  createdAt: string;
}

export interface MaterialFilters {
  page?: number;
  limit?: number;
  materialType?: string;
  status?: string;
  lng?: number;
  lat?: number;
  maxDistanceKm?: number;
}
