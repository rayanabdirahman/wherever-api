import { OrderStatusEnum } from '../enums/order';

export interface FilterOrderByModel {
  user: string;
}

export interface CreateOrderModel {
  user: string;
  orderItems: CreateOrderItemModel[];
  status?: OrderStatusEnum;
  // price will be calculated on order creation
}

// this is the order modal saved to the database
export interface CreateUpdatedOrderModel {
  user: string;
  orderItems: string[];
  status?: OrderStatusEnum;
  price: number;
}

export interface UpdateOrderModel {
  status: OrderStatusEnum;
}

export interface CreateOrderItemModel {
  product: string;
  quantity: number;
  price: number;
}
