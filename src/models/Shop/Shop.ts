import * as Mongoose from "mongoose";

export interface Shop extends Mongoose.Document {
  id: string;
  name: string;
  ownerId: string;
  logoUrl: string;
  isActive: boolean;
  categories: string[];
  creationDate: string;
  description: string;
}

const ShopSchema = new Mongoose.Schema({
  name: String,
  ownerId: String,
  logoUrl: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/000/538/499/small/shopping_cart-01.jpg",
  },
  isActive: Boolean,
  categories: [String],
  creationDate: String,
  description: String,
});

export const Shop = Mongoose.model<Shop>("shop", ShopSchema);
