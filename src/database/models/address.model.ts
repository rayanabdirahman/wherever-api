import mongoose, { Schema } from 'mongoose';

export interface AddressDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: string;
  country: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postCode: string;
  phoneNumber: string;
  deliveryInstructions: string;
  securityCode: string;
}

const AddressSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    country: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    streetAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postCode: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    deliveryInstructions: {
      type: String,
      required: true,
      trim: true
    },
    securityCode: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model<AddressDocument>('Address', AddressSchema);
