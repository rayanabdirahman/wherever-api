import mongoose, { Schema } from 'mongoose';

export interface PostDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  postedBy: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
}

const PostSchema: mongoose.Schema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model<PostDocument>('Post', PostSchema);
