import { Field, InputType } from "type-graphql";
import UserType from "./UserType";

@InputType()
export class RegisterUserInput implements Partial<UserType> {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  password!: string;

  @Field()
  email!: string;
}
