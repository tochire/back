import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class ShopType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  ownerId!: string;

  @Field({ nullable: true })
  logoUrl!: string;

  @Field()
  isActive!: boolean;

  @Field(() => [String], { nullable: true })
  categories!: string[];

  @Field()
  creationDate!: string;

  @Field({ nullable: true })
  description!: string;
}
