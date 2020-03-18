import Joi from 'joi'

export const registerValidation = body => {
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }
  return Joi.validate(body, schema)
}

export const loginValidation = body => {
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }
  return Joi.validate(body, schema)
}
