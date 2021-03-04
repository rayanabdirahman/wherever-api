import mongoose from 'mongoose';

export interface CategoryDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  // image: string;
}

const CategorySchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  icon: { type: String }
  // image: { type: String }
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
