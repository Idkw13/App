import crypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import Token from '../models/Token'
import { registerValidation, loginValidation } from '../validations/user'
import { updateTokens } from '../helpers/authHelpers'

/**
 * Save user
 * @param req
 * @param res
 * @returns void
 */

export async function signup (req, res) {
  const { email, password } = req.body
  // Validation data
  const { error } = registerValidation({ email, password })
  if (error) return res.status(400).send(error)

  // Checking if the user is  already in database
  const emailExist = await User.findOne({ email })
  if (emailExist) return res.status(400).send('Email already exist')

  // Hash the password
  const salt = await crypt.genSalt(10)
  const hashedPassword = await crypt.hash(password, salt)

  const user = new User({
    email,
    password: hashedPassword
  })
  const tokens = await updateTokens(user._id)

  res.header('Authorization', tokens.accessToken)
  try {
    await user.save()
    res.status(201).send({ tokens, userId: user._id })
  }
  catch (e) {
    res.status(400).send(e)
  }
}

/**
 * Login
 * @param req
 * @param res
 * @returns void
 */

export async function signIn (req, res) {
  const { email, password } = req.body

  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error)

  const user = await User.findOne({ email })
  const validPassword = await crypt.compare(password, user.password)

  if (!user || !validPassword) return res.status(403).send('Invalid login credentials')

  // Create and assign  a token
  const tokens = await updateTokens(user._id)

  res.header('Authorization', tokens.accessToken)

  res.status(200).send({
    tokens,
    userId: user._id,
  })
}

export async function refreshToken (req, res) {
  const { refreshToken } = req.body
  let payload
  try {
    payload = jwt.verify(refreshToken, process.env.TOKEN_SECRET)
    if (payload.type !== 'refresh') {
      res.status(400).send({
        message: 'Invalid Token!'
      })
    }
  }
  catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).send({
        message: 'Token expired!'
      })
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).send({
        message: 'Invalid Token!'
      })
    }
  }
  Token.findOne({ tokenId: payload.id }).exec().then((token) => {
    if (token === null) {
      throw new Error(`Invalid token!`)
    }
    return updateTokens(token.userId)

  }).then((tokens) => {
    res.status(400).send({
      tokens
    })
  })
}


