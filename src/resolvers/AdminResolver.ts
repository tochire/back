import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { isAdminAt } from "../models/Admin/isAdminAt";
import { Shop } from "../models/Shop/Shop";
import { User } from "../models/User/User";
import { ErrorType } from "../models/Utils";
import AdminType from "../models/Admin/AdminType";
import PermissionsType from "../models/Admin/PermissionsType";
import UpdatePermissionsInput from "../models/Admin/updatePermissionsInput";
import moment from "moment";

@ObjectType()
class MessageResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => String, { nullable: true })
  message?: string;
}

@ObjectType()
class PermissionsResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => PermissionsType, { nullable: true })
  permissions?: PermissionsType;
}

@ObjectType()
class AdminResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => [AdminType], { nullable: true })
  admins?: AdminType[];
}
@Resolver()
export default class AdminResolver {
  @Mutation(() => MessageResponse)
  async addAdmin(
    @Arg("shopId") shopId: string,
    @Arg("email") email: string,
    @Ctx() ctx
  ) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "permission denied", code: "401" }] };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const isAdmin = await isAdminAt.findOne({ userId: user._id, shopId });
    if (isAdmin) {
      return {
        errors: [
          { msg: "this user is already an admin in your shop", code: "400" },
        ],
      };
    }
    const newAdmin = new isAdminAt({
      shopId,
      userId: user._id,
      date: moment().unix(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
    await newAdmin.save();
    return { message: "admin added successfully" };
  }

  @Query(() => AdminResponse)
  async admins(@Arg("shopId") shopId: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "permission denied", code: "401" }] };
    }
    const admins = await isAdminAt.find({ shopId });
    return { admins };
  }
  @Mutation(() => String)
  async removeAdmin(
    @Arg("shopId") shopId: string,
    @Arg("adminId") adminId: string,
    @Ctx() ctx
  ) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "permission denied", code: "401" }] };
    }
    const admin = await isAdminAt.findOne({ userId: adminId, shopId });
    if (!admin) {
      return { errors: [{ msg: "admin not found", code: "404" }] };
    }
    admin.remove();
    return "removed successfully";
  }
  @Query(() => PermissionsResponse)
  async permissions(@Arg("shopId") shopId: string, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId == ctx.user.id) {
      return {
        permissions: {
          categories: true,
          products: true,
          orders: true,
          customers: true,
          logs: true,
          admins: true,
          statistics: true,
        },
      };
    }
    const admin = await isAdminAt.findOne({ shopId, userId: ctx.user.id });
    if (!admin) {
      return { errors: [{ msg: "manager not found", code: "404" }] };
    }
    return { permissions: Object.assign(admin, { admins: false }) };
  }
  @Mutation(() => String)
  async updatePermissions(
    @Arg("shopId") shopId: string,
    @Arg("adminId") adminId: string,
    @Arg("permissions") permissions: UpdatePermissionsInput,
    @Ctx() ctx
  ) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    const shop = await Shop.findOne({ _id: shopId });
    if (!shop) {
      return { errors: [{ msg: "shop not found", code: "404" }] };
    }
    if (shop.ownerId != ctx.user.id) {
      return { errors: [{ msg: "permission denied", code: "401" }] };
    }
    const admin = await isAdminAt.findOne({ userId: adminId, shopId });
    if (!admin) {
      return { errors: [{ msg: "admin not found", code: "404" }] };
    }
    Object.assign(admin, permissions);
    await admin.save();
    return "permissions update successfully";
  }
}
