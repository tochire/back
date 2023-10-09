import { Field, InputType } from "type-graphql";
import ShopType from "./ShopType";

@InputType()
export default class UpdateShopInput implements Partial<ShopType> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  logoUrl: string;

  @Field(() => [String], { nullable: true })
  categories: string[];

  @Field({ nullable: true })
  description: string;
}
