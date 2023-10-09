import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Product } from "../models/Product/Product";
import { Shop } from "../models/Shop/Shop";
import { Log } from "../models/Log/Log";
import { ErrorType } from "../models/Utils";
import ProductType from "../models/Product/ProductType";
import CreateProductInput from "../models/Product/CreateProductInput";
import UpdateProductInput from "../models/Product/UpdateProductInput";
import Bcrypt from "bcrypt";
import moment from "moment";
import { sign, verify } from "jsonwebtoken";
import { getJWT } from "../modules/jwt";
import { __jwt_secret__ } from "../constants";

@ObjectType()
class ProductResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => ProductType, { nullable: true })
  product?: Product;
  @Field(() => [ProductType], { nullable: true })
  products?: Product[];
}

@Resolver()
export default class ProductResolver {
  @Mutation(() => ProductResponse)
  async addProduct(
    @Arg("product") productData: CreateProductInput,
    @Arg("shopId") shopId: string,
    @Ctx() ctx
  ) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    let shop = await Shop.findOne({ _id: shopId, isActive: true });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
    }
    let product = new Product(productData);
    product.createdBy = ctx.user.id;
    product.isActive = true;
    product.creationDate = moment().unix();
    product.shopId = shop._id;
    await product.save();
    let log = new Log({
      loggerId: ctx.user.id,
      shopId: shopId,
      time: moment().unix(),
      action: "proudct has been created",
    });
    await log.save();
    return { product: product };
  }

  @Mutation(() => ProductResponse)
  async deleteProduct(@Arg("productId") productId: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    let product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    let shop = await Shop.findOne({ _id: product.shopId });
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
    }
    await product.delete();
    let log = new Log({
      loggerId: ctx.user.id,
      shopId: shop._id,
      time: moment().unix(),
      action: "proudct has been deleted",
    });
    await log.save();
    return { product: product };
  }
  @Query(() => ProductResponse)
  async product(@Arg("productId") productId: string, @Ctx() ctx) {
    let product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return { errors: [{ msg: "product not found", code: "404" }] };
    }
    return { product: product };
  }

  @Query(() => [ProductType])
  async products(
    @Ctx() ctx,
    @Arg("name", {
      nullable: true,
    })
    name: string,
    @Arg("shopId")
    shopId: string
  ): Promise<Product[]> {
    return Product.find(
      name
        ? {
            name: {
              $regex: new RegExp(`${name}`, "gi"),
            },
            isActive: true,
            shopId: shopId,
          }
        : {
            isActive: true,
            shopId: shopId,
          }
    );
  }

  @Mutation(() => ProductResponse)
  async updateProduct(
    @Ctx() ctx,
    @Arg("productId") productId: string,
    @Arg("product") updateProductData: UpdateProductInput
  ): Promise<ProductResponse> {
    if (!ctx.user || !ctx.user.id) {
      if (!ctx.user) {
        return { errors: [{ msg: "user not found", code: "404" }] };
      }
    }

    const product = await Product.findOne({
      _id: productId,
    });
    if (!product) {
      return { errors: [{ msg: "product not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: product.shopId });
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "this action is unauthorized", code: "401" }] };
    }
    Object.assign(product, updateProductData);
    await product.save();
    return { product: product };
  }
}
