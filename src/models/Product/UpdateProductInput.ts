import { Field, InputType } from 'type-graphql'
import ProductType from './ProductType'

@InputType()
export default class UpdateProductInput implements Partial<ProductType> {
  @Field({nullable:true})
  name?: string
  
  @Field({nullable:true})
  price!: number

  @Field({nullable:true})
  description!: string

  @Field({nullable:true})
  category!: string

  @Field({nullable:true})
  pictureUrl!: string

  @Field({nullable:true})
  quantity!: number

}
