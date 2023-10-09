import { Field, InputType } from 'type-graphql'
import UserType from './UserType'

@InputType()
export default class LoginUserInput implements Partial<UserType> {
  @Field()
  password: string

  @Field()
  email: string
}
