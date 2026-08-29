import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  isActive: boolean;
  firebaseUid?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, required: true, default: 'user', enum: ['user', 'admin'] },
    isActive: { type: Boolean, required: true, default: true },
    firebaseUid: { type: String, default: null },
    avatar: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ deletedAt: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
