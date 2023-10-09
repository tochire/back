import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ErrorType {
  @Field(() => String)
  msg: string;
  @Field(() => String)
  code: string;
}
