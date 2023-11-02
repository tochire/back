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
import { User } from "../models/User/User";
import { ErrorType } from "../models/Utils";
import UserType from "../models/User/UserType";
import { RegisterUserInput } from "../models/User/RegisterInput";
import LoginUserInput from "../models/User/LoginInput";
import UpdateUserInput from "../models/User/UpdateUserInput";
import UpdateUserPass from "../models/User/UpdateUserPass";
import Bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { getJWT } from "../modules/jwt";
import { __jwt_secret__ } from "../constants";

@ObjectType()
class UserResponse {
  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
  @Field(() => UserType, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  token?: string;
}

@Resolver()
export default class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("user") newUserData: RegisterUserInput
  ): Promise<UserResponse> {
    const existingUser = await User.findOne({
      email: newUserData.email,
    });
    if (existingUser) {
      return {
        errors: [
          {
            code: "User.Exists",
            msg: "This email is already in use",
          },
        ],
      };
    }
    const newUser = new User(newUserData);
    newUser.password = await Bcrypt.hash(newUserData.password, 10);
    await newUser.save();
    const token = sign(
      {
        id: newUser.id,
      },
      __jwt_secret__
    );
    return { user: newUser, token: token };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("user") loginInfo: LoginUserInput,
    @Ctx() { res }: { res: Response; user: User }
  ): Promise<UserResponse> {
    const user = await User.findOne({ email: loginInfo.email });
    if (!user) {
      return {
        errors: [
          {
            code: "wrong login credentials",
            msg: "wrong login credentials",
          },
        ],
      };
    }
    if (!Bcrypt.compareSync(loginInfo.password, user.password)) {
      return { errors: [{ msg: "password is wrong", code: "401" }] };
    }
    const token = getJWT({ id: user.id });
    return { user: user, token: token };
  }

  //update first and lastname
  @Mutation(() => UserResponse)
  async updateUser(@Arg("user") user: UpdateUserInput, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    let newUser = await User.findOne({ _id: ctx.user.id });
    newUser = Object.assign(newUser, user);
    await newUser.save();
    return { user: newUser };
  }

  //update password
  @Mutation(() => UserResponse)
  async updatePass(@Arg("user") user: UpdateUserPass, @Ctx() ctx) {
    if (!ctx.user) {
      return { errors: [{ msg: "user not found", code: "404" }] };
    }
    var newuser = await User.findOne({ _id: ctx.user.id });
    if (!Bcrypt.compareSync(user.oldpassword, newuser.password)) {
      return { errors: [{ msg: "password is wrong", code: "401" }] };
    }
    newuser.password = await Bcrypt.hash(user.password, 10);
    await newuser.save();
    return { user: newuser };
  }

  @Query(() => UserType, { nullable: true })
  async me(
    @Ctx() { user }: { res: Response; user: User }
  ): Promise<User | null> {
    if (user) {
      return User.findOne({ _id: user.id });
    }
    return null;
  }
}
