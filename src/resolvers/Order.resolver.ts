import { Response } from "express";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ErrorType } from "../models/Utils";
import OrderType from "../models/Order/OrderType";
import { Order } from "../models/Order/Order";
import { Shop } from "../models/Shop/Shop";
import { isAdminAt } from "../models/Admin/isAdminAt";
import { Customer } from "../models/Customer/Customer";

@ObjectType()
class OrderResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];

  @Field(() => [OrderType], { nullable: true })
  orders?: OrderType[];

  @Field({ nullable: true })
  order?: OrderType;

  @Field({ nullable: true })
  confirmMessage?: string;
}

@Resolver()
export default class OrderResolver {
  @Query(() => OrderResponse)
  async shopOrders(@Ctx() ctx, @Arg("shopId") shopId: string) {
    if (!ctx.user || !ctx.user.id) {
      return {
        errors: [
          {
            code: "401",
            msg: "access denied",
          },
        ],
      };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "Shop Not Found", code: "404" }] };
    }
    if (ctx.user.id != shop.ownerId) {
      const permissions = await isAdminAt.findOne({
        userId: ctx.user.id,
        shopId: shop.id,
      });
      if (!permissions.orders) {
        return { errors: [{ msg: "you do not have permission", code: "401" }] };
      }
    }
    const orders = await Order.find({ shopId: shop.id });
    return { orders };
  }
  @Query(() => OrderResponse)
  async customerOrders(
    @Ctx() ctx,
    @Arg("shopId") shopId: string,
    @Arg("customerId") customerId: string
  ) {
    if (!ctx.user || !ctx.user.id) {
      return {
        errors: [
          {
            code: "401",
            msg: "access denied",
          },
        ],
      };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "Shop Not Found", code: "404" }] };
    }
    if (ctx.user.id != shop.ownerId) {
      const permissions = await isAdminAt.findOne({
        userId: ctx.user.id,
        shopId: shop.id,
      });
      if (!permissions.orders) {
        return { errors: [{ msg: "you do not have permission", code: "401" }] };
      }
    }
    const customer = await Customer.findOne({
      _id: customerId,
      shopId: shopId,
    });
    if (!shop) {
      return { errors: [{ msg: "Customer Not Found", code: "404" }] };
    }
    const orders = await Order.find({ shopId: shop.id, userId: customerId });
    return { orders };
  }

  @Query(() => OrderResponse)
  async shopOrder(
    @Ctx() ctx,
    @Arg("shopId") shopId: string,
    @Arg("orderId") orderId: string
  ) {
    if (!ctx.user || !ctx.user.id) {
      return {
        errors: [
          {
            code: "401",
            msg: "access denied",
          },
        ],
      };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "Shop Not Found", code: "404" }] };
    }
    if (ctx.user.id != shop.ownerId) {
      const permissions = await isAdminAt.findOne({
        userId: ctx.user.id,
        shopId: shop.id,
      });
      if (!permissions.orders) {
        return { errors: [{ msg: "you do not have permission", code: "401" }] };
      }
    }
    const order = await Order.findOne({ shopId: shop.id, _id: orderId });
    if (!order) {
      return { errors: [{ msg: "order not found", code: "404" }] };
    }
    return { order };
  }

  @Mutation(() => OrderResponse)
  async changeOrderStatus(
    @Ctx() ctx,
    @Arg("orderId") orderId: string,
    @Arg("status") status: string
  ) {
    if (!ctx.user || !ctx.user.id) {
      return {
        errors: [
          {
            code: "401",
            msg: "access denied",
          },
        ],
      };
    }
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return { errors: [{ code: "404", msg: "Order Not Found" }] };
    }
    const shop = await Shop.findOne({ _id: order.shopId });
    if (shop.ownerId != ctx.user.id) {
      const permissions = await isAdminAt.findOne({
        shopId: shop._id,
        userId: ctx.user.id,
      });
      if (!permissions.orders) {
        return {
          errors: [
            {
              code: "401",
              msg: "You do not have permission to do this action",
            },
          ],
        };
      }
    }
    order.status = status;
    await order.save();
    return { confirmMessage: "status changed succesfully" };
  }
}
