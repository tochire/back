import * as Mongoose from "mongoose";

export interface Product extends Mongoose.Document {
  id: string;
  name: string;
  shopId: string;
  price: number;
  description: string;
  category: string;
  pictureUrl: string;
  quantity: number;
  creationDate: number;
  createdBy: string;
  isActive: boolean;
}

const ProductSchema = new Mongoose.Schema({
  name: String,
  shopId: String,
  price: Number,
  description: String,
  category: String,
  pictureUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/3502/3502601.png",
  },
  quantity: { type: Number, default: 0 },
  creationDate: Number,
  createdBy: String,
  isActive: Boolean,
});

export const Product = Mongoose.model<Product>("product", ProductSchema);
