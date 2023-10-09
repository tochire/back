import * as Mongoose from "mongoose";

export interface isAdminAt extends Mongoose.Document {
  id: string;
  shopId: string;
  userId: string;
  date: number;
  name: string;
  email: string;
  categories: boolean;
  products: boolean;
  orders: boolean;
  customers: boolean;
  logs: boolean;
  statistics: boolean;
}

const IsAdminSchema = new Mongoose.Schema({
  shopId: String,
  userId: String,
  date: Number,
  name: String,
  email: String,
  categories: { type: Boolean, default: false },
  products: { type: Boolean, default: false },
  orders: { type: Boolean, default: false },
  customers: { type: Boolean, default: false },
  logs: { type: Boolean, default: false },
  statistics: { type: Boolean, default: false },
});

export const isAdminAt = Mongoose.model<isAdminAt>("isAdminAt", IsAdminSchema);
