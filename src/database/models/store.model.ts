import mongoose, { Schema } from 'mongoose';

export interface StoreDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  members?: string[];
  organisation: string;
}

const StoreSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  organisation: {
    type: Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true
  }
});

export default mongoose.model<StoreDocument>('Store', StoreSchema);
