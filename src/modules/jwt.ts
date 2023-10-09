import { sign, verify } from 'jsonwebtoken'
import { __jwt_secret__ } from '../constants'

export const verifyJWT = (token: string): { id: string } => {
    try {
      return verify(token, __jwt_secret__, { algorithms: ['HS256'] }) as {
        id: string
      }
    } catch (err) {
      return null
    }
  }
  
  export const getJWT = (user: { id: string }) =>
  sign(
    {
      id: user.id,
    },
    __jwt_secret__,{ algorithm: 'HS256' }
  )