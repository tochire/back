import * as Mongoose from "mongoose";

export interface Customer extends Mongoose.Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isBlocked: boolean;
  subscriptionEndAt?: number;
  plan: string;
  shopId: string;
  phoneNumber: string;
  totalSpending: number;
}

const CustomerSchema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  subscriptionEndAt: Number,
  plan: String,
  shopId: String,
  phoneNumber: String,
  totalSpending: Number,
});

export const Customer = Mongoose.model<Customer>("shopUser", CustomerSchema);
