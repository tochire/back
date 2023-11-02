import * as Mongoose from "mongoose";

export interface Order extends Mongoose.Document {
  id: string;
  date: number;
  shopId: string;
  total: number;
  userId: string;
  items: { id: string; price: number; quantity: number; name: string }[];
  status: string;
  customerName: string;
}

const OrderSchema = new Mongoose.Schema({
  date: Number,
  userId: String,
  shopId: String,
  total: Number,
  items: [{ id: String, price: Number, quantity: Number, name: String }],
  status: String,
  customerName: String,
});

export const Order = Mongoose.model<Order>("order", OrderSchema);
