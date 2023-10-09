import { Field, InputType } from "type-graphql";
import PermissionsType from "./PermissionsType";

@InputType()
export default class UpdatePermissionsInput
  implements Partial<PermissionsType>
{
  @Field({ nullable: true })
  categories!: boolean;

  @Field({ nullable: true })
  products!: boolean;

  @Field({ nullable: true })
  orders!: boolean;

  @Field({ nullable: true })
  customers!: boolean;

  @Field({ nullable: true })
  logs!: boolean;

  @Field({ nullable: true })
  statistics!: boolean;
}
