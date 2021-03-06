import { injectable } from 'inversify';
import { CreateOrderItemModel } from '../../domain/interfaces/order';
import OrderItem, { OrderItemDocument } from '../models/orderItem.model';

export interface OrderItemRepository {
  createOne(model: CreateOrderItemModel): Promise<OrderItemDocument>;
}

@injectable()
export class OrderItemRepositoryImpl implements OrderItemRepository {
  async createOne(model: CreateOrderItemModel): Promise<OrderItemDocument> {
    const orderItem = new OrderItem(model);
    return await orderItem.save();
  }
}
