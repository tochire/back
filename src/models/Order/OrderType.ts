import { Field, ID, ObjectType, Root } from "type-graphql";

import ItemOrderType from "./ItemOrderType";

@ObjectType()
export default class OrderType {
  @Field(() => ID)
  id!: string;

  @Field()
  date: number;

  @Field()
  ShopId: string;

  @Field()
  userId: string;

  @Field()
  total: number;

  @Field()
  status: string;

  @Field(() => [ItemOrderType])
  items: ItemOrderType[];

  @Field()
  customerName: string;
}
