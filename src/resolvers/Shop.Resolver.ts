import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Shop } from "../models/Shop/Shop";
import { Product } from "../models/Product/Product";
import { Log } from "../models/Log/Log";
import { ErrorType } from "../models/Utils";
import ShopType from "../models/Shop/ShopType";
import LogType from "../models/Log/LogType";
import UpdateShopInput from "../models/Shop/UpdateShopInput";
import Bcrypt from "bcrypt";
import moment from "moment";
import { sign, verify } from "jsonwebtoken";
import { getJWT } from "../modules/jwt";
import { __jwt_secret__ } from "../constants";
import { isAdminAt } from "../models/Admin/isAdminAt";

@ObjectType()
class ShopResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => ShopType, { nullable: true })
  shop?: Shop;
  @Field(() => [ShopType], { nullable: true })
  shops?: Shop[];
}

@ObjectType()
class LogResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => [LogType], { nullable: true })
  logs?: Log[];
}

@Resolver()
export default class ShopResolver {
  @Mutation(() => ShopResponse)
  async createShop(@Arg("name") name: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    let existingShop = await Shop.findOne({ name: name, isActive: true });
    if (existingShop) {
      return {
        errors: [
          {
            code: "Shop.Exists",
            msg: "this name is already used",
          },
        ],
      };
    }
    let newShop = new Shop({
      name: name,
      ownerId: ctx.user.id,
      isActive: true,
      creationDate: moment().unix(),
    });
    await newShop.save();
    return { shop: newShop };
  }

  @Mutation(() => ShopResponse)
  async updateShop(
    @Arg("shopId") shopId: string,
    @Arg("shop") shopData: UpdateShopInput,
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
      return {
        errors: [
          { msg: "you do not have permission to do this action", code: "401" },
        ],
      };
    }
    shop = Object.assign(shop, shopData);
    await shop.save();
    let log = new Log({
      loggerId: ctx.user.id,
      shopId: shopId,
      time: moment().unix(),
      action: "shop has been updated",
    });
    await log.save();
    return { shop: shop };
  }

  @Mutation(() => ShopResponse)
  async deleteShop(@Arg("shopId") shopId: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    let shop = await Shop.findOne({ _id: shopId, isActive: true });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return {
        errors: [
          { msg: "you do not have permission to do this action", code: "401" },
        ],
      };
    }
    shop.isActive = false;
    await shop.save();
    let log = new Log({
      loggerId: ctx.user.id,
      shopId: shopId,
      time: moment().unix(),
      action: "shop has been deleted",
    });
    await log.save();
    return { shop: shop };
  }

  @Query(() => ShopResponse)
  async myShops(@Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shops = await Shop.find({
      ownerId: ctx.user.id,
      isActive: true,
    });
    return { shops: shops };
  }

  @Query(() => ShopResponse)
  async admininShops(@Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const adminin = await isAdminAt.find({ userId: ctx.user.id });
    const ids = adminin.map((x) => x.shopId);
    const shops = await Shop.find({ _id: { $in: ids } });
    return { shops };
  }
  @Query(() => ShopResponse)
  async shop(@Ctx() ctx, @Arg("id") id: string) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: id });
    return { shop };
  }
  @Mutation(() => String)
  async addCategory(
    @Arg("name") name: string,
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
      return {
        errors: [
          { msg: "you do not have permission to do this action", code: "401" },
        ],
      };
    }
    if (shop.categories.includes(name)) {
      return "category already exists";
    }
    shop.categories.push(name);
    await shop.save();
    return "category saved successfully";
  }
  @Mutation(() => String)
  async deleteCategory(
    @Arg("name") name: string,
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
      return {
        errors: [
          { msg: "you do not have permission to do this action", code: "401" },
        ],
      };
    }
    if (!shop.categories.includes(name)) {
      return "category does not exist";
    }
    shop.categories.splice(shop.categories.indexOf(name), 1);
    await shop.save();
    await Product.updateMany({ category: name }, { category: "" });
    return "category deleted successfully";
  }
  @Query(() => LogResponse)
  async logs(@Arg("shopId") shopId: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    let shop = await Shop.findOne({ _id: shopId, isActive: true });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return {
        errors: [
          { msg: "you do not have permission to do this action", code: "401" },
        ],
      };
    }
    const logs = await Log.find({ shopId });
    return { logs };
  }
}
