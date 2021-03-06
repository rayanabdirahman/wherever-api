import { injectable, inject } from 'inversify';
import { OrderDocument } from '../database/models/order.model';
import { OrderRepository } from '../database/repositories/order.repository';
import { OrderItemRepository } from '../database/repositories/orderItem.repository';
import {
  CreateOrderItemModel,
  CreateOrderModel,
  CreateUpdatedOrderModel,
  FilterOrderByModel,
  UpdateOrderModel
} from '../domain/interfaces/order';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface OrderService {
  createOne(model: CreateOrderModel): Promise<OrderDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: UpdateOrderModel
  ): Promise<OrderDocument | null>;
  findOneById(_id: string): Promise<OrderDocument | null>;
  findAll(filterBy: FilterOrderByModel): Promise<OrderDocument[]>;
}

@injectable()
export class OrderServiceImpl implements OrderService {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderItemRepository;

  constructor(
    @inject(TYPES.OrderRepository)
    orderRepository: OrderRepository,
    @inject(TYPES.OrderItemRepository)
    orderItemRepository: OrderItemRepository
  ) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
  }

  async createOne(model: CreateOrderModel): Promise<OrderDocument> {
    try {
      // save order items to db and return _id and total price for each order item
      const orderItems = await Promise.all(
        model.orderItems.map(async (orderItem: CreateOrderItemModel) => {
          const savedOrderItem = await this.orderItemRepository.createOne(
            orderItem
          );
          return [
            savedOrderItem._id,
            // calculate total order item value
            savedOrderItem.price * savedOrderItem.quantity
          ];
        })
      );

      const orderItemsId = orderItems
        .map((orderItem) =>
          // filter orderItems to return only the _id
          orderItem.filter((orderItem, index) => !(index % 2))
        )
        // flatten multidimensional Array
        // From: [[_id1],[_id2],[_id3]] to: [_id1,_id 2, _id3]
        .reduce((flatArray, currentArray) => flatArray.concat(currentArray));

      const totalOrderPrice = orderItems
        // filter orderItems to return only the price
        .map((orderItem) => orderItem.filter((orderItem, index) => index % 2))
        // flatten multidimensional Array to calculate the total order value
        // From: [[1],[2],[3]] to: [1, 2, 3]
        .reduce((flatArray, currentArray) => flatArray.concat(currentArray))
        // calculate the total order value by accumulating the total order item value
        .reduce(
          (totalOrderValue, orderItemValue) =>
            parseInt(`${totalOrderValue}`) + parseInt(`${orderItemValue}`),
          0
        );

      const orderModel: CreateUpdatedOrderModel = {
        ...model,
        orderItems: (orderItemsId as unknown) as string[],
        price: totalOrderPrice as number
      };

      return await this.orderRepository.createOne(orderModel);
    } catch (error) {
      if (error.code === 11000) {
        error.message = `Order with the given details already exists`;
      }
      logger.error(
        `[OrderService: createOne]: Unabled to create a new order: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: UpdateOrderModel
  ): Promise<OrderDocument | null> {
    try {
      const order = await this.orderRepository.findOneByIdAndUpdate(_id, model);
      // check if order document is returned
      if (!order) {
        throw new Error('Order with the given id was not found');
      }
      return order;
    } catch (error) {
      logger.error(
        `[OrderService: findOneByIdAndUpdate]: Unabled to update order: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<OrderDocument | null> {
    try {
      const order = await this.orderRepository.findOneById(_id);
      // check if order document is returned
      if (!order) {
        throw new Error('Order with the given id was not found');
      }
      return order;
    } catch (error) {
      logger.error(`[OrderService: findOne]: Unable to find order: ${error}`);
      throw error;
    }
  }

  async findAll(filterBy: FilterOrderByModel): Promise<OrderDocument[]> {
    try {
      return await this.orderRepository.findAll(filterBy);
    } catch (error) {
      logger.error(`[OrderService: findAll]: Unable to find orders: ${error}`);
      throw error;
    }
  }
}
