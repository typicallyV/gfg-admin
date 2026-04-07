import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string; // Optional because we might want to omit it in responses
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
