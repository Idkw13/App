import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import Token from '../models/Token'

const generateAccessToken = userId => {
  const payload = {
    userId,
    type: 'access'
  }
  const options = { expiresIn: '30m' }
  return jwt.sign(payload, process.env.TOKEN_SECRET, options)
}
const generateRefreshToken = () => {
  const payload = {
    id: uuidv4(),
    type: 'refresh'
  }
  const options = { expiresIn: `1h` }
  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.TOKEN_SECRET, options)
  }
}
const replaceRefreshToken = (tokenId, userId) => {
  return Token.findOneAndRemove({ userId }).exec().then(() => {
    return Token.create({ tokenId, userId })
  })
}
const updateTokens = userId => {
  const refreshToken = generateRefreshToken()
  const accessToken = generateAccessToken(userId)

  return replaceRefreshToken(refreshToken.id, userId).then(() => {
    return {
      accessToken,
      refreshToken: refreshToken.token
    }
  })
}
export  {
  updateTokens
}
