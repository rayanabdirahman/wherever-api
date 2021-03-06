import mongoose, { Schema } from 'mongoose';

export interface OrderItemDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  product: string;
  quantity: number;
  price: number;
}

const OrderItemSchema: mongoose.Schema = new mongoose.Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

export default mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema);
