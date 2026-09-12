import {
  CATEGORIES,
  MOCK_CARBON_IMPACT,
  MOCK_USER,
  NOTIFICATIONS,
  ORDERS,
  PRODUCTS,
} from '@/lib/mock-data';
import {
  Category,
  CarbonImpact,
  Notification,
  Order,
  Product,
  User,
  WishlistItem,
} from '@/lib/types';
import { createHmac } from 'crypto';
import { calculateDistanceKm, calculateOrderImpact, getSustainableQuantity } from '@/lib/carbon-calculator';

const clone = <T>(value: T): T => structuredClone(value);

type StoreState = {
  users: Map<string, User>;
  credentials: Map<string, string>;
  products: Product[];
  categories: Category[];
  orders: Order[];
  notifications: Notification[];
  wishlists: Map<string, WishlistItem[]>;
  impactByUser: Map<string, CarbonImpact>;
};

declare global {
  // eslint-disable-next-line no-var
  var __reloopStore: StoreState | undefined;
}

const store: StoreState = globalThis.__reloopStore ?? (globalThis.__reloopStore = {
  users: new Map([[MOCK_USER.id, clone(MOCK_USER)]]),
  credentials: new Map([[MOCK_USER.email, 'demo-password']]),
  products: clone(PRODUCTS),
  categories: clone(CATEGORIES),
  orders: clone(ORDERS),
  notifications: clone(NOTIFICATIONS),
  wishlists: new Map(),
  impactByUser: new Map([[MOCK_USER.id, clone(MOCK_CARBON_IMPACT)]]),
});

const { users, credentials, products, categories, orders, notifications, wishlists, impactByUser } = store;
const sessionSecret = process.env.RELOOP_SESSION_SECRET ?? 'reloop-development-secret';

function createSessionToken(userId: string) {
  const payload = Buffer.from(userId).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function getMaterials(options: { category?: string; page: number; search?: string; limit?: number }) {
  const limit = options.limit ?? 15;
  const search = options.search?.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = !options.category || options.category === 'all' || product.category === options.category;
    const searchable = `${product.title} ${product.description} ${product.material} ${product.seller.name}`.toLowerCase();
    return matchesCategory && (!search || searchable.includes(search));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.max(1, options.page);
  return {
    data: filtered.slice((page - 1) * limit, page * limit),
    totalPages,
    totalCount: filtered.length,
    page,
  };
}

export function getRecommendedMaterials() {
  return products.filter((product) => product.featured || product.topCarbonSaver || product.isFreeReallocation).slice(0, 8);
}

export function getCategories() {
  return categories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.id && product.status !== 'archived').length || category.count,
  }));
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getUserBySession(token: string | undefined) {
  if (!token) return undefined;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || createHmac('sha256', sessionSecret).update(payload).digest('base64url') !== signature) return undefined;
  return users.get(Buffer.from(payload, 'base64url').toString());
}

export function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const loginEmail = normalizedEmail === 'seller@reloop.local' ? MOCK_USER.email.toLowerCase() : normalizedEmail;
  const user = users.get(Array.from(users.values()).find((candidate) => candidate.email.toLowerCase() === loginEmail)?.id ?? '');
  if (!user || credentials.get(user.email) !== password) return null;
  return { token: createSessionToken(user.id), user: clone(user) };
}

export function signup(input: { companyName: string; industry: string; email: string; password: string; city: string; state: string }) {
  if (Array.from(users.values()).some((user) => user.email.toLowerCase() === input.email.toLowerCase())) return null;
  const user: User = {
    id: `usr_${crypto.randomUUID()}`,
    name: input.companyName,
    email: input.email,
    companyName: input.companyName,
    industry: input.industry,
    role: 'buyer',
    location: { city: input.city, state: input.state, country: 'India', lat: 0, lng: 0 },
    sustainabilityScore: 0,
    joinedDate: new Date().toISOString(),
  };
  users.set(user.id, user);
  credentials.set(user.email, input.password);
  return { token: createSessionToken(user.id), user: clone(user) };
}

