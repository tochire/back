import { Field, InputType } from 'type-graphql'
import UserType from './UserType'

@InputType()
export default class UpdateUserInput implements Partial<UserType> {
  @Field()
  firstName: string

  @Field()
  lastName: string
}
