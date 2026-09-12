// ==========================================
// Product types
// ==========================================

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProductCategory;
  material: string;
  grade: 'A' | 'B' | 'C';
  condition?: 'A' | 'B' | 'C'; // alias for grade
  gradeConfidence: number;
  dimensions: { length: number; width: number; height: number; unit: 'cm' | 'mm' | 'in' };
  weight: { value: number; unit: 'kg' | 'lbs' };
  quantity: number;
  moq: number;
  pricePerUnit: number;
  wholesalePrice: number;
  isFreeReallocation?: boolean; // zero-cost circular claim
  status?: 'active' | 'claimed' | 'sold' | 'archived';
  currency: string;
  images: string[];
  co2Savings: number;
  co2SavedEstimate?: number; // alias for co2Savings
  co2Details: string;
  specs: Record<string, string | number>;
  defects: AIDefect[];
  seller: Seller;
  location: GeoLocation;
  distanceKm?: number;
  unitsPerTruckload: number;
  unitsPerContainer: number;
  humidityContent?: number;
  createdAt: string;
  featured: boolean;
  topCarbonSaver: boolean;
  meshType: 'crate' | 'drum' | 'pallet' | 'ibc' | 'cardboard' | 'strapping';
  meshColor: string;
  buyerInterest?: {
    companyName: string;
    city: string;
    state: string;
    quantity: number;
    distanceKm: number;
    expectedDelivery: string;
    status: 'pending' | 'confirmed';
  };
}

export type ProductCategory =
  | 'timber-skids'
  | 'steel-drums'
  | 'plastic-totes'
  | 'cardboard'
  | 'metal-strapping'
  | 'industrial-pallets'
  | 'scrap-metals';

export interface Category {
  id: ProductCategory;
  name: string;
  slug: string;
  count: number;
  thumbnailUrl?: string; // seller/admin uploaded thumbnail image
  listingCount?: number; // alias for count
}

// Also export as CategoryInfo for components that use that name
export type CategoryInfo = Category;

export interface AIDefect {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'significant';
  description: string;
  position: { x: number; y: number; z: number };
  grade?: 'A' | 'B' | 'C';
}

// ==========================================
// Seller/Company types
// ==========================================

export interface Seller {
  id: string;
  name: string;
  companyName?: string; // alias for name
  logo?: string;
  industry?: string;
  location: GeoLocation;
  rating: number;
  salesCount: number;
  totalSales?: number; // alias for salesCount
  memberSince: string;
  verified: boolean;
}

export interface GeoLocation {
  address?: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

// ==========================================
// User/Auth types
// ==========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  companyName: string;
  industry: string;
  role: 'buyer' | 'seller' | 'both';
  location: GeoLocation;
  profileImage?: string;
  avatar?: string;
  createdAt?: string;
  sustainabilityScore?: number;
  joinedDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PendingAction {
  description: string;
  callback: () => void;
}

// ==========================================
// Order/Tracking types
// ==========================================

export interface OrderProduct {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  status: OrderStatus;
  buyerId: string;
  sellerId: string;
  products: OrderProduct[];
  subtotal: number;
  freightCost: number;
  tax: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  events: TrackingEvent[];
  shippingAddress: GeoLocation;
  estimatedDelivery?: string;
  co2Saved?: number;
}

export type OrderStatus = 'confirmed' | 'processing' | 'in-transit' | 'out-for-delivery' | 'delivered';

export interface TrackingEvent {
  status: string;
  timestamp: string;
  description: string;
}

// ==========================================
// AI types
// ==========================================

export interface AIGradeResult {
  grade: 'A' | 'B' | 'C';
  confidence: number;
  defects: AIDefect[];
  suggestedTitle: string;
  suggestedDescription: string;
  wholesalePrice: number;
  retailPrice: number;
  co2Savings: number;
  specs: Record<string, string | number>;
}

export interface AIFitScore {
  score: number;
  reason: string;
  industryMatch: number;
  proximityScore: number;
  carbonImpact: number;
  priceFit: number;
}

// ==========================================
// Impact/Carbon types
// ==========================================

export interface CarbonImpact {
  totalCo2Saved: number;
  wasteDiverted: number;
  virginMaterialDisplaced: number;
  equivalentTreesSaved: number;
  monthlyData: { month: string; co2Saved: number; wasteDiverted: number }[];
  transactions: ImpactTransaction[];
}

export interface ImpactTransaction {
  id: string;
  date: string;
  item: string;
  quantity: number;
  co2Saved: number;
  source: string;
  // Aliases for components that use other names
  orderId?: string;
  productTitle?: string;
  wasteDiverted?: number;
  materialType?: string;
}

// ==========================================
// Notification types
// ==========================================

export interface Notification {
  id: string;
  type: 'order' | 'market' | 'alert' | 'inventory' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// Alias for components that use AppNotification name
export type AppNotification = Notification;

// ==========================================
// Wishlist
// ==========================================

export interface WishlistItem {
  productId: string;
  addedAt: string;
  priceAtAdd: number;
  currentPrice: number;
}

// ==========================================
// Platform stats
// ==========================================

export interface PlatformStats {
  totalWasteDiverted: number;
  totalCo2Saved: number;
  totalCompanies: number;
  totalTransactions: number;
}