export function logout(_token: string | undefined) {
  void _token;
}

export function getWishlist(userId: string) {
  return wishlists.get(userId) ?? [];
}

export function addWishlistItem(userId: string, productId: string) {
  const product = getProduct(productId);
  if (!product) return null;
  const current = getWishlist(userId);
  if (!current.some((item) => item.productId === productId)) {
    current.push({ productId, addedAt: new Date().toISOString(), priceAtAdd: product.pricePerUnit, currentPrice: product.pricePerUnit });
    wishlists.set(userId, current);
  }
  return current;
}

export function removeWishlistItem(userId: string, productId: string) {
  const current = getWishlist(userId).filter((item) => item.productId !== productId);
  wishlists.set(userId, current);
  return current;
}

export function getNotifications() {
  return notifications;
}

export function markNotificationRead(id: string) {
  const notification = notifications.find((item) => item.id === id);
  if (notification) notification.read = true;
  return notification;
}

export function markAllNotificationsRead() {
  notifications.forEach((notification) => { notification.read = true; });
  return notifications;
}

export function getOrder(identifier: string) {
  const normalized = identifier.trim().toUpperCase();
  return orders.find((order) => order.id.toUpperCase() === normalized || order.trackingNumber.toUpperCase() === normalized);
}

export function getOrders(userId: string) {
  return orders.filter((order) => order.buyerId === userId);
}

export function getSellerListings(userId: string) {
  return products.filter((product) => product.seller.id === userId);
}

export function getSellerOrders(userId: string) {
  return orders.filter((order) => order.sellerId === userId);
}

