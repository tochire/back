import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class ItemOrderType {
  @Field()
  id!: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  quantity: number;
}
