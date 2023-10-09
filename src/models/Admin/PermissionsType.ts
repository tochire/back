import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class PermissionType {
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
  admins!: boolean;

  @Field()
  statistics!: boolean;
}
