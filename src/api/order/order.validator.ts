import * as Joi from 'joi';
import { OrderStatusEnum } from '../../domain/enums/order';
import {
  CreateOrderModel,
  UpdateOrderModel
} from '../../domain/interfaces/order';

const OrderItemsObject = Joi.object().keys({
  product: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required()
});

export default class OrderValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    user: Joi.string().required(),
    orderItems: Joi.array().items(OrderItemsObject.required()).required(),
    status: Joi.string().valid(
      OrderStatusEnum.PENDING,
      OrderStatusEnum.ACCEPTED,
      OrderStatusEnum.PROCESSING,
      OrderStatusEnum.DISPATCHED,
      OrderStatusEnum.COMPLETED,
      OrderStatusEnum.CANCELLED
    )
  });

  static updateOneSchema: Joi.ObjectSchema = Joi.object({
    status: Joi.string()
      .valid(
        OrderStatusEnum.PENDING,
        OrderStatusEnum.ACCEPTED,
        OrderStatusEnum.PROCESSING,
        OrderStatusEnum.DISPATCHED,
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.CANCELLED
      )
      .required()
  });

  static createOne(model: CreateOrderModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }

  static updateOne(model: UpdateOrderModel): Joi.ValidationResult {
    return this.updateOneSchema.validate(model);
  }
}
