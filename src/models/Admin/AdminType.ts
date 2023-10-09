import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class AdminType {
  @Field(() => ID)
  userId!: string;

  @Field()
  shopId!: string;

  @Field()
  date!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  categories!: boolean;

  @Field()
  products!: boolean;

  @Field()
  orders!: boolean;

  @Field()
  customers!: boolean;

  @Field()
  logs!: boolean;

  @Field()
  statistics!: boolean;
}
