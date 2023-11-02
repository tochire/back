import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Order } from "../models/Order/Order";
import { Shop } from "../models/Shop/Shop";
import { isAdminAt } from "../models/Admin/isAdminAt";
import { Customer } from "../models/Customer/Customer";
import { ErrorType } from "../models/Utils";
import CustomerType from "../models/Customer/CustomerType";

@ObjectType()
class CustomerResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];

  @Field(() => [CustomerType], { nullable: true })
  customers?: CustomerType[];

  @Field({ nullable: true })
  customer?: CustomerType;
  @Field({ nullable: true })
  confirmMessage?: string;
}
@Resolver()
export default class CustomerResolver {
  @Query(() => CustomerResponse)
  async shopCustomers(@Ctx() ctx, @Arg("shopId") shopId: string) {
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
      if (!permissions.customers) {
        return { errors: [{ msg: "you do not have permission", code: "401" }] };
      }
    }
    const customers = await Customer.find({ shopId: shopId });
    return { customers };
  }
  @Query(() => CustomerResponse)
  async shopCustomer(
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
      if (!permissions.customers) {
        return { errors: [{ msg: "you do not have permission", code: "401" }] };
      }
    }
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return { errors: [{ msg: "customer not found", code: "404" }] };
    }
    return { customer };
  }
}
