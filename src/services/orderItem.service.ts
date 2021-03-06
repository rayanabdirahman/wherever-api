import { injectable, inject } from 'inversify';
import { OrderItemDocument } from '../database/models/orderItem.model';
import { OrderItemRepository } from '../database/repositories/orderItem.repository';
import { CreateOrderItemModel } from '../domain/interfaces/order';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface OrderItemService {
  createOne(model: CreateOrderItemModel): Promise<OrderItemDocument>;
}

@injectable()
export class OrderItemServiceImpl implements OrderItemService {
  private orderItemRepository: OrderItemRepository;

  constructor(
    @inject(TYPES.OrderItemRepository) orderItemRepository: OrderItemRepository
  ) {
    this.orderItemRepository = orderItemRepository;
  }

  async createOne(model: CreateOrderItemModel): Promise<OrderItemDocument> {
    try {
      return await this.orderItemRepository.createOne(model);
    } catch (error) {
      if (error.code === 11000) {
        error.message = `Order item with the given details already exists`;
      }
      logger.error(
        `[OrderItemService: createOne]: Unabled to create a new order item: ${error}`
      );
      throw error;
    }
  }
}
