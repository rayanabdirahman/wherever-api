import { injectable } from 'inversify';
import {
  CreateUpdatedOrderModel,
  FilterOrderByModel,
  UpdateOrderModel
} from '../../domain/interfaces/order';
import Order, { OrderDocument } from '../models/order.model';

export interface OrderRepository {
  createOne(model: CreateUpdatedOrderModel): Promise<OrderDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: UpdateOrderModel
  ): Promise<OrderDocument | null>;
  findOneById(_id: string): Promise<OrderDocument | null>;
  findAll(filterBy: FilterOrderByModel): Promise<OrderDocument[]>;
}

@injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async createOne(model: CreateUpdatedOrderModel): Promise<OrderDocument> {
    const order = new Order(model);
    return await order.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: UpdateOrderModel
  ): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneById(_id: string): Promise<OrderDocument | null> {
    return await Order.findOne({ _id }).populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        model: 'Product',
        populate: [
          {
            path: 'store',
            model: 'Store',
            select: 'name'
          },
          {
            path: 'organisation',
            model: 'Organisation',
            select: 'name'
          }
        ]
      }
    });
  }

  async findAll(filterBy: FilterOrderByModel): Promise<OrderDocument[]> {
    return await Order.find(filterBy)
      .sort('-createdAt')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          model: 'Product',
          select: 'name image'
        }
      });
  }
}