export function createOrder(input: { productId: string; quantity: number }, buyer: User) {
  const product = getProduct(input.productId);
  if (!product || input.quantity < product.moq || input.quantity > product.quantity) return null;
  const distanceKm = calculateDistanceKm(buyer.location, product.location);
  const impact = calculateOrderImpact(product, input.quantity, distanceKm);
  if (impact.netEmissions <= 0) return null;
  const subtotal = product.pricePerUnit * input.quantity;
  const freightCost = Math.round(subtotal * 0.06);
  const tax = Math.round((subtotal + freightCost) * 0.18);
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord_${crypto.randomUUID()}`,
    trackingNumber: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'confirmed',
    buyerId: buyer.id,
    sellerId: product.seller.id,
    products: [{ product, quantity: input.quantity, priceAtPurchase: product.pricePerUnit }],
    subtotal,
    freightCost,
    tax,
    total: subtotal + freightCost + tax,
    currency: product.currency,
    createdAt: now,
    updatedAt: now,
    events: [{ status: 'confirmed', timestamp: now, description: `Order confirmed by ${product.seller.name}.` }],
    shippingAddress: buyer.location,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    co2Saved: impact.netEmissions,
  };
  orders.unshift(order);
  product.quantity -= input.quantity;
  return order;
}

export function getOrderImpact(productId: string, quantity: number, buyer: User) {
  const product = getProduct(productId);
  if (!product) return null;
  const distanceKm = calculateDistanceKm(buyer.location, product.location);
  const impact = calculateOrderImpact(product, quantity, distanceKm);
  return { ...impact, distanceKm, sustainableQuantity: getSustainableQuantity(product, distanceKm), availableQuantity: product.quantity, minimumOrder: product.moq };
}

export function getDashboardData(userId: string) {
  const userOrders = getOrders(userId);
  return {
    orders: userOrders,
    sellerListings: getSellerListings(userId),
    sellerOrders: getSellerOrders(userId).map((order) => ({
      ...order,
      distanceKm: calculateDistanceKm(order.products[0].product.location, order.shippingAddress),
    })),
    impact: impactByUser.get(userId) ?? clone(MOCK_CARBON_IMPACT),
    wishlist: getWishlist(userId),
  };
}

export function createProduct(input: Partial<Product>, seller: User) {
  const buyerProfiles = [
    { companyName: 'NovaPack Manufacturing', city: 'Vadodara', state: 'Gujarat', distanceKm: 112 },
    { companyName: 'GreenRoute Logistics', city: 'Surat', state: 'Gujarat', distanceKm: 265 },
    { companyName: 'Apex Auto Components', city: 'Pune', state: 'Maharashtra', distanceKm: 534 },
    { companyName: 'EcoBuild Industries', city: 'Mumbai', state: 'Maharashtra', distanceKm: 488 },
  ];
  const buyer = buyerProfiles[Math.floor(Math.random() * buyerProfiles.length)];
  const requestedQuantity = Math.max(Number(input.moq ?? 1), Math.min(Number(input.quantity ?? 1), Math.floor((Number(input.quantity ?? 1) * (0.15 + Math.random() * 0.35)) / 10) * 10));
  const expectedDelivery = new Date(Date.now() + (4 + Math.floor(Math.random() * 6)) * 24 * 60 * 60 * 1000).toISOString();
  const product: Product = {
    ...(input as Product),
    id: `prd_${crypto.randomUUID()}`,
    slug: `${String(input.title ?? 'material').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`,
    seller: { id: seller.id, name: seller.companyName, location: seller.location, rating: 5, salesCount: 0, verified: false, memberSince: new Date().toISOString() },
    location: seller.location,
    status: 'active',
    createdAt: new Date().toISOString(),
    featured: false,
    topCarbonSaver: false,
    buyerInterest: {
      ...buyer,
      quantity: requestedQuantity,
      expectedDelivery,
      status: 'pending',
    },
  };
  products.unshift(product);
  notifications.unshift({
    id: `notif_${crypto.randomUUID()}`,
    type: 'market',
    title: 'Buyer interest on your new listing',
    message: `${buyer.companyName} is interested in ${product.title}: ${requestedQuantity} units from ${buyer.city}. Expected delivery ${new Date(expectedDelivery).toLocaleDateString()}.`,
    read: false,
    createdAt: new Date().toISOString(),
    link: '/dashboard?tab=listings',
  });
  return product;
}

export function confirmBuyerInterest(productId: string, seller: User) {
  const product = products.find((candidate) => candidate.id === productId && candidate.seller.id === seller.id);
  if (!product?.buyerInterest || product.buyerInterest.status === 'confirmed') return null;

  const interest = product.buyerInterest;
  const now = new Date().toISOString();
  const subtotal = product.pricePerUnit * interest.quantity;
  const freightCost = Math.round(subtotal * 0.06);
  const tax = Math.round((subtotal + freightCost) * 0.18);
  const order: Order = {
    id: `ord_${crypto.randomUUID()}`,
    trackingNumber: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'confirmed',
    buyerId: `buyer_${crypto.randomUUID()}`,
    sellerId: seller.id,
    products: [{ product, quantity: interest.quantity, priceAtPurchase: product.pricePerUnit }],
    subtotal,
    freightCost,
    tax,
    total: subtotal + freightCost + tax,
    currency: product.currency,
    createdAt: now,
    updatedAt: now,
    events: [{ status: 'confirmed', timestamp: now, description: `${interest.companyName} order confirmed by ${seller.companyName}.` }],
    shippingAddress: { city: interest.city, state: interest.state, country: 'India', lat: 0, lng: 0 },
    estimatedDelivery: interest.expectedDelivery,
    co2Saved: 0,
  };

  interest.status = 'confirmed';
  product.quantity = Math.max(0, product.quantity - interest.quantity);
  orders.unshift(order);
  notifications.unshift({
    id: `notif_${crypto.randomUUID()}`,
    type: 'order',
    title: 'Buyer interest confirmed',
    message: `${interest.companyName}'s order for ${interest.quantity} units of ${product.title} is now in Sell Orders.`,
    read: false,
    createdAt: now,
    link: '/dashboard?tab=sell-orders',
  });
  return order;
}
