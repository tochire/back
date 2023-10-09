import { Field, InputType } from 'type-graphql'
import { User } from './User'

@InputType()
export default class UpdateUserPass implements Partial<User> {
  @Field()
  password: string
  @Field()
  oldpassword: string

  

  
}
