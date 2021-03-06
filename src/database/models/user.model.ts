import mongoose, { Schema } from 'mongoose';
import { UserRolesEnum } from '../../domain/enums/user';
import BycryptHelper from '../../utilities/bcrypt-helper';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  avatar: string;
  likes: mongoose.Types.ObjectId[];
  password: string;
  role: UserRolesEnum[];
  address: string;
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    avatar: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    password: { type: String, required: true },
    role: [
      { type: String, enum: [UserRolesEnum], default: UserRolesEnum.BUYER }
    ],
    address: { type: Schema.Types.ObjectId, ref: 'Address' }
  },
  { timestamps: true }
);

// Encrypt user password before saving
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    // hash user password
    const password = await BycryptHelper.encryptPassword(this.get('password'));
    this.set({ password });
  }
});

export default mongoose.model<UserDocument>('User', UserSchema);
