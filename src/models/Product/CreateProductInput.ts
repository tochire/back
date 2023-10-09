import { Field, InputType } from "type-graphql";
import ProductType from "./ProductType";

@InputType()
export default class CreateProductInput implements Partial<ProductType> {
  @Field()
  name?: string;

  @Field()
  price!: number;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  category!: string;

  @Field({ nullable: true })
  pictureUrl!: string;

  @Field({ nullable: true })
  quantity!: number;
}
