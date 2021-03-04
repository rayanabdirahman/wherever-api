import mongoose from 'mongoose';
import { UserRolesEnum } from '../../domain/enums/user';
import BycryptHelper from '../../utilities/bcrypt-helper';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  role: UserRolesEnum[];
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    avatar: { type: String },
    password: { type: String, required: true },
    role: {
      type: [
        {
          type: String,
          enum: [UserRolesEnum]
        }
      ],
      default: UserRolesEnum.BUYER
    }
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
