import mongoose, { Schema } from 'mongoose';

export interface ProductDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  category: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  organisation: mongoose.Types.ObjectId;
}

const ProductSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, default: '' },
    images: [{ type: String }],
    brand: { type: String, required: true, default: '' },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: String, required: true, min: 0 },
    rating: { type: Number, min: 0 },
    numReviews: { type: Number, min: 0 },
    isFeatured: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ProductDocument>('Product', ProductSchema);
