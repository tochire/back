import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class ProductType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  shopId!: string;

  @Field()
  price!: number;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  category!: string;

  @Field({ nullable: true })
  pictureUrl!: string;

  @Field()
  quantity!: number;

  @Field({ nullable: true })
  creationDate!: number;

  @Field()
  createdBy!: string;

  @Field()
  isActive!: boolean;
}
