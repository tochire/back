import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
export default class LogType {
  @Field(() => ID)
  id!: string;

  @Field()
  action!: string;

  @Field()
  time!: number;
}
