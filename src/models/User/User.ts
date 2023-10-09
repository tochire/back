import * as Mongoose from "mongoose";

export interface User extends Mongoose.Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isBlocked: boolean;
  subscriptionEndAt?: number;
  plan: string;
}

const UserSchema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  subscriptionEndAt: Number,
  plan: String,
});

export const User = Mongoose.model<User>("user", UserSchema);
