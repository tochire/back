import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class CustomerType {
  @Field(() => ID)
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  shopId!: string;

  @Field()
  totalSpending!: number;
}
