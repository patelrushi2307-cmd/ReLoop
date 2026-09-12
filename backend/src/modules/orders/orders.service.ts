import { OrderModel, IOrder, OrderStatus } from './orders.model.js';
import { MaterialModel } from '../materials/materials.model.js';
import { ListingModel } from '../listings/listing.model.js';
import { AppError } from '../../middleware/errorHandler.js';

export interface CreateOrderDTO {
  buyerOrganizationId: string;
  materialId?: string;
  listingId?: string;
  quantity: number;
  orderType: 'free_claim' | 'paid_purchase';
  deliveryNotes?: string;
}

const fail = (statusCode: number, code: string, message: string): AppError => {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
};

export class OrdersService {
  /**
   * Places an order against a Listing — the carbon-aware inventory model the
   * exchange actually runs on. Reserves the lot so it cannot be sold twice.
   */
  async createOrderFromListing(data: CreateOrderDTO): Promise<IOrder> {
    const listing = await ListingModel.findOne({ _id: data.listingId, isDeleted: false });
    if (!listing) throw fail(404, 'NOT_FOUND', 'Listing not found');

    if (listing.status !== 'published') {
      throw fail(409, 'LISTING_NOT_AVAILABLE', 'Only a published lot can be ordered');
    }

    if (String(listing.organizationId) === String(data.buyerOrganizationId)) {
      throw fail(409, 'SELF_TRADE', 'A lot cannot be bought by the organisation selling it');
    }

    if (data.quantity > listing.massKg) {
      throw fail(400, 'INSUFFICIENT_QUANTITY', 'Ordered mass exceeds the mass on the lot');
    }

    // The asking price covers the whole lot, so a partial take is pro-rated.
    const askingAmount = listing.askingPrice?.amount ?? 0;
    const share = listing.massKg > 0 ? data.quantity / listing.massKg : 1;
    const totalPrice =
      data.orderType === 'free_claim' ? 0 : Number((askingAmount * share).toFixed(2));

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const order = await OrderModel.create({
      orderNumber,
      buyerOrganizationId: data.buyerOrganizationId,
      sellerOrganizationId: listing.organizationId,
      listingId: listing._id,
      orderType: data.orderType,
      quantity: data.quantity,
      unit: 'kg',
      totalPrice,
      deliveryNotes: data.deliveryNotes,
    });

    listing.status = 'reserved';
    await listing.save();

    return order;
  }

  /**
   * Moves an order along its lifecycle. The seller accepts and dispatches;
   * either side can cancel while it has not shipped; the buyer confirms
   * completion. Rejected transitions surface as a 409 rather than silently
   * writing an impossible state.
   */
  async updateStatus(
    orderId: string,
    organizationId: string,
    next: OrderStatus
  ): Promise<IOrder> {
    const order = await OrderModel.findOne({ _id: orderId, isDeleted: false });
    if (!order) throw fail(404, 'NOT_FOUND', 'Order not found');

    const isSeller = String(order.sellerOrganizationId) === String(organizationId);
    const isBuyer = String(order.buyerOrganizationId) === String(organizationId);
    if (!isSeller && !isBuyer) throw fail(403, 'FORBIDDEN', 'Order belongs to another organisation');

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in_transit', 'cancelled'],
      in_transit: ['completed'],
      completed: [],
      cancelled: [],
    };

    if (!allowed[order.status].includes(next)) {
      throw fail(409, 'INVALID_TRANSITION', `An order cannot move from ${order.status} to ${next}`);
    }

    const sellerOnly: OrderStatus[] = ['accepted', 'in_transit'];
    if (sellerOnly.includes(next) && !isSeller) {
      throw fail(403, 'FORBIDDEN', 'Only the selling organisation can advance this order');
    }
    if (next === 'completed' && !isBuyer) {
      throw fail(403, 'FORBIDDEN', 'Only the buying organisation can confirm delivery');
    }

    order.status = next;
    await order.save();

    // A cancelled order releases the lot; a completed one is sold for good.
    if (order.listingId) {
      const listingStatus = next === 'cancelled' ? 'published' : next === 'completed' ? 'completed' : null;
      if (listingStatus) {
        await ListingModel.updateOne({ _id: order.listingId }, { $set: { status: listingStatus } });
      }
    }

    return order;
  }

  async createOrder(data: CreateOrderDTO): Promise<IOrder> {
    if (data.listingId) return this.createOrderFromListing(data);
    const material = await MaterialModel.findOne({ _id: data.materialId, isDeleted: false });
    if (!material) {
      const err: AppError = new Error('Material listing not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (material.availableQuantity < data.quantity) {
      const err: AppError = new Error('Insufficient material quantity available');
      err.statusCode = 400;
      err.code = 'INSUFFICIENT_QUANTITY';
      throw err;
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const totalPrice = data.orderType === 'free_claim' ? 0 : data.quantity * (material.pricePerUnit || 0);

    const order = await OrderModel.create({
      orderNumber,
      buyerOrganizationId: data.buyerOrganizationId,
      sellerOrganizationId: material.sellerOrganizationId,
      materialId: material._id,
      orderType: data.orderType,
      quantity: data.quantity,
      unit: material.unit,
      totalPrice,
      deliveryNotes: data.deliveryNotes,
    });

    // Deduct available quantity
    material.availableQuantity -= data.quantity;
    if (material.availableQuantity <= 0) {
      material.status = 'reserved';
    }
    await material.save();

    return order;
  }

  async getById(id: string): Promise<IOrder | null> {
    return OrderModel.findOne({ _id: id, isDeleted: false })
      .populate('buyerOrganizationId', 'name contactEmail address')
      .populate('sellerOrganizationId', 'name contactEmail address')
      .populate('materialId')
      .populate('listingId');
  }

  async listForOrganization(organizationId: string): Promise<IOrder[]> {
    return OrderModel.find({
      $or: [{ buyerOrganizationId: organizationId }, { sellerOrganizationId: organizationId }],
      isDeleted: false,
    })
      .populate('materialId', 'title materialType')
      .populate('listingId', 'title materialCategory materialSubtype grade massKg facilityId')
      .populate('buyerOrganizationId', 'name')
      .populate('sellerOrganizationId', 'name')
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();
  }
}

export const ordersService = new OrdersService();
