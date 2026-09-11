import { OrderModel, IOrder } from './orders.model.js';
import { MaterialModel } from '../materials/materials.model.js';
import { AppError } from '../../middleware/errorHandler.js';

export interface CreateOrderDTO {
  buyerOrganizationId: string;
  materialId: string;
  quantity: number;
  orderType: 'free_claim' | 'paid_purchase';
  deliveryNotes?: string;
}

export class OrdersService {
  async createOrder(data: CreateOrderDTO): Promise<IOrder> {
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
      .populate('materialId');
  }

  async listForOrganization(organizationId: string): Promise<IOrder[]> {
    return OrderModel.find({
      $or: [{ buyerOrganizationId: organizationId }, { sellerOrganizationId: organizationId }],
      isDeleted: false,
    })
      .populate('materialId', 'title materialType')
      .populate('buyerOrganizationId', 'name')
      .populate('sellerOrganizationId', 'name')
      .sort({ createdAt: -1 });
  }
}

export const ordersService = new OrdersService();
