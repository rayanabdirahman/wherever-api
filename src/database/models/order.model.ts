import mongoose, { Schema } from 'mongoose';
import { OrderStatusEnum } from '../../domain/enums/order';

export interface OrderDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: string;
  orderItems: string[];
  status: string;
  price: number;
}

const OrderSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
    status: {
      type: String,
      enum: [OrderStatusEnum],
      default: OrderStatusEnum.PENDING
    },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<OrderDocument>('Order', OrderSchema);
